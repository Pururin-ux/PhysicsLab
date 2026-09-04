import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionRoot = path.join(webRoot, "public", "art", "production");
const manifest = JSON.parse(await readFile(path.join(webRoot, "art-manifest.json"), "utf8"));
const sourceRoots = ["app", "components", "lib", "styles"];
const sourceExtensions = new Set([".css", ".js", ".jsx", ".ts", ".tsx"]);
const resolutionExtensions = ["", ...sourceExtensions];
const dynamicFamilies = new Map([
  [
    "curator-mechanics-${state}.webp",
    ["curator-mechanics-thinking.webp", "curator-mechanics-support.webp"],
  ],
]);
const errors = [];
const warnings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

function webpDimensions(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("not a RIFF WebP file");
  }

  for (let offset = 12; offset + 8 <= buffer.length; ) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (type === "VP8X" && data + 10 <= buffer.length) {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      };
    }
    if (type === "VP8 " && data + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (type === "VP8L" && data + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(data + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      };
    }
    offset = data + size + (size % 2);
  }
  throw new Error("WebP dimensions were not found");
}

const sourceFiles = (await Promise.all(sourceRoots.map((root) => walk(path.join(webRoot, root))))).flat();
const sourceFileSet = new Set(sourceFiles.map((file) => path.normalize(file)));
const sourceByFile = new Map(
  await Promise.all(sourceFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);
const importPattern = /(?:import\s+(?:[^"']*?\s+from\s+)?|export\s+(?:[^"']*?\s+from\s+))["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|@import\s+["']([^"']+)["']/g;
// Next also discovers suffix variants such as page.dev.tsx in this project;
// browser evidence takes precedence over assuming only page.tsx is routable.
const nextEntrypointPattern = /^(?:(?:page|layout|route|loading|error|not-found|template|default|global-error)(?:\.[^.]+)*)\.(?:js|jsx|ts|tsx)$/;

function resolveLocalImport(importer, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = path.resolve(path.dirname(importer), specifier);
  for (const extension of resolutionExtensions) {
    const direct = path.normalize(`${base}${extension}`);
    if (sourceFileSet.has(direct)) return direct;
  }
  for (const extension of sourceExtensions) {
    const indexed = path.normalize(path.join(base, `index${extension}`));
    if (sourceFileSet.has(indexed)) return indexed;
  }
  return null;
}

// A file is production-reachable only when an app entrypoint imports it,
// directly or transitively. Merely keeping a prototype under components/
// must not make its images look active in the user-facing product.
const reachableSources = new Set();
const queue = sourceFiles.filter((file) => {
  const relativeParts = path.relative(webRoot, file).split(path.sep);
  return relativeParts[0] === "app" && nextEntrypointPattern.test(path.basename(file));
});
while (queue.length > 0) {
  const sourceFile = queue.pop();
  if (!sourceFile || reachableSources.has(sourceFile)) continue;
  reachableSources.add(sourceFile);
  const source = sourceByFile.get(sourceFile) ?? "";
  for (const match of source.matchAll(importPattern)) {
    const dependency = resolveLocalImport(sourceFile, match[1] ?? match[2] ?? match[3]);
    if (dependency && !reachableSources.has(dependency)) queue.push(dependency);
  }
}

const references = new Map();
const prototypeReferences = new Map();
const referencePattern = /\/art\/production\/([A-Za-z0-9._${}-]+\.webp)/g;

for (const sourceFile of sourceFiles) {
  const relativeSource = path.relative(webRoot, sourceFile).replaceAll(path.sep, "/");
  const source = sourceByFile.get(sourceFile) ?? "";
  const targetReferences = reachableSources.has(sourceFile) ? references : prototypeReferences;
  for (const match of source.matchAll(referencePattern)) {
    const token = match[1];
    const expanded = dynamicFamilies.get(token) ?? (token.includes("${") ? null : [token]);
    if (!expanded) {
      errors.push(`${relativeSource}: dynamic art reference ${token} has no audited expansion`);
      continue;
    }
    for (const file of expanded) {
      const locations = targetReferences.get(file) ?? [];
      locations.push(relativeSource);
      targetReferences.set(file, locations);
    }
  }
}

const prototypeOnlyReferences = new Map(
  [...prototypeReferences].filter(([file]) => !references.has(file)),
);

const approvedStatuses = new Set(["approved", "approved-with-composition-guard"]);
const reviewPasses = new Set(["pass", "not-applicable"]);
const diagramPath = /(?:^|\/)(?:components\/(?:diagrams|physics-graph)|lib\/physics)(?:\/|$)/;

for (const [file, locations] of references) {
  const record = manifest.assets[file];
  if (!record) {
    errors.push(`${file}: referenced by ${locations.join(", ")} but absent from art-manifest.json`);
    continue;
  }

  const assetPath = path.join(productionRoot, file);
  let buffer;
  try {
    buffer = await readFile(assetPath);
  } catch {
    errors.push(`${file}: reviewed file is missing from public/art/production`);
    continue;
  }

  if (path.extname(file).slice(1) !== manifest.policy.allowedFormat) {
    errors.push(`${file}: only ${manifest.policy.allowedFormat} is allowed in the reviewed production set`);
  }
  if (buffer.length > manifest.policy.maxReferencedBytes) {
    errors.push(`${file}: ${buffer.length} bytes exceeds ${manifest.policy.maxReferencedBytes}`);
  }

  const sha256 = createHash("sha256").update(buffer).digest("hex");
  if (sha256 !== record.sha256) errors.push(`${file}: content changed after human review (SHA-256 mismatch)`);
  if (buffer.length !== record.bytes) errors.push(`${file}: byte size changed after human review`);

  try {
    const size = webpDimensions(buffer);
    if (size.width !== record.width || size.height !== record.height) {
      errors.push(`${file}: dimensions are ${size.width}x${size.height}, expected ${record.width}x${record.height}`);
    }
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }

  const review = record.review ?? {};
  if (!approvedStatuses.has(review.status) || review.humanApproved !== true) {
    errors.push(`${file}: no current human visual approval`);
  }
  for (const field of ["identity", "anatomy", "textArtifacts"]) {
    if (!reviewPasses.has(review[field])) errors.push(`${file}: review.${field} is not passed`);
  }
  if (!["pass", "decorative-only", "not-applicable"].includes(review.logic)) {
    errors.push(`${file}: review.logic is missing or unresolved`);
  }
  if (review.logic === "decorative-only" && locations.some((location) => diagramPath.test(location))) {
    errors.push(`${file}: decorative-only art is referenced from an instructional diagram/physics path`);
  }
  if (/(?:mobile|desktop)/i.test(file) && record.viewportPolicy !== "purpose-specific") {
    errors.push(`${file}: a viewport-specific generation is referenced without an explicit exception`);
  }
}

for (const file of Object.keys(manifest.assets)) {
  if (references.has(file)) continue;
  const prototypeLocations = prototypeOnlyReferences.get(file);
  if (prototypeLocations) {
    warnings.push(`${file}: prototype-only reference in ${prototypeLocations.join(", ")}`);
  } else {
    warnings.push(`${file}: reviewed but not currently referenced`);
  }
}

for (const rule of manifest.policy.canonicalViewportAssets) {
  const componentPath = path.join(webRoot, rule.component);
  const source = await readFile(componentPath, "utf8");
  const staticFiles = new Set(
    [...source.matchAll(/\/art\/production\/([A-Za-z0-9._-]+\.webp)/g)].map((match) => match[1]),
  );
  if (staticFiles.size !== 1 || !staticFiles.has(rule.file)) {
    errors.push(`${rule.sceneId}: desktop/mobile must resolve to the single reviewed file ${rule.file}`);
  }
  if (/(?:MOBILE|DESKTOP)_ART/.test(source)) {
    errors.push(`${rule.sceneId}: separate MOBILE_ART/DESKTOP_ART constants are forbidden`);
  }
  if (!source.includes('data-art-viewport-policy="single-source-crop"')) {
    errors.push(`${rule.sceneId}: component is missing the single-source viewport contract`);
  }
}

const diskFiles = (await readdir(productionRoot)).filter((file) => file.endsWith(".webp"));
for (const file of diskFiles) {
  if (!manifest.assets[file]) warnings.push(`${file}: legacy/unreviewed file remains on disk (safe while unreferenced)`);
}

console.log(
  `Art audit: ${references.size} production-reachable assets, ${prototypeOnlyReferences.size} prototype-only assets, ${Object.keys(manifest.assets).length} reviewed assets.`,
);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log("PASS Every production-reachable image is hash-locked, reviewed, dimension-checked, and viewport-safe.");
}
