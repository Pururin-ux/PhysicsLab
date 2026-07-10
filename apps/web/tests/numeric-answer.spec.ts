import {
  expect,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
} from "@playwright/test";

type NumericAnswer = {
  value: number;
  unit: string;
  decimals: number;
  tolerance: number;
  sign: "positive" | "magnitude" | "signed";
};

type ApiTaskBase = {
  id: string;
  type: "single_choice" | "numeric_input";
  blueprint: string;
  text: string;
};

type SingleChoiceTask = ApiTaskBase & {
  type: "single_choice";
  answer: string;
  options: {
    id: string;
    text: string;
    correct?: boolean;
    misconception?: string;
  }[];
};

type NumericTask = ApiTaskBase & {
  type: "numeric_input";
  answer: NumericAnswer;
  misconceptions: { value: number; label: string }[];
};

type ApiTask = SingleChoiceTask | NumericTask;

function isNumericTask(task: ApiTask): task is NumericTask {
  return task.type === "numeric_input";
}

async function fetchTasks(
  request: APIRequestContext,
  template: string,
  count = 1,
  batch = 0,
): Promise<ApiTask[]> {
  const response = await request.get(
    `/api/tasks?template=${template}&count=${count}&batch=${batch}`,
  );
  expect(response.ok(), `${template} API response`).toBe(true);
  const payload = (await response.json()) as { tasks: ApiTask[] };
  expect(payload.tasks).toHaveLength(count);
  return payload.tasks;
}

async function mountTaskSet(
  page: Page,
  path: string,
  routeTemplate: string,
  tasks: ApiTask[],
) {
  await page.route("**/api/tasks?*", async (route) => {
    const requestedTemplate = new URL(route.request().url()).searchParams.get(
      "template",
    );

    if (requestedTemplate !== routeTemplate) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ tasks }),
    });
  });

  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
}

async function mountNumericPilot(
  page: Page,
  request: APIRequestContext,
  options: {
    path: string;
    routeTemplate: string;
    pilot: string;
    count?: number;
    batch?: number;
  },
): Promise<NumericTask[]> {
  const tasks = await fetchTasks(
    request,
    options.pilot,
    options.count ?? 1,
    options.batch ?? 0,
  );
  expect(tasks.every(isNumericTask), `${options.pilot} must be numeric`).toBe(true);
  await mountTaskSet(page, options.path, options.routeTemplate, tasks);
  return tasks as NumericTask[];
}

function commaOf(value: number) {
  return String(value).replace(".", ",");
}

function misconceptionFor(task: NumericTask) {
  const misconception = task.misconceptions.find(
    (candidate) =>
      Math.abs(candidate.value - task.answer.value) > task.answer.tolerance,
  );
  expect(misconception, `${task.blueprint} has a usable misconception`).toBeTruthy();
  return misconception!;
}

async function expectNumericReady(page: Page, task: NumericTask) {
  const input = page.getByTestId("numeric-answer-input");
  await expect(input).toBeVisible();
  await expect(input).toHaveValue("");
  await expect(input).toHaveAttribute(
    "aria-label",
    `Ответ в единицах: ${task.answer.unit}`,
  );
  await expect(page.getByTestId("numeric-answer-unit")).toHaveText(
    task.answer.unit,
  );
  await expect(page.getByTestId("numeric-submit")).toBeDisabled();
  await expect(page.getByTestId("numeric-correct-answer")).toHaveCount(0);

  const box = await input.boundingBox();
  expect(box, "numeric input must have a layout box").not.toBeNull();
  expect(box!.width, "numeric input must not collapse to zero width").toBeGreaterThan(80);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectSummaryScore(page: Page, score: number, total: number) {
  await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();
  const visibleScore = page
    .locator("main p")
    .filter({ hasText: `${score} / ${total}` })
    .filter({ visible: true });
  await expect(visibleScore).toHaveCount(1);
}

async function expectScrollableAboveMobileNav(
  control: Locator,
  mobileNavContainer: Locator,
) {
  await control.evaluate((element) => element.scrollIntoView({ block: "end" }));
  const [controlBox, navBox] = await Promise.all([
    control.boundingBox(),
    mobileNavContainer.boundingBox(),
  ]);

  expect(controlBox, "control must have a bounding box").not.toBeNull();
  expect(navBox, "mobile nav must have a bounding box").not.toBeNull();
  expect(navBox!.y - (controlBox!.y + controlBox!.height)).toBeGreaterThanOrEqual(8);
}

test.describe("numeric answer desktop flows", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop functional coverage.");
  });

  test("average speed accepts comma and dot and resets between numeric tasks", async ({
    page,
    request,
  }) => {
    const tasks = await mountNumericPilot(page, request, {
      path: "/practice/kinematics-demo",
      routeTemplate: "mixed",
      pilot: "average-speed-segments",
      count: 2,
    });

    await expectNumericReady(page, tasks[0]);
    await page.getByTestId("numeric-answer-input").fill(commaOf(tasks[0].answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "correct",
    );
    await expect(page.getByRole("status")).not.toContainText("Верно. Верно.");
    await expect(page.getByTestId("numeric-correct-answer")).toBeVisible();
    await expect(page.getByTestId("next-task-button")).toBeFocused();

    await page.getByTestId("next-task-button").click();
    await expectNumericReady(page, tasks[1]);
    await page.getByTestId("numeric-answer-input").fill(String(tasks[1].answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "correct",
    );
    await page.getByTestId("next-task-button").click();
    await expectSummaryScore(page, 2, 2);
  });

  test("average speed wrong answer stays compact and exposes targeted help", async ({
    page,
    request,
  }) => {
    const [task] = await mountNumericPilot(page, request, {
      path: "/practice/kinematics-demo",
      routeTemplate: "mixed",
      pilot: "average-speed-segments",
    });
    const misconception = misconceptionFor(task);

    await page.getByTestId("numeric-answer-input").fill(commaOf(misconception.value));
    await page.getByTestId("numeric-submit").click();

    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "wrong",
    );
    await expect(page.getByTestId("numeric-answer")).toContainText(
      commaOf(misconception.value),
    );
    await expect(page.getByTestId("numeric-correct-answer")).toBeVisible();
    await expect(page.getByTestId("solution-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByTestId("help-target-button")).toBeVisible();

    await page.getByTestId("solution-toggle").click();
    await expect(page.getByTestId("solution-formula")).toBeVisible();
  });

  test("signed work distinguishes a sign mistake and accepts a leading minus", async ({
    page,
    request,
  }) => {
    const [task] = await mountNumericPilot(page, request, {
      path: "/practice/dynamics-demo",
      routeTemplate: "dynamics-mixed",
      pilot: "work-force-distance",
      batch: 0,
    });
    expect(task.answer.value).toBeLessThan(0);
    expect(task.answer.sign).toBe("signed");

    const signMistake = task.misconceptions.find(
      (candidate) => candidate.value === Math.abs(task.answer.value),
    );
    expect(signMistake, "work pilot exposes the sign misconception").toBeTruthy();

    await page.getByTestId("numeric-answer-input").fill(String(signMistake!.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "wrong",
    );
    await expect(
      page.getByRole("status").filter({ hasText: signMistake!.label }),
    ).toHaveCount(1);

    await page.getByTestId("next-task-button").click();
    await page.getByRole("button", { name: "Ещё 10 задач" }).click();
    await expectNumericReady(page, task);
    await page.getByTestId("numeric-answer-input").fill(String(task.answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "correct",
    );
  });

  test("electric power submits an integer by Enter and keeps the watt unit outside", async ({
    page,
    request,
  }) => {
    const [task] = await mountNumericPilot(page, request, {
      path: "/practice/electro-demo",
      routeTemplate: "electro-mixed",
      pilot: "electric-power",
    });
    expect(Number.isInteger(task.answer.value)).toBe(true);
    expect(task.answer.unit).toBe("Вт");

    await expectNumericReady(page, task);
    const input = page.getByTestId("numeric-answer-input");
    await input.fill(String(task.answer.value));
    await input.press("Enter");
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "correct",
    );
  });

  test("heat balance covers wrong and correct paths with a separate °C suffix", async ({
    page,
    request,
  }) => {
    const tasks = await mountNumericPilot(page, request, {
      path: "/practice/thermo-demo",
      routeTemplate: "thermo-mixed",
      pilot: "heat-balance-simple",
      count: 2,
    });
    const misconception = misconceptionFor(tasks[0]);

    await expectNumericReady(page, tasks[0]);
    await page.getByTestId("numeric-answer-input").fill(String(misconception.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "wrong",
    );
    await expect(page.getByTestId("numeric-correct-answer")).toContainText("°C");

    await page.getByTestId("next-task-button").click();
    await expectNumericReady(page, tasks[1]);
    await page.getByTestId("numeric-answer-input").fill(String(tasks[1].answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute(
      "data-state",
      "correct",
    );
  });

  test("empty, malformed and expression input cannot be submitted", async ({
    page,
    request,
  }) => {
    const [task] = await mountNumericPilot(page, request, {
      path: "/practice/kinematics-demo",
      routeTemplate: "mixed",
      pilot: "average-speed-segments",
    });
    await expectNumericReady(page, task);

    const input = page.getByTestId("numeric-answer-input");
    const submit = page.getByTestId("numeric-submit");
    for (const value of ["abc", "2+2", "1,2,3", "1e3"]) {
      await input.fill(value);
      await expect(submit).toBeDisabled();
      await expect(page.getByTestId("numeric-answer")).toHaveCount(0);
    }

    await input.press("Enter");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByText("Введи число — можно с десятичной запятой и со знаком минус.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("mixed single-choice → numeric session records score, weakness and restart", async ({
    page,
    request,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    const [choice] = await fetchTasks(request, "newton-second", 1, 0);
    const [numeric] = await fetchTasks(request, "average-speed-segments", 1, 0);
    expect(choice.type).toBe("single_choice");
    expect(numeric.type).toBe("numeric_input");
    await mountTaskSet(page, "/practice/kinematics-demo", "mixed", [choice, numeric]);

    const singleChoice = choice as SingleChoiceTask;
    const wrongOptionIndex = singleChoice.options.findIndex((option) => !option.correct);
    const wrongOption = singleChoice.options[wrongOptionIndex];
    expect(wrongOption).toBeTruthy();
    const optionButtons = page.locator(".quiz-option");
    await expect(optionButtons).toHaveCount(singleChoice.options.length);
    await optionButtons.nth(wrongOptionIndex).click();
    await page.getByTestId("next-task-button").click();

    const numericTask = numeric as NumericTask;
    await expectNumericReady(page, numericTask);
    await page
      .getByTestId("numeric-answer-input")
      .fill(commaOf(numericTask.answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByText("Серия: 1", { exact: true })).toBeVisible();
    await page.getByTestId("next-task-button").click();

    await expectSummaryScore(page, 1, 2);
    await expect(page.getByText("На что обратить внимание", { exact: true })).toBeVisible();

    const progress = await page.evaluate(() => {
      const raw = window.localStorage.getItem("physicslab-v3-progress-v1");
      if (!raw) return null;
      const envelope = JSON.parse(raw) as {
        data: {
          topics: {
            kinematics: {
              solved: number;
              correct: number;
              completedSessions: number;
              weakTraps: Record<string, number>;
            };
          };
        };
      };
      return envelope.data.topics.kinematics;
    });
    expect(progress).not.toBeNull();
    expect(progress!.solved).toBe(2);
    expect(progress!.correct).toBe(1);
    expect(progress!.completedSessions).toBe(1);
    expect(Object.values(progress!.weakTraps).reduce((sum, count) => sum + count, 0)).toBe(1);

    await page.getByRole("button", { name: "Ещё 10 задач" }).click();
    await expect(page.locator(".quiz-option")).toHaveCount(4);
    await expect(page.getByText("Итог тренировки", { exact: true })).toHaveCount(0);
  });
});

test.describe("numeric answer mobile layout", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile"),
      "Mobile safe-area coverage.",
    );
    await page.setViewportSize(
      testInfo.project.name === "mobile-390"
        ? { width: 390, height: 844 }
        : { width: 360, height: 800 },
    );
  });

  test("input, feedback and expanded solution clear the bottom nav", async ({
    page,
    request,
  }) => {
    const [task] = await mountNumericPilot(page, request, {
      path: "/practice/thermo-demo",
      routeTemplate: "thermo-mixed",
      pilot: "heat-balance-simple",
    });
    const misconception = misconceptionFor(task);
    await expectNumericReady(page, task);
    await expectNoHorizontalOverflow(page);

    const mobileNav = page.getByRole("navigation", {
      name: "Мобильная навигация",
    });
    const mobileNavContainer = mobileNav.locator("xpath=..");
    await expect(mobileNav).toBeVisible();
    await expectScrollableAboveMobileNav(
      page.getByTestId("numeric-submit"),
      mobileNavContainer,
    );

    await page.getByTestId("numeric-answer-input").fill(String(misconception.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("solution-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expectScrollableAboveMobileNav(
      page.getByTestId("next-task-button"),
      mobileNavContainer,
    );

    await page.getByTestId("solution-toggle").click();
    await expect(page.getByTestId("solution-formula")).toBeVisible();
    await expectScrollableAboveMobileNav(
      page.getByTestId("next-task-button"),
      mobileNavContainer,
    );
    await expectNoHorizontalOverflow(page);
  });
});
