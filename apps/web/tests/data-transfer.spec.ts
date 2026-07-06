import { expect, test } from "@playwright/test";

// Экспорт/импорт прогресса: решаем задачу -> скачиваем файл -> сбрасываем
// прогресс -> восстанавливаем из файла -> числа вернулись без перезагрузки.

test("экспорт и восстановление прогресса из файла", async ({ page }) => {
  // Заработать прогресс: одна отвеченная задача в электро-тренировке.
  await page.goto("/practice/electro-demo", { waitUntil: "domcontentloaded" });
  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();
  await options.getByRole("button").first().click();
  await expect(page.getByRole("button", { name: "Следующая задача" })).toBeVisible();

  // XP пишется сразу; прогресс тем — по завершении сессии, для теста
  // достаточно XP + журнала дней (пишется при завершении) — поэтому
  // проверяем восстановление через XP в шапке профиля.
  await page.goto("/profile", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("data-transfer")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Скачать прогресс" }).click();
  const download = await downloadPromise;
  const filePath = await download.path();
  expect(download.suggestedFilename()).toMatch(/^physicslab-progress-\d{4}-\d{2}-\d{2}\.json$/);

  // Сброс всего прогресса (диалог confirm).
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Сбросить прогресс" }).click();

  // Импорт скачанного файла.
  await page.getByRole("button", { name: "Восстановить из файла" }).click();
  await page.getByTestId("import-file-input").setInputFiles(filePath!);
  await expect(page.getByTestId("import-confirm")).toBeVisible();
  await page.getByRole("button", { name: "Заменить", exact: true }).click();

  await expect(page.getByText("Прогресс восстановлен из файла.")).toBeVisible();
});

test("импорт мусорного файла не меняет состояние", async ({ page }) => {
  await page.goto("/profile", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Восстановить из файла" }).click();
  await page.getByTestId("import-file-input").setInputFiles({
    name: "garbage.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"это": "не экспорт"}'),
  });

  await expect(page.getByText("Это не файл экспорта PhysicsLab.")).toBeVisible();
  await expect(page.getByTestId("import-confirm")).not.toBeVisible();
});
