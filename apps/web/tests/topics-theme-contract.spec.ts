import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

function cssChannels(value: string) {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Не удалось разобрать CSS-цвет: ${value}`);
  }
  return channels;
}

function relativeLuminance(value: string) {
  const [red, green, blue] = cssChannels(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test("@a11y /topics: светлая тема сохраняет контраст сцены и списка", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.localStorage.setItem("physicslab-theme", "light");
  });
  await page.goto("/topics", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("article#kinematics")).toHaveAttribute(
    "data-theme-preserve",
    "dark",
  );

  const bodyBackground = await page.locator("body").evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const sceneBackground = await page.locator("article#kinematics").evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const flatText = [
    page.getByRole("heading", { name: "Темы физики", exact: true }),
    page.getByText("силы и движение", { exact: true }),
    page.getByRole("heading", { name: "Динамика", exact: true }),
    page.getByText("Как сила и масса меняют движение тела.", { exact: true }),
    page.getByRole("link", {
      name: "Решать задачи по теме «Динамика»",
      exact: true,
    }),
  ];
  const sceneText = [
    page.getByRole("heading", { name: "Кинематика", exact: true }),
    page.getByText("Как график скорости показывает ускорение движения.", {
      exact: true,
    }),
    page.getByRole("link", {
      name: "Решать задачи по теме «Кинематика»",
      exact: true,
    }),
  ];

  for (const locator of flatText) {
    const color = await locator.evaluate((element) => getComputedStyle(element).color);
    expect(contrastRatio(color, bodyBackground)).toBeGreaterThanOrEqual(4.5);
  }
  for (const locator of sceneText) {
    const color = await locator.evaluate((element) => getComputedStyle(element).color);
    expect(contrastRatio(color, sceneBackground)).toBeGreaterThanOrEqual(4.5);
  }

  const primary = page.getByRole("link", {
    name: "Разобрать тему «Динамика»",
    exact: true,
  });
  const primaryColors = await primary.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(contrastRatio(primaryColors.color, primaryColors.background)).toBeGreaterThanOrEqual(
    4.5,
  );

  await primary.focus();
  await expect(primary).toBeFocused();
  expect(
    await primary.evaluate((element) => getComputedStyle(element).boxShadow),
  ).not.toBe("none");

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
  ).toBe(false);

  const blocking = (await new AxeBuilder({ page }).exclude("canvas").analyze()).violations.filter(
    (violation) => ["serious", "critical"].includes(violation.impact ?? ""),
  );
  expect(
    blocking.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.slice(0, 5).map((node) => node.html.slice(0, 140)),
    })),
  ).toEqual([]);
});
