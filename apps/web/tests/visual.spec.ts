import {
  expect,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
} from "@playwright/test";

// Визуальный базлайн из двух слоёв:
//
// 1) Layout-assertions — детерминированные проверки геометрии, работают
//    на любой платформе (и в CI на linux): нет горизонтального скролла,
//    main в пределах viewport, на мобиле липкая шапка остаётся целой и
//    не перекрывает содержимое. Ловят сломанную вёрстку без пиксельного сравнения.
//
// 2) Пиксельные снапшоты main-региона — только при VISUAL_SNAPSHOTS=1:
//    рендеринг шрифтов платформозависим, базлайны в репо сняты на
//    win32; linux-базлайны добавляются из CI-артефакта отдельным
//    коммитом (см. docs/wave-a-deferred.md). Скриншотим main, а не
//    full-page: канвас звёзд и вьюпорт-эффекты — источники шума.

const routes = [
  { name: "home", path: "/" },
  { name: "topics", path: "/topics" },
  { name: "profile", path: "/profile" },
  { name: "mistakes", path: "/mistakes" },
  { name: "formulas", path: "/formulas" },
  { name: "tasks", path: "/tasks" },
  { name: "task-ohm-law", path: "/tasks/ohm-law" },
  { name: "practice-family-ohm-law", path: "/practice/family/ohm-law" },
  { name: "practice-kinematics", path: "/practice/kinematics-demo" },
  { name: "practice-optics", path: "/practice/optics-demo" },
  { name: "practice-exam", path: "/practice/exam-demo" },
  { name: "not-found", path: "/definitely-not-a-page" },
] as const;

// Снапшоты держим на двух конфигурациях; tablet/mobile-360 гоняют
// только layout-слой, чтобы базлайны не разрастались вчетверо.
const SNAPSHOT_PROJECTS = ["desktop", "mobile-390"];
const withSnapshots = process.env.VISUAL_SNAPSHOTS === "1";

for (const route of routes) {
  test(`@visual ${route.name}: раскладка целая`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content: "canvas { visibility: hidden !important; }",
    });

    const viewport = page.viewportSize();
    if (!viewport) {
      throw new Error("viewport не задан в проекте");
    }

    // Нет горизонтального переполнения документа.
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth, "горизонтальный скролл — сломанная вёрстка").toBeLessThanOrEqual(
      viewport.width + 1,
    );

    // main рендерит контент и не вылезает за viewport по ширине.
    const main = page.getByRole("main");
    const mainBox = await main.boundingBox();
    expect(mainBox, "main обязан иметь bounding box").not.toBeNull();
    expect(mainBox!.width).toBeGreaterThan(200);
    expect(mainBox!.height).toBeGreaterThan(200);
    expect(mainBox!.x).toBeGreaterThanOrEqual(-1);
    expect(mainBox!.x + mainBox!.width).toBeLessThanOrEqual(viewport.width + 1);

    // На мобиле первичная навигация живёт во второй строке липкой шапки.
    if (testInfo.project.name.startsWith("mobile")) {
      const mobileNav = page.getByTestId("mobile-bottom-nav");
      const header = page.locator("header").first();
      await expect(mobileNav).toBeVisible();

      const [navBox, headerBox] = await Promise.all([
        mobileNav.boundingBox(),
        header.boundingBox(),
      ]);
      expect(navBox).not.toBeNull();
      expect(headerBox).not.toBeNull();
      expect(await mobileNav.evaluate((element) => getComputedStyle(element).position)).toBe(
        "fixed",
      );
      expect(navBox!.y + navBox!.height).toBeLessThanOrEqual(viewport.height + 1);
      expect(navBox!.y).toBeGreaterThan(headerBox!.y + headerBox!.height);

      if (route.name === "home") {
        expect(await header.evaluate((element) => getComputedStyle(element).position)).toBe(
          "absolute",
        );
        const titleBox = await page.getByRole("heading", { level: 1 }).boundingBox();
        expect(titleBox, "home title must be rendered").not.toBeNull();
        expect(titleBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
      } else {
        expect(await header.evaluate((element) => getComputedStyle(element).position)).toBe(
          "sticky",
        );
      }

      if (route.name === "formulas") {
        const entryMetrics = await page.locator("[data-formula-id]").evaluateAll(
          (entries) =>
            entries.map((entry) => ({
              clientWidth: entry.clientWidth,
              scrollWidth: entry.scrollWidth,
            })),
        );
        expect(entryMetrics).toHaveLength(40);
        expect(
          entryMetrics.filter(
            ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth + 1,
          ),
          "formula entries must not overflow horizontally on mobile",
        ).toEqual([]);
      }
    }

    if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
      await expect(main).toHaveScreenshot(`${route.name}.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    }
  });
}

type VisualPracticeTask = {
  type: "single_choice" | "numeric_input";
  options?: { correct?: boolean }[];
  answer: { value?: number; unit?: string };
};

async function useDeterministicPracticeBatch(
  page: Page,
  request: APIRequestContext,
  template: string,
) {
  const response = await request.get(`/api/tasks?template=${template}&count=5&batch=0`);
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as { tasks: VisualPracticeTask[] };

  await page.route("**/api/tasks?*", (route) => {
    const requestedTemplate = new URL(route.request().url()).searchParams.get("template");
    return requestedTemplate === template
      ? route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(payload),
        })
      : route.continue();
  });

  return payload;
}

async function prepareVisualSurface(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: "canvas { visibility: hidden !important; }",
  });
}

async function expectPracticeSnapshot(surface: Locator, name: string) {
  if (!withSnapshots) return;
  await expect(surface).toHaveScreenshot(name, {
    animations: "disabled",
    maxDiffPixelRatio: 0.02,
  });
}

test("@visual simplified navigation shell is stable", async ({ page }, testInfo) => {
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  await prepareVisualSurface(page);

  const viewport = page.viewportSize()!;
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    viewport.width + 1,
  );

  if (testInfo.project.name === "desktop") {
    await expect(page.getByTestId("desktop-sidebar-nav").getByRole("link")).toHaveCount(5);
  } else if (testInfo.project.name === "tablet") {
    await expect(page.getByTestId("tablet-quick-actions").getByRole("link")).toHaveCount(4);
  } else {
    const navigation = page.getByTestId("mobile-bottom-nav");
    await expect(navigation.locator(":scope > a")).toHaveCount(5);
    await expect(
      navigation.getByRole("link", { name: "Задачи", exact: true }),
    ).toBeVisible();
  }

  if (
    withSnapshots &&
    ["desktop", "tablet", "mobile-390"].includes(testInfo.project.name)
  ) {
    await expect(page).toHaveScreenshot("navigation-shell.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});

test("@visual compact wrong-answer hierarchy and contextual help are stable", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    !SNAPSHOT_PROJECTS.includes(testInfo.project.name),
    "Practice state baselines are kept for desktop and mobile-390.",
  );
  const payload = await useDeterministicPracticeBatch(page, request, "ohm-law");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await prepareVisualSurface(page);

  const surface = page.getByTestId("practice-with-help");
  await expectPracticeSnapshot(surface, "practice-before-answer.png");

  const wrongIndex = payload.tasks[0].options!.findIndex((option) => !option.correct);
  expect(wrongIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(wrongIndex).click();
  await expect(page.getByTestId("answer-feedback")).toHaveAttribute("data-state", "wrong");
  await expectPracticeSnapshot(surface, "practice-wrong-collapsed.png");

  await page.getByTestId("solution-toggle").click();
  await expect(page.getByTestId("solution-content")).toBeVisible();
  await expectPracticeSnapshot(surface, "practice-wrong-expanded.png");

  await page.getByTestId("solution-toggle").click();
  await expect(page.getByTestId("solution-content")).toHaveCount(0);
  await page.getByTestId("help-target-button").click();
  await expect(page.getByTestId("topic-theory-drawer")).toBeVisible();
  await expectPracticeSnapshot(surface, "practice-help-open.png");
});

test("@visual correct and restored answer hierarchy is stable", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    !SNAPSHOT_PROJECTS.includes(testInfo.project.name),
    "Practice state baselines are kept for desktop and mobile-390.",
  );
  const payload = await useDeterministicPracticeBatch(page, request, "ohm-law");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await prepareVisualSurface(page);

  const correctIndex = payload.tasks[0].options!.findIndex((option) => option.correct);
  expect(correctIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(correctIndex).click();
  await expect(page.getByTestId("answer-feedback")).toHaveAttribute("data-state", "correct");
  await expectPracticeSnapshot(
    page.getByTestId("practice-with-help"),
    "practice-correct.png",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  await prepareVisualSurface(page);
  await expect(page.getByTestId("session-restored-notice")).toBeVisible();
  await expect(page.getByTestId("solution-toggle")).toHaveAttribute("aria-expanded", "false");
  await expectPracticeSnapshot(
    page.getByTestId("practice-with-help"),
    "practice-answered-restored.png",
  );
});

test("@visual numeric feedback hierarchy is stable", async ({ page, request }, testInfo) => {
  test.skip(
    !SNAPSHOT_PROJECTS.includes(testInfo.project.name),
    "Numeric state baselines are kept for desktop and mobile-390.",
  );
  const payload = await useDeterministicPracticeBatch(
    page,
    request,
    "average-speed-segments",
  );
  await page.goto("/practice/family/average-speed-segments", {
    waitUntil: "domcontentloaded",
  });
  await prepareVisualSurface(page);

  const expected = payload.tasks[0].answer.value;
  expect(typeof expected).toBe("number");
  await page.getByTestId("numeric-answer-input").fill(String(expected).replace(".", ","));
  await page.getByTestId("numeric-submit").click();
  await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
  await expectPracticeSnapshot(
    page.getByTestId("practice-with-help"),
    "practice-numeric-correct.png",
  );
});

test("@visual numeric wrong-answer hierarchy is stable", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    !SNAPSHOT_PROJECTS.includes(testInfo.project.name),
    "Numeric state baselines are kept for desktop and mobile-390.",
  );
  const payload = await useDeterministicPracticeBatch(
    page,
    request,
    "average-speed-segments",
  );
  await page.goto("/practice/family/average-speed-segments", {
    waitUntil: "domcontentloaded",
  });
  await prepareVisualSurface(page);

  const expected = payload.tasks[0].answer.value;
  expect(typeof expected).toBe("number");
  await page.getByTestId("numeric-answer-input").fill(String(expected! + 1000));
  await page.getByTestId("numeric-submit").click();
  await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "wrong");
  await expect(page.getByTestId("numeric-correct-answer")).toHaveCount(1);
  await expectPracticeSnapshot(
    page.getByTestId("practice-with-help"),
    "practice-numeric-wrong.png",
  );
});

async function expectReachableBelowStickyHeader(
  control: Locator,
  header: Locator,
) {
  await control.scrollIntoViewIfNeeded();

  const [controlBox, headerBox, viewportHeight] = await Promise.all([
    control.boundingBox(),
    header.boundingBox(),
    control.evaluate(() => window.innerHeight),
  ]);

  expect(
    controlBox,
    "interactive control must have a bounding box",
  ).not.toBeNull();
  expect(
    headerBox,
    "sticky mobile header must have a bounding box",
  ).not.toBeNull();
  expect(
    controlBox!.y - (headerBox!.y + headerBox!.height),
    "interactive control must remain below the sticky mobile header",
  ).toBeGreaterThanOrEqual(0);
  expect(controlBox!.y + controlBox!.height).toBeLessThanOrEqual(viewportHeight + 1);
}

test("@visual home art keeps one reviewed source across viewports", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const scene = page.getByTestId("home-study-scene");
  await expect(scene).toHaveAttribute(
    "data-art-source",
    "/art/production/hero-night-study-ultrawide-v3.webp",
  );
  await expect(scene).toHaveAttribute("data-art-viewport-policy", "single-source-crop");

  const images = scene.locator("img");
  const baseImage = images.first();
  await baseImage.evaluate((image) => (image as HTMLImageElement).decode());

  const decodedSources = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      const source = image.currentSrc || image.getAttribute("src") || "";
      const url = new URL(source, window.location.href);
      return url.searchParams.get("url") ?? url.pathname;
    }),
  );
  expect(new Set(decodedSources)).toEqual(
    new Set(["/art/production/hero-night-study-ultrawide-v3.webp"]),
  );

  const guard = page.getByTestId("home-scene-logic-guard");
  if (testInfo.project.name.startsWith("mobile")) {
    await expect(guard).toBeHidden();
  } else {
    await expect(guard).toBeVisible();
    expect(await guard.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
      "linear-gradient",
    );
  }

  for (const selector of [".home-window-light", ".home-desk-light"]) {
    const effect = page.locator(selector);
    if (testInfo.project.name.startsWith("mobile")) {
      await expect(effect).toBeHidden();
    } else {
      const style = await effect.evaluate((element) => {
        const computed = getComputedStyle(element);
        return { background: computed.backgroundImage, clip: computed.clipPath };
      });
      expect(style.background).toContain("radial-gradient");
      expect(style.clip).toBe("none");
    }
  }
});

test("@visual home respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const animationNames = await page
    .locator(".home-study-art, .home-window-light, .home-desk-light")
    .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName));
  expect(new Set(animationNames)).toEqual(new Set(["none"]));
});

test("@visual mobile practice controls remain reachable below the sticky header", async (
  { page, request },
  testInfo,
) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "This assertion exercises the sticky mobile header.",
  );

  const payload = await useDeterministicPracticeBatch(page, request, "ohm-law");
  await page.goto("/practice/family/ohm-law", {
    waitUntil: "domcontentloaded",
  });

  const mobileNav = page.getByTestId("mobile-bottom-nav");
  const header = page.locator("header").first();
  const options = page
    .getByRole("list", { name: "Варианты ответа" })
    .getByRole("button");

  await expect(mobileNav).toBeVisible();
  await expect(options).toHaveCount(4);
  await expectReachableBelowStickyHeader(options.last(), header);

  const wrongIndex = payload.tasks[0].options!.findIndex((option) => !option.correct);
  expect(wrongIndex).toBeGreaterThanOrEqual(0);
  await options.nth(wrongIndex).click();
  await expect(page.getByText("Не совсем", { exact: true })).toBeVisible();
  await expect(page.getByTestId("solution-toggle")).toBeVisible();

  const nextTaskButton = page.getByTestId("next-task-button");
  await expect(nextTaskButton).toBeVisible();
  await expectReachableBelowStickyHeader(nextTaskButton, header);

  await page.getByTestId("solution-toggle").click();
  await expect(
    page.getByRole("button", { name: "Свернуть решение" }),
  ).toBeVisible();
  await expect(page.getByTestId("solution-content")).toBeVisible();
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);
  await expectReachableBelowStickyHeader(nextTaskButton, header);
});

test("@visual task catalog search and empty states are stable", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: "canvas { visibility: hidden !important; }",
  });
  const search = page.getByLabel("Поиск по типам задач");

  await search.fill("закон Ома");
  await expect(page.locator('[data-family="ohm-law"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );
  if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
    await expect(page.getByRole("main")).toHaveScreenshot("tasks-search-results.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }

  await search.fill("несуществующая физика xyz");
  await expect(page.getByTestId("task-catalog-empty")).toBeVisible();
  if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
    await expect(page.getByRole("main")).toHaveScreenshot("tasks-empty.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});

const referenceVisualCases = [
  { name: "reference-ohm-expanded", family: "ohm-law", expanded: true },
  { name: "reference-vt-graph", family: "vt-area", expanded: true },
  { name: "reference-lens-diagram", family: "thin-lens-image-distance", expanded: true },
  { name: "reference-numeric", family: "average-speed-segments", expanded: true },
  { name: "reference-non-pilot", family: "free-fall", expanded: false },
] as const;

for (const visualCase of referenceVisualCases) {
  test(`@visual ${visualCase.name}: task detail remains legible`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/tasks/${visualCase.family}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "canvas { visibility: hidden !important; }" });

    if (visualCase.expanded) {
      await page.locator("summary").filter({ hasText: "Показать решение" }).click();
      await expect(page.getByTestId("reference-solution-steps")).toBeVisible();
    }

    const viewport = page.viewportSize()!;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1);

    if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
      await expect(page.getByRole("main")).toHaveScreenshot(`${visualCase.name}.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    }
  });
}

test("@visual focused numeric controls remain reachable below the sticky header", async (
  { page },
  testInfo,
) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "This assertion exercises the sticky mobile header.",
  );

  await page.goto("/practice/family/average-speed-segments", {
    waitUntil: "domcontentloaded",
  });
  const header = page.locator("header").first();
  const input = page.getByTestId("numeric-answer-input");
  await input.fill("0");
  await page.getByTestId("numeric-submit").click();

  const nextTaskButton = page.getByTestId("next-task-button");
  await expect(nextTaskButton).toBeVisible();
  await expectReachableBelowStickyHeader(nextTaskButton, header);
});

type VisualChoiceTask = {
  options: { correct?: boolean }[];
};

async function answerVisualChoice(page: Page, task: VisualChoiceTask) {
  const correctIndex = task.options.findIndex((option) => option.correct);
  expect(correctIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(correctIndex).click();
}

test("@visual focused five-task summary is stable", async ({ page, request }, testInfo) => {
  test.skip(
    !SNAPSHOT_PROJECTS.includes(testInfo.project.name),
    "Summary baseline is kept for desktop and mobile-390.",
  );

  const response = await request.get("/api/tasks?template=ohm-law&count=5&batch=0");
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as { tasks: VisualChoiceTask[] };
  await page.route("**/api/tasks?*", (route) => {
    const url = new URL(route.request().url());
    return url.searchParams.get("template") === "ohm-law"
      ? route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(payload),
        })
      : route.continue();
  });

  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  for (const task of payload.tasks) {
    await answerVisualChoice(page, task);
    await page.getByTestId("next-task-button").click();
  }
  await expect(page.getByText("Итог тренировки", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );

  if (withSnapshots) {
    await expect(page.getByRole("main")).toHaveScreenshot("focused-family-summary.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});

// Стабильные hardening-состояния: карточка ошибки загрузки (детерминированный
// мок 500). Layout-слой — на всех платформах; пиксельные снапшоты — только
// при VISUAL_SNAPSHOTS=1 на снапшот-проектах.
test("@visual exam resume gate: layout is stable", async ({ page }, testInfo) => {
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Начать диагностику" }).click();
  await expect(page.getByTestId("question-card")).toBeVisible({ timeout: 15000 });
  await page.reload({ waitUntil: "domcontentloaded" });

  const candidate = page.getByTestId("exam-resume-candidate");
  await expect(candidate).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "canvas { visibility: hidden !important; }" });

  const viewport = page.viewportSize()!;
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    viewport.width + 1,
  );

  if (testInfo.project.name.startsWith("mobile")) {
    const freshButton = candidate.getByRole("button", { name: "Начать новую диагностику" });
    await freshButton.scrollIntoViewIfNeeded();
    const [buttonBox, headerBox] = await Promise.all([
      freshButton.boundingBox(),
      page.locator("header").first().boundingBox(),
    ]);
    expect(buttonBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(buttonBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
    expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(viewport.height + 1);
  }

  if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
    await expect(page.getByRole("main")).toHaveScreenshot("exam-resume-gate.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});

test("@visual карточка ошибки загрузки: раскладка целая", async ({ page }, testInfo) => {
  await page.route("**/api/tasks?*", (route) =>
    new URL(route.request().url()).searchParams.get("template") === "dynamics-mixed"
      ? route.fulfill({ status: 500, contentType: "application/json", body: "{}" })
      : route.continue(),
  );
  await page.goto("/practice/dynamics-demo", { waitUntil: "domcontentloaded" });
  const card = page.getByTestId("quiz-load-error-card");
  await expect(card).toBeVisible({ timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "canvas { visibility: hidden !important; }" });

  const viewport = page.viewportSize()!;
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1);

  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);

  if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
    await expect(page.getByRole("main")).toHaveScreenshot("quiz-load-error.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  }
});
