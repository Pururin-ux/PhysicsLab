import {test,expect} from "@playwright/test";

test("density lesson completes from prediction to a saved notebook entry",async({page})=>{
  await page.goto("/practice/density-lesson");
  await page.getByRole("button",{name:"Сделать прогноз",exact:true}).click();
  await page.getByRole("button",{name:"Тоже увеличится вдвое",exact:true}).click();
  for(const name of ["Сравнить с наблюдением","Объяснить результат","Записать связь","Разобрать пример","Дополнить решение"])
    await page.getByRole("button",{name,exact:true}).click();
  await page.getByRole("textbox",{name:"m =",exact:true}).fill("39");
  await page.getByRole("button",{name:"Проверить",exact:true}).click();
  await page.getByRole("button",{name:"Решить самостоятельно",exact:true}).click();
  await expect(page.getByText("Раздели массу на объём.",{exact:true})).toHaveCount(0);
  await expect(page.getByRole("textbox",{name:"ρ =",exact:true})).toHaveValue("");
  await page.getByRole("textbox",{name:"ρ =",exact:true}).fill("27");
  await page.getByRole("button",{name:"Проверить",exact:true}).click();
  await expect(page.getByRole("button",{name:"Перенести идею",exact:true})).toBeDisabled();
  await page.getByRole("textbox",{name:"ρ =",exact:true}).fill("2,7");
  await page.getByRole("button",{name:"Проверить",exact:true}).click();
  await page.getByRole("button",{name:"Перенести идею",exact:true}).click();
  await expect(page.getByRole("textbox",{name:"m₂/m₁ =",exact:true})).toHaveValue("");
  await expect(page.getByRole("button",{name:"Подвести итог",exact:true})).toBeDisabled();
  await page.getByRole("textbox",{name:"m₂/m₁ =",exact:true}).fill("3");
  await page.getByRole("button",{name:"Проверить",exact:true}).click();
  await page.getByRole("button",{name:"Подвести итог",exact:true}).click();
  const note="У однородных образцов без пустот при одной температуре масса пропорциональна объёму.";
  await page.getByRole("textbox",{name:"Объяснение для себя",exact:true}).fill(note);
  await page.getByRole("button",{name:"Сохранить итог",exact:true}).click();
  await page.reload();
  await expect(page.getByRole("textbox",{name:"Объяснение для себя",exact:true})).toHaveValue(note);
  await page.getByRole("link",{name:"Открыть свою тетрадь",exact:true}).click();
  await expect(page.getByText(note,{exact:true})).toBeVisible();
});
