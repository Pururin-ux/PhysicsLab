import {test,expect} from "@playwright/test";

test("textbook reading order agrees with the contents and never loops back",async({page})=>{
  await page.goto("/learn");
  const links=page.locator("main h3");
  const titles=await links.allTextContents();
  expect(titles.indexOf("Инерция: почему движение продолжается")).toBeLessThan(titles.indexOf("Масса, объём и плотность"));
  await page.getByRole("link").filter({has:page.getByRole("heading",{name:"Инерция: почему движение продолжается",exact:true})}).click();
  await expect(page.getByRole("link",{name:/Следующее объяснение:/})).toHaveCount(0);
  await page.getByRole("link",{name:"Дальше: масса как мера инертности",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Масса, объём и плотность",exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Следующее объяснение: Сила и динамометр →",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Сила и динамометр",exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Дальше: как сила и площадь создают давление",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Давление: сила и площадь опоры",exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:/Следующее объяснение:/})).toHaveCount(0);
});
