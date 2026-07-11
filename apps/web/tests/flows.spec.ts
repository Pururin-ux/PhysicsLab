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
    page.getByText("2 / 10").filter({ visible: true }).first(),
  ).toBeVisible();

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

test("смешанная тренировка честно обозначает открытый scope", async ({ page }) => {
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Смешанная тренировка" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Это не полный вариант ЦТ/ЦЭ: квантовая и атомно-ядерная физика пока не включены.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Начать тренировку" }),
  ).toBeVisible();
});

test(
  "справочник рендерит весь корпус формул и ищет по содержимому",
  async ({ page }) => {
    await page.goto("/formulas", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const formulaRows = page.locator(".formula-row");
    const formulaCount = formulaReference.reduce(
      (count, group) => count + group.entries.length,
      0,
    );
    await expect(formulaRows).toHaveCount(formulaCount);
    await expect(page.locator(".katex-error")).toHaveCount(0);
    expect(await page.locator(".katex-mathml").count()).toBeGreaterThanOrEqual(
      formulaCount,
    );

    const averageSpeedRow = formulaRows.filter({
      hasText: "Средняя скорость на участках",
    });
    await averageSpeedRow.getByRole("button").click();
    await expect(averageSpeedRow).toHaveAttribute("data-open", "true");
    await expect(
      averageSpeedRow.locator(".formula-cyan .katex-mathml"),
    ).toHaveCount(3);

    await page
      .getByRole("searchbox", { name: "Поиск по формулам" })
      .fill("внутреннее сопротивление");
    await expect(formulaRows).toHaveCount(1);
    await expect(formulaRows).toContainText("Закон Ома для полной цепи");
  },
);
