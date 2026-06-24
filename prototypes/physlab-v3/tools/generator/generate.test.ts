import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { GET } from "../../web/app/api/tasks/route.ts";
import {
  generateTasks,
  getBlueprint,
  getTemplateIdsByGroup,
  templateRegistry,
} from "./generate.ts";
import type { GeneratedTask, TaskBlueprint } from "./types.ts";
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
  id: string;
  answer: string;
  answerUnit: string;
  blueprint: string;
  coach_lines: { correct: string; wrong: string; hint: string };
  explanation: string;
  options: { correct?: boolean; text: string }[];
  params: Record<string, number>;
  text: string;
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
  const tasks = generateTasks("newton-second", 200);
  const units = new Set(tasks.map((task) => task.answerUnit));
  assert.deepEqual(units, new Set(["Н", "кг", "м/с²"]));

  for (const unit of units) {
    const targetTasks = tasks.filter((task) => task.answerUnit === unit);
    assert.ok(targetTasks.length > 0, `newton-second should generate target unit ${unit}`);
    targetTasks.forEach((task) => {
      assert.equal(new Set(task.options.map((option) => option.value)).size, 4);
      assert.equal(task.options.some((option) => option.value === task.answerValue), true);
    });
  }
});

test("registry groups every template exactly once", () => {
  assert.equal(new Set(templateRegistry.map((entry) => entry.id)).size, templateRegistry.length);
  assert.deepEqual(new Set(getTemplateIdsByGroup("kinematics")), new Set(kinematicsTemplateIds));
  assert.deepEqual(new Set(getTemplateIdsByGroup("dynamics")), new Set(dynamicsTemplateIds));
});

test("validator allows signed answers without weakening current templates", () => {
  const signedBlueprint: TaskBlueprint = {
    id: "signed-mock",
    skill: "Signed mock",
    topic: "Test",
    group: "kinematics",
    difficulty: 1,
    params: {
      x: { min: -2, max: -2, step: 1, unit: "м" },
    },
    formula: "x=-2",
    answerUnit: "м",
    answerKind: "signed",
    solver: () => -2,
    distractors: [
      { label: "minus one", compute: () => -1 },
      { label: "zero", compute: () => 0 },
      { label: "plus one", compute: () => 1 },
    ],
    textTemplate: () => "Найдите проекцию координаты.",
    trap: "Игнорирует знак.",
    coachLines: {
      correct: () => "Верно.",
      wrong: () => "Проверь знак.",
    },
  };
  const signedTask: GeneratedTask = {
    id: "signed-mock-0001",
    blueprint: signedBlueprint.id,
    skill: signedBlueprint.skill,
    topic: signedBlueprint.topic,
    difficulty: signedBlueprint.difficulty,
    params: { x: -2 },
    text: "Найдите проекцию координаты.",
    formula: signedBlueprint.formula,
    answerUnit: "м",
    options: [
      { id: "a", text: "-2", value: -2 },
      { id: "b", text: "-1", value: -1 },
      { id: "c", text: "0", value: 0 },
      { id: "d", text: "1", value: 1 },
    ],
    answer: "a",
    answerValue: -2,
    trap: signedBlueprint.trap,
    coach_lines: {
      correct: "Верно.",
      wrong: "Проверь знак.",
    },
  };

  assert.deepEqual(validateGeneratedTask(signedTask, signedBlueprint).issues, []);
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
      assert.ok(task.explanation);
      assert.notEqual(task.explanation, task.coach_lines.correct);
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
      assert.ok(task.explanation);
      assert.notEqual(task.explanation, task.coach_lines.correct);
      assert.equal(task.options.filter((option) => option.correct).length, 1);
      assert.equal(
        task.options.every((option) => option.text.endsWith(` ${task.answerUnit}`)),
        true,
      );
    });
  }
});

test("API route делает batch детерминированным и меняет набор", async () => {
  const batchZeroUrl =
    "http://localhost/api/tasks?template=newton-second&count=10&batch=0";
  const batchOneUrl =
    "http://localhost/api/tasks?template=newton-second&count=10&batch=1";
  const firstResponse = await GET(new Request(batchZeroUrl));
  const repeatResponse = await GET(new Request(batchZeroUrl));
  const nextResponse = await GET(new Request(batchOneUrl));
  const first = (await firstResponse.json()) as ApiTaskResponse;
  const repeat = (await repeatResponse.json()) as ApiTaskResponse;
  const next = (await nextResponse.json()) as ApiTaskResponse;

  assert.deepEqual(first.tasks, repeat.tasks);
  assert.equal(first.tasks.length, 10);
  assert.equal(next.tasks.length, 10);
  assert.equal(
    first.tasks.some((task, index) => task.id !== next.tasks[index]?.id),
    true,
  );
  assert.equal(
    first.tasks.some(
      (task, index) =>
        JSON.stringify(task.params) !== JSON.stringify(next.tasks[index]?.params),
    ),
    true,
  );
  assert.equal(
    first.tasks.filter((task) => next.tasks.some((nextTask) => nextTask.id === task.id)).length,
    0,
  );
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
