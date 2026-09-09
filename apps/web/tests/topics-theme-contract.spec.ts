import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";

for(const theme of ["light","dark"]){
  test(`@a11y /topics: learning modes are usable in ${theme} theme`,async({page})=>{
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.addInitScript(value=>localStorage.setItem("physicslab-theme",value),theme);
    await page.goto("/topics");
    await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
    const textbook=page.getByRole("link",{name:"Учебник",exact:true});
    await textbook.focus();
    await expect(textbook).toBeFocused();
    expect(await textbook.evaluate(element=>getComputedStyle(element).outlineStyle)).not.toBe("none");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    const violations=(await new AxeBuilder({page}).exclude("canvas").analyze()).violations.filter(item=>["serious","critical"].includes(item.impact??""));
    expect(violations.map(item=>({id:item.id,nodes:item.nodes.map(node=>node.html)}))).toEqual([]);
  });
}

test("learning hub opens the textbook, Mio investigation and task catalog",async({page})=>{
  await page.goto("/topics");
  await page.getByRole("link",{name:"Учебник",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Учебник",exact:true})).toBeVisible();
  await page.getByRole("link",{name:"К разделу «Учиться»",exact:true}).click();
  await page.getByRole("link",{name:"Средняя скорость Поездка с Мио",exact:true}).click();
  await expect(page).toHaveURL(/\/practice\/average-speed-lesson$/);
  await expect(page.getByText("Мио · напарница по опытам",{exact:true})).toBeVisible();
  await page.getByRole("navigation",{name:"Основная навигация"}).getByRole("link",{name:"Учиться",exact:true}).click();
  await page.getByRole("link",{name:"Задачи",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Что потренируем?",exact:true})).toBeVisible();
});


