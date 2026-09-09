import { test, expect } from "@playwright/test";

test("density survives cutting and unit conversion, with independent transfer", async ({page}) => {
  await page.goto("/learn/density");
  const scene=page.getByRole("region",{name:"История и модель с Мио"});
  await scene.getByRole("radio",{name:"Уменьшится вдвое",exact:true}).check();
  await scene.getByRole("button",{name:"Разделить A пополам"}).click();
  await expect(scene).toContainText("Масса: 27 г");
  await expect(scene).toContainText("Объём: 10 см³");
  await expect(scene.getByRole("status")).toContainText("отношение осталось прежним");
  await scene.getByRole("button",{name:"Показать единицы СИ"}).click();
  await expect(scene).toContainText("Масса: 0,027 кг");
  await expect(scene).toContainText("Объём: 0,00001 м³");
  await expect(scene).toContainText("2700 кг/м³");
  await expect(scene).toContainText("7800 кг/м³");
  await scene.getByRole("button",{name:"Собрать A обратно"}).click();
  await expect(scene).toContainText("Масса: 0,054 кг");
  await expect(scene).toContainText("Объём: 0,00002 м³");
  await page.getByRole("radio",{name:"72 г; 30 см³; 1,8 г/см³",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя"}).click();
  await expect(page.getByRole("status")).toContainText("объём тоже");
  await page.getByRole("radio",{name:"72 г; 30 см³; 2,4 г/см³",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя"}).click();
  await expect(page.getByRole("status")).toContainText("Плотность сохранилась");
  await page.reload();
  await expect(page.getByRole("radio",{name:"72 г; 30 см³; 2,4 г/см³",exact:true})).toBeChecked();
  await page.getByText("Школьный учебник",{exact:true}).click();
  await expect(page.getByRole("link",{name:"Открыть соответствующий параграф в официальном учебнике"})).toHaveAttribute("href",/7kl_rus_2022\.pdf#page=76$/);
  await page.getByRole("link",{name:"Проверить связь массы и объёма в опыте"}).click();
  await expect(page.getByRole("heading",{name:"Как связаны масса и объём",exact:true})).toBeVisible();
});

test("density split honours reduced motion and fits narrow screens",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/learn/density");
  await page.getByRole("button",{name:"Разделить A пополам"}).click();
  const duration=await page.getByRole("region",{name:"История и модель с Мио"}).locator('svg rect').nth(1).evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration));
  expect(duration).toBeLessThanOrEqual(0.00001);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});

