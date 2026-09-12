import { expect, test } from "@playwright/test";

test("current V3 product shell renders the main learning routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const start = page.getByRole("navigation", { name: "С чего начать" });
  await expect(start.getByRole("link", { name: /^Выбрать тему/ })).toHaveAttribute("href", "/topics");
  await expect(start.getByRole("link", { name: /^Решить задачу/ })).toHaveAttribute("href", "/tasks");
  await expect(start.getByRole("link", { name: /^Подготовиться к ЦТ\/ЦЭ/ })).toHaveAttribute("href", "/practice/exam-demo");
  await expect(page.locator('img[src*="nova-dynamics-transfer-v1"]')).toHaveCount(0);
  await expect(
    page.locator('[data-art-id="home-mio"] img[src*="mio-thinking-v1"]'),
  ).toBeVisible();

  // Тема ведёт в урок, урок — в тренажёр той же темы.
  await page.goto("/topics", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Учиться", exact: true })).toBeVisible();
  await expect(page.locator('main a[href="/practice/kinematics-lesson"]').first()).toBeVisible();

  await page.goto("/practice/kinematics-lesson", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("button").first()).toBeVisible();

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
});
