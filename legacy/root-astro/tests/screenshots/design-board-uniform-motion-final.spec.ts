import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.resolve(
  process.cwd(),
  "artifacts/screenshots/design-board-uniform-motion-final"
);

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow-mobile", width: 360, height: 800 }
];

test.describe("uniform motion final design board screenshots", () => {
  test.beforeAll(async () => {
    await fs.rm(screenshotDir, { recursive: true, force: true });
    await fs.mkdir(screenshotDir, { recursive: true });
  });

  for (const viewport of viewports) {
    test(`${viewport.name} screenshot`, async ({ page }) => {
      const consoleMessages: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleMessages.push(message.text());
        }
      });

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto("/design-board/uniform-motion-final/", {
        waitUntil: "networkidle"
      });

      await expect(page.locator("[data-uniform-motion-final]")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Равномерное движение" })
      ).toBeVisible();
      await expect(page.getByText("PhysicsLab")).toBeVisible();
      await expect(page.getByText("Лаборатория")).toBeVisible();
      await expect(page.locator(".formula-screen")).toContainText("x = x₀ + vt");
      await expect(page.getByText("Движение тела")).toBeVisible();
      await expect(page.getByRole("heading", { name: "График x(t)" })).toBeVisible();
      await expect(page.getByText("Как это работает?")).toBeVisible();
      await expect(page.getByRole("button", { name: "Запустить" })).toBeVisible();
      await expect(page.getByText("ПРОВЕРЬ СЕБЯ")).toBeVisible();
      await expect(page.getByText("ПОДРОБНЕЕ")).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalScroll).toBe(false);
      expect(consoleMessages).toEqual([]);

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-full.png`),
        fullPage: true,
        animations: "disabled"
      });
    });
  }
});
