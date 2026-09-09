import {test,expect} from "@playwright/test";

test("inertia distinguishes motion relative to floor and braking cart",async({page})=>{
  await page.goto("/learn/inertia");
  const scene=page.getByRole("region",{name:"История и модель с Мио"});
  await scene.getByRole("radio",{name:"Шайбу разгонит сила вперёд",exact:true}).check();
  await scene.getByRole("button",{name:"Через 2 с",exact:true}).click();
  await expect(scene).toContainText("шайба прошла по полу 8 м, тележка — 4 м");
  await expect(scene.getByRole("status")).toContainText("на свободную шайбу горизонтальная сила не действует");
  await scene.getByRole("button",{name:"Смотрим с тележки",exact:true}).click();
  await expect(scene).toContainText("сместилась вперёд на 4 м");
  await expect(scene.getByRole("img",{name:/2 с; наблюдатель/})).toHaveAttribute("aria-label",/Скорость тележки 0 м\/с/);
  await scene.getByRole("button",{name:"До торможения",exact:true}).click();
  await expect(scene).toContainText("сместилась вперёд на 0 м");
  await page.getByRole("radio",{name:"Нет, потому что шайбу постоянно разгоняет инерция",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await expect(page.getByRole("status").filter({hasText:"Инерция — свойство"})).toBeVisible();
  await page.getByRole("radio",{name:"Нет, горизонтальная скорость сохраняется без горизонтального воздействия",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await page.reload();
  await expect(page.getByRole("radio",{name:"Нет, горизонтальная скорость сохраняется без горизонтального воздействия",exact:true})).toBeChecked();
  await page.getByText("Школьный учебник",{exact:true}).click();
  await expect(page.getByRole("link",{name:"Открыть соответствующий параграф в официальном учебнике",exact:true})).toHaveAttribute("href",/7kl_rus_2022.pdf#page=73$/);
  await page.getByRole("link",{name:"Дальше: масса как мера инертности",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Масса, объём и плотность",exact:true})).toBeVisible();
});

