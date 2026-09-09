import { expect, test } from "@playwright/test";

test("the authored optics probe keeps conversion and reflection as one visual choice", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/dev/optics-authored-arc", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Исследовать лучи" }).click();

  const slider = page.getByRole("slider", { name: "Угол падения от нормали" });
  await slider.press("ArrowLeft");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Сформулировать связь" })).toBeEnabled();
  await page.getByRole("button", { name: "Сформулировать связь" }).click();

  await page.getByRole("radio", { name: /При каждом изменении оба отсчёта/ }).check();
  await page.getByRole("button", { name: "Проверить формулировку" }).click();
  await page.getByRole("button", { name: "Уточнить правило" }).click();
  await page.getByRole("button", { name: "Применить" }).click();

  await expect(page.getByRole("radio", { name: "Луч A" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Луч B" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Луч C" })).toBeVisible();
  await expect(page.getByText("55°", { exact: true })).toHaveCount(0);

  const geometry = await page
    .locator("[data-probe-ray], [data-probe-incident]")
    .evaluateAll((lines) =>
      lines.map((line) => ({
        id: line.getAttribute("data-probe-ray") ?? "incident",
        x1: Number(line.getAttribute("x1")),
        y1: Number(line.getAttribute("y1")),
        x2: Number(line.getAttribute("x2")),
        y2: Number(line.getAttribute("y2")),
      })),
    );
  const byId = Object.fromEntries(geometry.map((line) => [line.id, line]));
  const normalAngle = (line: { x1: number; y1: number; x2: number; y2: number }, fromStart: boolean) => {
    const horizontal = fromStart ? line.x2 - line.x1 : line.x1 - line.x2;
    const vertical = fromStart ? line.y1 - line.y2 : line.y2 - line.y1;
    return (Math.atan2(Math.abs(horizontal), vertical) * 180) / Math.PI;
  };

  for (const id of ["surface-as-normal", "double-surface", "law"]) {
    expect(byId[id].x1).toBe(280);
    expect(byId[id].y1).toBe(252);
  }
  expect(byId.incident.x2).toBe(280);
  expect(byId.incident.y2).toBe(252);
  expect(normalAngle(byId["surface-as-normal"], true)).toBeCloseTo(35, 5);
  expect(normalAngle(byId["double-surface"], true)).toBeCloseTo(20, 5);
  expect(normalAngle(byId.law, true)).toBeCloseTo(55, 5);
  expect(normalAngle(byId.incident, false)).toBeCloseTo(55, 5);

  await page.getByRole("radio", { name: "Луч A" }).press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Луч B" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: "Луч B" }).press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "Луч A" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: "Луч A" }).press("Enter");
  await expect(page.getByRole("radio", { name: "Луч A" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Проверить луч" }).click();
  await expect(page.getByText(/35° задано относительно поверхности зеркала/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Помощь на другом примере" })).toBeVisible();
  await page.getByRole("button", { name: "Помощь на другом примере" }).click();
  await expect(page.getByText(/20° с поверхностью/)).toBeVisible();
  await expect(page.getByText(/70°/)).toBeVisible();
  await page.getByRole("button", { name: "Вернуться к исходной задаче" }).click();
  await expect(page.getByText(/20° с поверхностью/)).toHaveCount(0);

  await page.getByRole("radio", { name: "Луч B" }).click();
  await page.getByRole("button", { name: "Проверить луч" }).click();
  await expect(page.getByText(/Аналогичный пример/)).toBeVisible();
  await page.getByRole("button", { name: "Вернуться к исходной задаче" }).click();

  await page.getByRole("radio", { name: "Луч C" }).click();
  await page.getByRole("button", { name: "Проверить луч" }).click();
  await expect(page.getByText("35° к поверхности → 55° к нормали → симметричный отражённый луч.")).toBeVisible();
  await expect(page.getByLabel("Почему именно этот луч?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Перейти к задачам по отражению" })).toHaveAttribute("href", "/practice/family/reflection-angle");
  await expect(page.getByRole("link", { name: "Вернуться к теме" })).toHaveAttribute("href", "/topics");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect(consoleErrors).toEqual([]);
});
