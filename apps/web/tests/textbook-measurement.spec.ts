import { test, expect } from "@playwright/test";

test("grade 7 scale reading distinguishes divisions, readings and the correct book", async ({ page }) => {
  await page.goto("/learn");
  const gradeSeven = page.getByRole("region", { name: "Измерения и вещества" });
  await expect(gradeSeven).toContainText("7 класс");
  await gradeSeven.getByRole("link", { name: /Как читать шкалу прибора/ }).click();
  const scene = page.getByRole("region", { name: "История и модель с Мио" });
  await scene.getByRole("radio", { name: "Объём воды", exact: true }).check();
  await scene.getByRole("button", { name: "Считать показание" }).click();
  await expect(scene.getByRole("status")).toContainText("30 ± 5 мл");
  await scene.getByRole("button", { name: "Мелкая шкала" }).click();
  await expect(scene.getByRole("status")).toHaveCount(0);
  await scene.getByRole("button", { name: "Считать показание" }).click();
  await expect(scene.getByRole("status")).toContainText("32 ± 1 мл");
  await expect(scene.getByRole("status")).toContainText("Количество воды не изменилось");
  await page.getByRole("radio", { name: "4 см на деление", exact: true }).check();
  await page.getByRole("button", { name: "Проверить себя" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Проверь делитель" })).toBeVisible();
  await page.getByRole("radio", { name: "5 см на деление", exact: true }).check();
  await page.getByRole("button", { name: "Проверить себя" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Верно: (30 − 10) / 4 = 5 см" })).toBeVisible();
  await page.getByText("Школьный учебник",{exact:true}).click();
  await expect(page.getByRole("link", { name: /Открыть официальный учебник/ })).toHaveAttribute("href", /7kl_rus_2022\.pdf$/);
});


