import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(webRoot, "../..");
const outputDir = join(repoRoot, "artifacts", "lighthouse");
const distDirName = ".next-lighthouse";
const distDir = join(webRoot, distDirName);
const chromeProfileDir = join(webRoot, ".lighthouse-profile");
const tsconfigPath = join(webRoot, "tsconfig.json");
const baseURL = "http://127.0.0.1:3100";
const isWindows = process.platform === "win32";

const routes = [
  { name: "home", path: "/" },
  { name: "topics", path: "/topics" },
  { name: "exam", path: "/practice/exam-demo" },
  { name: "formulas", path: "/formulas" },
];

const budgets = {
  performance: 0.7,
  accessibility: 0.9,
  "best-practices": 0.9,
  seo: 0.9,
  lcpMs: 4000,
  cls: 0.1,
  tbtMs: 300,
};

function assertOwnedPath(target) {
  const fromRoot = relative(webRoot, target);
  if (!fromRoot || fromRoot.startsWith(`..${sep}`) || fromRoot === "..") {
    throw new Error(`Refusing to remove a path outside apps/web: ${target}`);
  }
}

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: webRoot,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
      ...options,
    });

    child.once("error", rejectRun);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(
        new Error(
          `${command} ${args.join(" ")} failed with ${
            signal ? `signal ${signal}` : `exit code ${code}`
          }`,
        ),
      );
    });
  });
}

function npmInvocation(args) {
  if (isWindows) {
    return {
      command: process.env.ComSpec ?? "cmd.exe",
      args: ["/d", "/s", "/c", "npm", ...args],
    };
  }
  return { command: "npm", args };
}

function runNpm(args, options = {}) {
  const invocation = npmInvocation(args);
  return run(invocation.command, invocation.args, options);
}

function spawnNpm(args, options = {}) {
  const invocation = npmInvocation(args);
  return spawn(invocation.command, invocation.args, {
    cwd: webRoot,
    env: process.env,
    windowsHide: true,
    ...options,
  });
}

async function waitForServer(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }

  throw new Error(`Production server did not become ready: ${lastError ?? url}`);
}

async function stopProcessTree(child) {
  if (!child.pid || child.exitCode !== null) return;

  if (process.platform === "win32") {
    await run("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    }).catch(() => undefined);
    return;
  }

  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    new Promise((resolveWait) => setTimeout(resolveWait, 5000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

function score(report, category) {
  return report.categories[category]?.score ?? 0;
}

function metric(report, audit) {
  return report.audits[audit]?.numericValue ?? Number.POSITIVE_INFINITY;
}

function summarize(name, report) {
  return {
    page: name,
    performance: score(report, "performance"),
    accessibility: score(report, "accessibility"),
    bestPractices: score(report, "best-practices"),
    seo: score(report, "seo"),
    lcpMs: Math.round(metric(report, "largest-contentful-paint")),
    cls: Number(metric(report, "cumulative-layout-shift").toFixed(3)),
    tbtMs: Math.round(metric(report, "total-blocking-time")),
  };
}

function findFailures(result) {
  const failures = [];
  if (result.performance < budgets.performance) failures.push("performance");
  if (result.accessibility < budgets.accessibility) failures.push("accessibility");
  if (result.bestPractices < budgets["best-practices"]) failures.push("best-practices");
  if (result.seo < budgets.seo) failures.push("seo");
  if (result.lcpMs > budgets.lcpMs) failures.push("LCP");
  if (result.cls > budgets.cls) failures.push("CLS");
  if (result.tbtMs > budgets.tbtMs) failures.push("TBT");
  return failures;
}

async function main() {
  assertOwnedPath(distDir);
  assertOwnedPath(chromeProfileDir);
  const tsconfigBeforeBuild = await readFile(tsconfigPath, "utf8");
  await rm(distDir, { recursive: true, force: true });
  await rm(chromeProfileDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const isolatedEnv = {
    ...process.env,
    NEXT_DIST_DIR: distDirName,
    NEXT_TELEMETRY_DISABLED: "1",
  };

  let server;
  let chrome;

  try {
    await runNpm(["run", "build"], { env: isolatedEnv });

    server = spawnNpm(
      ["run", "start", "--", "--hostname", "127.0.0.1", "--port", "3100"],
      {
        env: isolatedEnv,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.stdout.on("data", (chunk) => process.stdout.write(chunk));
    server.stderr.on("data", (chunk) => process.stderr.write(chunk));

    await waitForServer(baseURL);
    await mkdir(chromeProfileDir, { recursive: true });
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
      handleSIGINT: false,
      logLevel: "silent",
      userDataDir: chromeProfileDir,
    });

    const results = [];

    for (const route of routes) {
      const reportPath = join(outputDir, `${route.name}.json`);
      const runnerResult = await lighthouse(
        `${baseURL}${route.path}`,
        {
          logLevel: "error",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
          output: "json",
          port: chrome.port,
        },
        desktopConfig,
      );
      if (!runnerResult) {
        throw new Error(`Lighthouse returned no report for ${route.path}`);
      }

      const report = runnerResult.lhr;
      await writeFile(reportPath, JSON.stringify(report), "utf8");
      results.push(summarize(route.name, report));
    }

    console.table(results);
    const failed = results
      .map((result) => ({ page: result.page, checks: findFailures(result) }))
      .filter(({ checks }) => checks.length > 0);

    if (failed.length > 0) {
      throw new Error(
        `Lighthouse budgets failed: ${failed
          .map(({ page, checks }) => `${page} (${checks.join(", ")})`)
          .join("; ")}`,
      );
    }
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch {
        // The browser may already be gone after Lighthouse finishes.
      }
    }
    if (server) await stopProcessTree(server);
    await writeFile(tsconfigPath, tsconfigBeforeBuild, "utf8");
    await rm(chromeProfileDir, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    }).catch(() => undefined);
    await rm(distDir, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
