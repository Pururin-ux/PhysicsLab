import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

// Экспорт/импорт прогресса: решаем задачу -> скачиваем файл -> сбрасываем
// прогресс -> восстанавливаем из файла -> числа вернулись без перезагрузки.

const STORE_KEYS = [
  "physicslab-v3-progress-v1",
  "physicslab-v3-exam-log-v1",
  "physicslab-v3-practice-log-v1",
  "physicslab-v3-xp-v1",
] as const;

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
  if (!filePath) {
    throw new Error("Download path is unavailable");
  }
  expect(download.suggestedFilename()).toMatch(/^physicslab-progress-\d{4}-\d{2}-\d{2}\.json$/);
  const exported = JSON.parse(await readFile(filePath, "utf8")) as {
    stores: Record<string, unknown>;
  };

  // Сброс всего прогресса (диалог confirm).
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Сбросить прогресс" }).click();
  const afterReset = await page.evaluate((keys) => {
    return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
  }, STORE_KEYS);
  for (const key of STORE_KEYS) {
    expect(afterReset[key]).toBeNull();
  }

  // Импорт скачанного файла.
  await page.getByRole("button", { name: "Восстановить из файла" }).click();
  await page.getByTestId("import-file-input").setInputFiles(filePath);
  await expect(page.getByTestId("import-confirm")).toBeVisible();
  await page.getByRole("button", { name: "Заменить", exact: true }).click();

  await expect(page.getByText("Прогресс восстановлен из файла.")).toBeVisible();
  const restored = await page.evaluate((keys) => {
    return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
  }, STORE_KEYS);
  for (const key of STORE_KEYS) {
    expect(JSON.parse(restored[key]!)).toEqual(exported.stores[key]);
  }
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
