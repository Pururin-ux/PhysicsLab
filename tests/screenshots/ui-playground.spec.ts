import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.resolve(
  process.cwd(),
  "artifacts/screenshots/ui-playground"
);

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow-mobile", width: 360, height: 800 }
];

test.describe("ui-playground screenshots", () => {
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

      await page.goto("/ui-playground/", { waitUntil: "networkidle" });

      await expect(
        page.getByRole("heading", { name: "Песочница интерфейса PhysicsLab" })
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Формулы" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Маскот" })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Движение и обратная связь" })
      ).toBeVisible();

      await expect(page.locator("[data-experiment-zone]")).toHaveCount(3);
      await expect(page.locator("[data-formula-card-experiment]")).toBeVisible();
      await expect(page.getByText("Сейчас меняем скорость v")).toBeVisible();
      await expect(page.getByText("Больше v → линия круче")).toBeVisible();
      await expect(
        page.getByText("График показывает, как меняется координата", { exact: false })
      ).toBeVisible();
      await expect(page.locator("img")).toHaveCount(0);

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
