import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

// Оптика: детерминированные сценарии на реальных сгенерированных задачах.
// Набор задач берётся прямым запросом к /api/tasks и подставляется в
// optics-mixed через route-фикстуру — без случайного кликанья.

type ApiTask = {
  id: string;
  type: "single_choice" | "numeric_input";
  blueprint: string;
  text: string;
  answer: unknown;
  options?: { id: string; text: string; correct?: boolean }[];
  diagram?: { kind: string; spec: { scene?: string } } | null;
};

type NumericAnswer = { value: number; unit: string };

async function fetchTemplate(
  request: APIRequestContext,
  template: string,
  count = 1,
  batch = 0,
): Promise<ApiTask[]> {
  const response = await request.get(
    `/api/tasks?template=${template}&count=${count}&batch=${batch}`,
  );
  expect(response.ok(), `${template} API`).toBe(true);
  const payload = (await response.json()) as { tasks: ApiTask[] };
  expect(payload.tasks).toHaveLength(count);
  return payload.tasks;
}

async function mountOpticsTasks(page: Page, tasks: ApiTask[]) {
  await page.addInitScript((count) => {
    window.__physlabQuizExpectedCount = count;
  }, tasks.length);
  await page.route("**/api/tasks?*", async (route) => {
    const template = new URL(route.request().url()).searchParams.get("template");
    if (template !== "optics-mixed") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ tasks }),
    });
  });

  await page.goto("/practice/optics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
}

async function clickCorrectOption(page: Page, task: ApiTask) {
  const optionIndex = task.options?.findIndex((candidate) => candidate.correct) ?? -1;
  expect(optionIndex, `${task.blueprint}: есть правильный вариант`).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(optionIndex).click();
}

function commaOf(value: number) {
  return String(value).replace(".", ",");
}

test.describe("optics desktop flows", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Функциональные сценарии — на desktop.");
  });

  test("оптика открывается с /topics", async ({ page }) => {
    await page.goto("/topics", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Оптика", exact: true })).toBeVisible();
    const sidebar = page.getByRole("navigation", { name: "Разделы PhysicsLab" });
    await expect(sidebar.getByRole("link")).toHaveCount(5);
    await expect(sidebar.getByRole("link", { name: "Оптика", exact: true })).toHaveCount(0);

    const opticsLinks = page.locator('a[href="/practice/optics-demo"]');
    await expect(opticsLinks).toHaveCount(1);
    await opticsLinks.click();

    await expect(page).toHaveURL(/\/practice\/optics-demo/);
    await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
  });

  test("отражение: луч-решение появляется только после ответа", async ({ page, request }) => {
    const tasks = await fetchTemplate(request, "reflection-angle");
    await mountOpticsTasks(page, tasks);

    const diagram = page.getByTestId("optics-diagram");
    await expect(diagram).toBeVisible();
    await expect(diagram).toHaveAttribute("data-scene", "reflection");
    // До ответа отражённого луча нет ни в DOM, ни в a11y-дереве.
    await expect(page.getByTestId("optics-solution")).toHaveCount(0);

    await clickCorrectOption(page, tasks[0]);

    await expect(page.getByTestId("optics-solution")).toBeVisible();
    await expect(diagram).toHaveAttribute("data-solution", "true");
  });

  test("плоское зеркало: мнимое изображение появляется после submit", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "plane-mirror-separation");
    await mountOpticsTasks(page, tasks);

    await expect(page.getByTestId("optics-diagram")).toHaveAttribute(
      "data-scene",
      "plane_mirror",
    );
    await expect(page.getByTestId("optics-solution")).toHaveCount(0);
    await expect(page.getByText("изображение", { exact: true })).toHaveCount(0);

    const answer = tasks[0].answer as NumericAnswer;
    await page.getByTestId("numeric-answer-input").fill(String(answer.value));
    await page.getByTestId("numeric-submit").click();

    await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
    await expect(page.getByTestId("optics-solution")).toBeVisible();
    await expect(page.getByText("изображение", { exact: true })).toBeVisible();
  });

  test("преломление: диаграмма с углами и разбор с формулой", async ({ page, request }) => {
    const tasks = await fetchTemplate(request, "snell-index-ratio");
    await mountOpticsTasks(page, tasks);

    const diagram = page.getByTestId("optics-diagram");
    await expect(diagram).toHaveAttribute("data-scene", "refraction");
    // Оба угла даны по условию и подписаны на диаграмме.
    const spec = tasks[0].diagram!.spec as { incidenceAngleDeg: number; refractionAngleDeg: number };
    await expect(
      diagram.getByText(`${spec.incidenceAngleDeg}°`, { exact: true }),
    ).toBeVisible();
    await expect(
      diagram.getByText(`${spec.refractionAngleDeg}°`, { exact: true }),
    ).toBeVisible();

    await clickCorrectOption(page, tasks[0]);

    await page.getByTestId("solution-toggle").click();
    await expect(page.getByTestId("solution-content")).toBeVisible();
    await expect(page.getByTestId("solution-formula")).toHaveCount(0);
  });

  test("тонкая линза: F и 2F видны, изображение и лучи — после ответа", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "thin-lens-image-distance");
    await mountOpticsTasks(page, tasks);

    const diagram = page.getByTestId("optics-diagram");
    await expect(diagram).toHaveAttribute("data-scene", "thin_lens");
    await expect(diagram.getByText("F", { exact: true }).first()).toBeVisible();
    await expect(diagram.getByText("2F", { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId("optics-solution")).toHaveCount(0);

    const answer = tasks[0].answer as NumericAnswer;
    await page.getByTestId("numeric-answer-input").fill(commaOf(answer.value));
    await page.getByTestId("numeric-submit").click();

    await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
    await expect(page.getByTestId("optics-solution")).toBeVisible();
  });

  test("оптическая сила: числовой ввод с суффиксом дптр", async ({ page, request }) => {
    const tasks = await fetchTemplate(request, "lens-optical-power");
    await mountOpticsTasks(page, tasks);

    await expect(page.getByTestId("numeric-answer-unit")).toHaveText("дптр");
    const answer = tasks[0].answer as NumericAnswer;
    const input = page.getByTestId("numeric-answer-input");
    await input.fill(commaOf(answer.value));
    await input.press("Enter");

    await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
  });

  test("показатель преломления: безразмерный ввод без пустой единицы", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "refractive-index-speed");
    await mountOpticsTasks(page, tasks);

    const input = page.getByTestId("numeric-answer-input");
    await expect(input).toHaveAttribute("aria-label", "Ответ (число без единиц)");
    await expect(page.getByTestId("numeric-answer-unit")).toHaveCount(0);

    const answer = tasks[0].answer as NumericAnswer;
    await input.fill(commaOf(answer.value));
    await page.getByTestId("numeric-submit").click();
    await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
  });

  test("высота изображения: перевёрнутое изображение только после ответа", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "lens-image-height");
    await mountOpticsTasks(page, tasks);

    await expect(page.getByTestId("optics-diagram")).toHaveAttribute("data-scene", "thin_lens");
    await expect(page.getByTestId("optics-solution")).toHaveCount(0);

    await clickCorrectOption(page, tasks[0]);

    await expect(page.getByTestId("optics-solution")).toBeVisible();
    await expect(page.getByText("изображение", { exact: true })).toBeVisible();
  });

  test("таргет-справка открывает нужный оптический раздел", async ({ page, request }) => {
    const tasks = await fetchTemplate(request, "reflection-angle");
    await mountOpticsTasks(page, tasks);
    await page.waitForLoadState("networkidle");

    await page.getByTestId("practice-open-help").click();
    const drawer = page.getByTestId("topic-theory-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-state", "open");
    await expect(drawer).toHaveAttribute("data-active-section", "reflection");
    await expect(drawer.getByTestId("compact-help-formula")).toHaveAttribute(
      "data-help-card-formula",
      "\\beta=\\alpha",
    );
  });

  test("смешанная тренировка содержит 2 задачи оптики из 10", async ({ request }) => {
    const tasks = await fetchTemplate(request, "exam", 10, 2);
    const opticsBlueprints = new Set([
      "reflection-angle",
      "plane-mirror-separation",
      "refractive-index-speed",
      "snell-index-ratio",
      "thin-lens-image-distance",
      "lens-optical-power",
      "lens-image-height",
    ]);
    const opticsCount = tasks.filter((task) => opticsBlueprints.has(task.blueprint)).length;
    expect(opticsCount).toBe(2);
  });

  test("итог сессии записывает прогресс оптики и переживает перезагрузку", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "reflection-angle", 2, 1);
    await mountOpticsTasks(page, tasks);

    for (const task of tasks) {
      await clickCorrectOption(page, task);
      await page.getByTestId("next-task-button").click();
    }

    await expect(page.getByText("Итог тренировки")).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText(
        "Ты уверенно работаешь с отражением, преломлением и собирающей линзой.",
        { exact: true },
      ),
    ).toBeVisible();

    const stored = await page.evaluate(() =>
      window.localStorage.getItem("physicslab-v3-progress-v1"),
    );
    expect(stored, "прогресс записан").toBeTruthy();
    const parsed = JSON.parse(stored!) as {
      version: number;
      data: { version: number; topics: { optics: { completedSessions: number; solved: number } } };
    };
    expect(parsed.version).toBe(3);
    expect(parsed.data.topics.optics.completedSessions).toBe(1);
    expect(parsed.data.topics.optics.solved).toBe(2);

    // Перезагрузка не теряет прогресс оптики.
    await page.unroute("**/api/tasks?*");
    await page.goto("/topics", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const after = await page.evaluate(() =>
      window.localStorage.getItem("physicslab-v3-progress-v1"),
    );
    const afterParsed = JSON.parse(after!) as typeof parsed;
    expect(afterParsed.data.topics.optics.completedSessions).toBe(1);
  });

  test("v2-хранилище мигрирует в v3, не теряя старые темы", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      const v2 = {
        version: 2,
        data: {
          version: 2,
          topics: {
            kinematics: {
              solved: 12,
              correct: 9,
              completedSessions: 3,
              weakTraps: { "vt-area:площадь": 1 },
              weakTrapLastSeenAt: {},
              lastPracticedAt: "2026-07-01T10:00:00.000Z",
            },
          },
        },
      };
      window.localStorage.setItem("physicslab-v3-progress-v1", JSON.stringify(v2));
    });

    await page.goto("/topics", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    // Дожидаемся write-back миграции.
    await expect(async () => {
      const raw = await page.evaluate(() =>
        window.localStorage.getItem("physicslab-v3-progress-v1"),
      );
      const parsed = JSON.parse(raw!) as {
        version: number;
        data: { topics: { kinematics: { solved: number }; optics: { solved: number } } };
      };
      expect(parsed.version).toBe(3);
      expect(parsed.data.topics.kinematics.solved).toBe(12);
      expect(parsed.data.topics.optics.solved).toBe(0);
    }).toPass({ timeout: 10000 });
  });
});

test.describe("optics mobile layout", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile"),
      "Геометрия мобильной раскладки — только на mobile-проектах.",
    );
  });

  test("диаграмма и ответ без переполнения, контролы выше нижней навигации", async ({
    page,
    request,
  }) => {
    const tasks = await fetchTemplate(request, "thin-lens-image-distance");
    await mountOpticsTasks(page, tasks);

    await expect(page.getByTestId("optics-diagram")).toBeVisible();

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Сабмит-контрол можно доскроллить выше фиксированной нижней навигации.
    const submit = page.getByTestId("numeric-submit");
    await submit.evaluate((element) => element.scrollIntoView({ block: "end" }));
    const [submitBox, navBox] = await Promise.all([
      submit.boundingBox(),
      page
        .getByRole("navigation", { name: "Мобильная навигация" })
        .boundingBox(),
    ]);
    expect(submitBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(navBox!.y - (submitBox!.y + submitBox!.height)).toBeGreaterThanOrEqual(4);

    const answer = tasks[0].answer as NumericAnswer;
    await page
      .getByTestId("numeric-answer-input")
      .fill(commaOf(answer.value + Math.max(10, Math.abs(answer.value))));
    await page.getByTestId("numeric-submit").click();

    await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "wrong");
    await expect(page.getByTestId("solution-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByTestId("optics-solution")).toBeVisible();

    const next = page.getByTestId("next-task-button");
    await next.evaluate((element) => element.scrollIntoView({ block: "end" }));
    const [nextBox, nextNavBox] = await Promise.all([
      next.boundingBox(),
      page
        .getByRole("navigation", { name: "Мобильная навигация" })
        .boundingBox(),
    ]);
    expect(nextBox).not.toBeNull();
    expect(nextNavBox).not.toBeNull();
    expect(nextNavBox!.y - (nextBox!.y + nextBox!.height)).toBeGreaterThanOrEqual(4);

    await page.getByTestId("solution-toggle").click();
    await expect(page.getByTestId("solution-content")).toBeVisible();
    await expect(page.getByTestId("solution-formula")).toHaveCount(0);
    await next.evaluate((element) => element.scrollIntoView({ block: "end" }));
    const [expandedNextBox, expandedNavBox] = await Promise.all([
      next.boundingBox(),
      page
        .getByRole("navigation", { name: "Мобильная навигация" })
        .boundingBox(),
    ]);
    expect(expandedNextBox).not.toBeNull();
    expect(expandedNavBox).not.toBeNull();
    expect(
      expandedNavBox!.y - (expandedNextBox!.y + expandedNextBox!.height),
    ).toBeGreaterThanOrEqual(4);

    const expandedDimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(expandedDimensions.scrollWidth).toBeLessThanOrEqual(
      expandedDimensions.clientWidth + 1,
    );
  });
});
