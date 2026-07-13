import { expect, test, type Page } from "@playwright/test";

const pilots = [
  "ohm-law",
  "vt-area",
  "friction-force",
  "average-speed-segments",
  "heat-balance-simple",
  "thin-lens-image-distance",
] as const;

async function openSolution(page: Page) {
  const summary = page.locator("summary").filter({ hasText: "Показать решение" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("reference-solution-steps")).toBeVisible();
}

test("reference example is closed, keyboard-accessible and links to an exact focused batch", async ({ page }) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/tasks")) apiRequests.push(request.url());
  });

  await page.goto("/tasks/ohm-law", { waitUntil: "domcontentloaded" });
  const reference = page.getByTestId("reference-solution");
  await expect(reference.getByRole("heading", { name: "Пример с разбором" })).toBeVisible();
  await expect(page.getByTestId("reference-solution-steps")).toBeHidden();
  expect(apiRequests).toEqual([]);

  const storageBefore = await page.evaluate(() => ({
    local: { ...localStorage },
    session: { ...sessionStorage },
  }));

  await openSolution(page);
  for (const heading of ["Модель", "Закон", "Подстановка", "Ответ"]) {
    await expect(reference.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(reference.getByText("Типичная ошибка", { exact: true })).toBeVisible();
  const storageAfter = await page.evaluate(() => ({
    local: { ...localStorage },
    session: { ...sessionStorage },
  }));
  expect(storageAfter).toEqual(storageBefore);
  expect(apiRequests).toEqual([]);

  await reference.getByRole("link", { name: "Решить 5 похожих" }).click();
  await expect(page).toHaveURL(/\/practice\/family\/ohm-law$/);
  await expect(page.getByTestId("question-card")).toBeVisible();
  const focusedRequest = apiRequests.find((url) => url.includes("template=ohm-law"));
  expect(focusedRequest).toBeTruthy();
  expect(new URL(focusedRequest!).searchParams.get("count")).toBe("5");

  await page.goBack();
  await expect(page.getByTestId("reference-solution-steps")).toBeHidden();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("reference-solution-steps")).toBeHidden();
});

test("all six pilot pages expose authored reference content", async ({ page }) => {
  for (const family of pilots) {
    await page.goto(`/tasks/${family}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("reference-solution")).toBeVisible();
    await expect(page.getByRole("link", { name: "Посмотреть пример" })).toHaveAttribute("href", "#reference-example");
  }
});

test("non-pilot task detail remains complete without an empty placeholder", async ({ page }) => {
  await page.goto("/tasks/free-fall", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Решить 5 похожих" })).toBeVisible();
  await expect(page.getByTestId("reference-solution")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Посмотреть пример" })).toHaveCount(0);
});

test("reference math and visuals expose semantic descriptions", async ({ page }) => {
  await page.goto("/tasks/ohm-law", { waitUntil: "domcontentloaded" });
  await openSolution(page);
  await expect(page.getByLabel("I равно U делённому на R")).toBeVisible();

  await page.goto("/tasks/vt-area", { waitUntil: "domcontentloaded" });
  const graph = page.getByTestId("physics-graph");
  await expect(graph).toBeVisible();
  await expect(graph.getByRole("img")).toHaveAttribute("aria-label", /закрашенная площадь.+перемещением/i);

  await page.goto("/tasks/thin-lens-image-distance", { waitUntil: "domcontentloaded" });
  const diagram = page.getByTestId("optics-diagram");
  await expect(diagram).toBeVisible();
  await expect(diagram.getByRole("img")).toHaveAccessibleName(/Собирающая тонкая линза.+30 см.+10 см/i);
  await expect(diagram.getByTestId("optics-solution")).toBeVisible();
});

test("reference pages do not overflow on narrow mobile viewports", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only layout assertion");
  if (testInfo.project.name === "mobile-360") {
    await page.setViewportSize({ width: 360, height: 800 });
  }

  for (const family of ["ohm-law", "vt-area", "thin-lens-image-distance"] as const) {
    await page.goto(`/tasks/${family}`, { waitUntil: "domcontentloaded" });
    await openSolution(page);
    const viewport = page.viewportSize()!;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1);

    const cta = page.getByTestId("reference-solution").getByRole("link", { name: "Решить 5 похожих" });
    await cta.scrollIntoViewIfNeeded();
    const [ctaBox, navBox] = await Promise.all([
      cta.boundingBox(),
      page.getByRole("navigation", { name: "Мобильная навигация" }).boundingBox(),
    ]);
    expect(ctaBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(navBox!.y - (ctaBox!.y + ctaBox!.height)).toBeGreaterThanOrEqual(8);
  }
});
