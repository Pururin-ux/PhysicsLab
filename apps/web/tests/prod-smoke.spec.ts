import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { templateRegistry } from "../lib/server/task-generator/generate.ts";

const routesFixture = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "required-routes.json"), "utf8"),
) as { required: string[]; devOnly: string[] };

// Смок против production-сборки (playwright.prod.config.ts, next start :3100).
// Ловит класс багов «build прошёл, рантайм отдаёт 404» — реальный случай
// с неполным манифестом turbopack-сборки дошёл бы только до пользователей.

const pageRoutes = routesFixture.required.filter((route) => !route.startsWith("/api"));

for (const route of pageRoutes) {
  test(`prod: ${route} отвечает 200 и рендерит контент`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

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

test("prod: /api/tasks?template=exam соблюдает квоты спецификации", async ({ request }) => {
  const response = await request.get("/api/tasks?template=exam&count=10&batch=1");
  expect(response.status()).toBe(200);

  const data = (await response.json()) as {
    tasks: {
      blueprint: string;
      text: string;
      options: { correct?: boolean }[];
    }[];
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
    electrodynamics: 3,
    thermodynamics: 3,
  });

  const texts = new Set(data.tasks.map((task) => task.text));
  expect(texts.size).toBe(10);

  for (const task of data.tasks) {
    expect(task.options).toHaveLength(4);
    expect(task.options.filter((option) => option.correct)).toHaveLength(1);
  }
});
