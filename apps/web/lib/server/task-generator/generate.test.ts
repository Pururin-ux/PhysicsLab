import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import {
  generateTasks,
  getBlueprint,
  getTemplateIdsByGroup,
  templateRegistry,
} from "./generate.ts";
import type { GeneratedTask, TaskBlueprint } from "./types.ts";
import { validateGeneratedTask } from "./validator.ts";

const kinematicsTemplateIds = [
  "free-fall",
  "vt-slope",
  "vt-area",
  "relative-velocity-vectors",
  "average-speed-segments",
  "unit-conversion-speed",
] as const;
const dynamicsTemplateIds = [
  "newton-second",
  "friction-force",
  "incline-force",
  "resultant-force",
  "resultant-force-2d",
  "weight-lift",
  "density-volume-ratio",
  "impulse-momentum",
  "inelastic-collision-speed",
  "kinetic-energy",
  "work-force-distance",
] as const;
const electrodynamicsTemplateIds = [
  "ohm-law",
  "resistor-network",
  "source-internal-resistance",
  "capacitor-energy",
  "charge-sharing",
  "electric-power",
] as const;

// Шаблоны на пифагоровых тройках имеют естественно малый пул параметров:
// пар с целым ответом немного, тексты множатся только сюжетами.
const uniqueTextPoolBySkill: Record<string, number> = {
  "relative-velocity-vectors": 36,
  "resultant-force-2d": 24,
};
const thermodynamicsTemplateIds = [
  "ideal-gas-state",
  "heat-amount",
  "phase-change-heat",
  "gas-state-ratio",
  "heat-balance-simple",
] as const;

type ApiTask = {
  id: string;
  answer: string;
  answerUnit: string;
  blueprint: string;
  coach_lines: { correct: string; wrong: string; hint: string };
  explanation: string;
  options: { correct?: boolean; text: string; misconception?: string }[];
  params: Record<string, number>;
  text: string;
  graph?: { type: string } | null;
  diagram?: { kind: string } | null;
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

    // Пул relative-velocity-vectors ограничен пифагоровыми тройками:
    // 12 пар × 3 сюжета = 36 уникальных текстов, дальше цикл повторяется.
    const uniqueBatchSize = Math.min(uniqueTextPoolBySkill[templateId] ?? 50, 50);
    const firstBatchTexts = tasks.slice(0, uniqueBatchSize).map((task) => task.text);
    assert.equal(
      new Set(firstBatchTexts).size,
      uniqueBatchSize,
      `${templateId} duplicated a text in batch ${uniqueBatchSize}`,
    );
  });
}

test("vt-slope answers use whole or half-step acceleration values", () => {
  const tasks = generateTasks("vt-slope", 200);

  tasks.forEach((task) => {
    assert.equal(
      Math.abs(task.answerValue * 2 - Math.round(task.answerValue * 2)) < 1e-9,
      true,
      `Got ugly vt-slope answer: ${task.answerValue}`,
    );
    assert.equal(task.answerValue > 0, true, `Answer must be positive: ${task.answerValue}`);
    assert.equal(task.answerValue <= 20, true, `Answer too large: ${task.answerValue}`);
  });

  assert.equal(
    new Set(tasks.map((task) => task.text)).size,
    200,
    "vt-slope should keep at least 200 unique tasks after constraints",
  );
});

test("expanded task families encode the intended physical rule", () => {
  const averageSpeed = getBlueprint("average-speed-segments");
  const averageParams = { v1: 10, t1: 2, v2: 20, t2: 8 };
  assert.equal(averageSpeed.solver(averageParams), 18);
  assert.notEqual(averageSpeed.solver(averageParams), (averageParams.v1 + averageParams.v2) / 2);

  const unitConversion = getBlueprint("unit-conversion-speed");
  assert.equal(unitConversion.solver({ vKmh: 36, tMin: 5 }), 3000);

  const work = getBlueprint("work-force-distance");
  assert.equal(work.solver({ F: 20, s: 3, __variant: 0 }), 60);
  assert.equal(work.solver({ F: 20, s: 3, __variant: 1 }), -60);

  const power = getBlueprint("electric-power");
  assert.equal(power.solver({ I: 3, R: 4, __variant: 0 }), 36);
  assert.equal(power.solver({ I: 3, R: 4, __variant: 1 }), 36);
  assert.equal(power.solver({ I: 3, R: 4, __variant: 2 }), 36);

  const gasRatio = getBlueprint("gas-state-ratio");
  assert.equal(gasRatio.solver({ p1: 100, V1: 4, V2: 2, temp1C: 27, temp2C: 327 }), 400);

  const heatBalance = getBlueprint("heat-balance-simple");
  assert.equal(heatBalance.solver({ mHot: 2, tempHot: 80, mCold: 3, tempCold: 30 }), 50);
});

test("production templates keep enough variants and explanations", () => {
  for (const { id } of templateRegistry) {
    const tasks = generateTasks(id, 200);
    const blueprint = getBlueprint(id);

    assert.equal(tasks.length, 200, `${id} should generate 200 tasks`);
    const minUniqueTexts = uniqueTextPoolBySkill[id] ?? 50;
    assert.equal(
      new Set(tasks.map((task) => task.text)).size >= minUniqueTexts,
      true,
      `${id} should keep at least ${minUniqueTexts} unique texts in the first 200 tasks`,
    );

    tasks.forEach((task) => {
      assert.ok(task.explanation?.trim(), `${id} should provide a non-empty explanation`);
      assert.equal(
        task.options.filter((option) => option.value !== task.answerValue).every((option) => option.misconception),
        true,
        `${id} should label every wrong option with a misconception`,
      );
      if (blueprint.explanationTemplate) {
        assert.notEqual(task.explanation, task.coach_lines.correct);
      }
    });
  }
});

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
  assert.deepEqual(
    new Set(getTemplateIdsByGroup("electrodynamics")),
    new Set(electrodynamicsTemplateIds),
  );
  assert.deepEqual(
    new Set(getTemplateIdsByGroup("thermodynamics")),
    new Set(thermodynamicsTemplateIds),
  );
});

test("ohm-law: покрывает все три искомые величины с единицами", () => {
  const tasks = generateTasks("ohm-law", 200);
  const units = new Set(tasks.map((task) => task.answerUnit));

  assert.deepEqual(units, new Set(["А", "В", "Ом"]));

  for (const task of tasks) {
    assert.equal(new Set(task.options.map((option) => option.value)).size, 4);
    assert.equal(
      task.options.some((option) => option.value === task.answerValue),
      true,
    );
  }
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
      { id: "b", text: "-1", value: -1, misconception: "minus one" },
      { id: "c", text: "0", value: 0, misconception: "zero" },
      { id: "d", text: "1", value: 1, misconception: "plus one" },
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

for (const templateId of [
  ...dynamicsTemplateIds,
  ...electrodynamicsTemplateIds,
  ...thermodynamicsTemplateIds,
]) {
  if (templateId === "ohm-law") {
    continue; // отдельный тест ниже: покрывает три целевые величины.
  }

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

    const batchSize = Math.min(uniqueTextPoolBySkill[templateId] ?? 50, 50);
    const firstBatchTexts = tasks.slice(0, batchSize).map((task) => task.text);
    assert.equal(
      new Set(firstBatchTexts).size,
      batchSize,
      `${templateId} duplicated a text in batch ${batchSize}`,
    );
  });
}

test("API route возвращает валидные задачи", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&count=5"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 5);
  data.tasks.forEach((task) => {
    assert.ok(task.answer);
    assert.ok(task.explanation.trim());
    assert.equal(task.options.length, 4);
    assert.equal(task.options.filter((option) => option.correct).length, 1);
    assert.equal(
      task.options.filter((option) => !option.correct).every((option) => option.misconception),
      true,
    );
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
        task.options.filter((option) => !option.correct).every((option) => option.misconception),
        true,
      );
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

test("API route dynamics-mixed покрывает все навыки динамики", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=dynamics-mixed&count=14&batch=7"),
  );
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 14);
  assert.deepEqual(
    new Set(data.tasks.map((task) => task.blueprint)),
    new Set(dynamicsTemplateIds),
  );
});

test("API route mixed покрывает все навыки кинематики", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=mixed&count=10&batch=7"),
  );
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.deepEqual(
    new Set(data.tasks.map((task) => task.blueprint)),
    new Set(kinematicsTemplateIds),
  );
});

test("API route electro-mixed покрывает все навыки электродинамики", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=electro-mixed&count=10&batch=7"),
  );
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.deepEqual(
    new Set(data.tasks.map((task) => task.blueprint)),
    new Set(electrodynamicsTemplateIds),
  );
});

test("API route thermo-mixed покрывает все навыки термодинамики", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=thermo-mixed&count=10&batch=7"),
  );
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.deepEqual(
    new Set(data.tasks.map((task) => task.blueprint)),
    new Set(thermodynamicsTemplateIds),
  );
});

test("API route exam собирает вариант по пропорциям спецификации", async () => {
  const url = "http://localhost/api/tasks?template=exam&count=10&batch=3";
  const firstResponse = await GET(new Request(url));
  const repeatResponse = await GET(new Request(url));
  const first = (await firstResponse.json()) as ApiTaskResponse;
  const repeat = (await repeatResponse.json()) as ApiTaskResponse;

  assert.equal(firstResponse.status, 200);
  assert.equal(first.tasks.length, 10);
  assert.deepEqual(first.tasks, repeat.tasks);

  // Квоты на 10 задач: 4 механики (2 кинематика + 2 динамика),
  // 3 электродинамики, 3 термодинамики — как в route.ts.
  const groupOf = (blueprint: string) =>
    (kinematicsTemplateIds as readonly string[]).includes(blueprint)
      ? "kinematics"
      : (dynamicsTemplateIds as readonly string[]).includes(blueprint)
        ? "dynamics"
        : (electrodynamicsTemplateIds as readonly string[]).includes(blueprint)
          ? "electrodynamics"
          : "thermodynamics";

  const counts: Record<string, number> = {};
  for (const task of first.tasks) {
    const group = groupOf(task.blueprint);
    counts[group] = (counts[group] ?? 0) + 1;
  }

  assert.equal(counts.kinematics, 2, "в exam должно быть 2 задачи кинематики");
  assert.equal(counts.dynamics, 2, "в exam должно быть 2 задачи динамики");
  assert.equal(counts.electrodynamics, 3, "в exam должно быть 3 задачи электродинамики");
  assert.equal(counts.thermodynamics, 3, "в exam должно быть 3 задачи термодинамики");

  // Порядок перемешан: первые пять задач не могут быть одной группы.
  const firstFiveGroups = new Set(first.tasks.slice(0, 5).map((task) => groupOf(task.blueprint)));
  assert.equal(firstFiveGroups.size > 1, true, "exam не должен идти блоками по темам");

  const ids = new Set(first.tasks.map((task) => task.id));
  assert.equal(ids.size, first.tasks.length, "id задач в exam должны быть уникальны");

  // Термо-квота (3) больше числа термо-шаблонов (2): один шаблон входит
  // дважды и обязан дать две разные задачи, а не одну и ту же.
  const texts = new Set(first.tasks.map((task) => task.text));
  assert.equal(texts.size, first.tasks.length, "в exam не должно быть одинаковых задач");

  // Другой batch должен давать другой набор задач.
  const nextResponse = await GET(
    new Request("http://localhost/api/tasks?template=exam&count=10&batch=4"),
  );
  const next = (await nextResponse.json()) as ApiTaskResponse;
  assert.equal(
    first.tasks.some((task, index) => task.id !== next.tasks[index]?.id),
    true,
  );
});

test("relative-velocity-vectors несёт векторную диаграмму с ответом-гипотенузой", () => {
  const tasks = generateTasks("relative-velocity-vectors", 36);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "vector");
    if (task.diagram?.kind !== "vector") {
      continue;
    }
    assert.equal(task.diagram.spec.layout, "chain");
    assert.equal(task.diagram.spec.vectors.length, 2);
    assert.equal(task.diagram.spec.showResultant, true);
    assert.equal(
      task.answerValue,
      Math.hypot(task.params.v1, task.params.v2),
      "ответ должен быть гипотенузой треугольника скоростей",
    );
    assert.equal(Number.isInteger(task.answerValue), true);
  }
});

test("source-internal-resistance несёт схему цепи и целый ток", () => {
  const tasks = generateTasks("source-internal-resistance", 60);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "circuit");
    if (task.diagram?.kind !== "circuit") {
      continue;
    }
    assert.equal(task.diagram.spec.topology, "source-internal");
    assert.equal(
      task.answerValue,
      task.params.emf / (task.params.R + task.params.r),
    );
    assert.equal(Number.isInteger(task.answerValue), true);
    assert.equal(task.params.R > task.params.r, true);
  }
});

test("resultant-force-2d несёт concurrent-диаграмму с ответом-гипотенузой", () => {
  const tasks = generateTasks("resultant-force-2d", 20);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "vector");
    if (task.diagram?.kind !== "vector") {
      continue;
    }
    assert.equal(task.diagram.spec.layout, "concurrent");
    assert.equal(task.diagram.spec.showResultant, true);
    assert.equal(task.answerValue, Math.hypot(task.params.f1, task.params.f2));
    assert.equal(Number.isInteger(task.answerValue), true);
    assert.equal(task.params.f1 % 5, 0, "силы кратны 5 Н");
  }
});

test("resistor-network: обе топологии со схемой и чистым ответом", () => {
  const tasks = generateTasks("resistor-network", 200);
  const topologies = new Set<string>();

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "circuit");
    if (task.diagram?.kind !== "circuit") {
      continue;
    }
    topologies.add(task.diagram.spec.topology);

    if (task.diagram.spec.topology === "parallel") {
      const expected = (task.params.r1 * task.params.r2) / (task.params.r1 + task.params.r2);
      assert.equal(task.answerValue, expected);
      assert.equal(Number.isInteger(task.answerValue), true, "параллельный ответ целый");
      assert.equal(
        task.answerValue < Math.min(task.params.r1, task.params.r2),
        true,
        "параллельное сопротивление меньше меньшего",
      );
    } else {
      assert.equal(task.answerValue, task.params.r1 + task.params.r2);
    }
  }

  assert.deepEqual(topologies, new Set(["series", "parallel"]));
});

test("API route пробрасывает diagram в задачи", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=relative-velocity-vectors&count=3&batch=1"),
  );
  const data = (await response.json()) as ApiTaskResponse & {
    tasks: { diagram?: { kind: string } | null }[];
  };

  assert.equal(response.status, 200);
  data.tasks.forEach((task) => {
    assert.equal(task.diagram?.kind, "vector");
  });
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
