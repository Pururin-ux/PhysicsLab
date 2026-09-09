import { test, expect } from "@playwright/test";

test("mean speed accounts for unequal times and a stop", async ({ page }) => {
  await page.goto("/learn/average-speed");
  const scene = page.getByRole("region", { name: "История и модель с Мио" });
  await expect(scene).toContainText("50 м");
  await scene.getByRole("button", { name: "8 с медленно, 2 с быстро" }).click();
  await expect(scene).toContainText("32 м");
  await expect(scene).toContainText("3,2 м/с");
  await scene.getByRole("checkbox", { name: "Включить ещё 10 с остановки в эту поездку" }).check();
  await expect(scene).toContainText("1,6 м/с");
  await expect(scene).toContainText("Делим 32 м на 20 с");
  await scene.getByRole("button", { name: "По 5 с на участок" }).click();
  await expect(scene).toContainText("2,5 м/с");
});

test("acceleration sign and speeding up are independent", async ({ page }) => {
  await page.goto("/learn/acceleration");
  const scene = page.getByRole("region", { name: "История и модель с Мио" });
  await expect(scene.getByRole("img", { name: "Ускорение вправо", exact: true })).toBeVisible();
  await scene.getByRole("checkbox", { name: "Троллейбус едет влево" }).check();
  await expect(scene.getByRole("img", { name: "Скорость влево", exact: true })).toBeVisible();
  await expect(scene.getByRole("img", { name: "Ускорение влево", exact: true })).toBeVisible();
  await expect(scene.getByRole("paragraph").filter({ hasText: "aₓ =" })).toContainText("= -2 м/с²");
  await expect(scene).toContainText("троллейбус разгоняется");
  await scene.getByRole("button", { name: "Торможение: от 8 до 2 м/с за 3 с" }).click();
  await expect(scene.getByRole("img", { name: "Ускорение вправо", exact: true })).toBeVisible();
  await expect(scene.getByRole("paragraph").filter({ hasText: "aₓ =" })).toContainText("= 2 м/с²");
  await expect(scene).toContainText("троллейбус замедляется");
});
