import { expect, test } from "@playwright/test";
import { formulaReference } from "../lib/physics/formula-reference.ts";

// Пользовательские сценарии поверх smoke: ответ на задачу с фидбеком
// и доступность всех продуктовых страниц, а не только главных трёх.

test("ученик отвечает на задачу и переходит к следующей", async ({ page }) => {
  await page.goto("/practice/electro-demo", { waitUntil: "domcontentloaded" });

  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();

  // Любой вариант приводит в состояние «отвечено»: появляется реакция Nova
  // и кнопка перехода. Правильность ответа для сценария не важна.
  await options.getByRole("button").first().click();

  const nextButton = page.getByRole("button", { name: "Следующая задача" });
  await expect(nextButton).toBeVisible();
  await expect(page.getByRole("status")).toContainText(/\S/);

  await nextButton.click();
  await expect(
    page.getByTestId("practice-progress"),
  ).toHaveText("Задание 2 из 10");

  // electro-mixed детерминированно ставит задачу «полная цепь» второй —
  // на карточке должна быть схема цепи из CircuitDiagram.
});

const productRoutes = [
  { name: "mistakes", path: "/mistakes" },
  { name: "profile", path: "/profile" },
  { name: "formulas", path: "/formulas" },
  { name: "dynamics", path: "/practice/dynamics-demo" },
  { name: "electro", path: "/practice/electro-demo" },
  { name: "thermo", path: "/practice/thermo-demo" },
  { name: "exam", path: "/practice/exam-demo" },
] as const;

for (const route of productRoutes) {
  test(`${route.name}: страница открывается без ошибок`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("body")).not.toHaveText(
      /Unhandled Runtime Error|Application error/i,
    );
  });
}

test("диагностика до старта показывает честную карту всей программы", async ({ page }) => {
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", {
      name: "Диагностика: 10 задач по 5 открытым темам",
      exact: true,
    }),
  ).toBeVisible();
  const coverage = page.getByTestId("exam-coverage-map");
  await expect(coverage.getByRole("list", { name: "Покрытие разделов программы" }).getByRole("listitem")).toHaveCount(6);
  await expect(coverage).toContainText("Полностью: 0 · Частично: 4 · Пока нет: 2");
  await expect(coverage.getByText("Покрыто частично", { exact: true })).toHaveCount(4);
  await expect(coverage.getByText("Пока нет задач", { exact: true })).toHaveCount(2);
  await expect(
    coverage.getByText(/не полный вариант ЦТ\/ЦЭ/i),
  ).toBeVisible();
  const start = page.getByRole("button", { name: "Начать диагностику" });
  await expect(start).toBeVisible();
  const [coverageBox, startBox] = await Promise.all([
    coverage.boundingBox(),
    start.boundingBox(),
  ]);
  expect(coverageBox).not.toBeNull();
  expect(startBox).not.toBeNull();
  expect(startBox!.y).toBeGreaterThanOrEqual(coverageBox!.y + coverageBox!.height);
});

test(
  "справочник рендерит весь корпус формул и ищет по содержимому",
  async ({ page }) => {
    await page.goto("/formulas", { waitUntil: "domcontentloaded" });

    const formulaEntries = page.locator("[data-formula-id]");
    const formulaCount = formulaReference.reduce(
      (count, group) => count + group.entries.length,
      0,
    );
    await expect(formulaEntries).toHaveCount(formulaCount);
    await expect(page.locator(".katex-error")).toHaveCount(0);
    expect(await page.locator(".katex-mathml").count()).toBeGreaterThanOrEqual(
      formulaCount,
    );

    const averageSpeedEntry = page.locator('[data-formula-id="average-speed-segments"]');
    await expect(averageSpeedEntry).toContainText("Средняя путевая скорость");
    const symbols = averageSpeedEntry.locator("details");
    await symbols.locator("summary").click();
    await expect(symbols).toHaveAttribute("open", "");
    await expect(symbols.locator("dl")).toBeVisible();

    await page
      .getByRole("searchbox", { name: "Найти формулу" })
      .fill("внутреннее сопротивление");
    await expect(formulaEntries).toHaveCount(1);
    await expect(formulaEntries).toContainText("Закон Ома для полной цепи");
  },
);

test("справочник объясняет способ чтения и связывает формулу с практикой", async ({ page }) => {
  await page.goto("/formulas?formula=ohm-law", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Найди нужную связь." })).toBeVisible();
  await expect(page.getByLabel("Как читать формулы")).toContainText("запись");
  await expect(page.getByLabel("Как читать формулы")).toContainText("физический смысл");
  const formula = page.locator('[data-formula-id="ohm-law"]');
  await expect(formula.getByRole("link", { name: "Разобрать тип" })).toHaveAttribute(
    "href",
    "/tasks/ohm-law",
  );
  await expect(formula.getByRole("link", { name: "Потренироваться" })).toHaveAttribute(
    "href",
    "/practice/family/ohm-law",
  );
});
