import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { GET } from "../../web/app/api/tasks/route.ts";
import { blueprints, generateTasks, getBlueprint } from "./generate.ts";
import { validateGeneratedTask } from "./validator.ts";

const templateIds = Object.keys(blueprints);

type ApiTask = {
  answer: string;
  options: { correct?: boolean }[];
  graph?: { type: string } | null;
};

type ApiTaskResponse = {
  tasks: ApiTask[];
};

for (const templateId of templateIds) {
  test(`${templateId}: generates 500 deterministic valid variants`, () => {
    const startedAt = performance.now();
    const tasks = generateTasks(templateId, 500);
    const durationMs = performance.now() - startedAt;
    const blueprint = getBlueprint(templateId);

    assert.equal(tasks.length, 500);
    assert.equal(durationMs < 100, true, `${templateId} took ${durationMs.toFixed(2)}ms`);

    for (const task of tasks) {
      const validation = validateGeneratedTask(task, blueprint);
      assert.deepEqual(validation.issues, []);
      assert.equal(validation.valid, true);
    }

    const answerDistribution = new Set(tasks.map((task) => task.answerValue));
    assert.equal(
      answerDistribution.size >= 4,
      true,
      `${templateId} should produce at least 4 different answers`,
    );

    const firstBatchTexts = tasks.slice(0, 50).map((task) => task.text);
    assert.equal(new Set(firstBatchTexts).size, 50, `${templateId} duplicated a text in batch 50`);
  });
}

test("API route возвращает валидные задачи", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&count=5"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 5);
  data.tasks.forEach((task) => {
    assert.ok(task.answer);
    assert.equal(task.options.length, 4);
    assert.equal(task.options.filter((option) => option.correct).length, 1);
  });
});

test("API route возвращает vt-slope batch", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=vt-slope&count=10"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.equal(data.tasks.every((task) => task.graph?.type === "vt"), true);
});

test("API route обрезает count до 20", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&count=100"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 20);
});

test("API route отдаёт 400 для неизвестного template", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=unknown&count=5"));
  const data = await response.json();

  assert.equal(response.status, 400);
  assert.match(data.error, /Unknown template/);
});
