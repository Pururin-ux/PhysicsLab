import {expect,test} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for(const theme of ["dark","light"]){
  test(`exam catalog coverage preserves its evidence boundary in ${theme} theme`,async({page})=>{
    await page.addInitScript(value=>localStorage.setItem("physicslab-theme",value),theme);
    await page.goto("/practice/exam-demo");
    await page.locator('a[href="/exam/program"]').click();
    const source=page.getByRole("complementary");
    await expect(source).toContainText("Здесь есть задачи по отдельным темам.");
    await expect(source).not.toContainText("Проверено для");
    await expect(page.getByText(/task families/)).toHaveCount(0);
    const missing=page.getByRole("list",{name:"Разделы программы по физике"}).locator(":scope > li").filter({has:page.getByRole("heading",{name:"Квантовая физика",exact:true})});
    await expect(missing.getByRole("link")).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    await page.locator("main").evaluate(async element=>{await Promise.all(element.getAnimations({subtree:true}).filter(animation=>animation.effect?.getTiming().iterations!==Infinity).map(animation=>animation.finished.catch(()=>{})));});
    const failures=(await new AxeBuilder({page}).exclude("canvas").analyze()).violations.filter(item=>["serious","critical"].includes(item.impact??""));
    expect(failures.map(item=>({id:item.id,nodes:item.nodes.map(node=>({html:node.html,details:node.failureSummary}))}))).toEqual([]);
    await page.getByRole("link",{name:"Кинематика",exact:true}).click();
    await expect(page).toHaveURL(/\/tasks\?topic=kinematics$/);
    await expect(page.getByRole("heading",{name:"Что потренируем?",exact:true})).toBeVisible();
  });
}



