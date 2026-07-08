import { expect, test } from "@playwright/test";

// Витрины /dev обязаны работать в dev-режиме (в production их закрывают
// pageExtensions + runtime-гард — это проверяет prod-smoke). Тест ловит
// регресс вида «переименовали page.dev.tsx и дев-витрины умерли молча».

test("дев-витрины доступны в dev-режиме", async ({ request }) => {
  for (const route of ["/dev/graphs", "/dev/diagrams"]) {
    const response = await request.get(route);
    expect(response.status(), `${route} в dev должен отвечать 200`).toBe(200);
  }
});
