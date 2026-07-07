import { expect, test } from "@playwright/test";

const topicPracticeRoutes = [
  { name: "kinematics", path: "/practice/kinematics-demo" },
  { name: "dynamics", path: "/practice/dynamics-demo" },
  { name: "electro", path: "/practice/electro-demo" },
  { name: "thermo", path: "/practice/thermo-demo" },
] as const;

for (const route of topicPracticeRoutes) {
  test(`task-first ${route.name}: задача видна до теории`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });

    const question = page.getByTestId("question-card");
    await expect(question).toBeVisible({ timeout: 15000 });

    const viewport = page.viewportSize();
    const questionBox = await question.boundingBox();
    expect(viewport).not.toBeNull();
    expect(questionBox).not.toBeNull();
    expect(
      questionBox!.y,
      "карточка задачи должна начинаться в первом viewport",
    ).toBeLessThan(viewport!.height);

    const theory = page.locator("#theory details");
    await expect(theory).toBeVisible();
    await expect(theory).not.toHaveAttribute("open", "");

    const theoryBox = await theory.boundingBox();
    expect(theoryBox).not.toBeNull();
    expect(
      theoryBox!.y,
      "закрытая справка должна идти после task block, а не перед ним",
    ).toBeGreaterThan(questionBox!.y);
  });
}

test("wrong answer feedback is compact until solution is requested", async ({
  page,
}, testInfo) => {
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();

  const beforeAnswerScrollY = await page.evaluate(() => window.scrollY);
  await options.getByRole("button").filter({ hasText: "31" }).first().click();

  await expect(page.getByRole("button", { name: "Показать решение" })).toBeVisible();
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);
  await expect(page.getByTestId("question-formula")).toHaveCount(0);

  if (testInfo.project.name === "desktop") {
    const afterAnswerScrollY = await page.evaluate(() => window.scrollY);
    expect(
      Math.abs(afterAnswerScrollY - beforeAnswerScrollY),
      "desktop не должен прыгать к feedback после выбора ответа",
    ).toBeLessThan(8);
  }

  await page.getByRole("button", { name: "Показать решение" }).click();
  await expect(page.getByTestId("solution-formula")).toBeVisible();

  await page.getByRole("button", { name: "Следующая задача" }).click();
  await expect(page.getByText("2 / 10").filter({ visible: true }).first()).toBeVisible();
});
