import { test, expect } from "@playwright/test";

test("notebook reads saved explanations, searches and links back to lesson", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("physicslab-lesson-draft-average-speed", JSON.stringify({ version: 1, data: { stage: 4, summaryText: "Объём и время — мои слова. <script>не исполнять</script>", summarySaved: true } }));
    localStorage.setItem("physicslab-lesson-draft-acceleration", JSON.stringify({ version: 1, data: { screen: 9, summaryText: "Несохранённая мысль", summarySaved: false } }));
  });
  await page.goto("/profile");
  await page.getByRole("link", { name: "Мой блокнот Объяснения из уроков" }).click();
  await expect(page.getByRole("heading", { name: "Средняя путевая скорость" })).toBeVisible();
  await expect(page.getByText("Несохранённая мысль")).toHaveCount(0);
  await expect(page.getByText("Объём и время — мои слова. <script>не исполнять</script>")).toBeVisible();
  await page.getByRole("searchbox").fill("объем время");
  await expect(page.getByRole("status")).toContainText("1 из 1");
  await page.getByRole("searchbox").fill("линза");
  await expect(page.getByText("Таких записей пока нет. Попробуй другое слово.")).toBeVisible();
  await page.getByRole("searchbox").fill("");
  await page.getByRole("link", { name: "Вернуться в урок и дополнить" }).click();
  await expect(page.getByRole("heading", { name: "Забери мысль с собой" })).toBeVisible();
  await page.getByText("Открыть моё объяснение", { exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Объём и время — мои слова. <script>не исполнять</script>");
});

test("empty notebook offers a real first experiment", async ({ page }) => {
  await page.goto("/profile/notebook");
  await expect(page.getByRole("heading", { name: "Здесь появятся твои записи" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Провести опыт с Мио" })).toHaveAttribute("href", "/practice/average-speed-lesson");
});
