import {test,expect} from "@playwright/test";
test("pressure chapter leads through five tasks and back to the same explanation",async({page})=>{
  await page.goto("/learn/pressure");
  await page.getByRole("link",{name:"Решить 5 задач на давление опоры",exact:true}).click();
  const targets=new Set<string>();
  for(let i=0;i<5;i++){
    await expect(page.getByText(`Задание ${i+1} из 5`,{exact:true})).toBeVisible();
    const statement=page.locator("main p").filter({hasText:/Платформа (действует|создаёт)/});
    const text=await statement.innerText();
    targets.add(text.includes("Найдите полную силу")?"force":text.includes("Найдите суммарную площадь")?"area":"pressure");
    const force=Number(text.match(/силой ([\d,]+) Н/)?.[1].replace(",","."));
    const supports=Number(text.match(/неё (\d+) одинаковые/)![1]);
    const area=Number(text.match(/по (\d+) см²/)?.[1]);
    const pressure=Number(text.match(/давление (\d+) кПа/)?.[1]);
    const answer=text.includes("Найдите полную силу")?pressure*1000*supports*area/10000:text.includes("Найдите суммарную площадь")?force/(pressure*1000)*10000:force/(supports*area/10000)/1000;
    const options=page.getByRole("list",{name:"Варианты ответа"}).getByRole("button");
    const values=await options.allTextContents();
    const correct=values.findIndex(value=>Math.abs(Number(value.replace(/[^\d,.-]/g,"").replace(",","."))-answer)<0.00051);
    expect(correct).toBeGreaterThanOrEqual(0);
    if(i===0){
      await options.nth((correct+1)%4).click();
      await expect(page.getByRole("button",{name:"Разобрать тему: Давление на опору",exact:true})).toBeVisible();
      await page.getByRole("button",{name:"Попробовать ещё раз",exact:true}).click();
    }
    await options.nth(correct).click();
    await page.getByRole("button",{name:i<4?"Следующая задача":"Показать итог",exact:true}).click();
  }
  expect([...targets].sort()).toEqual(["area","force","pressure"]);
  await expect(page.getByText(/4 \/ 5/)).toBeVisible();
  await page.getByRole("link",{name:"Повторить силу и площадь опоры",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Давление: сила и площадь опоры",exact:true})).toBeVisible();
});
