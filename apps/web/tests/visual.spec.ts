import { expect, test, type Locator } from "@playwright/test";

// Визуальный базлайн из двух слоёв:
//
// 1) Layout-assertions — детерминированные проверки геометрии, работают
//    на любой платформе (и в CI на linux): нет горизонтального скролла,
//    main в пределах viewport, на мобиле нижняя навигация видима и
//    прижата к низу. Ловят сломанную вёрстку без пиксельного сравнения.
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

    // На мобиле нижняя навигация видима и прижата к нижней кромке.
    if (testInfo.project.name.startsWith("mobile")) {
      const mobileNav = page.getByRole("navigation", { name: "Мобильная навигация" });
      await expect(mobileNav).toBeVisible();
      const navBox = await mobileNav.boundingBox();
      expect(navBox).not.toBeNull();
      // Роль navigation — на <nav> внутри fixed-контейнера с py-2:
      // допускаем паддинг контейнера (12px), но не «уплывшую» панель.
      expect(navBox!.y + navBox!.height).toBeGreaterThanOrEqual(viewport.height - 12);

      if (route.name === "home") {
        const warmupHeading = page.getByRole("heading", {
          name: "Проверь себя на графике скорости",
        });
        const warmupBox = await warmupHeading.boundingBox();
        expect(warmupBox, "next working section must be rendered").not.toBeNull();
        expect(
          warmupBox!.y,
          "mobile home must hint at the warm-up task above the fixed nav",
        ).toBeLessThan(navBox!.y);
      }

      if (route.name === "formulas") {
        const rowMetrics = await page.locator(".formula-row button").evaluateAll(
          (rows) =>
            rows.map((row) => ({
              clientWidth: row.clientWidth,
              scrollWidth: row.scrollWidth,
            })),
        );
        expect(rowMetrics.length).toBeGreaterThan(20);
        expect(
          rowMetrics.filter(
            ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth + 1,
          ),
          "formula rows must not overflow horizontally on mobile",
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

async function expectScrollableAboveMobileNav(
  control: Locator,
  mobileNavContainer: Locator,
) {
  await control.evaluate((element) =>
    element.scrollIntoView({ block: "end" }),
  );

  const [controlBox, navBox] = await Promise.all([
    control.boundingBox(),
    mobileNavContainer.boundingBox(),
  ]);

  expect(
    controlBox,
    "interactive control must have a bounding box",
  ).not.toBeNull();
  expect(
    navBox,
    "fixed mobile navigation must have a bounding box",
  ).not.toBeNull();
  expect(
    navBox!.y - (controlBox!.y + controlBox!.height),
    "interactive control must clear the fixed mobile navigation after scrollIntoView",
  ).toBeGreaterThanOrEqual(8);
}

test("@visual mobile practice controls clear the fixed bottom navigation", async (
  { page },
  testInfo,
) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "This assertion exercises the fixed mobile navigation.",
  );

  await page.goto("/practice/kinematics-demo", {
    waitUntil: "domcontentloaded",
  });

  const mobileNav = page.getByRole("navigation", {
    name: "Мобильная навигация",
  });
  const mobileNavContainer = mobileNav.locator("xpath=..");
  const options = page
    .getByRole("list", { name: "Варианты ответа" })
    .getByRole("button");

  await expect(mobileNav).toBeVisible();
  await expect(options).toHaveCount(4);
  await expectScrollableAboveMobileNav(options.last(), mobileNavContainer);

  await options.last().click();
  await expect(page.getByText("Не совсем", { exact: true })).toBeVisible();
  await expect(page.getByTestId("solution-toggle")).toBeVisible();

  const nextTaskButton = page.getByTestId("next-task-button");
  await expect(nextTaskButton).toBeVisible();
  await expectScrollableAboveMobileNav(nextTaskButton, mobileNavContainer);

  await page.getByTestId("solution-toggle").click();
  await expect(
    page.getByRole("button", { name: "Свернуть решение" }),
  ).toBeVisible();
  await expectScrollableAboveMobileNav(nextTaskButton, mobileNavContainer);
});

// Стабильные hardening-состояния: карточка ошибки загрузки (детерминированный
// мок 500). Layout-слой — на всех платформах; пиксельные снапшоты — только
// при VISUAL_SNAPSHOTS=1 на снапшот-проектах.
test("@visual exam resume gate: layout is stable", async ({ page }, testInfo) => {
  await page.goto("/practice/exam-demo", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Начать тренировку" }).click();
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
    const freshButton = candidate.getByRole("button", { name: "Начать новый вариант" });
    await freshButton.scrollIntoViewIfNeeded();
    const [buttonBox, navBox] = await Promise.all([
      freshButton.boundingBox(),
      page.getByRole("navigation", { name: "Мобильная навигация" }).boundingBox(),
    ]);
    expect(buttonBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(navBox!.y - (buttonBox!.y + buttonBox!.height)).toBeGreaterThanOrEqual(8);
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
    new URL(route.request().url()).searchParams.get("template") === "mixed"
      ? route.fulfill({ status: 500, contentType: "application/json", body: "{}" })
      : route.continue(),
  );
  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
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
