import { expect, test } from "@playwright/test";

test("pressure paragraph connects the observation to its sections, example, self-check and practice", async ({ page }) => {
  await page.goto("/learn/pressure");

  // Параграф 7 класса с подтверждённым номером § и локальным указателем разделов.
  await expect(
    page.getByRole("heading", { level: 1, name: "§ 28. Давление: сила и площадь опоры", exact: true }),
  ).toBeVisible();
  // Указатель разделов: на desktop это липкая строка, на телефоне — раскрывающаяся строка.
  const outlineVisible = await page.evaluate(() =>
    Array.from(document.querySelectorAll("nav, summary")).some(
      (node) => node.textContent?.includes("В этом параграфе") && (node as HTMLElement).offsetParent !== null,
    ),
  );
  expect(outlineVisible).toBe(true);
  await expect(page.getByRole("link", { name: "← К оглавлению 7 класса", exact: true }).first()).toBeVisible();

  const scene = page.getByRole("region", { name: "Наблюдение с Мио и опытом о давлении" });

  await expect(scene.getByRole("heading", { name: "Почему один брусок сильнее сминает губку?", exact: true })).toBeVisible();
  await expect(scene.getByText("Бруски одинаковые и давят с одной силой. Губки тоже одинаковые.", { exact: true })).toBeVisible();
  // «Время» и «след» в этом параграфе не существуют.
  await expect(scene.getByText(/время/i)).toHaveCount(0);
  await expect(scene.getByText(/след/i)).toHaveCount(0);

  await scene.getByRole("button", { name: "Брусок справа давит с большей силой", exact: true }).click();
  await expect(scene.getByTestId("pressure-explanation-feedback")).toContainText("Сила не изменилась");

  await scene.getByRole("button", { name: "Пока не понимаю", exact: true }).click();
  await expect(scene.getByText("Посмотри, какой частью брусок касается губки. Справа эта площадка меньше, хотя сила та же.", { exact: true })).toBeVisible();

  await scene.getByRole("button", { name: "Та же сила приходится на меньшую площадь", exact: true }).click();
  await expect(scene.getByTestId("pressure-explanation-feedback")).toContainText("давление больше");

  // Разделы параграфа: формула, единицы площади, расчёт 10 / 20 кПа.
  await expect(page.getByRole("heading", { name: "Формула давления", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Паскаль и единицы площади", exact: true })).toBeVisible();
  await expect(page.getByText("0,004 м²", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Почему площадь меняет давление", exact: true })).toBeVisible();
  await expect(page.getByLabel("Давление 10 кПа на общей шкале от 0 до 40 кПа")).toBeVisible();
  await expect(page.getByLabel("Давление 20 кПа на общей шкале от 0 до 40 кПа")).toBeVisible();

  // Полосы на одной шкале 0–40 кПа: отношение длин 1:2 (25% / 50%).
  const wideWidth = await page.getByTestId("pressure-bar-wide").evaluate((el) => parseFloat(getComputedStyle(el).width));
  const narrowWidth = await page.getByTestId("pressure-bar-narrow").evaluate((el) => parseFloat(getComputedStyle(el).width));
  expect(narrowWidth / wideWidth).toBeCloseTo(2, 1);

  // Применение: при той же площади давление растёт вместе с силой.
  const transfer = page.getByTestId("pressure-transfer");
  await transfer.getByRole("button", { name: "40 Н", exact: true }).click();
  await expect(transfer.getByTestId("pressure-transfer-feedback")).toContainText("давление осталось 10 кПа");
  await expect(transfer.getByTestId("pressure-transfer-feedback")).toContainText("увеличь силу вдвое");

  await transfer.getByRole("button", { name: "80 Н", exact: true }).click();
  await expect(transfer.getByTestId("pressure-transfer-feedback")).toContainText("Сила увеличилась вдвое");
  await expect(transfer.getByTestId("pressure-transfer-feedback")).toContainText("20 кПа");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);

  // Краткий конспект и самопроверка параграфа.
  await expect(page.getByRole("heading", { name: "Коротко", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Проверь себя", exact: true })).toBeVisible();

  await page.getByRole("radio", { name: "40 кПа", exact: true }).check();
  await page.getByRole("button", { name: "Проверить себя", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "суммарную площадь двух опор" })).toBeVisible();

  await page.getByRole("radio", { name: "20 кПа", exact: true }).check();
  await page.getByRole("button", { name: "Проверить себя", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "20 000 Па = 20 кПа" })).toBeVisible();

  // Сохранённый ответ самопроверки и черновики новых блоков переживают reload.
  await page.reload();
  await expect(page.getByRole("radio", { name: "20 кПа", exact: true })).toBeChecked();
  await expect(scene.getByRole("button", { name: "Та же сила приходится на меньшую площадь", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(transfer.getByRole("button", { name: "80 Н", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("link", { name: "Решить задачи по этому параграфу", exact: true }).click();
  await expect(page).toHaveURL(/\/practice\/family\/contact-pressure$/);
  await expect(page.getByText("Задание 1 из 5", { exact: true })).toBeVisible();
});
