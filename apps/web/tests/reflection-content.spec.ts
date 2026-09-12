import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const screenshots = "C:/Users/lalad/OneDrive/Pictures/Screenshots/PhysicsLab-reflection-content-2026-09-07";

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => image.offsetParent !== null)
        .map((image) => image.complete ? Promise.resolve() : new Promise<void>((resolve) => image.addEventListener("load", () => resolve(), { once: true }))),
    );
  });
}

async function capture(page: Page, name: string) {
  await settle(page);
  await page.screenshot({ path: path.join(screenshots, name), animations: "disabled" });
}

test.describe("content-first отражение", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const project = testInfo.project.name;
    if (project === "desktop") {
      await page.setViewportSize({ width: 1440, height: 1000 });
    } else if (project === "mobile-390") {
      await page.setViewportSize({ width: 390, height: 844 });
    } else if (project === "mobile-360") {
      await page.setViewportSize({ width: 360, height: 800 });
    }
    await page.goto("/practice/optics-lesson", { waitUntil: "domcontentloaded" });
    await settle(page);
    // Dev-индикатор Next.js не является частью продукта и не должен попадать
    // в пользовательские raw captures.
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  });

  test("desktop: рукопись, интерактивность и состояния задачи", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop evidence");
    await mkdir(screenshots, { recursive: true });
    await capture(page, "01-intro-desktop-1440x1000.png");

    await page.getByRole("heading", { name: "Как читать схему отражения" }).scrollIntoViewIfNeeded();
    await capture(page, "02-normal-desktop-1440x1000.png");
    await page.getByRole("heading", { name: "Закон отражения света" }).scrollIntoViewIfNeeded();
    await capture(page, "03-formula-desktop-1440x1000.png");
    await page.getByTestId("reflection-angle-slider").scrollIntoViewIfNeeded();
    await page.getByTestId("reflection-angle-slider").press("ArrowRight");
    await capture(page, "04-interactive-desktop-1440x1000.png");
    await page.getByRole("heading", { name: "Когда угол дан к поверхности зеркала" }).scrollIntoViewIfNeeded();
    await capture(page, "05-worked-example-desktop-1440x1000.png");

    const task = page.getByTestId("reflection-independent-task");
    await task.scrollIntoViewIfNeeded();
    await expect(task).not.toContainText("62°");
    const initialAria = await task.evaluate((element) =>
      [...element.querySelectorAll("[aria-label], [aria-describedby]")]
        .map((node) => `${node.getAttribute("aria-label") ?? ""} ${node.getAttribute("aria-describedby") ?? ""}`)
        .join(" "),
    );
    expect(initialAria).not.toContain("62°");
    expect(initialAria).not.toContain("90° − 28°");
    await capture(page, "06-task-unanswered-desktop-1440x1000.png");
    const group = task.getByTestId("reflection-task-radiogroup");
    await group.focus();
    await page.keyboard.press("Enter");
    await task.getByRole("button", { name: "Помощь" }).click();
    await expect(task.getByTestId("reflection-analogue-help")).toBeVisible();
    await task.getByTestId("reflection-analogue-help").scrollIntoViewIfNeeded();
    await capture(page, "07-task-help-desktop-1440x1000.png");
    await group.focus();
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await expect(task.getByTestId("reflection-task-success")).toBeVisible();
    await task.getByTestId("reflection-task-success").scrollIntoViewIfNeeded();
    await capture(page, "08-task-success-desktop-1440x1000.png");
    await page.getByRole("heading", { name: "Почему зеркало даёт чёткое изображение, а стена — нет" }).scrollIntoViewIfNeeded();
    await capture(page, "09-diffuse-desktop-1440x1000.png");
  });

  test("mobile: длинный текст остаётся читаемым", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile"), "mobile evidence");
    await mkdir(screenshots, { recursive: true });
    await page.getByRole("heading", { name: "Закон отражения света" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("main")).toBeVisible();
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
    if (testInfo.project.name === "mobile-390") {
      await capture(page, "10-long-form-mobile-390x844.png");
    }
  });
});
