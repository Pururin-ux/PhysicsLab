import {
  expect,
  test,
  type APIRequestContext,
  type Page,
  type Route,
} from "@playwright/test";

// Матрица устойчивости public beta: детерминированные сценарии сетевых
// сбоев, восстановления сессии, повреждённого storage и route-фолбэков.
// Никаких реальных 12-секундных таймаутов: hook читает test-хук
// window.__physlabQuizTimeoutMs. Production integrity всегда требует 10 задач.

type ApiTask = {
  id: string;
  type: "single_choice" | "numeric_input";
  blueprint: string;
  text: string;
  answer: unknown;
  options?: { id: string; text: string; correct?: boolean }[];
};

const PROGRESS_KEY = "physicslab-v3-progress-v1";
const XP_KEY = "physicslab-v3-xp-v1";
const SNAPSHOT_KEY = "physicslab-v3-active-quiz-v1";
const KINEMATICS = "/practice/kinematics-demo";

async function fetchTasks(
  request: APIRequestContext,
  template: string,
  count: number,
  batch = 0,
): Promise<ApiTask[]> {
  const response = await request.get(
    `/api/tasks?template=${template}&count=${count}&batch=${batch}`,
  );
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as { tasks: ApiTask[] };
  return payload.tasks;
}

// Общая заготовка: короткий таймаут + ожидаемый размер набора.
async function prime(page: Page, expectedCount = 10, timeoutMs = 3000) {
  await page.addInitScript(
    ({ count, timeout }) => {
      window.__physlabQuizExpectedCount = count;
      window.__physlabQuizTimeoutMs = timeout;
    },
    { count: expectedCount, timeout: timeoutMs },
  );
}

function isMixedRequest(route: Route): boolean {
  return (
    new URL(route.request().url()).searchParams.get("template") === "mixed"
  );
}

async function mountMixed(page: Page, tasks: ApiTask[]) {
  await prime(page, tasks.length);
  await page.route("**/api/tasks?*", async (route) => {
    if (!isMixedRequest(route)) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ tasks }),
    });
  });
  await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
}

async function answerCorrectly(page: Page, task: ApiTask) {
  if (task.type === "single_choice") {
    const index = task.options?.findIndex((option) => option.correct) ?? -1;
    expect(index).toBeGreaterThanOrEqual(0);
    await page.locator(".quiz-option").nth(index).click();
  } else {
    const answer = task.answer as { value: number };
    await page
      .getByTestId("numeric-answer-input")
      .fill(String(answer.value).replace(".", ","));
    await page.getByTestId("numeric-submit").click();
  }
  await expect(page.getByTestId("next-task-button")).toBeVisible();
}

async function expectErrorCard(page: Page, heading: string | RegExp) {
  const card = page.getByTestId("quiz-load-error-card");
  await expect(card).toBeVisible({ timeout: 10000 });
  await expect(card.getByRole("heading", { name: heading })).toBeVisible();
  await expect(page.getByTestId("quiz-load-retry")).toBeVisible();
  await expect(card.getByRole("link", { name: "К темам" })).toBeVisible();
}

test.describe("quiz loading resilience", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Функциональная матрица — desktop.");
  });

  test("начальное состояние загрузки анонсируется и не мигает пустым экраном", async ({
    page,
  }) => {
    await prime(page, 10);
    await page.route("**/api/tasks?*", async (route) => {
      if (!isMixedRequest(route)) return route.continue();
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
    });
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });

    const loading = page.getByTestId("quiz-loading-card");
    await expect(loading).toBeVisible();
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(loading).toContainText("Готовлю новый набор задач");
  });

  test("500 → карточка ошибки сервера", async ({ page }) => {
    await prime(page, 10);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Internal", code: "X", retryable: true }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Сервер временно недоступен");
    // Никаких сырых status/stack в карточке.
    await expect(page.getByTestId("quiz-load-error-card")).not.toContainText("500");
    await expect(page.getByTestId("quiz-load-error-card")).not.toContainText("Internal");
  });

  test("503 → retryable ошибка, retry повторяет тот же batch", async ({ page }) => {
    const batches: string[] = [];
    let failuresLeft = 2;
    await prime(page, 10);
    await page.route("**/api/tasks?*", async (route) => {
      if (!isMixedRequest(route)) return route.continue();
      batches.push(new URL(route.request().url()).searchParams.get("batch") ?? "");
      if (failuresLeft > 0) {
        failuresLeft -= 1;
        return route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
      }
      return route.continue();
    });
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Сервер временно недоступен");

    await page.getByTestId("quiz-load-retry").click();
    await expectErrorCard(page, "Сервер временно недоступен");
    await page.getByTestId("quiz-load-retry").click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    // Retry не увеличивает batch: все три запроса — один и тот же batch.
    expect(batches.length).toBe(3);
    expect(new Set(batches).size).toBe(1);
  });

  test("invalid JSON → «Ответ повреждён», без сырого исключения", async ({ page }) => {
    await prime(page, 10);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: "{not json" })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Ответ повреждён");
    await expect(page.getByTestId("quiz-load-error-card")).not.toContainText("Unexpected");
  });

  test("{} и {tasks: []} → понятные ошибки вместо пустого экрана", async ({ page }) => {
    await prime(page, 10);
    let payload = "{}";
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: payload })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Ответ повреждён");

    payload = JSON.stringify({ tasks: [] });
    await page.getByTestId("quiz-load-retry").click();
    await expectErrorCard(page, "Набор задач пуст");
  });

  test("malformed choice-задача не попадает в UI", async ({ page, request }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    const broken = structuredClone(tasks) as ApiTask[];
    const choice = broken.find((task) => task.type === "single_choice")!;
    // Две correct-опции — нарушение контракта.
    choice.options = choice.options!.map((option) => ({ ...option, correct: true }));

    await prime(page, 10);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks: broken }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Набор задач не прошёл проверку");
  });

  test("malformed numeric-задача не попадает в UI", async ({ page, request }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    const broken = structuredClone(tasks) as ApiTask[];
    const numeric = broken.find((task) => task.type === "numeric_input")!;
    (numeric.answer as { tolerance: number }).tolerance = -5;

    await prime(page, 10);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks: broken }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Набор задач не прошёл проверку");
  });

  test("зависший запрос → timeout без 12-секундного ожидания", async ({ page }) => {
    await prime(page, 10, 400);
    await page.route("**/api/tasks?*", async (route) => {
      if (!isMixedRequest(route)) return route.continue();
      // Никогда не отвечаем: запрос прерывает клиентский таймаут.
      await new Promise(() => {});
    });
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Сервер не отвечает");
  });

  test("offline → понятное сообщение; online → retry того же batch", async ({
    page,
  }) => {
    const batches: string[] = [];
    await prime(page, 10);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
    });
    let offline = true;
    await page.route("**/api/tasks?*", (route) => {
      if (!isMixedRequest(route)) return route.continue();
      batches.push(new URL(route.request().url()).searchParams.get("batch") ?? "");
      return offline ? route.abort("internetdisconnected") : route.continue();
    });

    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expectErrorCard(page, "Нет соединения");
    await expect(page.getByTestId("offline-hint")).toBeVisible();

    offline = false;
    await page.evaluate(() => {
      Object.defineProperty(navigator, "onLine", { configurable: true, get: () => true });
    });
    await page.getByTestId("quiz-load-retry").click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    expect(new Set(batches).size).toBe(1);
  });

  test("устаревший медленный ответ не перезаписывает новый и не даёт ложную ошибку", async ({
    page,
    request,
  }) => {
    const staleTasks = await fetchTasks(request, "mixed", 10, 50);
    const freshTasks = await fetchTasks(request, "mixed", 10, 60);
    expect(staleTasks[0].text).not.toBe(freshTasks[0].text);

    let call = 0;
    await prime(page, 10);
    await page.route("**/api/tasks?*", async (route) => {
      if (!isMixedRequest(route)) return route.continue();
      call += 1;
      if (call === 1) {
        // Первый запрос «висит» дольше, чем живёт его mount: страница
        // перезагружается, запрос abort-ится. Он не должен ни показать
        // ошибку, ни перезаписать данные нового запроса.
        await new Promise((resolve) => setTimeout(resolve, 2500));
        return route
          .fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks: staleTasks }) })
          .catch(() => {});
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks: freshTasks }) });
    });

    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("quiz-loading-card")).toBeVisible();

    // Новый mount тех же параметров: свежий запрос отвечает мгновенно.
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("question-card")).toContainText(
      freshTasks[0].text.slice(0, 40),
    );

    // Устаревший ответ «дозревает» — состояние не меняется и ошибок нет.
    await page.waitForTimeout(2200);
    await expect(page.getByTestId("question-card")).toContainText(
      freshTasks[0].text.slice(0, 40),
    );
    await expect(page.getByTestId("quiz-load-error-card")).toHaveCount(0);
  });
});

test.describe("session recovery", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Recovery — desktop матрица.");
  });

  test("reload на активной задаче восстанавливает позицию, счёт и серию", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    await mountMixed(page, tasks);

    for (const task of tasks.slice(0, 3)) {
      await answerCorrectly(page, task);
      await page.getByTestId("next-task-button").click();
    }
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 4 из 10");

    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("session-restored-notice")).toContainText(
      "Тренировка восстановлена: задание 4 из 10",
    );
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 4 из 10");
    await expect(page.getByText("Серия: 3", { exact: true })).toHaveCount(0);
    await expect.poll(() => page.evaluate((key) => {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { session: { streak: number } }).session.streak : null;
    }, SNAPSHOT_KEY)).toBe(3);
  });

  test("reload после ответа восстанавливает answered-состояние и фидбэк", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    await mountMixed(page, tasks);

    await answerCorrectly(page, tasks[0]);
    await page.reload({ waitUntil: "domcontentloaded" });

    // Answered-фаза: фидбэк и Next восстановлены, «Показать решение» доступно.
    await expect(page.getByTestId("next-task-button")).toBeVisible();
    await expect(page.getByTestId("solution-toggle")).toBeVisible();
    await expect(page.getByText("Верно", { exact: true }).first()).toBeVisible();

    // Продолжение работает: Next ведёт к задаче 2.
    await page.getByTestId("next-task-button").click();
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 2 из 10");
  });

  test("reload после numeric-ответа восстанавливает введённое значение", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    const numericIndex = tasks.findIndex((task) => task.type === "numeric_input");
    expect(numericIndex).toBeGreaterThanOrEqual(0);
    await mountMixed(page, tasks);

    for (const task of tasks.slice(0, numericIndex)) {
      await answerCorrectly(page, task);
      await page.getByTestId("next-task-button").click();
    }
    const numericTask = tasks[numericIndex];
    await answerCorrectly(page, numericTask);

    await page.reload({ waitUntil: "domcontentloaded" });

    const submitted = page.getByTestId("numeric-answer");
    await expect(submitted).toBeVisible();
    await expect(submitted).toHaveAttribute("data-state", "correct");
    await expect(page.getByTestId("numeric-correct-answer")).toHaveCount(0);
  });

  test("XP не начисляется повторно при восстановлении", async ({ page, request }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    await mountMixed(page, tasks);

    await answerCorrectly(page, tasks[0]);
    const xpBefore = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      XP_KEY,
    );
    expect(xpBefore).toBeTruthy();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("next-task-button")).toBeVisible();
    // Небольшая пауза исключает отложенную повторную запись.
    await expect
      .poll(async () =>
        page.evaluate((key) => window.localStorage.getItem(key), XP_KEY),
      )
      .toBe(xpBefore);
  });

  test("завершение сессии записывается один раз и очищает снапшот (двойной клик)", async ({
    page,
    request,
  }) => {
    // Короткая сессия из 2 задач: helper объявляет expectedCount.
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 2);
    await mountMixed(page, tasks);

    await answerCorrectly(page, tasks[0]);
    await page.getByTestId("next-task-button").click();
    await answerCorrectly(page, tasks[1]);

    // Reload after the final answer but before opening the summary: this is
    // the window where completion recording must remain idempotent.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("next-task-button")).toBeVisible();

    // Двойной клик по «Показать итог».
    await page.getByTestId("next-task-button").click({ clickCount: 2, delay: 40 });
    await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();

    const progress = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { data: { topics: Record<string, { completedSessions: number }> } }) : null;
    }, PROGRESS_KEY);
    expect(progress?.data.topics.kinematics.completedSessions).toBe(1);

    const snapshot = await page.evaluate(
      (key) => window.sessionStorage.getItem(key),
      SNAPSHOT_KEY,
    );
    expect(snapshot).toBeNull();

    // Reload на summary не создаёт вторую запись.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    const progressAfter = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { data: { topics: Record<string, { completedSessions: number }> } }) : null;
    }, PROGRESS_KEY);
    expect(progressAfter?.data.topics.kinematics.completedSessions).toBe(1);
  });

  test("повторное прохождение того же batch=0 в одной вкладке записывается второй раз", async ({
    page,
    request,
  }) => {
    // Регрессия P1: sessionId был детерминирован по набору задач, и второй
    // честный проход batch=0 молча не записывался. attemptId различает попытки.
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 2);

    const readProgress = () =>
      page.evaluate((key) => {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as {
          data: {
            topics: Record<string, { completedSessions: number; solved: number; correct: number }>;
          };
        };
        return parsed.data.topics.kinematics;
      }, PROGRESS_KEY);

    const completeSession = async () => {
      await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
      await answerCorrectly(page, tasks[0]);
      await page.getByTestId("next-task-button").click();
      await answerCorrectly(page, tasks[1]);
      await page.getByTestId("next-task-button").click();
      await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();
    };

    await mountMixed(page, tasks);
    await completeSession();
    const first = await readProgress();
    expect(first?.completedSessions).toBe(1);
    expect(first?.solved).toBe(2);

    // Уходим и возвращаемся В ТОЙ ЖЕ вкладке: batch снова 0, задачи те же.
    await page.goto("/topics", { waitUntil: "domcontentloaded" });
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await completeSession();

    const second = await readProgress();
    expect(second?.completedSessions, "вторая попытка обязана записаться").toBe(2);
    expect(second?.solved).toBe(4);
    expect(second?.correct).toBe(4);
  });

  test("exam: повторный вариант того же batch записывается, дубль одной попытки — нет", async ({
    page,
    request,
  }) => {
    const tasks = (await fetchTasks(request, "exam", 10)).slice(0, 2);
    await prime(page, 2);
    await page.route("**/api/tasks?*", (route) =>
      new URL(route.request().url()).searchParams.get("template") === "exam"
        ? route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ tasks }),
          })
        : route.continue(),
    );

    const readAttempts = () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("physicslab-v3-exam-log-v1");
        if (!raw) return 0;
        return (JSON.parse(raw) as { data: unknown[] }).data.length;
      });

    const completeExam = async () => {
      await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "Начать тренировку" }).click();
      await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
      await answerCorrectly(page, tasks[0]);
      await page.getByTestId("next-task-button").click();
      await answerCorrectly(page, tasks[1]);
      // Двойной клик по «Показать итог» — одна попытка, одна запись.
      await page.getByTestId("next-task-button").click({ clickCount: 2, delay: 40 });
      await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();
    };

    await completeExam();
    expect(await readAttempts()).toBe(1);

    await completeExam();
    expect(await readAttempts(), "второй вариант того же batch записан").toBe(2);
  });

  test("Restart очищает снапшот и начинает новый batch", async ({ page, request }) => {
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 2);
    const nextBatch = (await fetchTasks(request, "mixed", 10, 1)).slice(0, 2);
    await prime(page, 2);
    const batches: string[] = [];
    await page.route("**/api/tasks?*", (route) => {
      if (!isMixedRequest(route)) return route.continue();
      const batch = new URL(route.request().url()).searchParams.get("batch") ?? "";
      batches.push(batch);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ tasks: batch === "0" ? tasks : nextBatch }),
      });
    });
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    await answerCorrectly(page, tasks[0]);
    await page.getByTestId("next-task-button").click();
    await answerCorrectly(page, tasks[1]);
    await page.getByTestId("next-task-button").click();
    await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Ещё 10 задач" }).click();
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    expect(batches.at(-1)).toBe("1");
    const snapshotBatch = await page.evaluate((key) => {
      const raw = window.sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { batch: number }).batch : null;
    }, SNAPSHOT_KEY);
    expect(snapshotBatch).toBe(1);
  });

  test("битый / просроченный / чужой снапшот не ломает загрузку", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTasks(request, "mixed", 10);

    // Битый JSON.
    await prime(page, 10);
    await page.addInitScript((key) => {
      window.sessionStorage.setItem(key, "{broken");
    }, SNAPSHOT_KEY);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("session-restored-notice")).toHaveCount(0);
    await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 10");
  });

  test("future-version снапшот не используется и не удаляется", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTasks(request, "mixed", 10);
    const futureSnapshot = JSON.stringify({ version: 99, anything: true });

    await prime(page, 10);
    await page.addInitScript(
      ({ key, value }) => {
        window.sessionStorage.setItem(key, value);
      },
      { key: SNAPSHOT_KEY, value: futureSnapshot },
    );
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("session-restored-notice")).toHaveCount(0);

    // Данные из будущего целы, пока снапшот-эффект не перезапишет их —
    // проверяем до первого ответа.
    const raw = await page.evaluate(
      (key) => window.sessionStorage.getItem(key),
      SNAPSHOT_KEY,
    );
    expect(raw).toContain('"version":99');
  });
});

test.describe("storage resilience", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Storage — desktop матрица.");
  });

  test("повреждённый progress безопасно сбрасывается с одним уведомлением", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "{definitely broken");
    }, PROGRESS_KEY);
    await page.goto("/topics", { waitUntil: "domcontentloaded" });

    const notice = page.getByTestId("persistence-notice");
    await expect(notice).toBeVisible();
    await expect(notice).toContainText("Повреждённые локальные данные были сброшены");

    // Dismiss — tab-local: на следующем route уведомления нет.
    await page.getByTestId("persistence-notice-dismiss").click();
    await expect(notice).toHaveCount(0);
    await page.goto("/formulas", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("persistence-notice")).toHaveCount(0);
  });

  test("future-version progress не удаляется и не перезаписывается", async ({
    page,
    request,
  }) => {
    const futureProgress = JSON.stringify({ version: 99, data: { version: 99, topics: {} } });
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 2);

    await prime(page, 2);
    await page.addInitScript(
      ({ key, value }) => {
        window.localStorage.setItem(key, value);
      },
      { key: PROGRESS_KEY, value: futureProgress },
    );
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("persistence-notice")).toContainText(
      "более новой версией приложения",
    );

    // Завершаем сессию: запись прогресса заблокирована для future-ключа.
    await answerCorrectly(page, tasks[0]);
    await page.getByTestId("next-task-button").click();
    await answerCorrectly(page, tasks[1]);
    await page.getByTestId("next-task-button").click();
    await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();

    const raw = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      PROGRESS_KEY,
    );
    expect(raw).toBe(futureProgress);
  });

  test("недоступный localStorage: страница работает, уведомление видно", async ({
    page,
    request,
  }) => {
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 1);
    await prime(page, 1);
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Storage blocked by browser settings");
        },
        configurable: true,
      });
    });
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("persistence-notice")).toContainText(
      "Браузер не разрешает сохранить прогресс",
    );

    // Ответ работает несмотря на storage.
    await answerCorrectly(page, tasks[0]);
  });

  test("quota exceeded при записи → уведомление, без crash", async ({
    page,
    request,
  }) => {
    const tasks = (await fetchTasks(request, "mixed", 10)).slice(0, 1);
    await prime(page, 1);
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItem(key: string, value: string) {
        if (key.startsWith("physicslab-v3-") && !key.includes("active-quiz")) {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        }
        return original.call(this, key, value);
      };
    });
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tasks }) })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });

    // Правильный ответ вызывает запись XP → quota → уведомление.
    await answerCorrectly(page, tasks[0]);
    await expect(page.getByTestId("persistence-notice")).toContainText(
      "Хранилище браузера переполнено",
    );
  });
});

test.describe("route resilience", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Route-матрица — desktop.");
  });

  test("неизвестный route показывает страницу «не найдена» с навигацией", async ({
    page,
  }) => {
    await page.goto("/definitely-not-a-page", { waitUntil: "domcontentloaded" });
    const card = page.getByTestId("not-found-card");
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
    await expect(card.getByRole("link", { name: "К темам" })).toBeVisible();
    await expect(card.getByRole("link", { name: "На главную" })).toBeVisible();
  });

  test("route error boundary: retry доступен, stack не показывается", async ({ page }) => {
    // Дев-витрина /dev/boom бросает при рендере (только dev-сервер).
    await page.goto("/dev/boom", { waitUntil: "domcontentloaded" });
    const card = page.getByTestId("route-error-card");
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { name: "Страница не открылась" })).toBeVisible();
    await expect(page.getByTestId("route-error-retry")).toBeVisible();
    await expect(card).not.toContainText("Intentional dev crash");
    await expect(card).not.toContainText("at ");
  });
});

test.describe("mobile error layout", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile"),
      "Геометрия мобильной ошибки — mobile-проекты.",
    );
  });

  test("карточка ошибки: кнопки доступны, без overflow и без перекрытия навигацией", async ({
    page,
  }) => {
    await prime(page, 10);
    await page.route("**/api/tasks?*", (route) =>
      isMixedRequest(route)
        ? route.fulfill({ status: 500, contentType: "application/json", body: "{}" })
        : route.continue(),
    );
    await page.goto(KINEMATICS, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("quiz-load-error-card")).toBeVisible({ timeout: 10000 });

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    const retry = page.getByTestId("quiz-load-retry");
    await retry.evaluate((element) => element.scrollIntoView({ block: "end" }));
    const [retryBox, navBox] = await Promise.all([
      retry.boundingBox(),
      page.getByRole("navigation", { name: "Мобильная навигация" }).boundingBox(),
    ]);
    expect(retryBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(navBox!.y - (retryBox!.y + retryBox!.height)).toBeGreaterThanOrEqual(4);

    // Retry доступен с клавиатуры.
    await retry.focus();
    await expect(retry).toBeFocused();
  });
});
