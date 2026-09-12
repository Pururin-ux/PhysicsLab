import { expect, test } from "@playwright/test";

test("lesson engine keeps stage focus with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/practice/kinematics-lesson", { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toBeFocused();

  const next = page.getByRole("button", { name: "Сделать прогноз" });
  await next.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Троллейбус отходит от остановки" }),
  ).toBeFocused();
  await expect(page.locator('[data-lesson-stage-panel="prediction"]')).toBeVisible();

  const back = page
    .locator('[data-lesson-engine="concept-first-v2"] footer')
    .getByRole("button", { name: "Назад" });
  await back.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Троллейбус начинает разгоняться" }),
  ).toBeFocused();
  await expect(page.locator('[data-lesson-stage-panel="context"]')).toBeVisible();
});
