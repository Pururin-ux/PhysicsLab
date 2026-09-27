import {test,expect} from "@playwright/test";

declare global {
  interface Window {textbookCheckReads:number}
}

test("textbook contents returns to an incorrect check and updates after correction",async({page})=>{
  await page.goto("/learn/reading-scales");
  await page.getByRole("radio",{name:"4 см на деление",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await page.getByRole("link",{name:"К оглавлению",exact:true}).click();
  await page.getByRole("button",{name:"Повторить · 1",exact:true}).click();
  const entry=page.getByRole("link",{name:/Как читать шкалу прибора/});
  await expect(entry).toContainText("Повторить");
  await expect(entry).toHaveAttribute("href","/learn/reading-scales#self-check");
  await expect(page.getByRole("link",{name:/Масса, объём и плотность/})).toHaveCount(0);
  await entry.click();
  await page.getByRole("radio",{name:"5 см на деление",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await page.getByRole("link",{name:"К оглавлению",exact:true}).click();
  await expect(page.getByRole("link",{name:/Как читать шкалу прибора/})).toContainText("Ответ верный");
  await page.getByRole("button",{name:"Повторить · 0",exact:true}).click();
  await expect(page.getByText(/Нет тем для повторения/)).toBeVisible();
});

test("unreadable check remains preserved and is not labelled unattempted",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("physicslab-lesson-draft-textbook-check-density", "{broken"));
  await page.goto("/learn");
  await expect(page.getByRole("link",{name:/Масса, объём и плотность/})).toContainText("Не удалось загрузить ответ");
  await expect(page.getByRole("alert").filter({hasText:"Часть ответов"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem("physicslab-lesson-draft-textbook-check-density"))).toBe("{broken");
});


test("textbook search combines with class selection and recovers from empty results",async({page})=>{
  await page.goto("/learn");
  await page.getByRole("button",{name:"9 класс",exact:true}).click();
  await page.getByRole("searchbox",{name:"Найти тему",exact:true}).fill("путь");
  await expect(page.getByRole("heading",{level:3})).toHaveCount(2);
  await page.getByRole("button",{name:"7 класс",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("Тема не найдена");
  await page.getByRole("searchbox",{name:"Найти тему",exact:true}).fill("объем");
  await expect(page.getByRole("link",{name:/Масса, объём и плотность/})).toBeVisible();
  await page.getByRole("searchbox",{name:"Найти тему",exact:true}).fill("");
  await expect(page.getByRole("heading",{level:3})).toHaveCount(5);
});

test("contents reads only the changed check after a storage event",async({page})=>{
  await page.addInitScript(()=>{
    const originalGetItem=Storage.prototype.getItem;
    window.textbookCheckReads=0;
    Storage.prototype.getItem=function(key:string){
      if(this===window.localStorage&&key.startsWith("physicslab-lesson-draft-textbook-check-"))window.textbookCheckReads++;
      return originalGetItem.call(this,key);
    };
  });
  await page.goto("/learn");
  await expect.poll(()=>page.evaluate(()=>window.textbookCheckReads)).toBeGreaterThan(0);

  const unrelatedReads=await page.evaluate(()=>{
    window.textbookCheckReads=0;
    window.dispatchEvent(new StorageEvent("storage",{key:"physicslab-theme",storageArea:localStorage}));
    return window.textbookCheckReads;
  });
  expect(unrelatedReads).toBe(0);

  const key="physicslab-lesson-draft-textbook-check-reading-scales";
  const changedReads=await page.evaluate((draftKey)=>{
    localStorage.setItem(draftKey,JSON.stringify({version:2,data:{}}));
    window.textbookCheckReads=0;
    window.dispatchEvent(new StorageEvent("storage",{key:draftKey,storageArea:localStorage}));
    return window.textbookCheckReads;
  },key);
  expect(changedReads).toBe(1);
  await expect(page.getByRole("alert").filter({hasText:"Часть ответов"})).toBeVisible();
  expect(await page.evaluate(draftKey=>localStorage.getItem(draftKey),key)).toBe(JSON.stringify({version:2,data:{}}));

  const clearedReads=await page.evaluate((draftKey)=>{
    localStorage.removeItem(draftKey);
    window.textbookCheckReads=0;
    window.dispatchEvent(new StorageEvent("storage",{key:null,storageArea:localStorage}));
    return window.textbookCheckReads;
  },key);
  expect(clearedReads).toBeGreaterThan(1);
  await expect(page.getByRole("alert").filter({hasText:"Часть ответов"})).toHaveCount(0);
});
