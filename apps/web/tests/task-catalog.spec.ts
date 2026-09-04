import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

type ApiTask =
  | {
      id: string;
      type: "single_choice";
      blueprint: string;
      options: { id: string; text: string; correct?: boolean }[];
    }
  | {
      id: string;
      type: "numeric_input";
      blueprint: string;
      answer: { value: number; unit: string };
    };

const SNAPSHOT_KEY = "physicslab-v3-active-quiz-v1";
const PROGRESS_KEY = "physicslab-v3-progress-v1";

async function fetchFamilyTasks(
  request: APIRequestContext,
  family: string,
  batch = 0,
): Promise<ApiTask[]> {
  const response = await request.get(
    `/api/tasks?template=${family}&count=5&batch=${batch}`,
  );
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as { tasks: ApiTask[] };
  expect(payload.tasks).toHaveLength(5);
  expect(payload.tasks.every((task) => task.blueprint === family)).toBe(true);
  return payload.tasks;
}

async function answerCorrectly(page: Page, task: ApiTask) {
  if (task.type === "numeric_input") {
    await page
      .getByTestId("numeric-answer-input")
      .fill(String(task.answer.value).replace(".", ","));
    await page.getByTestId("numeric-submit").click();
    return;
  }

  const correctIndex = task.options.findIndex((option) => option.correct);
  expect(correctIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(correctIndex).click();
}

async function answerWrongly(page: Page, task: Extract<ApiTask, { type: "single_choice" }>) {
  const wrongIndex = task.options.findIndex((option) => !option.correct);
  expect(wrongIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(wrongIndex).click();
}

async function mountDeterministicFamily(
  page: Page,
  request: APIRequestContext,
  family: string,
) {
  const batches = new Map<number, ApiTask[]>([
    [0, await fetchFamilyTasks(request, family, 0)],
    [1, await fetchFamilyTasks(request, family, 1)],
  ]);
  const requestedBatches: number[] = [];

  await page.route("**/api/tasks?*", async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("template") !== family) {
      await route.continue();
      return;
    }

    expect(url.searchParams.get("count")).toBe("5");
    const batch = Number(url.searchParams.get("batch") ?? "0");
    requestedBatches.push(batch);
    const tasks = batches.get(batch) ?? (await fetchFamilyTasks(request, family, batch));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ tasks }),
    });
  });

  return { tasks: batches.get(0)!, requestedBatches };
}

test("каталог показывает все 35 типов и честные группы", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Что потренируем?", level: 1 })).toBeVisible();
  await expect(page.getByTestId("task-catalog-item")).toHaveCount(35);
  await expect(page.getByText("Найдено типов:")).toContainText("35");

  // Плотность и объём относятся к молекулярной физике, поэтому этот тип
  // считается за термодинамику, а не за динамику.
  const expectedCounts = {
    kinematics: 6,
    dynamics: 10,
    electrodynamics: 6,
    thermodynamics: 6,
    optics: 7,
  } as const;
  for (const [topic, count] of Object.entries(expectedCounts)) {
    await expect(page.locator(`[data-topic="${topic}"]`)).toHaveCount(count);
  }
});

test("карта экзаменационного покрытия принадлежит диагностике, а не каталогу", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("program-coverage")).toHaveCount(0);

  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });
  const coverage = page.getByTestId("exam-coverage-map");
  await expect(coverage).toBeVisible();
  await expect(coverage.getByRole("list", { name: "Покрытие разделов программы" }).getByRole("listitem")).toHaveCount(6);
  await expect(coverage).toContainText("Полностью: 0 · Частично: 4 · Пока нет: 2");
});

test("поиск, topic filter и URL-state переживают reload и историю", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  const search = page.getByLabel("Поиск по типам задач");

  await search.fill("закон Ома");
  await expect(page).toHaveURL(/q=%D0%B7%D0%B0%D0%BA%D0%BE%D0%BD\+%D0%9E%D0%BC%D0%B0/);
  await expect(page.locator('[data-family="ohm-law"]')).toBeVisible();
  await expect(page.getByTestId("task-catalog-item").first()).toHaveAttribute(
    "data-family",
    "ohm-law",
  );

  await page.getByRole("button", { name: "Электричество" }).click();
  await expect(page).toHaveURL(/topic=electrodynamics/);
  await expect(page.getByTestId("task-catalog-item")).not.toHaveCount(0);
  expect(
    await page
      .getByTestId("task-catalog-item")
      .evaluateAll((items) => items.every((item) => item.getAttribute("data-topic") === "electrodynamics")),
  ).toBe(true);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(search).toHaveValue("закон Ома");
  await expect(page.getByRole("button", { name: "Электричество" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goBack();
  await expect(page).not.toHaveURL(/topic=electrodynamics/);
  await page.goForward();
  await expect(page).toHaveURL(/topic=electrodynamics/);
});

test("поиск поддерживает формулы, графики, синонимы и empty state", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  const search = page.getByLabel("Поиск по типам задач");

  for (const [query, family] of [
    ["I=U/R", "ohm-law"],
    ["v(t)", "vt-slope"],
    ["площадь под графиком", "vt-area"],
    ["тепловой баланс", "heat-balance-simple"],
    ["объём", "density-volume-ratio"],
  ] as const) {
    await search.fill(query);
    await expect(page.locator(`[data-family="${family}"]`)).toBeVisible();
  }

  await search.fill("несуществующая физика xyz");
  await expect(page.getByTestId("task-catalog-empty")).toBeVisible();
  await page.getByRole("button", { name: "Сбросить фильтры" }).click();
  await expect(page.getByTestId("task-catalog-item")).toHaveCount(35);
});

test("карточка типа ведёт в focused drill, неизвестный slug — 404", async ({ page }, testInfo) => {
  await page.goto("/tasks/ohm-law", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Закон Ома", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Что означают буквы" })).toHaveAttribute(
    "href",
    "/formulas?formula=ohm-law",
  );

  await page.goto("/tasks/ohm-law", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Начать: 5 задач" }).click();
  await expect(page).toHaveURL("/practice/family/ohm-law");
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 5");

  await page.goto("/tasks/not-a-family", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Такой тренировки здесь нет" })).toBeVisible();
  await page.goto("/practice/family/not-a-family", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("not-found-card")).toBeVisible();
});

test("формула ведёт к точному типу задачи и focused практике", async ({ page }) => {
  await page.goto("/formulas?formula=ohm-law", { waitUntil: "domcontentloaded" });

  const formula = page.locator('[data-formula-id="ohm-law"]');
  await expect(formula).toBeVisible();
  await expect(formula.getByRole("link", { name: "Разобрать тип" })).toHaveAttribute(
    "href",
    "/tasks/ohm-law",
  );
  await expect(formula.getByRole("link", { name: "Потренироваться" })).toHaveAttribute(
    "href",
    "/practice/family/ohm-law",
  );
});

test("focused drill сохраняет single choice и numeric input", async ({ page, request }) => {
  test.skip(test.info().project.name !== "desktop", "Глубокий flow достаточно проверить один раз.");

  const choice = await mountDeterministicFamily(page, request, "ohm-law");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".quiz-option")).toHaveCount(4);
  await answerCorrectly(page, choice.tasks[0]);
  await expect(page.getByTestId("next-task-button")).toBeVisible();

  await page.evaluate((key) => sessionStorage.removeItem(key), SNAPSHOT_KEY);
  await page.unrouteAll({ behavior: "wait" });
  const numeric = await mountDeterministicFamily(page, request, "average-speed-segments");
  await page.goto("/practice/family/average-speed-segments", { waitUntil: "domcontentloaded" });
  const input = page.getByTestId("numeric-answer-input");
  await expect(input).toBeVisible();
  await expect(page.getByTestId("numeric-answer-unit")).toHaveText("м/с");
  await input.fill(String((numeric.tasks[0] as Extract<ApiTask, { type: "numeric_input" }>).answer.value).replace(".", ","));
  await page.getByTestId("numeric-submit").click();
  await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
});

test("focused drill восстанавливает correction и restart запрашивает новый batch", async ({ page, request }) => {
  test.skip(test.info().project.name !== "desktop", "Recovery и restart достаточно проверить один раз.");

  const { tasks, requestedBatches } = await mountDeterministicFamily(page, request, "ohm-law");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });

  const firstTask = tasks[0] as Extract<ApiTask, { type: "single_choice" }>;
  const wrongIndex = firstTask.options.findIndex((option) => !option.correct);
  const correctIndex = firstTask.options.findIndex((option) => option.correct);

  await answerWrongly(page, firstTask);
  const retry = page.getByTestId("retry-task-button");
  await expect(retry).toBeFocused();
  await expect(page.getByTestId("next-task-button")).toHaveCount(0);

  await page.keyboard.press("Enter");
  await expect(page.locator(".quiz-option").nth(wrongIndex)).toBeDisabled();
  await expect(page.locator(".quiz-option:not(:disabled)").first()).toBeFocused();

  const correctOption = page.locator(".quiz-option").nth(correctIndex);
  await correctOption.focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("next-task-button")).toBeVisible();
  await page.getByTestId("next-task-button").click();
  await answerCorrectly(page, tasks[1]);
  await page.getByTestId("next-task-button").click();
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 3 из 5");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("session-restored-notice")).toBeVisible();
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 3 из 5");

  await answerCorrectly(page, tasks[2]);
  const xpBeforeReload = await page.evaluate(() => localStorage.getItem("physicslab-v3-xp-v1"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("session-restored-notice")).toBeVisible();
  await expect(page.getByTestId("next-task-button")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("physicslab-v3-xp-v1"))).toBe(xpBeforeReload);
  const previousAttemptId = await page.evaluate((key) => {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { attemptId: string }).attemptId : null;
  }, SNAPSHOT_KEY);
  await page.getByTestId("next-task-button").click();

  for (let index = 3; index < 5; index += 1) {
    await answerCorrectly(page, tasks[index]);
    if (index === 4) {
      await expect(page.getByTestId("practice-progress")).toHaveText("Задание 5 из 5");
    }
    await page.getByTestId("next-task-button").click();
  }
  await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();
  const taskTypeLinks = page.getByRole("link", { name: "К типу задачи" });
  await expect(taskTypeLinks).toHaveCount(1);
  await expect(taskTypeLinks).toHaveAttribute("href", "/tasks/ohm-law");
  await expect(page.getByRole("link", { name: "Проверить без подсказки" })).toHaveAttribute(
    "href",
    "/practice/electro-demo",
  );

  const progress = await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY);
  expect(progress).toContain('"completedSessions":1');
  expect(progress).toMatch(/"weakTraps":\{[^}]+\}/);

  await page.getByRole("button", { name: "Ещё 5 задач" }).click();
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 5");
  expect(requestedBatches.at(-1)).toBe(1);
  await expect.poll(() => page.evaluate((key) => {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { batch: number }).batch : null;
  }, SNAPSHOT_KEY)).toBe(1);
  const restartedSnapshot = await page.evaluate((key) => {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { attemptId: string; batch: number }) : null;
  }, SNAPSHOT_KEY);
  expect(restartedSnapshot).not.toBeNull();
  expect(restartedSnapshot!.batch).toBe(1);
  expect(restartedSnapshot!.attemptId).not.toBe(previousAttemptId);
});

test("topic и mixed training сохраняют стандартные 10 задач", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "Контракт count проверяется один раз.");

  const requests: { template: string | null; count: string | null }[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/api/tasks") {
      requests.push({
        template: url.searchParams.get("template"),
        count: url.searchParams.get("count"),
      });
    }
  });

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 10");
  expect(requests.some((request) => request.template === "mixed" && request.count === "10")).toBe(true);

  await page.evaluate((key) => sessionStorage.removeItem(key), SNAPSHOT_KEY);
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Начать диагностику" }).click();
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 10");
  expect(requests.some((request) => request.template === "exam" && request.count === "10")).toBe(true);
});
