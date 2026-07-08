import { expect, test } from "@playwright/test";

const topicPracticeRoutes = [
  { name: "kinematics", path: "/practice/kinematics-demo" },
  { name: "dynamics", path: "/practice/dynamics-demo" },
  { name: "electro", path: "/practice/electro-demo" },
  { name: "thermo", path: "/practice/thermo-demo" },
] as const;

for (const route of topicPracticeRoutes) {
  test(`targeted help ${route.name}: drawer закрыт и открывается из quickbar`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole("button", { name: "Задачи" })).toBeVisible();
    const helpButton = page.getByRole("button", { name: "Справка" });
    await expect(helpButton).toBeVisible();

    const drawer = page.getByTestId("topic-theory-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).not.toHaveAttribute("open", "");

    await helpButton.click();
    await expect(drawer).toHaveAttribute("open", "");
    await expect(drawer).toHaveAttribute("data-active-section", /\S+/);
    await expect(page.locator('[data-testid^="help-chip-"]')).toHaveCount(0);
    await expect(page.locator('[data-testid^="help-section-button-"][aria-pressed="true"]')).toHaveCount(1);
  });
}

test("kinematics help targets accelerated first task and graph second task", async ({
  page,
}) => {
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const drawer = page.getByTestId("topic-theory-drawer");
  await page.getByTestId("practice-open-help").click();
  await expect(drawer).toHaveAttribute("open", "");
  await expect(drawer).toHaveAttribute("data-active-section", "accelerated-motion");
  await expect(page.getByTestId("help-section-button-accelerated-motion")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("help-section-button-motion-graphs")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.locator("button").filter({ hasText: "37" }).first().click();
  await page.getByTestId("next-task-button").click();
  await expect(page.getByText("2 / 10").filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByTestId("question-card")).toContainText("графике скорости");
  await expect(drawer).toHaveAttribute("data-active-section", "motion-graphs");
  await expect(page.getByTestId("help-section-button-motion-graphs")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("help-section-button-accelerated-motion")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("wrong answer opens contextual help without expanding solution", async ({ page }) => {
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();
  await options.getByRole("button").filter({ hasText: "31" }).first().click();

  await expect(page.getByRole("button", { name: "Показать решение" })).toBeVisible();
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);

  const drawer = page.getByTestId("topic-theory-drawer");
  await expect(drawer).not.toHaveAttribute("open", "");

  const helpTarget = page.getByTestId("help-target-button");
  await expect(helpTarget).toBeVisible();
  await expect(helpTarget).toContainText("Равноускоренное движение");
  await helpTarget.click();

  await expect(drawer).toHaveAttribute("open", "");
  await expect(drawer).toHaveAttribute("data-active-section", "accelerated-motion");
  await expect(page.locator('[data-testid^="help-chip-"]')).toHaveCount(0);
  await expect(page.locator('[data-testid^="help-section-button-"][aria-pressed="true"]')).toHaveCount(1);
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);
});

test("targeted help mobile has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible();

  await page.getByRole("button", { name: "Справка" }).click();
  await expect(page.getByTestId("topic-theory-drawer")).toHaveAttribute("open", "");

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
