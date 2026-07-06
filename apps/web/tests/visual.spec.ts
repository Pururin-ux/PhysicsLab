import { expect, test } from "@playwright/test";

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
  { name: "formulas", path: "/formulas" },
  { name: "practice-kinematics", path: "/practice/kinematics-demo" },
  { name: "practice-exam", path: "/practice/exam-demo" },
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
    }

    if (withSnapshots && SNAPSHOT_PROJECTS.includes(testInfo.project.name)) {
      await expect(main).toHaveScreenshot(`${route.name}.png`, {
        animations: "disabled",
        // Канвас звёзд рандомен по построению; маскируем и его, и
        // фоновое свечение темы.
        mask: [page.locator("canvas")],
        maxDiffPixelRatio: 0.02,
      });
    }
  });
}
