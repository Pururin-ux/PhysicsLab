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
