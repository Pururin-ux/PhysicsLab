import { expect, test } from "@playwright/test";

test("ускорение: наблюдение за маршрутом открывает связанный ответ", async ({ page }) => {
  await page.goto("/practice/acceleration-focus", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Разгон у остановки" })).toBeVisible();

  const finalMoment = page.getByRole("button", { name: "3 с 8 м/с" });
  await expect(page.getByRole("button", { name: "на 2 м/с каждую секунду" })).toBeDisabled();
  await finalMoment.focus();
  await finalMoment.press("Enter");
  await expect(finalMoment).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Через 3 с: 8 м/с и 15 м от начальной отметки.")).toBeVisible();
  await expect(page.getByText("Вот что повторяется.")).toBeVisible();
  await expect(page.getByRole("button", { name: "на 2 м/с каждую секунду" })).toBeEnabled();

  await page.getByRole("button", { name: "на 2 м/с каждую секунду" }).click();
  await expect(page.getByTestId("acceleration-answer-feedback")).toContainText("Верно: скорость прибавляла по 2 м/с каждую секунду.");
  await expect(page.getByRole("link", { name: "Продолжить с другими задачами" })).toHaveAttribute(
    "href",
    "/practice/kinematics-demo",
  );

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("моменты маршрута и график доступны не только ползунком", async ({ page }) => {
  await page.goto("/practice/acceleration-focus", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "2 с 6 м/с" }).click();
  await expect(page.getByRole("button", { name: "2 с 6 м/с" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("От 1 до 2 с скорость выросла с 4 до 6 м/с.")).toBeVisible();
});

test("урок ведёт к той же живой сцене движения", async ({ page }) => {
  await page.goto("/practice/kinematics-lesson", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Становится больше" }).click();
  await page.getByRole("button", { name: "Дальше" }).click();

  await expect(page.getByRole("heading", { name: "Оставим метки на дороге" })).toBeVisible();
  const finalMoment = page.getByRole("button", { name: "3 с 8 м/с" });
  await expect(finalMoment).toBeVisible();
  await finalMoment.click();
  await expect(finalMoment).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Через 3 с: 8 м/с и 15 м от начальной отметки.")).toBeVisible();
  await expect(page.getByText("Скорость во времени")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
