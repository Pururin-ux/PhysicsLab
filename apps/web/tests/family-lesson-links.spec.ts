import {test,expect} from "@playwright/test";

test("family pages link to relevant explanations and do not substitute a broad topic lesson",async({page})=>{
  for(const family of ["thin-lens-image-distance","gas-state-ratio"]){
    await page.goto(`/tasks/${family}`);
    await expect(page.getByRole("link",{name:/Если тема пока незнакома/})).toHaveCount(0);
    await expect(page.locator('main a[href$="-lesson"]')).toHaveCount(0);
    await expect(page.getByRole("link",{name:/Что означают буквы/})).toBeVisible();
    await expect(page.getByRole("link",{name:"Начать: 5 задач",exact:true})).toHaveAttribute("href",`/practice/family/${family}`);
  }
  for(const [family,label,title] of [
    ["relative-velocity-vectors","Учебник: сложение скоростей","Относительное движение и сложение скоростей"],
    ["density-volume-ratio","Учебник: масса, объём и плотность","Масса, объём и плотность"],
    ["contact-pressure","Учебник: давление на опору","Давление: сила и площадь опоры"],
  ]){
    await page.goto(`/tasks/${family}`);
    await page.getByRole("link",{name:label,exact:true}).click();
    await expect(page.getByRole("heading",{name:title,exact:true})).toBeVisible();
  }
});
