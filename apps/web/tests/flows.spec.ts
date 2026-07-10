import { expect, test } from "@playwright/test";

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
  await expect(page.getByTestId("circuit-diagram")).toBeVisible();
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
      "Это не полный вариант ЦТ/ЦЭ: оптика, квантовая и атомно-ядерная физика пока не включены.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Начать тренировку" }),
  ).toBeVisible();
});
