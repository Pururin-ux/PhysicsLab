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

const expectMotionLabelsSeparated = async (scene: Locator) => {
  const layout = await scene.locator("[data-motion-panel]").evaluate((panel) => {
    const motionPoint = panel.querySelector("[data-motion-point]");
    const xLabel = panel.querySelector("[data-motion-x-label]");
    const toRect = (element: Element) => {
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
    const toNumber = (value: string) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const overlaps = (
      a: ReturnType<typeof toRect>,
      b: ReturnType<typeof toRect>
    ) => !(a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1);

    if (!motionPoint || !xLabel) {
      return {
        missing: true,
        overlap: true,
        verticalGap: 0,
        xLabel: null,
        vLabel: null
      };
    }

    const pointRect = toRect(motionPoint);
    const xLabelRect = toRect(xLabel);
    const labelStyle = window.getComputedStyle(motionPoint, "::after");
    const fontSize = toNumber(labelStyle.fontSize) || 13;
    const lineHeight = labelStyle.lineHeight === "normal"
      ? fontSize * 1.2
      : toNumber(labelStyle.lineHeight) || fontSize * 1.2;
    const paddingX = toNumber(labelStyle.paddingLeft) + toNumber(labelStyle.paddingRight);
    const paddingY = toNumber(labelStyle.paddingTop) + toNumber(labelStyle.paddingBottom);
    const borderX = toNumber(labelStyle.borderLeftWidth) + toNumber(labelStyle.borderRightWidth);
    const borderY = toNumber(labelStyle.borderTopWidth) + toNumber(labelStyle.borderBottomWidth);
    const labelText = motionPoint.getAttribute("data-motion-label") ?? "";
    const labelWidth = Math.max(24, labelText.length * fontSize * 0.58 + paddingX + borderX);
    const labelHeight = lineHeight + paddingY + borderY;
    const labelTop = pointRect.top + toNumber(labelStyle.top);
    const vLabelRect = {
      left: pointRect.left + pointRect.width / 2 - labelWidth / 2,
      top: labelTop,
      right: pointRect.left + pointRect.width / 2 + labelWidth / 2,
      bottom: labelTop + labelHeight,
      width: labelWidth,
      height: labelHeight
    };
    const verticalGap = xLabelRect.bottom <= vLabelRect.top
      ? vLabelRect.top - xLabelRect.bottom
      : xLabelRect.top - vLabelRect.bottom;

    return {
      missing: false,
      overlap: overlaps(xLabelRect, vLabelRect),
      verticalGap,
      xLabel: xLabelRect,
      vLabel: vLabelRect
    };
  });

  expect(layout.missing, "motion x and v labels exist").toBe(false);
  expect(layout.overlap, `x and v motion labels overlap: ${JSON.stringify(layout)}`).toBe(false);
  expect(layout.verticalGap, `x and v motion label gap: ${JSON.stringify(layout)}`).toBeGreaterThanOrEqual(2);
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
      const chapter = page.locator("[data-accelerated-motion-chapter]");
      await expect(chapter).toHaveAttribute("data-release-stage", "prototype-v0");
      await expect(chapter).toHaveAttribute("data-review-status", "author-review-required");
      await expect(page.locator("[data-acceleration-scene]")).toHaveAttribute(
        "data-component-stage",
        "prototype-v0"
      );
      const visiblePageText = await page.locator("body").evaluate((body) => (body as HTMLElement).innerText);
      expect(visiblePageText).not.toMatch(/prototype|authorReviewRequired|прототип|demo/i);
      expect(visiblePageText).not.toMatch(/прогноз/i);
      const prediction = page.locator("[data-acceleration-predict]");
      await expect(prediction).toBeVisible();
      const predictionPrompt = prediction.locator(".prediction-prompt");
      await expect(predictionPrompt).toHaveText("Тело сначала едет вправо, а ускорение направлено влево. Что сначала будет происходить?");
      await expect(predictionPrompt).not.toContainText("v₀ > 0");
      await expect(predictionPrompt).not.toContainText("a < 0");
      await expect(prediction).not.toContainText("x(t) обязан быть прямой");
      await expect(prediction).toContainText("Будет ехать вправо всё быстрее");
      await expect(prediction).toContainText("Сначала скорость");
      await expect(prediction).toContainText("Потом координата");
      const wrongPrediction = prediction.getByRole("button", { name: "Будет ехать вправо всё быстрее" });
      const correctPrediction = prediction.getByRole("button", { name: "Ещё едет вправо, но замедляется" });
      await wrongPrediction.click();
      await expect(wrongPrediction).toHaveAttribute("aria-pressed", "true");
      await expect(prediction.locator("[data-prediction-feedback]")).toContainText("Сначала смотри на знак скорости");
      await expect(prediction.locator("[data-prediction-hint]")).toBeVisible();
      await expect(prediction.locator("[data-prediction-hint]")).toContainText("линия скорости пересечёт ноль");
      await correctPrediction.click();
      await expect(correctPrediction).toHaveAttribute("aria-pressed", "true");
      await expect(wrongPrediction).toHaveAttribute("aria-pressed", "false");
      await expect(prediction.locator("[data-prediction-feedback]")).toContainText("Ускорение влево опускает линию скорости");

      const scene = sceneRoot(page);
      await expect(scene).toBeVisible();
      await expect(scene.locator('[data-input="v0"]')).toBeVisible();
      await expect(scene.locator('[data-input="a"]')).toBeVisible();
      const dynamicSummary = scene.locator("[data-dynamic-summary]");
      await expect(dynamicSummary).toBeAttached();
      await expect(dynamicSummary).toHaveAttribute("aria-live", "polite");
      await expect(dynamicSummary).toHaveAttribute("aria-atomic", "true");
      await expect(dynamicSummary).toContainText("t = 0 с");
      await expect(dynamicSummary).toContainText("v = 3 м/с");
      await expect(dynamicSummary).toContainText("x = 0 м");
      await expect(dynamicSummary).toContainText("a = 0.8 м/с²");
      await expect(dynamicSummary).toContainText("Движется вправо");
      await expect(dynamicSummary).toContainText("Скорость растёт");
      await expect(dynamicSummary).not.toContainText("График v(t): наклон показывает ускорение");
      await expect(dynamicSummary).not.toContainText("График x(t): наклон показывает скорость");
      const graphMeaningSummary = scene.locator("[data-graph-meaning-summary]");
      await expect(graphMeaningSummary).toBeAttached();
      expect(await graphMeaningSummary.getAttribute("aria-live")).toBeNull();
      await expect(graphMeaningSummary).toContainText("Смысл графиков");
      await expect(graphMeaningSummary).toContainText("v(t) — наклон показывает ускорение");
      await expect(graphMeaningSummary).toContainText("x(t) — наклон показывает скорость");
      await expect(scene.getByText("Старт движения при t = 0.")).toBeVisible();
      await expect(scene.getByText("Как меняется v за 1 секунду.")).toBeVisible();
      await expect(scene.locator("[data-motion-point]")).toBeVisible();
      await expect(scene.locator("[data-velocity-arrow]")).toBeVisible();
      await expectMotionLabelsSeparated(scene);
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
      await expect(formulaSection.locator(".formula-intro")).toContainText("Сначала свяжи скорость с графиком v(t)");
      await expect(formulaSection).toContainText("Справочник");
      await expect(formulaSection).toContainText("Можно подсмотреть");
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

      expect(formulaReadability.count).toBeGreaterThanOrEqual(3);
      expect(formulaReadability.visibleCount).toBe(formulaReadability.count);
      expect(formulaReadability.katexCount).toBe(formulaReadability.count);
      expect(formulaReadability.displayCount).toBe(formulaReadability.count);
      expect(formulaReadability.hasFraction).toBe(true);
      expect(formulaReadability.hasMathMl).toBe(true);
      await expect(formulaSection.locator(".formula-card [data-math-formula]")).toHaveCount(2);
      await expect(formulaSection.locator("[data-formula-seq]")).toHaveCount(0);
      await expect(formulaSection.locator("[data-step]")).toHaveCount(0);
      await expect(formulaSection.locator("[data-formula-gate]")).toHaveCount(0);
      await expect(formulaSection.locator("[data-formula-continue]")).toHaveCount(0);
      const workedExample = formulaSection.locator("[data-formula-worked-example]");
      await expect(workedExample).toBeVisible();
      await expect(workedExample).toContainText("v₀ = 3 м/с");
      await expect(workedExample).toContainText("a = −2 м/с²");
      await expect(workedExample).toContainText("t = 1 с");
      await expect(workedExample).toContainText("v = 1 м/с");
      await expect(workedExample).toContainText("Дано");
      await expect(workedExample).toContainText("Подставляем");
      await expect(workedExample).toContainText("Получаем");
      await expect(workedExample).toContainText("Значит");
      await expect(workedExample).toContainText("Единицы");
      await expect(workedExample).toContainText("(м/с²) · с = м/с");
      await expect(workedExample).toContainText("v всё ещё положительная");
      await expect(workedExample).toContainText("тело движется вправо");
      await expect(workedExample).toContainText("скорость уменьшается");
      await expect(workedExample).toContainText("Направление задаёт знак v");
      await expect(formulaSection).not.toContainText("4. Переменные");
      await expect(formulaSection).not.toContainText("5. Когда применять");
      await expect(formulaSection).toContainText("Вправо считаем положительным");
      await expect(formulaSection).toContainText("v > 0");
      await expect(formulaSection).toContainText("другая модель");
      await expect(formulaSection).toContainText("x₀ зафиксировано как 0");
      const formulaCondition = formulaSection.locator(".formula-condition");
      const conditionNotes = formulaCondition.locator("[data-formula-condition-note]");
      await expect(conditionNotes).toHaveCount(5);
      await expect(formulaSection.locator(".formula-condition > p")).toHaveCount(0);
      await expect(formulaCondition.locator('[data-formula-condition-note="axis"]')).toContainText("Вправо считаем положительным");
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
      const summaryBeforePlay = await dynamicSummary.textContent();
      await playButton.click();
      await expect
        .poll(async () => currentTime(scene), { timeout: 1800 })
        .toBeGreaterThan(startTime);
      await expect
        .poll(async () => dynamicSummary.textContent(), { timeout: 2600 })
        .not.toBe(summaryBeforePlay);

      await resetButton.click();
      await expect.poll(async () => currentTime(scene)).toBe(0);
      await expect(dynamicSummary).toContainText("t = 0 с");

      const velocityLineBefore = await scene.locator('[data-polyline="v"]').getAttribute("points");
      await scene.locator('[data-input="a"]').evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "-2";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(scene).toHaveAttribute("data-current-a", "-2");
      await expect(scene).toHaveAttribute("data-motion-direction", "forward");
      await expect(scene.locator("[data-guidance]")).toContainText("ещё едет вправо");
      await expect(dynamicSummary).toContainText("a = -2 м/с²");
      await expect(dynamicSummary).toContainText("Скорость уменьшается");
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

      await scene.locator('[data-input="v0"]').evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "-3";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(scene).toHaveAttribute("data-current-v", "-3");
      await expect(scene).toHaveAttribute("data-motion-direction", "backward");
      await expect(dynamicSummary).toContainText("v = -3 м/с");
      await expect(dynamicSummary).toContainText("Движется влево/назад");
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
