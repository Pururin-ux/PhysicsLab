import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2];
const SPECS = process.argv.slice(3); // name|path|device|fullPage|scrollY
mkdirSync(OUT, { recursive: true });
const sizes = { desktop: { width: 1440, height: 1000 }, tablet: { width: 768, height: 1024 }, mobile: { width: 390, height: 844 }, m360: { width: 360, height: 800 } };

const browser = await chromium.launch();
for (const spec of SPECS) {
  const [name, path, dev = "desktop", full = "0", scrollY = "0"] = spec.split("|");
  const size = sizes[dev] ?? sizes.desktop;
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: dev === "mobile" || dev === "m360", hasTouch: dev !== "desktop" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  try { await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 180000 }); }
  catch (e) { console.log(`${name}: NAV ${e.message.split("\n")[0]}`); }
  if (scrollY !== "0") { try { await page.evaluate((y) => window.scrollTo(0, Number(y)), scrollY); } catch {} await page.waitForTimeout(700); }
  await page.waitForTimeout(1300);
  const h = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full === "1" });
  console.log(`${name}: ok${h ? " | H-SCROLL!" : ""}${errs.length ? " | ERR " + errs[0] : ""}`);
  await ctx.close();
}
await browser.close();
