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

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalScroll).toBe(false);

      const speedSlider = page.locator('[data-input="v"]');
      await expect(speedSlider).toBeVisible();
      await speedSlider.evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "4";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await expect(page.locator('[data-value="v"]')).toContainText("4 м/с");
      await expect(page.locator('[data-value="x"]')).toContainText("12 м");
      await expect(page.locator('[data-graph-note="x"]')).toContainText(
        "Линия идёт вверх"
      );
      await expect(page.locator('[data-formula-token="v"]').first()).toHaveClass(
        /is-active/
      );

      await page.getByRole("button", { name: "График станет траекторией тела" }).click();
      await expect(page.locator("[data-feedback]")).toContainText("Не совсем");

      await page.getByRole("button", { name: "Линия станет круче" }).click();
      await expect(page.locator("[data-feedback]")).toContainText("Верно");
    });
  }

  test("lab-preview reduced motion keeps the lab meaningful", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/lab-preview/", { waitUntil: "networkidle" });

    await expect(page.locator("[data-uniform-motion-lab]")).toBeVisible();
    await expect(page.locator('[data-polyline="x"]')).toHaveAttribute("points", /,/);
    await expect(page.locator('[data-polyline="v"]')).toHaveAttribute("points", /,/);
    await expect(page.locator("[data-motion-point]")).toBeVisible();
  });
});
