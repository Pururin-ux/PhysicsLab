import { expect, test, type Page } from "@playwright/test";

// На всех размерах остаются те же пять долговечных направлений. На телефоне
// они переезжают в нижнюю панель, но не меняют названия и не прячутся в «Ещё».
const durableLabels = ["Главная", "Темы", "Формулы", "Задачи", "Прогресс"] as const;

async function answerOhmWrong(page: Page) {
  const responsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === "/api/tasks" && url.searchParams.get("template") === "ohm-law";
  });
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  const payload = (await (await responsePromise).json()) as {
    tasks: { options: { correct?: boolean; text: string }[] }[];
  };
  const wrong = payload.tasks[0]?.options.find((option) => !option.correct);
  expect(wrong).toBeDefined();
  await page
    .getByRole("list", { name: "Варианты ответа" })
    .getByRole("button")
    .filter({ hasText: wrong!.text })
    .click();
}

test("desktop header exposes five durable destinations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop navigation contract.");
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });

  const navigation = page.getByTestId("desktop-sidebar-nav");
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(5);
  expect(
    (await navigation.getByRole("link").allTextContents()).map((label) => label.trim()),
  ).toEqual(durableLabels);
  // Подписи не обрезаются: пункт целиком помещается в свою кнопку.
  expect(
    await navigation.getByRole("link").evaluateAll((links) =>
      links.map((link) => link.scrollWidth <= link.clientWidth + 1),
    ),
  ).toEqual(durableLabels.map(() => true));
  await expect(navigation).not.toContainText("Кинематика");
  await expect(navigation).not.toContainText("Квантовая физика");
  await expect(navigation).not.toContainText("скоро");
  await expect(navigation).not.toContainText("XP");
  await expect(navigation).not.toContainText("Опыт");

  const progressLink = navigation.getByRole("link", { name: "Прогресс", exact: true });
  await expect(progressLink).toHaveAttribute("href", "/profile");
  await progressLink.click();
  await expect(page).toHaveURL("/profile");
  await expect(page.getByRole("heading", { name: "Твоя физика", level: 1 })).toBeVisible();
  await expect(page).toHaveTitle("Твоя физика | PhysicsLab");
});

test("mobile navigation keeps the same five destinations and practice stays under Tasks", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile navigation contract.");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible();

  const navigation = page.getByTestId("mobile-bottom-nav");
  await expect(navigation).toBeVisible();
  expect(
    (await navigation.getByRole("link").allTextContents()).map((label) => label.trim()),
  ).toEqual([...durableLabels]);

  // Тренировка по типу задач относится к постоянному пункту «Задачи».
  await expect(navigation.getByRole("link", { name: "Задачи", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(navigation.getByRole("link", { name: "Прогресс", exact: true })).toHaveAttribute(
    "href",
    "/profile",
  );
  await expect(page.locator("header").getByText("XP", { exact: true })).toHaveCount(0);
});

test("tablet quick actions remain a single four-item row", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "tablet", "Tablet navigation contract.");

  for (const width of [768, 820, 900, 1023]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/tasks", { waitUntil: "domcontentloaded" });
    const quickActions = page.getByTestId("tablet-quick-actions");
    await expect(quickActions).toBeVisible();
    await expect(quickActions.getByRole("link")).toHaveCount(4);
    await expect(page.getByTestId("mobile-bottom-nav")).toBeHidden();

    const geometry = await quickActions.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      rowCount: new Set(
        Array.from(element.querySelectorAll("a")).map((link) => link.getBoundingClientRect().top),
      ).size,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    expect(geometry.rowCount).toBe(1);
  }

  // На 1024 та же шапка продолжает работать: строка одна, скролла нет.
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/tasks", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("tablet-quick-actions")).toBeVisible();
  await expect(page.getByTestId("mobile-bottom-nav")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    1025,
  );
});

test("practice removes metadata noise and puts Next before optional detail", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Hierarchy is asserted once on desktop.");
  await answerOhmWrong(page);

  const question = page.getByTestId("question-card");
  await expect(page.getByTestId("practice-progress")).toHaveText("Задание 1 из 5");
  await expect(question).not.toContainText("Один ответ");
  await expect(question).not.toContainText("Сложность");
  await expect(page.getByText(/^Серия:/)).toHaveCount(0);
  await expect(page.getByTestId("practice-tab-tasks")).toHaveCount(0);
  await expect(page.getByTestId("answer-feedback")).toHaveAttribute("data-state", "wrong");
  await expect(page.getByTestId("answer-feedback").getByText("Не совсем", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Nova" })).toHaveCount(0);
  await expect(page.locator(".nova-caret")).toHaveCount(0);

  const next = page.getByTestId("next-task-button");
  const secondary = page.getByTestId("secondary-answer-actions");
  const nextBeforeSecondary = await next.evaluate((element, secondaryTestId) => {
    const other = document.querySelector(`[data-testid="${secondaryTestId}"]`);
    return Boolean(other && (element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING));
  }, "secondary-answer-actions");
  expect(nextBeforeSecondary).toBe(true);
  const [nextBox, secondaryBox] = await Promise.all([next.boundingBox(), secondary.boundingBox()]);
  expect(nextBox).not.toBeNull();
  expect(secondaryBox).not.toBeNull();
  expect(nextBox!.y + nextBox!.height).toBeLessThanOrEqual(secondaryBox!.y);

  await expect(page.getByTestId("solution-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByTestId("solution-content")).toHaveCount(0);
  await page.getByTestId("solution-toggle").click();
  await expect(page.getByTestId("solution-content")).toBeVisible();
  await expect(page.getByTestId("solution-formula")).toHaveCount(0);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("next-task-button")).toBeVisible();
  await expect(page.getByTestId("solution-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByTestId("solution-content")).toHaveCount(0);
});

test("desktop help is adjacent and close restores focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop aside geometry.");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible();

  const trigger = page.getByTestId("practice-open-help");
  await trigger.click();
  const help = page.getByTestId("topic-theory-drawer");
  await expect(help).toBeVisible();

  const [quizBox, helpBox] = await Promise.all([
    page.getByTestId("quiz-session").boundingBox(),
    help.boundingBox(),
  ]);
  expect(quizBox).not.toBeNull();
  expect(helpBox).not.toBeNull();
  expect(helpBox!.x).toBeGreaterThan(quizBox!.x + quizBox!.width);
  expect(helpBox!.y).toBeLessThan(page.viewportSize()!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );

  await page.getByTestId("close-topic-help").click();
  await expect(help).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile help stays inline and above the bottom safe area", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile inline help geometry.");
  await page.goto("/practice/family/ohm-law", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("question-card")).toBeVisible();

  const trigger = page.getByTestId("practice-open-help");
  await trigger.click();
  const help = page.getByTestId("topic-theory-drawer");
  await expect(help).toBeVisible();
  const [quizBox, helpBox] = await Promise.all([
    page.getByTestId("quiz-session").boundingBox(),
    help.boundingBox(),
  ]);
  expect(quizBox).not.toBeNull();
  expect(helpBox).not.toBeNull();
  expect(helpBox!.y).toBeGreaterThan(quizBox!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );

  await page.getByTestId("close-topic-help").click();
  await expect(trigger).toBeFocused();
});
