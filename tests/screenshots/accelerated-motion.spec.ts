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

type GraphReadabilityOptions = {
  minimumGraphCount?: number;
  requireTickLabels?: boolean;
};

const expectReadableInstrumentGraphs = async (
  root: Locator,
  options: GraphReadabilityOptions = {}
) => {
  const { minimumGraphCount = 1, requireTickLabels = true } = options;
  const graphs = await root.evaluateAll((figures) => {
    const rectOf = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      };
    };
    const overlaps = (
      a: ReturnType<typeof rectOf>,
      b: ReturnType<typeof rectOf>
    ) => !(a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1);
    const isInside = (
      child: ReturnType<typeof rectOf>,
      parent: ReturnType<typeof rectOf>
    ) => (
      child.left >= parent.left - 2 &&
      child.right <= parent.right + 2 &&
      child.top >= parent.top - 2 &&
      child.bottom <= parent.bottom + 2
    );

    return figures
      .filter((figure) => {
        const rect = figure.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && figure.querySelector("[data-graph-svg]");
      })
      .map((figure) => {
        const svg = figure.querySelector("[data-graph-svg]");
        const plotArea = figure.querySelector("[data-plot-area]");
        const xAxisLabel = figure.querySelector('[data-axis-label="x"]');
        const yAxisLabel = figure.querySelector('[data-axis-label="y"]');
        const xTickLabels = [...figure.querySelectorAll('[data-tick-label="x"]')];
        const yTickLabels = [...figure.querySelectorAll('[data-tick-label="y"]')];
        const currentPoint = figure.querySelector("[data-point]");
        const projection = figure.querySelector("[data-projection]");
        const labels = [xAxisLabel, yAxisLabel, ...xTickLabels, ...yTickLabels].filter(Boolean) as Element[];

        if (!svg || !xAxisLabel || !yAxisLabel || !currentPoint) {
          return {
            title: figure.querySelector("figcaption")?.textContent?.trim() ?? "",
            missingRequiredMarker: true,
            hasPlotArea: false,
            svgWidth: 0,
            svgHeight: 0,
            xAxisVisible: false,
            yAxisVisible: false,
            xTickCount: xTickLabels.length,
            yTickCount: yTickLabels.length,
            xAxisOverlapsTick: true,
            yAxisOverlapsTick: true,
            hasLabelOutsideSvg: true,
            hasFlatLabel: true,
            currentPointVisible: false,
            currentPointInsideSvg: false,
            hasProjection: Boolean(projection),
            projectionLineCount: projection?.querySelectorAll("[data-projection-line]").length ?? 0
          };
        }

        const svgRect = rectOf(svg);
        const xAxisRect = rectOf(xAxisLabel);
        const yAxisRect = rectOf(yAxisLabel);
        const xTickRects = xTickLabels.map(rectOf);
        const yTickRects = yTickLabels.map(rectOf);
        const currentPointRect = rectOf(currentPoint);

        return {
          title: figure.querySelector("figcaption")?.textContent?.trim() ?? "",
          missingRequiredMarker: false,
          hasPlotArea: Boolean(plotArea),
          svgWidth: svgRect.width,
          svgHeight: svgRect.height,
          xAxisVisible: xAxisRect.width > 0 && xAxisRect.height > 0,
          yAxisVisible: yAxisRect.width > 0 && yAxisRect.height > 0,
          xTickCount: xTickLabels.length,
          yTickCount: yTickLabels.length,
          xAxisOverlapsTick: xTickRects.some((tick) => overlaps(xAxisRect, tick)),
          yAxisOverlapsTick: yTickRects.some((tick) => overlaps(yAxisRect, tick)),
          hasLabelOutsideSvg: labels.map(rectOf).some((label) => !isInside(label, svgRect)),
          hasFlatLabel: labels.map(rectOf).some((label) => label.width <= 0 || label.height <= 0),
          currentPointVisible: currentPointRect.width > 0 && currentPointRect.height > 0,
          currentPointInsideSvg: isInside(currentPointRect, svgRect),
          hasProjection: Boolean(projection),
          projectionLineCount: projection?.querySelectorAll("[data-projection-line]").length ?? 0
        };
      });
  });

  expect(graphs.length).toBeGreaterThanOrEqual(minimumGraphCount);
  for (const graph of graphs) {
    expect(graph.missingRequiredMarker, `${graph.title} required graph markers`).toBe(false);
    expect(graph.hasPlotArea, `${graph.title} plot area marker`).toBe(true);
    expect(graph.svgWidth, `${graph.title} svg width`).toBeGreaterThan(180);
    expect(graph.svgHeight, `${graph.title} svg height`).toBeGreaterThan(150);
    expect(graph.xAxisVisible, `${graph.title} x axis label visible`).toBe(true);
    expect(graph.yAxisVisible, `${graph.title} y axis label visible`).toBe(true);
    if (requireTickLabels) {
      expect(graph.xTickCount, `${graph.title} x tick labels`).toBeGreaterThanOrEqual(2);
      expect(graph.yTickCount, `${graph.title} y tick labels`).toBeGreaterThanOrEqual(2);
    }
    expect(graph.xAxisOverlapsTick, `${graph.title} x axis label overlaps tick labels`).toBe(false);
    expect(graph.yAxisOverlapsTick, `${graph.title} y axis label overlaps tick labels`).toBe(false);
    expect(graph.hasLabelOutsideSvg, `${graph.title} label outside svg`).toBe(false);
    expect(graph.hasFlatLabel, `${graph.title} flat label box`).toBe(false);
    expect(graph.currentPointVisible, `${graph.title} current point visible`).toBe(true);
    expect(graph.currentPointInsideSvg, `${graph.title} current point inside svg`).toBe(true);
    if (graph.hasProjection) {
      expect(graph.projectionLineCount, `${graph.title} projection lines`).toBeGreaterThanOrEqual(2);
    }
  }
};

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
      await expect(prediction).toContainText("Сначала v(t)");
      await expect(prediction).toContainText("Потом x(t)");
      const wrongPrediction = prediction.getByRole("button", { name: "Сразу едет назад" });
      const correctPrediction = prediction.getByRole("button", { name: "Ещё едет вправо, но замедляется" });
      await wrongPrediction.click();
      await expect(wrongPrediction).toHaveAttribute("aria-pressed", "true");
      await expect(prediction.locator("[data-prediction-feedback]")).toContainText("Сначала смотри на знак v");
      await expect(prediction.locator("[data-prediction-hint]")).toBeVisible();
      await expect(prediction.locator("[data-prediction-hint]")).toContainText("Теперь выставь a < 0");
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
      await expectReadableInstrumentGraphs(scene.locator(".pl-instrument-graph"), {
        minimumGraphCount: 2
      });
      await expect(page.getByText("Переменные и единицы")).toBeVisible();
      await expect(page.getByText("Формулы подходят, если ускорение a постоянно.")).toBeVisible();
      await expect(page.locator('[data-formula-variable="a"]')).toContainText("м/с²");
      const formulaSection = page.locator("#formula");
      const formulaReadability = await formulaSection.evaluate((section) => {
        const formulas = [...section.querySelectorAll("[data-math-formula]")];
        const sectionRect = section.getBoundingClientRect();
        const isInsideSection = (rect: DOMRect) => (
          rect.left >= sectionRect.left - 2 &&
          rect.right <= sectionRect.right + 2 &&
          rect.top >= sectionRect.top - 2 &&
          rect.bottom <= sectionRect.bottom + 2
        );

        return {
          count: formulas.length,
          visibleCount: formulas.filter((formula) => {
            const rect = formula.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && isInsideSection(rect);
          }).length,
          katexCount: formulas.filter((formula) => formula.querySelector(".katex")).length,
          displayCount: formulas.filter((formula) => formula.getAttribute("data-display") === "true").length,
          hasFraction: formulas.some((formula) => Boolean(formula.querySelector(".frac-line"))),
          hasMathMl: formulas.every((formula) => Boolean(formula.querySelector("math")))
        };
      });

      expect(formulaReadability.count).toBe(2);
      expect(formulaReadability.visibleCount).toBe(2);
      expect(formulaReadability.katexCount).toBe(2);
      expect(formulaReadability.displayCount).toBe(2);
      expect(formulaReadability.hasFraction).toBe(true);
      expect(formulaReadability.hasMathMl).toBe(true);
      await expect(formulaSection).toContainText("вправо считаем положительным");
      await expect(formulaSection).toContainText("v > 0");
      await expect(formulaSection).toContainText("ускорение меняется во времени");
      await expect(formulaSection).toContainText("x₀ зафиксировано как 0");
      const formulaCondition = formulaSection.locator(".formula-condition");
      const conditionNotes = formulaCondition.locator("[data-formula-condition-note]");
      await expect(conditionNotes).toHaveCount(5);
      await expect(formulaSection.locator(".formula-condition > p")).toHaveCount(0);
      await expect(formulaCondition.locator('[data-formula-condition-note="axis"]')).toContainText("вправо считаем положительным");
      await expect(formulaCondition.locator('[data-formula-condition-note="direction"]')).toContainText("v > 0");
      await expect(formulaCondition.locator('[data-formula-condition-note="direction"]')).toContainText("v < 0");
      await expect(formulaCondition.locator('[data-formula-condition-note="constant-a"]')).toContainText("Формулы подходят, если ускорение a постоянно.");

      const playButton = scene.locator("[data-play-toggle]");
      const resetButton = scene.locator("[data-reset]");
      await expect(playButton).toBeVisible();
      await expect(resetButton).toBeVisible();

      const readoutsTop = await topOf(scene.locator("[data-scene-readouts]"));
      const controlsTop = await topOf(scene.locator(".acceleration-controls"));
      const sceneTop = await topOf(scene);
      const primaryObservation = scene.locator("[data-primary-observation]");
      await expect(primaryObservation).toBeVisible();
      await expect(primaryObservation.locator("[data-motion-panel]")).toBeVisible();
      await expect(primaryObservation.locator('[data-primary-graph="v"]')).toBeVisible();
      const primaryObservationBox = await boxOf(primaryObservation);
      const motionPanelBox = await boxOf(scene.locator("[data-motion-panel]"));
      const motionPanelTop = motionPanelBox.y;
      const graphStackTop = await topOf(scene.locator("[data-graph-stack]"));
      const primaryGraphBox = await boxOf(scene.locator('[data-primary-graph="v"]'));
      const secondaryGraphBox = await boxOf(scene.locator('[data-secondary-graph="x"]'));
      const primaryGraphTop = primaryGraphBox.y;
      const secondaryGraphTop = secondaryGraphBox.y;
      const playTop = await topOf(playButton);
      const accelerationInputTop = await topOf(scene.locator('[data-input="a"]'));
      expect(readoutsTop).toBeLessThan(controlsTop);
      expect(controlsTop).toBeLessThan(motionPanelTop);
      expect(controlsTop).toBeLessThan(graphStackTop);
      expect(controlsTop).toBeLessThan(primaryObservationBox.y);
      expect(controlsTop).toBeLessThan(primaryGraphTop);
      expect(primaryGraphTop).toBeLessThan(secondaryGraphTop);
      expect(secondaryGraphTop).toBeGreaterThan(primaryObservationBox.y);
      expect(motionPanelBox.y).toBeGreaterThanOrEqual(primaryObservationBox.y - 2);
      expect(primaryGraphBox.y).toBeGreaterThanOrEqual(primaryObservationBox.y - 2);
      expect(motionPanelBox.y + motionPanelBox.height).toBeLessThanOrEqual(
        primaryObservationBox.y + primaryObservationBox.height + 2
      );
      expect(primaryGraphBox.y + primaryGraphBox.height).toBeLessThanOrEqual(
        primaryObservationBox.y + primaryObservationBox.height + 2
      );
      expect(playTop).toBeLessThan(graphStackTop);
      expect(accelerationInputTop).toBeLessThan(graphStackTop);

      if (viewport.width <= 600) {
        expect(playTop - sceneTop).toBeLessThan(260);
        expect(accelerationInputTop - sceneTop).toBeLessThan(440);
        expect(motionPanelTop).toBeLessThan(primaryGraphTop);
        expect(motionPanelTop - sceneTop).toBeLessThan(620);
        expect(primaryGraphTop - sceneTop).toBeLessThan(960);
        expect(motionPanelBox.height).toBeLessThan(300);
      } else if (viewport.width >= 1200) {
        expect(Math.abs(primaryGraphTop - motionPanelTop)).toBeLessThan(80);
        expect(secondaryGraphBox.x).toBeLessThanOrEqual(motionPanelBox.x + 4);
        expect(secondaryGraphBox.x + secondaryGraphBox.width).toBeGreaterThanOrEqual(
          primaryGraphBox.x + primaryGraphBox.width - 4
        );
        expect(secondaryGraphBox.height).toBeLessThan(primaryGraphBox.height);
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
