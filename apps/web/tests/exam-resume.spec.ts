import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

type ApiTask = {
  id: string;
  type: "single_choice" | "numeric_input";
  answer: { value?: number };
  options?: { correct?: boolean }[];
};

const EXAM_PATH = "/practice/exam-demo";
const SNAPSHOT_KEY = "physicslab-v3-active-quiz-v1";
const XP_KEY = "physicslab-v3-xp-v1";

async function fetchExam(request: APIRequestContext, batch = 0): Promise<ApiTask[]> {
  const response = await request.get(`/api/tasks?template=exam&count=10&batch=${batch}`);
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { tasks: ApiTask[] }).tasks;
}

async function answerCorrectly(page: Page, task: ApiTask) {
  if (task.type === "single_choice") {
    const correctIndex = task.options?.findIndex((option) => option.correct) ?? -1;
    expect(correctIndex).toBeGreaterThanOrEqual(0);
    await page.locator(".quiz-option").nth(correctIndex).click();
  } else {
    await page.getByTestId("numeric-answer-input").fill(String(task.answer.value));
    await page.getByTestId("numeric-submit").click();
  }
  await expect(page.getByTestId("next-task-button")).toBeVisible();
}

async function openNormalGate(page: Page) {
  await page.goto(EXAM_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Начать тренировку" })).toBeVisible();
}

test.describe("exam resume gate", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Functional flow runs once on desktop.");
  });

  test("active and answered attempts resume; start new discards only that attempt", async ({
    page,
    request,
  }) => {
    const tasks = await fetchExam(request);
    await openNormalGate(page);
    await page.getByRole("button", { name: "Начать тренировку" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    for (let index = 0; index < 3; index += 1) {
      await answerCorrectly(page, tasks[index]);
      await page.getByTestId("next-task-button").click();
    }
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 4 из 10");

    await page.reload({ waitUntil: "domcontentloaded" });
    const candidate = page.getByTestId("exam-resume-candidate");
    await expect(candidate).toContainText("Незавершённый вариант");
    await expect(candidate).toContainText("задания 4 из 10");
    await expect(candidate.getByRole("button", { name: "Продолжить вариант" })).toBeVisible();
    await expect(candidate.getByRole("button", { name: "Начать новый вариант" })).toBeVisible();

    await candidate.getByRole("button", { name: "Продолжить вариант" }).click();
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 4 из 10");

    await answerCorrectly(page, tasks[3]);
    const xpAfterAnswer = await page.evaluate((key) => localStorage.getItem(key), XP_KEY);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-resume-candidate")).toContainText(
      "Ответ на задание 4 уже сохранён",
    );
    await page.getByRole("button", { name: "Продолжить вариант" }).click();
    await expect(page.getByTestId("next-task-button")).toBeVisible();
    await expect(page.getByText("Верно", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), XP_KEY)).toBe(
      xpAfterAnswer,
    );

    await page.reload({ waitUntil: "domcontentloaded" });
    const oldAttemptId = await page.evaluate((key) => {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { attemptId: string }).attemptId : null;
    }, SNAPSHOT_KEY);
    await page.getByRole("button", { name: "Начать новый вариант" }).click();
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 10");
    const freshAttemptId = await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = sessionStorage.getItem(key);
          return raw ? (JSON.parse(raw) as { attemptId: string }).attemptId : null;
        }, SNAPSHOT_KEY),
      )
      .not.toBe(oldAttemptId);
    void freshAttemptId;
  });

  test("continue loads the snapshot batch directly without a batch zero prefetch", async ({
    page,
    request,
  }) => {
    const tasks = await fetchExam(request, 4);
    await page.addInitScript(
      ({ key, taskIds }) => {
        sessionStorage.setItem(
          key,
          JSON.stringify({
            version: 2,
            attemptId: "exam-direct-batch-0004",
            savedAt: Date.now(),
            template: "exam",
            topic: "Смешанная тренировка",
            title: "Смешанная тренировка · открытые темы",
            sessionKind: "exam",
            batch: 4,
            taskIds,
            session: {
              phase: "active",
              currentIndex: 0,
              selectedOptionId: null,
              answers: [],
              score: 0,
              streak: 0,
              total: taskIds.length,
            },
          }),
        );
      },
      { key: SNAPSHOT_KEY, taskIds: tasks.map((task) => task.id) },
    );

    const requestedBatches: string[] = [];
    page.on("request", (outgoing) => {
      if (!outgoing.url().includes("/api/tasks?")) return;
      const url = new URL(outgoing.url());
      if (url.searchParams.get("template") === "exam") {
        requestedBatches.push(url.searchParams.get("batch") ?? "");
      }
    });

    await page.goto(EXAM_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-resume-candidate")).toBeVisible();
    expect(requestedBatches).toEqual([]);
    await page.getByRole("button", { name: "Продолжить вариант" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    expect(requestedBatches.length).toBeGreaterThan(0);
    expect(new Set(requestedBatches)).toEqual(new Set(["4"]));
  });

  test("a stale candidate falls back to a fresh session without a false restored notice", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          version: 2,
          attemptId: "exam-stale-attempt-0001",
          savedAt: Date.now(),
          template: "exam",
          topic: "Смешанная тренировка",
          title: "Смешанная тренировка · открытые темы",
          sessionKind: "exam",
          batch: 3,
          taskIds: Array.from({ length: 10 }, (_, index) => `stale-${index}`),
          session: {
            phase: "active",
            currentIndex: 0,
            selectedOptionId: null,
            answers: [],
            score: 0,
            streak: 0,
            total: 10,
          },
        }),
      );
    }, SNAPSHOT_KEY);

    await page.goto(EXAM_PATH, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Продолжить вариант" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 10");
    await expect(page.getByTestId("session-restored-notice")).toHaveCount(0);
  });

  test("start new preserves a snapshot replaced after the gate was rendered", async ({ page }) => {
    await openNormalGate(page);
    await page.getByRole("button", { name: "Начать тренировку" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-resume-candidate")).toBeVisible();

    const futureSnapshot = JSON.stringify({ version: 99, replaced: true });
    await page.evaluate(
      ({ key, value }) => sessionStorage.setItem(key, value),
      { key: SNAPSHOT_KEY, value: futureSnapshot },
    );
    await page.getByRole("button", { name: "Начать новый вариант" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect
      .poll(() => page.evaluate((key) => sessionStorage.getItem(key), SNAPSHOT_KEY))
      .toBe(futureSnapshot);
  });

  test("practice, future and corrupt snapshots never become exam candidates", async ({ page }) => {
    await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    const practiceSnapshot = await expect
      .poll(() => page.evaluate((key) => sessionStorage.getItem(key), SNAPSHOT_KEY))
      .not.toBeNull();
    void practiceSnapshot;
    await page.goto(EXAM_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Начать тренировку" })).toBeVisible();
    await expect(page.getByTestId("exam-resume-candidate")).toHaveCount(0);

    await page.evaluate((key) => sessionStorage.removeItem(key), SNAPSHOT_KEY);
    await page.evaluate(
      (key) => sessionStorage.setItem(key, JSON.stringify({ version: 99, future: true })),
      SNAPSHOT_KEY,
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Начать тренировку" })).toBeVisible();
    await expect(page.getByTestId("exam-resume-candidate")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate((key) => sessionStorage.getItem(key), SNAPSHOT_KEY))
      .toContain('"version":99');

    await page.getByRole("button", { name: "Начать тренировку" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect
      .poll(() => page.evaluate((key) => sessionStorage.getItem(key), SNAPSHOT_KEY))
      .toContain('"version":99');

    await page.evaluate((key) => sessionStorage.setItem(key, "{broken"), SNAPSHOT_KEY);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Начать тренировку" })).toBeVisible();
    await expect.poll(() => page.evaluate((key) => sessionStorage.getItem(key), SNAPSHOT_KEY)).toBeNull();
  });
});

test("exam resume gate fits above mobile navigation", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile geometry only.");

  await openNormalGate(page);
  await page.getByRole("button", { name: "Начать тренировку" }).click();
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
  await page.reload({ waitUntil: "domcontentloaded" });

  const candidate = page.getByTestId("exam-resume-candidate");
  const newButton = candidate.getByRole("button", { name: "Начать новый вариант" });
  await expect(candidate).toBeVisible();
  await newButton.scrollIntoViewIfNeeded();

  const [buttonBox, navBox] = await Promise.all([
    newButton.boundingBox(),
    page.getByRole("navigation", { name: "Мобильная навигация" }).boundingBox(),
  ]);
  expect(buttonBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(navBox!.y - (buttonBox!.y + buttonBox!.height)).toBeGreaterThanOrEqual(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );
});
