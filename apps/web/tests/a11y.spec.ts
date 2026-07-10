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
  "/practice/optics-demo",
  "/practice/exam-demo",
] as const;

async function scanForBlockingViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).exclude("canvas").analyze();
  return results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
}

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

    const blocking = await scanForBlockingViolations(page);

    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 120)),
      })),
    ).toEqual([]);
  });
}

// Карточка разбора после ответа — новая поверхность и отдельный класс
// контраста (Nova-заголовок, свёрнутый разбор). Сканируем её обе ветки.
test("@a11y карточка разбора после ошибки — без serious/critical", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const taskResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === "/api/tasks" && url.searchParams.get("template") === "mixed";
  });

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  const payload = (await (await taskResponse).json()) as {
    tasks: { options: { correct?: boolean; text: string }[] }[];
  };

  // Тяжёлый desktop-shell гидратируется дольше: клик сразу после появления
  // вариантов может опередить навешивание обработчика. Ждём готовности и
  // ретраим ответ, пока не появится карточка разбора.
  await page.waitForLoadState("networkidle");
  const options = page.getByRole("list", { name: "Варианты ответа" });
  await expect(options).toBeVisible();
  const wrongAnswer = payload.tasks[0]?.options.find((option) => !option.correct);
  expect(wrongAnswer, "generated kinematics task must expose a wrong option").toBeDefined();
  const wrongOption = options
    .getByRole("button")
    .filter({ hasText: wrongAnswer!.text });
  await expect(async () => {
    await wrongOption.click();
    // Compact-first: на ошибке полное решение закрыто, пока ученик его не попросит.
    await expect(page.getByRole("button", { name: "Показать решение" })).toBeVisible({
      timeout: 2000,
    });
  }).toPass({ timeout: 15000 });
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);

  await page.getByRole("button", { name: "Показать решение" }).click();
  await expect(page.getByTestId("solution-formula")).toBeVisible();

  const blocking = await scanForBlockingViolations(page);
  expect(
    blocking.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 120)),
    })),
  ).toEqual([]);
});

// Числовой ввод — новая интерактивная поверхность: у поля должно быть имя,
// единица понятна SR, статус верно/неверно не только цветом. Сканируем поле
// до ответа и карточку разбора после ответа.
test("@a11y числовой ввод и его разбор — без serious/critical", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await request.get(
    "/api/tasks?template=average-speed-segments&count=1&batch=0",
  );
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as {
    tasks: {
      type: "numeric_input";
      answer: { value: number; unit: string };
    }[];
  };

  await page.route("**/api/tasks?*", async (route) => {
    const template = new URL(route.request().url()).searchParams.get("template");
    if (template !== "mixed") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const input = page.getByTestId("numeric-answer-input");
  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute(
    "aria-label",
    `Ответ в единицах: ${payload.tasks[0].answer.unit}`,
  );

  const beforeSubmit = await scanForBlockingViolations(page);
  expect(beforeSubmit.map((violation) => violation.id)).toEqual([]);

  const answer = payload.tasks[0].answer;
  await input.fill(String(answer.value).replace(".", ","));
  await page.getByTestId("numeric-submit").click();
  await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
  await expect(page.getByTestId("numeric-answer")).toContainText("Верно");
  await expect(page.locator('[role="status"]')).toHaveCount(1);
  await expect(page.getByTestId("next-task-button")).toBeFocused();

  const afterSubmit = await scanForBlockingViolations(page);
  expect(
    afterSubmit.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 120)),
    })),
  ).toEqual([]);
});

// Оптическая диаграмма — новая визуальная поверхность: сканируем prompt-
// и solution-состояния. До ответа решения нет в accessibility tree.
test("@a11y оптическая диаграмма до и после ответа — без serious/critical", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await request.get("/api/tasks?template=reflection-angle&count=1&batch=0");
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as {
    tasks: { options: { text: string; correct?: boolean }[] }[];
  };

  await page.route("**/api/tasks?*", async (route) => {
    const template = new URL(route.request().url()).searchParams.get("template");
    if (template !== "optics-mixed") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.goto("/practice/optics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await expect(page.getByTestId("optics-diagram")).toBeVisible();
  // SVG имеет доступное имя (title + desc) и не выдаёт решение до ответа.
  await expect(page.getByRole("img", { name: /зеркал/i })).toBeVisible();
  await expect(page.getByTestId("optics-solution")).toHaveCount(0);

  const beforeSubmit = await scanForBlockingViolations(page);
  expect(beforeSubmit.map((violation) => violation.id)).toEqual([]);

  const correctIndex = payload.tasks[0].options.findIndex((option) => option.correct);
  expect(correctIndex).toBeGreaterThanOrEqual(0);
  await page.locator(".quiz-option").nth(correctIndex).click();
  await expect(page.getByTestId("optics-solution")).toBeVisible();

  const afterSubmit = await scanForBlockingViolations(page);
  expect(
    afterSubmit.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 120)),
    })),
  ).toEqual([]);
});

test("@a11y безразмерный числовой ответ оптики — без пустой единицы", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await request.get(
    "/api/tasks?template=refractive-index-speed&count=1&batch=0",
  );
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as {
    tasks: { answer: { value: number; unit: string } }[];
  };

  await page.route("**/api/tasks?*", async (route) => {
    const template = new URL(route.request().url()).searchParams.get("template");
    if (template !== "optics-mixed") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.goto("/practice/optics-demo", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const input = page.getByTestId("numeric-answer-input");
  await expect(input).toHaveAttribute("aria-label", "Ответ (число без единиц)");
  await expect(page.getByTestId("numeric-answer-unit")).toHaveCount(0);
  expect((await scanForBlockingViolations(page)).map((violation) => violation.id)).toEqual([]);

  await input.fill(String(payload.tasks[0].answer.value).replace(".", ","));
  await page.getByTestId("numeric-submit").click();
  await expect(page.getByTestId("numeric-answer")).toHaveAttribute("data-state", "correct");
  await expect(page.getByTestId("numeric-correct-answer")).toHaveText(
    `Правильный ответ: ${String(payload.tasks[0].answer.value).replace(".", ",")}`,
  );
  expect((await scanForBlockingViolations(page)).map((violation) => violation.id)).toEqual([]);
});
