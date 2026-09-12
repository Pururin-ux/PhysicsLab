import { test, expect } from "@playwright/test";

const lessons = [
  {id: "acceleration", route: "kinematics-lesson", field: "screen"},
  {id: "dynamics", route: "dynamics-lesson", field: "step"},
  {id: "density", route: "density-lesson", field: "stage"},
  {id: "electro", route: "electro-lesson", field: "stage"},
] as const;

for (const lesson of lessons) {
  test(`${lesson.id}: personal explanation and position survive reload`, async ({page}) => {
    const key = `physicslab-lesson-draft-${lesson.id}`;
    // A previous visit's draft exercises hydration without awarding practice
    // evidence or replaying every lesson in every viewport.
    await page.addInitScript(({key, field}) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({version: 1, data: {[field]: 9, summaryText: "Предыдущая мысль об уроке", summarySaved: false}}));
    }, {key, field: lesson.field});
    await page.goto(`/practice/${lesson.route}`);
    const summary = page.getByRole("textbox", {name: "Объяснение для себя", exact: true});
    await expect(summary).toHaveValue("Предыдущая мысль об уроке");
    await summary.fill("Я могу объяснить связь величин и проверить единицы в расчёте.");
    await page.getByRole("button", {name: "Сохранить итог", exact: true}).click();
    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).data.summarySaved, key)).toBe(true);
    await page.reload();
    await expect(summary).toHaveValue("Я могу объяснить связь величин и проверить единицы в расчёте.");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "10");
    await expect(page.getByRole("link").filter({hasText: /задач|Потренироваться|Решать/}).last()).toBeVisible();
  });
}

test("saving failure shows an error instead of a saved confirmation", async ({page}) => {
  await page.addInitScript(() => {
    localStorage.setItem("physicslab-lesson-draft-acceleration", JSON.stringify({version: 1, data: {screen: 9, summaryText: "Черновик до сбоя хранилища", summarySaved: false}}));
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith("physicslab-lesson-draft-")) throw new DOMException("Full", "QuotaExceededError");
      return write.call(this, key, value);
    };
  });
  await page.goto("/practice/kinematics-lesson");
  await page.getByRole("textbox", {name: "Объяснение для себя", exact: true}).fill("Это объяснение пока не удалось сохранить.");
  await page.getByRole("button", {name: "Сохранить итог", exact: true}).click();
  await expect(page.getByRole("alert").filter({hasText: "Не удалось сохранить урок"})).toBeVisible();
  await expect(page.getByText("Итог сохранён в этом браузере.", {exact: false})).toHaveCount(0);
});
