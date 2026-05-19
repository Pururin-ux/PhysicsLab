import { expect, test, type Locator, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.resolve(
  process.cwd(),
  "artifacts/screenshots/accelerated-motion"
);

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow-mobile", width: 360, height: 800 }
];

const sceneRoot = (page: Page) => page.locator("[data-acceleration-scene]").first();

const currentTime = async (scene: Locator) =>
  Number(await scene.getAttribute("data-current-time"));

const currentVelocity = async (scene: Locator) =>
  Number(await scene.getAttribute("data-current-v"));

const hasHorizontalScroll = async (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );

const boxOf = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("Expected element to have a visible bounding box");
  }

  return box;
};

const topOf = async (locator: Locator) => (await boxOf(locator)).y;

test.describe("accelerated-motion chapter screenshots", () => {
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

      await page.goto("/chapters/accelerated-motion/", { waitUntil: "networkidle" });

      await expect(page.getByRole("heading", { name: "Равноускоренное движение" })).toBeVisible();
      await expect(page.getByText("prototype v0").first()).toBeVisible();
      await expect(page.getByText("authorReviewRequired")).toBeVisible();
      const prediction = page.locator("[data-acceleration-predict]");
      await expect(prediction).toBeVisible();
      await expect(prediction.getByText("v₀ > 0, но a < 0. Что сначала будет с телом?")).toBeVisible();
      const wrongPrediction = prediction.getByRole("button", { name: "Сразу едет назад" });
      const correctPrediction = prediction.getByRole("button", { name: "Ещё едет вправо, но замедляется" });
      await wrongPrediction.click();
      await expect(wrongPrediction).toHaveAttribute("aria-pressed", "true");
      await expect(prediction.locator("[data-prediction-feedback]")).toContainText("Сначала смотри на знак v");
      await expect(prediction.locator("[data-prediction-hint]")).toBeVisible();
      await correctPrediction.click();
      await expect(correctPrediction).toHaveAttribute("aria-pressed", "true");
      await expect(wrongPrediction).toHaveAttribute("aria-pressed", "false");
      await expect(prediction.locator("[data-prediction-feedback]")).toContainText("Отрицательное a наклоняет v(t) вниз");

      const scene = sceneRoot(page);
      await expect(scene).toBeVisible();
      await expect(scene.locator('[data-input="v0"]')).toBeVisible();
      await expect(scene.locator('[data-input="a"]')).toBeVisible();
      await expect(scene.getByText("Старт движения при t = 0.")).toBeVisible();
      await expect(scene.getByText("Как меняется v за 1 секунду.")).toBeVisible();
      await expect(scene.locator("[data-motion-point]")).toBeVisible();
      await expect(scene.locator("[data-velocity-arrow]")).toBeVisible();
      await expect(scene.locator('[data-polyline="x"]')).toHaveAttribute("points", /,/);
      await expect(scene.locator('[data-current-polyline="x"]')).toHaveAttribute("points", /,/);
      await expect(scene.locator('[data-polyline="v"]')).toHaveAttribute("points", /,/);
      await expect(scene.locator('[data-current-polyline="v"]')).toHaveAttribute("points", /,/);
      await expect(scene.locator('[data-point="x"]')).toHaveAttribute("cx", /\d/);
      await expect(scene.locator('[data-point="v"]')).toHaveAttribute("cx", /\d/);
      await expect(page.getByText("Переменные и единицы")).toBeVisible();
      await expect(page.getByText("Формулы подходят, если ускорение a постоянно.")).toBeVisible();
      await expect(page.locator('[data-formula-variable="a"]')).toContainText("м/с²");
      const formulaSection = page.locator("#formula");
      await expect(formulaSection).toContainText("вправо считаем положительным");
      await expect(formulaSection).toContainText("v > 0");
      await expect(formulaSection).toContainText("ускорение меняется во времени");
      await expect(formulaSection).toContainText("x₀ зафиксировано как 0");

      const playButton = scene.locator("[data-play-toggle]");
      const resetButton = scene.locator("[data-reset]");
      await expect(playButton).toBeVisible();
      await expect(resetButton).toBeVisible();

      const readoutsTop = await topOf(scene.locator("[data-scene-readouts]"));
      const controlsTop = await topOf(scene.locator(".acceleration-controls"));
      const sceneTop = await topOf(scene);
      const motionPanelBox = await boxOf(scene.locator("[data-motion-panel]"));
      const motionPanelTop = motionPanelBox.y;
      const graphStackTop = await topOf(scene.locator("[data-graph-stack]"));
      const primaryGraphTop = await topOf(scene.locator('[data-primary-graph="v"]'));
      const secondaryGraphTop = await topOf(scene.locator('[data-secondary-graph="x"]'));
      const playTop = await topOf(playButton);
      const accelerationInputTop = await topOf(scene.locator('[data-input="a"]'));
      expect(readoutsTop).toBeLessThan(controlsTop);
      expect(controlsTop).toBeLessThan(motionPanelTop);
      expect(controlsTop).toBeLessThan(graphStackTop);
      expect(controlsTop).toBeLessThan(primaryGraphTop);
      expect(primaryGraphTop).toBeLessThan(secondaryGraphTop);
      expect(playTop).toBeLessThan(graphStackTop);
      expect(accelerationInputTop).toBeLessThan(graphStackTop);

      if (viewport.width <= 600) {
        expect(playTop - sceneTop).toBeLessThan(260);
        expect(accelerationInputTop - sceneTop).toBeLessThan(440);
        expect(primaryGraphTop - sceneTop).toBeLessThan(620);
        expect(motionPanelTop - sceneTop).toBeLessThan(960);
        expect(motionPanelBox.height).toBeLessThan(300);
      } else if (viewport.width >= 1200) {
        expect(Math.abs(primaryGraphTop - motionPanelTop)).toBeLessThan(80);
      }

      const startTime = await currentTime(scene);
      await playButton.click();
      await expect
        .poll(async () => currentTime(scene), { timeout: 1800 })
        .toBeGreaterThan(startTime);

      await resetButton.click();
      await expect.poll(async () => currentTime(scene)).toBe(0);

      const velocityLineBefore = await scene.locator('[data-polyline="v"]').getAttribute("points");
      await scene.locator('[data-input="a"]').evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "-2";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(scene).toHaveAttribute("data-current-a", "-2");
      await expect(scene).toHaveAttribute("data-motion-direction", "forward");
      await expect(scene.locator("[data-guidance]")).toContainText("ещё едет вправо");
      await expect(scene.locator('[data-graph-note="v"]')).toContainText("назад тело поедет только когда v станет меньше нуля");
      await expect(scene.locator('[data-polyline="v"]')).not.toHaveAttribute(
        "points",
        velocityLineBefore ?? ""
      );

      await scene.locator('[data-input="a"]').evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "0";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(scene).toHaveAttribute("data-current-a", "0");
      await expect(scene).toHaveAttribute("data-acceleration-mode", "uniform");
      await expect(scene.locator('[data-graph-note="v"]')).toContainText(/скорость постоянная/i);
      await expect(scene.locator('[data-graph-note="x"]')).toContainText("x(t) снова прямая");
      await playButton.click();
      await expect
        .poll(async () => currentTime(scene), { timeout: 1800 })
        .toBeGreaterThan(0);
      expect(Math.abs((await currentVelocity(scene)) - 3)).toBeLessThan(0.01);
      await resetButton.click();

      await page.getByRole("button", { name: "Едет назад: координата уменьшается" }).click();
      await expect(page.locator("[data-check-feedback]")).toContainText("После пересечения нуля");

      expect(await hasHorizontalScroll(page)).toBe(false);

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-full.png`),
        fullPage: true,
        animations: "disabled"
      });
    });
  }

  test("reduced motion uses step mode and keeps the scene meaningful", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/chapters/accelerated-motion/", { waitUntil: "networkidle" });

    const scene = sceneRoot(page);
    await expect(scene).toBeVisible();
    await expect(scene.locator("[data-play-toggle]")).toHaveAttribute("data-mode", "step");
    await expect(scene).toHaveAttribute("data-playing", "false");
    await expect(scene.locator('[data-polyline="x"]')).toHaveAttribute("points", /,/);
    await expect(scene.locator('[data-polyline="v"]')).toHaveAttribute("points", /,/);

    const initialTime = await currentTime(scene);
    await page.waitForTimeout(250);
    expect(await currentTime(scene)).toBe(initialTime);

    await scene.locator("[data-play-toggle]").click();
    await expect
      .poll(async () => currentTime(scene))
      .toBeGreaterThan(initialTime);
    await expect(scene).toHaveAttribute("data-playing", "false");
    expect(await hasHorizontalScroll(page)).toBe(false);
  });
});
