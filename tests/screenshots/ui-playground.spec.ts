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
      await expect(page.getByRole("heading", { name: "Формулы", exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Маскот" })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Движение и обратная связь" })
      ).toBeVisible();

      await expect(page.getByRole("link", { name: "Песочница интерфейса PhysicsLab" })).toHaveAttribute(
        "href",
        "/ui-playground/"
      );
      await expect(page.locator("[data-experiment-zone]")).toHaveCount(3);
      await expect(page.locator("[data-playground-particles]")).toHaveCount(1);
      await expect(page.locator("#lab-background-canvas")).toHaveCount(0);
      const canvasCount = await page.locator("canvas").count();
      expect(canvasCount).toBeLessThanOrEqual(1);
      const formulaCard = page.locator("[data-formula-card-experiment]");
      await expect(formulaCard).toBeVisible();
      await expect(formulaCard).toHaveAttribute("data-active-part", "none");
      expect(await formulaCard.getAttribute("data-motion-state")).toBeNull();
      await expect(page.locator("[data-formula-part]")).toHaveCount(5);
      await expect(page.locator("[data-variable-card]")).toHaveCount(4);
      await expect(page.getByText("Наведи на часть формулы")).toBeVisible();

      await page.waitForTimeout(700);
      await expect(formulaCard).toHaveAttribute("data-active-part", "none");
      await expect(page.getByText("Наведи на часть формулы")).toBeVisible();

      await page.locator('[data-formula-part="v"]').hover();
      await expect(formulaCard).toHaveAttribute("data-active-part", "v");
      await expect(page.locator('[data-variable-card="v"]')).toHaveAttribute("data-active", "");
      await expect(page.locator('[data-graph-element="line"]')).toHaveAttribute("data-active", "");
      await expect(page.getByText("v задает наклон графика x(t)")).toBeVisible();

      await page.locator('[data-formula-part="x0"]').focus();
      await expect(formulaCard).toHaveAttribute("data-active-part", "x0");
      await expect(page.locator('[data-variable-card="x0"]')).toHaveAttribute("data-active", "");
      await expect(page.locator('[data-graph-element="start"]')).toHaveAttribute("data-active", "");

      await page.locator('[data-formula-part="t"]').click();
      await expect(formulaCard).toHaveAttribute("data-active-part", "t");
      await expect(page.locator('[data-variable-card="t"]')).toHaveAttribute("data-active", "");
      await expect(page.locator('[data-graph-element="time"]')).toHaveAttribute("data-active", "");
      await expect(page.getByText("t показывает, сколько времени прошло")).toBeVisible();

      await expect(page.getByText("x, м")).toBeVisible();
      await expect(page.getByText("t, с")).toBeVisible();
      await expect(page.locator("[data-slope-icon]")).toHaveCount(3);
      await expect(page.locator(".formula-card-experiment__chip--positive")).toHaveCount(0);
      await expect(page.getByText("KaTeX-проверка")).toBeVisible();
      await expect(page.locator("[data-math-formula]")).toHaveCount(3);
      await expect(page.locator(".katex")).toHaveCount(3);
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
