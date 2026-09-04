import { expect, test } from "@playwright/test";

test("current V3 product shell renders the main learning routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "Проверить свою версию", exact: true })).toHaveAttribute(
    "href",
    "/practice/dynamics-lesson",
  );
  await expect(page.getByRole("link", { name: "Выбрать другую тему", exact: true })).toHaveAttribute(
    "href",
    "/topics",
  );
  await expect(page.locator('img[src*="nova-dynamics-transfer-v1"]')).toHaveCount(0);
  await expect(
    page.getByRole("img", { name: /Доска движется вправо и тормозит.*направление ускорения пока не показано/ }),
  ).toBeVisible();

  // Тема ведёт в урок, урок — в тренажёр той же темы.
  await page.goto("/topics", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /темы/i })).toBeVisible();
  await expect(page.locator('main a[href="/practice/kinematics-lesson"]').first()).toBeVisible();

  await page.goto("/practice/kinematics-lesson", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("button").first()).toBeVisible();

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
});
