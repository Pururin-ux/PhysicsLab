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

test("kinematics practice loads the generated mixed task set", async ({ page }) => {
  const taskResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname === "/api/tasks" &&
      url.searchParams.get("template") === "mixed" &&
      url.searchParams.get("count") === "10"
    );
  });

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });

  const response = await taskResponse;
  expect(response.ok()).toBe(true);

  const payload = (await response.json()) as {
    tasks: { blueprint: string }[];
  };
  expect([...new Set(payload.tasks.map((task) => task.blueprint))].sort()).toEqual(
    [
      "average-speed-segments",
      "free-fall",
      "relative-velocity-vectors",
      "unit-conversion-speed",
      "vt-area",
      "vt-slope",
    ],
  );
  await expect(page.getByTestId("question-card")).toBeVisible();
});

test("wrong answer feedback is compact until solution is requested", async ({
  page,
}, testInfo) => {
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

  const beforeAnswerScrollY = await page.evaluate(() => window.scrollY);
  await options.getByRole("button").filter({ hasText: wrongOption!.text }).click();

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
