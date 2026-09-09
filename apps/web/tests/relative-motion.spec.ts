import {test,expect} from "@playwright/test";

test("reference frames distinguish a stationary boat from a drifting boat",async({page})=>{
  await page.goto("/learn/relative-motion");
  const speed=page.getByRole("status");
  await page.getByRole("combobox",{name:"Скорость течения"}).selectOption("3");
  await page.getByRole("button",{name:"Против течения",exact:true}).click();
  await page.getByRole("button",{name:"Через 4 с",exact:true}).click();
  await expect(speed).toContainText("0 м/с");
  await expect(speed).toContainText("остаётся напротив");
  await page.getByRole("button",{name:"Относительно воды",exact:true}).click();
  await expect(speed).toContainText("3 м/с");
  await expect(page.getByRole("img",{name:/Через 4 с/})).toHaveAttribute("aria-label",/по горизонтали -12 м/);
  await page.getByRole("button",{name:"Относительно берега",exact:true}).click();
  await page.getByRole("combobox",{name:"Скорость течения"}).selectOption("4");
  await expect(speed).toContainText("1 м/с");
  await expect(speed).toContainText("вниз по течению");
  await page.getByRole("button",{name:"Поперёк течения",exact:true}).click();
  await expect(speed).toContainText("5 м/с");
  await expect(page.getByRole("img",{name:/Через 4 с/})).toHaveAttribute("aria-label",/по горизонтали 16 м, поперёк реки 12 м/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test("relative motion answer survives reload and links to its own practice",async({page})=>{
  await page.goto("/learn/relative-motion");
  await page.getByRole("radio",{name:"2 м/с по течению",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await expect(page.getByText(/Верно. Выбрав направление/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("radio",{name:"2 м/с по течению",exact:true})).toBeChecked();
  await expect(page.getByText(/Верно. Выбрав направление/)).toBeVisible();
  await expect(page.getByRole("link",{name:"Решать задачи на сложение скоростей",exact:true})).toHaveAttribute("href","/practice/family/relative-velocity-vectors");
});
