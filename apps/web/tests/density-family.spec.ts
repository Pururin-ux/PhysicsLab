import {test,expect} from "@playwright/test";

test("five generated density tasks are solvable from their visible conditions",async({page})=>{
  await page.goto("/practice/family/density-volume-ratio");
  for(let i=0;i<5;i++){
    await expect(page.getByText(`Задание ${i+1} из 5`,{exact:true})).toBeVisible();
    const statement=page.locator("main p").filter({hasText:"Первый — из материала"});
    await expect(statement).toContainText("округлите до тысячных");
    const text=await statement.innerText();
    const values=text.match(/плотностью (\d+) г\/см³ с ребром (\d+) см/g)!;
    expect(values).toHaveLength(2);
    const [[rho1,a1],[rho2,a2]]=values.map(v=>v.match(/\d+/g)!.map(Number));
    const answer=Number((rho1*a1**3/(rho2*a2**3)).toFixed(3));
    const options=page.getByRole("list",{name:"Варианты ответа"}).getByRole("button");
    const labels=await options.allTextContents();
    const correct=labels.findIndex(label=>Number(label.replace(/^[a-d]\s*/,"").trim().replace(",","."))===answer);
    expect(correct).toBeGreaterThanOrEqual(0);
    if(i===0){
      await options.nth((correct+1)%labels.length).click();
      await expect(page.getByRole("button",{name:"Разобрать тему: Плотность и объём",exact:true})).toBeVisible();
      await page.getByRole("button",{name:"Попробовать ещё раз",exact:true}).click();
    }
    await options.nth(correct).click();
    await expect(page.getByRole("status")).toContainText("Верно");
    if(i<4) await page.getByRole("button",{name:"Следующая задача",exact:true}).click();
  }
  await page.getByRole("button",{name:"Показать итог",exact:true}).click();
  await expect(page.getByText("Итог тренировки",{exact:true})).toBeVisible();
  await expect(page.getByText(/4 \/ 5/)).toBeVisible();
  await expect(page.getByText(/В этом наборе тренировали «Плотность и объём»/)).toBeVisible();
  const review=page.getByRole("link",{name:"Повторить массу, объём и плотность",exact:true});
  await expect(review).toHaveAttribute("href","/learn/density");
  await review.click();
  await expect(page.getByRole("heading",{name:"Масса, объём и плотность",exact:true})).toBeVisible();
});
