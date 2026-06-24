import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { GET } from "../../web/app/api/tasks/route.ts";
import { generateTasks, getBlueprint } from "./generate.ts";
import { validateGeneratedTask } from "./validator.ts";

const kinematicsTemplateIds = ["free-fall", "vt-slope", "vt-area"] as const;
const dynamicsTemplateIds = [
  "newton-second",
  "friction-force",
  "incline-force",
  "resultant-force",
  "weight-lift",
] as const;

type ApiTask = {
  answer: string;
  answerUnit: string;
  blueprint: string;
  options: { correct?: boolean; text: string }[];
  graph?: { type: string } | null;
};

type ApiTaskResponse = {
  tasks: ApiTask[];
};

for (const templateId of kinematicsTemplateIds) {
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
      assert.ok(task.answerUnit);
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

test("newton-second: uses units for all three target quantities", () => {
  const units = new Set(generateTasks("newton-second", 200).map((task) => task.answerUnit));
  assert.deepEqual(units, new Set(["Н", "кг", "м/с²"]));
});

for (const templateId of dynamicsTemplateIds) {
  test(`${templateId}: generates 200 deterministic valid variants`, () => {
    const startedAt = performance.now();
    const tasks = generateTasks(templateId, 200);
    const durationMs = performance.now() - startedAt;
    const blueprint = getBlueprint(templateId);

    assert.equal(tasks.length, 200);
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

test("API route возвращает все шаблоны динамики с единицами", async () => {
  for (const template of dynamicsTemplateIds) {
    const response = await GET(
      new Request(`http://localhost/api/tasks?template=${template}&count=3&batch=7`),
    );
    const data = (await response.json()) as ApiTaskResponse;

    assert.equal(response.status, 200);
    assert.equal(data.tasks.length, 3);
    data.tasks.forEach((task) => {
      assert.equal(task.blueprint, template);
      assert.ok(task.answerUnit);
      assert.equal(task.options.filter((option) => option.correct).length, 1);
      assert.equal(
        task.options.every((option) => option.text.endsWith(` ${task.answerUnit}`)),
        true,
      );
    });
  }
});

test("API route dynamics-mixed покрывает пять навыков", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=dynamics-mixed&count=10&batch=7"),
  );
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.deepEqual(
    new Set(data.tasks.map((task) => task.blueprint)),
    new Set(dynamicsTemplateIds),
  );
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
