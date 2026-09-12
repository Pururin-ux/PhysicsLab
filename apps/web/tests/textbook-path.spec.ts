import { test, expect } from "@playwright/test";

test("returning to the door preserves distance while displacement becomes zero", async ({ page }) => {
  await page.goto("/learn/path-and-displacement");
  const scene = page.getByRole("region", { name: "История и модель с Мио" });
  await scene.getByRole("button", { name: "У скамейки", exact: true }).click();
  await expect(scene.getByRole("img", { name: "Мио у скамейки; путь 20 метров; модуль перемещения 20 метров" })).toBeVisible();
  await scene.getByRole("button", { name: "Снова у двери" }).click();
  await expect(scene.getByRole("img", { name: "Мио у двери; путь 40 метров; модуль перемещения 0 метров" })).toBeVisible();
  await expect(scene).toContainText("всего 40 м");
  await scene.getByRole("button", { name: "У двери", exact: true }).click();
  await expect(scene.getByRole("img", { name: "Мио у двери; путь 0 метров; модуль перемещения 0 метров" })).toBeVisible();
  await page.getByRole("radio", { name: "Путь 400 м, модуль перемещения 0" }).check();
  await page.getByRole("button", { name: "Проверить себя" }).click();
  await expect(page.getByRole("status")).toContainText("Верно. Длина маршрута 400 м");
  await page.getByRole("link", { name: "Дальше: два смысла средней скорости" }).click();
  await expect(page).toHaveURL(/\/learn\/average-speed$/);
});
