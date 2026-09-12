import { expect, test } from "@playwright/test";
import { formulaReference } from "../lib/physics/formula-reference.ts";

// Пользовательские сценарии поверх smoke: ответ на задачу с фидбеком
// и доступность всех продуктовых страниц, а не только главных трёх.

test("ученик отвечает на задачу и переходит к следующей", async ({ page }) => {
  const taskResponse = page.waitForResponse((response) => response.url().includes("/api/tasks?"));
  await page.goto("/practice/electro-demo", { waitUntil: "domcontentloaded" });
  const { tasks } = await (await taskResponse).json() as { tasks: { options: { correct?: boolean }[] }[] };
  const correctIndex = tasks[0].options.findIndex((option) => option.correct);
  expect(correctIndex).toBeGreaterThanOrEqual(0);

  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();

  // After a wrong answer the learner retries before moving on.
  const wrongIndex = tasks[0].options.findIndex((option) => !option.correct);
  await options.getByRole("button").nth(wrongIndex).click();
  await expect(page.getByRole("button", { name: "Следующая задача" })).toBeHidden();
  await page.getByRole("button", { name: "Попробовать ещё раз", exact: true }).click();
  await options.getByRole("button").nth(correctIndex).click();

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

test("диагностика до старта обозначает границы и ведёт к карте программы", async ({ page }) => {
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", {
      name: "Подготовка к ЦТ/ЦЭ",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/не полный вариант ЦТ\/ЦЭ/i),
  ).toBeVisible();
  const start = page.getByRole("button", { name: "Начать диагностику" });
  await expect(start).toBeVisible();
  await page.locator('a[href="/exam/program"]').click();
  const sections = page.getByRole("list", { name: "Разделы программы по физике" }).locator(":scope > li");
  await expect(sections).toHaveCount(6);
  await expect(sections.filter({ has: page.getByRole("link") })).toHaveCount(4);
  await expect(sections.filter({ hasText: "Задачи появятся позже." })).toHaveCount(2);
  await expect(page.getByRole("complementary")).toContainText("Для полной подготовки занимайся также по школьному учебнику и программе экзамена.");
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
  const formula = page.locator('[data-formula-id="ohm-law"]');
  await expect(formula).toContainText("ток растёт с напряжением и падает с сопротивлением");
  await expect(formula).toContainText("сопротивление считаем постоянным");
  await formula.getByText("Разобрать обозначения").click();
  await expect(formula).toContainText("сила тока, А");
  await expect(formula).toContainText("сопротивление участка, Ом");
  await expect(formula.getByRole("link", { name: "Разобрать тип" })).toHaveAttribute(
    "href",
    "/tasks/ohm-law",
  );
  await expect(formula.getByRole("link", { name: "Потренироваться" })).toHaveAttribute(
    "href",
    "/practice/family/ohm-law",
  );
});
