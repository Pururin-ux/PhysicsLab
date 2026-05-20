import { expect, test, type Locator, type Page } from "@playwright/test";
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

const labRoot = (page: Page) => page.locator("[data-uniform-motion-lab]").first();

const currentTime = async (lab: Locator) =>
  Number(await lab.getAttribute("data-current-time"));

const hasHorizontalScroll = async (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );

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

      expect(await hasHorizontalScroll(page)).toBe(false);

      const lab = labRoot(page);
      const speedSlider = lab.locator('[data-input="v"]');
      const timeSlider = lab.locator('[data-input="t"]');
      const playButton = lab.getByRole("button", { name: /Запустить/ });
      const detailsButton = lab.getByRole("button", { name: "Показать подробнее" });

      await expect(
        page.locator('[data-uniform-motion-lab][data-visual-target="v1"]')
      ).toHaveCount(0);
      await expect(lab).toBeVisible();
      await expect(playButton).toBeVisible();
      await expect(detailsButton).toBeVisible();
      await expect(lab.locator("[data-motion-point]")).toBeVisible();
      await expect(lab.locator("[data-velocity-arrow]")).toBeVisible();
      await expect(lab.locator('[data-current-polyline="x"]')).toHaveAttribute("points", /,/);
      await expect(lab.locator('[data-current-polyline="v"]')).toHaveAttribute("points", /,/);
      await expect(lab.locator('[data-point="x"]')).toHaveAttribute("cx", /\d/);
      await expect(lab.locator('[data-point="v"]')).toHaveAttribute("cx", /\d/);
      await expectReadableInstrumentGraphs(lab.locator(".pl-instrument-graph"));

      const startTime = await currentTime(lab);
      await playButton.click();
      await expect(lab.getByRole("button", { name: /Пауза/ })).toBeVisible();
      await expect
        .poll(async () => currentTime(lab), {
          timeout: 1500
        })
        .toBeGreaterThan(startTime);

      await lab.getByRole("button", { name: /Пауза/ }).click();
      const pausedTime = await currentTime(lab);
      await page.waitForTimeout(250);
      const afterPauseTime = await currentTime(lab);
      expect(Math.abs(afterPauseTime - pausedTime)).toBeLessThan(0.05);

      await detailsButton.click();
      await expect(lab.getByRole("button", { name: "Скрыть подробности" })).toBeVisible();
      await expect(timeSlider).toBeVisible();
      await expect(lab.locator('[data-polyline="v"]')).toHaveAttribute("points", /,/);
      await expectReadableInstrumentGraphs(lab.locator(".pl-instrument-graph"), {
        minimumGraphCount: 2,
        requireTickLabels: false
      });

      await timeSlider.evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "3";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await expect(lab.locator('[data-value="t"]')).toContainText("3 с");
      await expect(lab).toHaveAttribute("data-animation-state", "paused");

      await expect(speedSlider).toBeVisible();
      await speedSlider.evaluate((element) => {
        const input = element as HTMLInputElement;
        input.value = "4";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      await expect(lab.locator('[data-value="v"]')).toContainText("4 м/с");
      await expect(lab.locator('[data-value="x"]')).toContainText("12 м");
      await expect(lab.locator('[data-graph-note="x"]')).toContainText(
        "круче линия вверх"
      );
      await expect(lab.locator('[data-formula-token="v"]').first()).toHaveClass(
        /is-active/
      );

      await lab.getByRole("button", { name: "Превратится в путь по карте" }).click();
      await expect(lab.locator("[data-feedback]")).toContainText("Не совсем");

      await lab.getByRole("button", { name: "Станет круче" }).click();
      await expect(lab.locator("[data-feedback]")).toContainText("Да. Скорость");

      await page.getByRole("button", { name: "Тело движется быстрее" }).click();
      await expect(page.locator("[data-quiz-feedback]")).toContainText("Не совсем");
      await page.getByRole("button", { name: "Координата не меняется, значит v = 0" }).click();
      await expect(page.locator("[data-quiz-feedback]")).toContainText(
        "горизонтальная линия"
      );
    });
  }

  test("lab-preview reduced motion keeps the lab meaningful", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/lab-preview/", { waitUntil: "networkidle" });

    const lab = labRoot(page);
    await expect(lab).toBeVisible();
    await expect(lab.getByRole("button", { name: "Шаг вперёд по времени" })).toBeVisible();
    await expect(lab.locator('[data-polyline="x"]')).toHaveAttribute("points", /,/);
    await expect(lab.locator('[data-polyline="v"]')).toHaveAttribute("points", /,/);
    await expect(lab.locator('[data-current-polyline="x"]')).toHaveAttribute("points", /,/);
    await expect(lab.locator('[data-current-polyline="v"]')).toHaveAttribute("points", /,/);
    await expect(lab.locator("[data-motion-point]")).toBeVisible();
    await lab.getByRole("button", { name: "Показать подробнее" }).click();
    await expect(lab.locator('[data-input="t"]')).toBeVisible();

    const initialTime = await currentTime(lab);
    await page.waitForTimeout(250);
    expect(await currentTime(lab)).toBe(initialTime);

    await lab.getByRole("button", { name: "Шаг вперёд по времени" }).click();
    await expect
      .poll(async () => currentTime(lab))
      .toBeGreaterThan(initialTime);
  });
});
