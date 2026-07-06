import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Доступность: axe-прогон ключевых страниц. Порог — ноль нарушений
// с impact serious/critical (minor/moderate не блокируют, но видны
// в выводе при падении). Запускается во всех viewport-проектах
// playwright.config.ts, так что desktop и mobile покрыты одним спеком.

const routes = [
  "/",
  "/topics",
  "/profile",
  "/mistakes",
  "/formulas",
  "/practice/kinematics-demo",
  "/practice/exam-demo",
] as const;

for (const route of routes) {
  test(`@a11y ${route}: без serious/critical нарушений`, async ({ page }) => {
    // Скан посреди анимации появления видит полупрозрачный текст и даёт
    // ложный провал контраста (ловилось на холодном лендинге). Просим
    // reduced-motion и дополнительно замораживаем CSS-анимации.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({
      content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
    });
    await expect(page.getByRole("main")).toBeVisible();
    // KaTeX и весь клиентский контент должны догрузиться до скана.
    await page.waitForLoadState("networkidle");

    // Reveal-секции (framer-motion, whileInView once) стоят в opacity:0,
    // пока не попадут во viewport, и анимируются инлайн-стилями — CSS-
    // заморозка их не берёт. Прокатываем страницу до низа (триггерим все
    // once-анимации), возвращаемся и ждём, пока непрозрачность дойдёт до 1.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
    await page
      .waitForFunction(
        () =>
          [...document.querySelectorAll<HTMLElement>('main [style*="opacity"]')].every(
            (element) => Number(getComputedStyle(element).opacity) >= 0.99,
          ),
        undefined,
        { timeout: 5000 },
      )
      .catch(() => {
        // Если какой-то блок так и не доанимировался — сканируем как есть:
        // axe упадёт с конкретикой, а не молча.
      });

    const results = await new AxeBuilder({ page })
      // Канвас звёздного фона — декорация с aria-hidden; axe иногда
      // спотыкается о его наложение на текст при вычислении контраста.
      .exclude("canvas")
      .analyze();

    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );

    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 120)),
      })),
    ).toEqual([]);
  });
}
