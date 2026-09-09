import { test, expect } from "@playwright/test";

test("a checked textbook answer survives reload and stays isolated from other chapters", async ({page})=>{
  await page.goto("/learn/reading-scales");
  const option=page.getByRole("radio",{name:"5 см на деление",exact:true});
  await option.check();
  await page.getByRole("button",{name:"Проверить себя"}).click();
  await expect(page.getByRole("status")).toContainText("Верно:");
  await page.reload();
  await expect(option).toBeChecked();
  await expect(page.getByRole("status")).toContainText("Верно:");
  await page.goto("/learn/path-and-displacement");
  await expect(page.getByRole("button",{name:"Проверить себя"})).toBeDisabled();
});

test("an obsolete question cannot restore feedback for a new question",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("physicslab-lesson-draft-textbook-check-reading-scales",JSON.stringify({version:1,data:{stage:0,summaryText:"",summarySaved:false,answer:"5 см на деление",checked:true,questionKey:"old-question"}})));
  await page.goto("/learn/reading-scales");
  await expect(page.getByRole("button",{name:"Проверить себя"})).toBeDisabled();
  await expect(page.getByRole("status")).toHaveCount(0);
});
