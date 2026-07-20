import { expect, test, type Page } from "@playwright/test";

const topicPracticeRoutes = [
  { name: "kinematics", path: "/practice/kinematics-demo" },
  { name: "dynamics", path: "/practice/dynamics-demo" },
  { name: "electro", path: "/practice/electro-demo" },
  { name: "thermo", path: "/practice/thermo-demo" },
] as const;

async function answerCurrentTaskAndMoveNext(page: Page) {
  await page.locator(".quiz-option").first().click();
  await page.getByTestId("next-task-button").click();
  await expect(page.getByTestId("question-card")).toBeVisible();
}

async function expectActiveHelpCard(
  page: Page,
  sectionId: string,
  title: string,
  formula: string,
) {
  const drawer = page.getByTestId("topic-theory-drawer");
  await expect(drawer).toHaveAttribute("data-active-section", sectionId);

  const card = drawer.getByTestId("compact-help-card");
  await expect(card).toHaveAttribute("data-help-card-section", sectionId);
  await expect(card).toHaveAttribute("data-help-card-title", title);
  await expect(card.getByTestId("compact-help-formula")).toHaveAttribute(
    "data-help-card-formula",
    formula,
  );
}

for (const route of topicPracticeRoutes) {
  test(`targeted help ${route.name}: drawer закрыт и открывается из quickbar`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    await expect(page.getByTestId("practice-tab-tasks")).toHaveCount(0);
    const helpButton = page.getByRole("button", { name: "Справка" });
    await expect(helpButton).toBeVisible();
    await expect(helpButton).toHaveAttribute("aria-expanded", "false");

    const drawer = page.getByTestId("topic-theory-drawer");
    await expect(drawer).toBeHidden();
    await expect(drawer).toHaveAttribute("data-state", "closed");

    await helpButton.click();
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-state", "open");
    await expect(helpButton).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toHaveAttribute("data-active-section", /\S+/);
    await expect(page.locator('[data-testid^="help-chip-"]')).toHaveCount(0);
    await expect(page.getByTestId("help-section-selector")).toHaveCount(1);

    await page.getByTestId("close-topic-help").click();
    await expect(drawer).toBeHidden();
    await expect(helpButton).toBeFocused();
  });
}

test.skip("kinematics help targets accelerated first task and graph second task", async ({
  page,
}) => {
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const drawer = page.getByTestId("topic-theory-drawer");
  await page.getByTestId("practice-open-help").click();
  await expect(drawer).toHaveAttribute("open", "");
  await expectActiveHelpCard(
    page,
    "accelerated-motion",
    "Равноускоренное движение",
    "x=x_0+v_0t+\\frac{at^2}{2}",
  );
  await expect(drawer.getByTestId("compact-help-card")).toContainText("at²/2");
  await expect(page.getByTestId("help-section-selector")).toHaveValue("accelerated-motion");
  await answerCurrentTaskAndMoveNext(page);
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 2 из 10");
  await expect(page.getByTestId("question-card")).toContainText("графике v(t)");
  await expectActiveHelpCard(
    page,
    "motion-graphs",
    "Графики v(t), x(t)",
    "a=\\frac{\\Delta v}{\\Delta t},\\quad s=\\frac{v_0+v}{2}\\,t",
  );
  await expect(drawer.getByTestId("compact-help-card")).toContainText("площадь под v(t)");
  await expect(page.getByTestId("help-section-selector")).toHaveValue("motion-graphs");
});

test.skip("generated practice help uses template metadata for topic routes", async ({ page }) => {
  await page.goto("/practice/dynamics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.getByTestId("practice-open-help").click();
  await expectActiveHelpCard(
    page,
    "newton-second-law",
    "Второй закон Ньютона",
    "\\sum F = ma",
  );

  await page.goto("/practice/electro-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const electroDrawer = page.getByTestId("topic-theory-drawer");
  await page.getByTestId("practice-open-help").click();
  await expectActiveHelpCard(page, "ohms-law", "Закон Ома", "I=\\frac{U}{R}");
  for (let index = 0; index < 4; index += 1) {
    await answerCurrentTaskAndMoveNext(page);
  }
  await expectActiveHelpCard(
    page,
    "charge-sharing",
    "Деление заряда",
    "q'=\\frac{q_1+q_2}{2}",
  );
  await expect(electroDrawer.getByTestId("compact-help-card")).toContainText(
    "с учётом знаков",
  );

  await page.goto("/practice/thermo-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const thermoDrawer = page.getByTestId("topic-theory-drawer");
  await page.getByTestId("practice-open-help").click();
  await expectActiveHelpCard(
    page,
    "gas-equation",
    "Уравнение состояния",
    "pV=\\nu RT",
  );
  await expect(thermoDrawer.getByTestId("compact-help-card")).toContainText(
    "кельвинах",
  );
  for (let index = 0; index < 2; index += 1) {
    await answerCurrentTaskAndMoveNext(page);
  }
  await expectActiveHelpCard(
    page,
    "heating-melting",
    "Плавление / нагревание",
    "Q=cm\\Delta T+\\lambda m",
  );
  await expect(thermoDrawer.getByTestId("compact-help-card")).toContainText(
    "отдельными стадиями",
  );
});

test("wrong answer opens contextual help without expanding solution", async ({ page }) => {
  const taskResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === "/api/tasks" && url.searchParams.get("template") === "mixed";
  });

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  const payload = (await (await taskResponse).json()) as {
    tasks: { options: { correct?: boolean; text: string }[] }[];
  };
  await page.waitForLoadState("networkidle");

  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();
  const wrongOption = payload.tasks[0]?.options.find((option) => !option.correct);
  expect(wrongOption, "generated kinematics task must expose a wrong option").toBeDefined();
  await options.getByRole("button").filter({ hasText: wrongOption!.text }).click();

  await expect(page.getByRole("button", { name: "Показать решение" })).toBeVisible();
  await expect(page.getByTestId("solution-content")).toHaveCount(0);

  const drawer = page.getByTestId("topic-theory-drawer");
  await expect(drawer).toBeHidden();

  const helpTarget = page.getByTestId("help-target-button");
  await expect(helpTarget).toBeVisible();
  await expect(helpTarget).toContainText("Равноускоренное движение");
  await helpTarget.click();

  await expect(drawer).toBeVisible();
  await expectActiveHelpCard(
    page,
    "accelerated-motion",
    "Равноускоренное движение",
    "x=x_0+v_0t+\\frac{at^2}{2}",
  );
  await expect(page.locator('[data-testid^="help-chip-"]')).toHaveCount(0);
  await expect(page.getByTestId("help-section-selector")).toHaveValue("accelerated-motion");
  await expect(page.getByTestId("solution-content")).toHaveCount(0);
});

test("targeted help mobile has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible();

  await page.getByTestId("practice-open-help").click();
  await expect(page.getByTestId("topic-theory-drawer")).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
