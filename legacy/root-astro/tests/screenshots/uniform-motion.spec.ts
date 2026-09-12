import { expect, test, type Locator, type Page } from "@playwright/test";
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

const labRoot = (page: Page) => page.locator("[data-uniform-motion-lab]").first();

const currentTime = async (lab: Locator) =>
  Number(await lab.getAttribute("data-current-time"));

const hasHorizontalScroll = async (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );

const clickDetailsToggle = async (detailsToggle: Locator) => {
  await detailsToggle.scrollIntoViewIfNeeded();
  await expect(detailsToggle).toBeVisible();
  await expect(detailsToggle).toBeEnabled();
  await detailsToggle.click();
};

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

test.describe("uniform-motion chapter screenshots", () => {
  test.beforeAll(async () => {
    await fs.rm(screenshotDir, { recursive: true, force: true });
    await fs.mkdir(screenshotDir, { recursive: true });
  });

  for (const viewport of viewports) {
    test(`${viewport.name} screenshot`, async ({ page }) => {
      // The interacted desktop page is the heaviest full-page capture in the
      // default parallel screenshot run, so give only that case extra headroom.
      if (viewport.name === "desktop") {
        test.setTimeout(60_000);
      }

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto("/chapters/uniform-motion/", { waitUntil: "networkidle" });

      await expect(
        page.getByRole("heading", { name: "Равномерное движение" })
      ).toBeVisible();
      await expect(page.locator("[data-formula-scene]")).toBeVisible();
      const lab = labRoot(page);
      await expect(lab).toBeVisible();
      await expect(lab).toHaveAttribute("data-visual-target", "v1");
      await expect(lab.locator("[data-motion-point]")).toBeVisible();
      await expect(lab.locator("[data-velocity-arrow]")).toBeVisible();
      await expect(lab.locator("[data-motion-x-label]")).toBeVisible();
      await expect(lab.locator('[data-polyline="x"]')).toHaveAttribute("points", /,/);
      await expect(lab.locator('[data-current-polyline="x"]')).toHaveAttribute("points", /,/);
      await expect(lab.locator('[data-point="x"]')).toHaveAttribute("cx", /\d/);
      await expect(lab.locator('[data-projection="x"]')).toBeVisible();
      await expect(lab.locator('[data-graph-note="x"]')).toContainText("Жёлтая точка");
      await expectReadableInstrumentGraphs(lab.locator(".pl-instrument-graph"));
      await expect(page.getByText("prototype/demo")).toBeVisible();
      await expect(page.getByText("authorReviewRequired")).toBeVisible();

      const playButton = lab.locator("[data-play-toggle]");
      const resetButton = lab.locator("[data-reset]");
      await expect(playButton).toBeVisible();
      await expect(resetButton).toBeVisible();

      const startTime = await currentTime(lab);
      await playButton.click();
      await expect(playButton).toContainText("Пауза");
      await expect
        .poll(async () => currentTime(lab), { timeout: 1800 })
        .toBeGreaterThan(startTime);

      await playButton.click();
      const pausedTime = await currentTime(lab);
      await page.waitForTimeout(250);
      const afterPauseTime = await currentTime(lab);
      expect(Math.abs(afterPauseTime - pausedTime)).toBeLessThan(0.05);

      await resetButton.click();
      await expect.poll(async () => currentTime(lab)).toBe(0);

      await lab.getByRole("button", { name: "вперёд" }).click();
      await expect(lab).toHaveAttribute("data-motion-direction", "forward");
      await expect(lab.locator("[data-observation]")).toContainText("Едет вправо");

      await lab.getByRole("button", { name: "стоит" }).click();
      await expect(lab).toHaveAttribute("data-motion-direction", "still");
      await expect(lab.locator("[data-observation]")).toContainText("Стоит");

      await lab.getByRole("button", { name: "назад" }).click();
      await expect(lab).toHaveAttribute("data-motion-direction", "backward");
      await expect(lab.locator("[data-observation]")).toContainText("Едет назад");
      await expect(lab.locator("[data-guidance]")).toContainText("Координата уменьшается");
      await expect(lab.locator("[data-guidance]")).not.toContainText(/замедл/i);

      const detailsToggle = lab.locator("[data-details-toggle]");
      const detailsPanel = lab.locator("[data-details-panel]");
      await expect(detailsToggle).toHaveAttribute("aria-expanded", "false");
      await expect(detailsPanel).toBeHidden();

      await clickDetailsToggle(detailsToggle);
      await expect(detailsToggle).toHaveAttribute("aria-expanded", "true");
      await expect(detailsPanel).toBeVisible();
      await expectReadableInstrumentGraphs(lab.locator(".pl-instrument-graph"), {
        minimumGraphCount: 2,
        requireTickLabels: false
      });

      await clickDetailsToggle(detailsToggle);
      await expect(detailsToggle).toHaveAttribute("aria-expanded", "false");
      await expect(detailsPanel).toBeHidden();

      await clickDetailsToggle(detailsToggle);
      const timeSlider = lab.locator('[data-input="t"]');
      await timeSlider.evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "3";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(lab).toHaveAttribute("data-animation-state", "paused");
      await expect(lab).toHaveAttribute("data-playing", "false");
      await expect(lab).toHaveAttribute("data-current-time", "3");
      await expect(lab.locator('[data-value="t"]')).toContainText("3 с");

      await resetButton.click();
      await clickDetailsToggle(detailsToggle);

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

      expect(await hasHorizontalScroll(page)).toBe(false);

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-full.png`),
        fullPage: true,
        animations: "disabled"
      });
    });
  }

  test("production route reduced motion keeps the lab meaningful", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/chapters/uniform-motion/", { waitUntil: "networkidle" });

    const lab = labRoot(page);
    await expect(lab).toBeVisible();
    await expect(lab).toHaveAttribute("data-visual-target", "v1");
    await expect(lab.getByRole("button", { name: "Шаг вперёд по времени" })).toBeVisible();
    await expect(lab).toHaveAttribute("data-playing", "false");

    const initialTime = await currentTime(lab);
    await page.waitForTimeout(250);
    expect(await currentTime(lab)).toBe(initialTime);

    await lab.getByRole("button", { name: "Шаг вперёд по времени" }).click();
    await expect
      .poll(async () => currentTime(lab))
      .toBeGreaterThan(initialTime);
    await expect(lab).toHaveAttribute("data-playing", "false");
    await expect(lab.locator("[data-motion-point]")).toBeVisible();
    await expect(lab.locator('[data-current-polyline="x"]')).toHaveAttribute("points", /,/);
    expect(await hasHorizontalScroll(page)).toBe(false);
  });
});
