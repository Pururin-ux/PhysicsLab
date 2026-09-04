import { expect, test } from "@playwright/test";

test("dynamics feedback and next action stay clear of mobile fixed UI", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-360",
    "The 320 px lower-bound contract runs once in the mobile project.",
  );

  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/practice/dynamics-lesson", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const startPrediction = page.getByRole("button", { name: "Сделать прогноз" });
  await startPrediction.focus();
  await page.keyboard.press("Enter");

  const correctPrediction = page.getByRole("button", {
    name: "Тележка 1 разгонится сильнее",
  });
  await correctPrediction.focus();
  await page.keyboard.press("Space");

  const startObservation = page.getByRole("button", { name: "Запустить опыт" });
  await startObservation.focus();
  await page.keyboard.press("Enter");

  const runExperiment = page.getByRole("button", { name: "Запустить обе" });
  await runExperiment.focus();
  await page.keyboard.press("Enter");

  const feedback = page.getByRole("status");
  const footer = page.locator("footer");
  const mobileNav = page.getByTestId("mobile-bottom-nav");
  await expect(feedback).toContainText("Тележка 1 получила вдвое большее ускорение");
  const replayExperiment = page.getByRole("button", { name: "Запустить ещё раз" });
  await expect(replayExperiment).toBeFocused();

  await page.keyboard.press("Tab");
  const backButton = page.getByRole("button", { name: "Назад" });
  await expect(backButton).toBeFocused();
  await page.keyboard.press("Tab");
  const nextButton = page.getByRole("button", { name: "Разобрать силы" });
  await expect(nextButton).toBeFocused();
  const focusOutline = await nextButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(focusOutline.style).not.toBe("none");
  expect(Number.parseFloat(focusOutline.width)).toBeGreaterThanOrEqual(2);

  const initialGeometry = await page.evaluate(() => {
    const feedbackElement = document.querySelector<HTMLElement>('[role="status"]');
    const footerElement = document.querySelector<HTMLElement>("footer");
    const navElement = document.querySelector<HTMLElement>(
      '[data-testid="mobile-bottom-nav"]',
    );
    if (!feedbackElement || !footerElement || !navElement) return null;

    const feedbackRect = feedbackElement.getBoundingClientRect();
    const footerRect = footerElement.getBoundingClientRect();
    const navRect = navElement.getBoundingClientRect();
    const overlap = (first: DOMRect, second: DOMRect) =>
      Math.max(
        0,
        Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top),
      );

    return {
      feedbackFooterOverlap: overlap(feedbackRect, footerRect),
      feedbackNavOverlap: overlap(feedbackRect, navRect),
      horizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  expect(initialGeometry).not.toBeNull();
  expect(initialGeometry?.feedbackFooterOverlap).toBe(0);
  expect(initialGeometry?.feedbackNavOverlap).toBe(0);
  expect(initialGeometry?.horizontalOverflow).toBe(false);

  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  const [footerBox, navBox] = await Promise.all([
    footer.boundingBox(),
    mobileNav.boundingBox(),
  ]);
  expect(footerBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(footerBox!.y + footerBox!.height).toBeLessThanOrEqual(navBox!.y + 1);
});
