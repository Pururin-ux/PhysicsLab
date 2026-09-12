import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { templateRegistry } from "../lib/server/task-generator/generate.ts";
import { textbookChapters } from "../lib/learning/textbook.ts";

type RoutesFixture = {
  required: string[];
  devOnly: string[];
  smokePaths?: Record<string, string>;
};

const routesFixture = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "required-routes.json"), "utf8"),
) as RoutesFixture;

// Смок против production-сборки (playwright.prod.config.ts, next start :3100).
// Ловит класс багов «build прошёл, рантайм отдаёт 404» — реальный случай
// с неполным манифестом turbopack-сборки дошёл бы только до пользователей.

const pageRoutes = routesFixture.required
  .filter((route) => !route.startsWith("/api"))
  .map((manifestRoute) => ({
    manifestRoute,
    path: routesFixture.smokePaths?.[manifestRoute] ?? manifestRoute,
  }));

for (const route of pageRoutes) {
  test(`prod: ${route.manifestRoute} отвечает 200 и рендерит контент`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("body")).not.toHaveText(
      /Unhandled Runtime Error|Application error|This page could not be found/i,
    );
  });
}

for (const route of routesFixture.devOnly) {
  test(`prod: дев-маршрут ${route} отдаёт 404`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
  });
}

for(const chapter of textbookChapters){
  test(`prod: учебник ${chapter.id} содержит объяснение и самопроверку`,async({page})=>{
    const response=await page.goto(`/learn/${chapter.id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading",{name:chapter.title,exact:true})).toBeVisible();
    await expect(page.getByRole("button",{name:"Проверить себя",exact:true})).toBeVisible();
    const art=page.getByRole("region",{name:"История и модель с Мио"}).locator('img[alt^="Мио "]');
    await expect(art).toBeVisible();
    await expect.poll(()=>art.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });
}

test("prod: базовые security headers присутствуют", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=()",
  );
});

test("prod: /api/tasks?template=exam сохраняет сбалансированный mixed-контракт", async ({ request }) => {
  const response = await request.get("/api/tasks?template=exam&count=10&batch=1");
  expect(response.status()).toBe(200);

  const data = (await response.json()) as {
    tasks: ({
      type: "single_choice";
      blueprint: string;
      text: string;
      options: { correct?: boolean }[];
    } | {
      type: "numeric_input";
      blueprint: string;
      text: string;
      answer: { value: number; tolerance: number };
    })[];
  };

  expect(data.tasks).toHaveLength(10);

  const groupByBlueprint = new Map(
    templateRegistry.map((entry) => [entry.id as string, entry.group]),
  );
  const counts: Record<string, number> = {};
  for (const task of data.tasks) {
    const group = groupByBlueprint.get(task.blueprint) ?? "unknown";
    counts[group] = (counts[group] ?? 0) + 1;
  }

  expect(counts).toEqual({
    kinematics: 2,
    dynamics: 2,
    electrodynamics: 2,
    thermodynamics: 2,
    optics: 2,
  });

  const texts = new Set(data.tasks.map((task) => task.text));
  expect(texts.size).toBe(10);

  for (const task of data.tasks) {
    if (task.type === "numeric_input") {
      expect("options" in task).toBe(false);
      expect(Number.isFinite(task.answer.value)).toBe(true);
      expect(task.answer.tolerance).toBeGreaterThan(0);
      continue;
    }

    expect(task.options).toHaveLength(4);
    expect(task.options.filter((option) => option.correct)).toHaveLength(1);
  }
});

test("prod: вход из Учиться, модель силы и сохранённая самопроверка работают после hydration",async({page})=>{
  await page.goto("/topics");
  await page.getByRole("link",{name:"Учебник",exact:true}).click();
  await page.getByRole("link").filter({has:page.getByRole("heading",{name:"Сила и динамометр",exact:true})}).click();
  const scene=page.getByRole("region",{name:"История и модель с Мио"});
  await scene.getByRole("button",{name:"Два одинаковых груза",exact:true}).click();
  await scene.getByRole("button",{name:"Показать разбор шкалы",exact:true}).click();
  await expect(scene.getByRole("status")).toContainText("Показание: 3 Н");
  await page.getByRole("radio",{name:"1,5 Н",exact:true}).check();
  await page.getByRole("button",{name:"Проверить себя",exact:true}).click();
  await page.reload();
  await expect(page.getByRole("radio",{name:"1,5 Н",exact:true})).toBeChecked();
  await page.getByRole("link",{name:"К оглавлению",exact:true}).click();
  const chapter=page.getByRole("link").filter({has:page.getByRole("heading",{name:"Сила и динамометр",exact:true})});
  await expect(chapter).toContainText("Ответ верный");
});

test("prod: банк давления включает три искомые величины",async({request})=>{
  const response=await request.get("/api/tasks?template=contact-pressure&count=5&batch=1");
  expect(response.status()).toBe(200);
  const {tasks}=await response.json() as {tasks:{text:string;options:{correct?:boolean}[]}[]};
  expect(tasks).toHaveLength(5);
  const targets=new Set(tasks.map(task=>task.text.includes("Найдите полную силу")?"force":task.text.includes("Найдите суммарную площадь")?"area":"pressure"));
  expect([...targets].sort()).toEqual(["area","force","pressure"]);
  for(const task of tasks){expect(task.options).toHaveLength(4);expect(task.options.filter(option=>option.correct)).toHaveLength(1);}
});

