import { expect, test } from "@playwright/test";

const SEEDED_PROGRESS = {
  version: 2,
  topics: {
    kinematics: {
      solved: 8,
      correct: 5,
      completedSessions: 1,
      weakTraps: {
        "vt-slope:used velocity instead of acceleration": 3,
        "vt-area:read graph height instead of area": 1,
      },
      weakTrapLastSeenAt: {
        "vt-slope:used velocity instead of acceleration": "2026-07-03T10:00:00.000Z",
        "vt-area:read graph height instead of area": "2026-07-03T10:00:00.000Z",
      },
      lastPracticedAt: "2026-07-03T10:00:00.000Z",
    },
    dynamics: {
      solved: 0,
      correct: 0,
      completedSessions: 0,
      weakTraps: {},
      weakTrapLastSeenAt: {},
      lastPracticedAt: null,
    },
    electrodynamics: {
      solved: 4,
      correct: 2,
      completedSessions: 1,
      weakTraps: {
        "ohm-law:multiplied voltage and resistance": 2,
      },
      weakTrapLastSeenAt: {
        "ohm-law:multiplied voltage and resistance": new Date().toISOString(),
      },
      lastPracticedAt: new Date().toISOString(),
    },
    thermodynamics: {
      solved: 0,
      correct: 0,
      completedSessions: 0,
      weakTraps: {},
      weakTrapLastSeenAt: {},
      lastPracticedAt: null,
    },
  },
};

test("страница ошибок показывает review cockpit, карту тем и фильтры очереди", async ({
  page,
}) => {
  await page.addInitScript((progress) => {
    window.localStorage.setItem(
      "physicslab-v3-progress-v1",
      JSON.stringify({ version: 2, data: progress }),
    );
  }, SEEDED_PROGRESS);

  await page.goto("/mistakes", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "План восстановления" }),
  ).toBeVisible();
  await expect(page.getByText("План повторения").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Карта тем" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Очередь повторения" }),
  ).toBeVisible();

  await expect(page.getByRole("button", { name: /Сегодня\s*2/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Следующая\s*1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Все\s*3/ })).toBeVisible();

  const queue = page.locator("section").filter({ hasText: "Очередь повторения" });
  await expect(queue.getByText("Наклон v(t)").first()).toBeVisible();
  await expect(queue.getByText("Площадь под v(t)").first()).toBeVisible();

  await page.getByRole("button", { name: /Следующая\s*1/ }).click();
  await expect(queue.getByText("Закон Ома").first()).toBeVisible();
  await expect(queue.getByText("Наклон v(t)")).toHaveCount(0);

  await queue.getByRole("link", { name: "Решить 5 похожих" }).click();
  await expect(page).toHaveURL("/practice/family/ohm-law");
});
