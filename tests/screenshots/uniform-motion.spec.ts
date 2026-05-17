import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.resolve(
  process.cwd(),
  "artifacts/screenshots/uniform-motion"
);

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow-mobile", width: 360, height: 800 }
];

test.describe("uniform-motion chapter screenshots", () => {
  test.beforeAll(async () => {
    await fs.rm(screenshotDir, { recursive: true, force: true });
    await fs.mkdir(screenshotDir, { recursive: true });
  });

  for (const viewport of viewports) {
    test(`${viewport.name} screenshot`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto("/chapters/uniform-motion/", { waitUntil: "networkidle" });

      await expect(
        page.getByRole("heading", { name: "Равномерное движение" })
      ).toBeVisible();
      await expect(page.locator("[data-formula-scene]")).toBeVisible();
      await expect(page.locator("[data-uniform-motion-lab]")).toBeVisible();
      await expect(
        page.locator('[data-uniform-motion-lab][data-visual-target="v1"]')
      ).toBeVisible();
      await expect(page.locator("[data-motion-x-label]")).toBeVisible();
      await expect(page.locator(".track-tick")).toHaveCount(3);
      await expect(page.locator('[data-projection="x"]')).toBeVisible();
      await expect(page.locator(".graph-tick-labels").first()).toBeVisible();
      await expect(page.getByText("prototype/demo")).toBeVisible();
      await expect(page.getByText("authorReviewRequired")).toBeVisible();

      const formulaScene = page.locator("[data-formula-scene]");
      await expect(formulaScene).toHaveAttribute("data-active-part", "none");
      await expect(page.locator("[data-scene-part]")).toHaveCount(5);
      await expect(formulaScene.getByText("x, м")).toBeVisible();
      await expect(formulaScene.getByText("t, с")).toBeVisible();

      await page.locator('[data-scene-part="v"]').click();
      await expect(formulaScene).toHaveAttribute("data-active-part", "v");
      await expect(page.locator('[data-scene-graph="slope-family"]')).toHaveAttribute(
        "data-active",
        ""
      );
      await expect(page.getByText("v задаёт наклон графика.")).toBeVisible();

      await page.locator('[data-scene-part="vt"]').click();
      await expect(formulaScene).toHaveAttribute("data-active-part", "vt");
      await expect(page.locator('[data-scene-graph="delta"]')).toHaveAttribute(
        "data-active",
        ""
      );
      await expect(formulaScene.getByText("vt — изменение координаты за время t.")).toBeVisible();

      await page.getByRole("button", { name: "Он показывает, как меняется координата" }).click();
      await expect(page.locator("[data-check-feedback]")).toContainText(
        "число x меняется со временем"
      );

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalScroll).toBe(false);

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-full.png`),
        fullPage: true,
        animations: "disabled"
      });
    });
  }
});
