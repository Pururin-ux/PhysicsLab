import { expect, test } from "@playwright/test";

test("mixed API keeps topic and difficulty balance deterministically", async ({ request }) => {
  const first = await request.get("/api/tasks?template=exam&count=10&batch=17");
  const repeat = await request.get("/api/tasks?template=exam&count=10&batch=17");
  expect(first.ok()).toBeTruthy();
  const firstTasks = (await first.json()).tasks as Array<{
    id: string;
    topic: string;
    difficulty: 1 | 2 | 3;
  }>;
  expect((await repeat.json()).tasks).toEqual(firstTasks);
  expect([1, 2, 3].map((level) => firstTasks.filter((task) => task.difficulty === level).length))
    .toEqual([5, 3, 2]);
  const topicCounts = new Map<string, number>();
  for (const task of firstTasks) topicCounts.set(task.topic, (topicCounts.get(task.topic) ?? 0) + 1);
  expect([...topicCounts.values()].sort()).toEqual([2, 2, 2, 2, 2]);
});

test("generated difficulty remains in the API but stays out of the core task UI", async ({ page }) => {
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/tasks?template=optics-mixed"),
  );
  await page.goto("/practice/optics-demo");
  const payload = await (await responsePromise).json() as { tasks: Array<{ difficulty: 1 | 2 | 3 }> };
  expect([1, 2, 3]).toContain(payload.tasks[0].difficulty);
  await expect(page.getByTestId("question-card")).not.toContainText("Сложность");
});
