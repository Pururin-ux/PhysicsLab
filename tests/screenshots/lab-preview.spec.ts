import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.resolve(
  process.cwd(),
  "artifacts/screenshots/lab-preview"
);

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "laptop", width: 1280, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow-mobile", width: 360, height: 800 }
];

test.describe("lab-preview screenshots", () => {
  test.beforeAll(async () => {
    await fs.rm(screenshotDir, { recursive: true, force: true });
    await fs.mkdir(screenshotDir, { recursive: true });
  });

  for (const viewport of viewports) {
    test(`${viewport.name} screenshots`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto("/lab-preview/", { waitUntil: "networkidle" });
      await expect(page.locator("body")).toBeVisible();

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-full.png`),
        fullPage: true,
        animations: "disabled"
      });

      const hero = page.locator(".hero-lab").first();
      await expect(hero).toBeVisible();
      await hero.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-hero.png`),
        animations: "disabled"
      });

      const chapterDemo = page.locator("#chapter-demo").first();
      if ((await chapterDemo.count()) > 0) {
        await expect(chapterDemo).toBeVisible();
        await chapterDemo.screenshot({
          path: path.join(
            screenshotDir,
            `${viewport.name}-chapter-demo.png`
          ),
          animations: "disabled"
        });
      }
    });
  }
});

