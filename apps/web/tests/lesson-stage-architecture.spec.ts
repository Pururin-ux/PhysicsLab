import { expect, test } from "@playwright/test";

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`generic lesson engine navigates a four-stage lesson (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/dev/lesson-stage-engine", { waitUntil: "domcontentloaded" });

    const engine = page.locator('[data-lesson-engine="concept-first-v2"]');
    const progress = engine.getByRole("progressbar");
    await expect(engine).toHaveAttribute("data-lesson-stage", "apply");
    await expect(progress).toHaveAttribute("aria-valuemax", "4");
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
    await expect(progress).toHaveAttribute("aria-valuetext", "Применить, шаг 1 из 4");

    const next = engine.getByRole("button", { name: "Сопоставить" });
    await expect(next).toBeDisabled();
    await page.getByRole("checkbox", { name: "Локально разрешить продолжение" }).check();
    await expect(next).toBeEnabled();
    await next.click();
    await expect(engine).toHaveAttribute("data-lesson-stage", "notice");
    await expect(progress).toHaveAttribute("aria-valuenow", "2");
    await expect(page.getByRole("heading", { name: "Этап: Заметить" })).toBeFocused();

    await engine.getByRole("button", { name: "Назад" }).click();
    await expect(engine).toHaveAttribute("data-lesson-stage", "apply");
    await expect(progress).toHaveAttribute("aria-valuenow", "1");
    await expect(page.getByRole("heading", { name: "Этап: Применить" })).toBeFocused();
  });
}
