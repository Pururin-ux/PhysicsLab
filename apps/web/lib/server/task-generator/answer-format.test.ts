import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import {
  blueprints,
  generateTasks,
  templateRegistry,
  type TemplateId,
} from "./generate.ts";
import {
  decimalsOf,
  isNumericAnswerCorrect,
  toleranceFor,
} from "../../answer/numeric-answer.ts";

const NUMERIC_PILOTS = [
  "average-speed-segments",
  "work-force-distance",
  "electric-power",
  "heat-balance-simple",
  "plane-mirror-separation",
  "refractive-index-speed",
  "thin-lens-image-distance",
  "lens-optical-power",
] as const satisfies readonly TemplateId[];

type ApiJson = {
  tasks: {
    type: "single_choice" | "numeric_input";
    blueprint: string;
    answerUnit: string;
    options?: unknown[];
    answer: unknown;
    misconceptions?: { value: number; label: string }[];
  }[];
};

async function fetchTasks(query: string): Promise<ApiJson> {
  const response = await GET(new Request(`http://localhost/api/tasks?${query}`));
  assert.equal(response.status, 200, `запрос ${query} вернул ${response.status}`);
  return (await response.json()) as ApiJson;
}

test("ровно восемь семейств используют numeric_input, остальные — single_choice", () => {
  const numeric = templateRegistry
    .filter((entry) => blueprints[entry.id].answerFormat === "numeric_input")
    .map((entry) => entry.id);

  assert.deepEqual(new Set(numeric), new Set<string>(NUMERIC_PILOTS));

  const single = templateRegistry.filter(
    (entry) => (blueprints[entry.id].answerFormat ?? "single_choice") === "single_choice",
  );

  assert.equal(templateRegistry.length, 35);
  assert.equal(numeric.length, 8);
  assert.equal(single.length, 27);
});

test("каждый шаблон имеет валидный answerFormat", () => {
  for (const entry of templateRegistry) {
    const format = blueprints[entry.id].answerFormat ?? "single_choice";
    assert.ok(
      format === "single_choice" || format === "numeric_input",
      `${entry.id}: неизвестный answerFormat ${format}`,
    );
  }
});

test("focused API batch returns exactly five tasks from one requested family", async () => {
  const payload = await fetchTasks("template=ohm-law&count=5&batch=4");
  assert.equal(payload.tasks.length, 5);
  assert.deepEqual(new Set(payload.tasks.map((task) => task.blueprint)), new Set(["ohm-law"]));
});

for (const pilot of NUMERIC_PILOTS) {
  test(`${pilot}: numeric-ответ самосогласован на 200 вариантах`, () => {
    const tasks = generateTasks(pilot, 200);

    for (const task of tasks) {
      const spec = { value: task.answerValue, tolerance: toleranceFor(task.answerValue) };

      // Правильный ответ проходит проверку допуском.
      assert.equal(
        isNumericAnswerCorrect(task.answerValue, spec),
        true,
        `${task.id}: правильный ответ ${task.answerValue} не принят`,
      );

      // Каждый дистрактор строго вне допуска: иначе получим false-correct или
      // неоднозначный misconception.
      for (const option of task.options) {
        if (option.id === task.answer) {
          continue;
        }
        assert.equal(
          isNumericAnswerCorrect(option.value, spec),
          false,
          `${task.id}: дистрактор ${option.value} попал в допуск ответа ${task.answerValue}`,
        );
      }

      // Метаданные для фидбэка/формулы сохранены. Пустая единица допустима
      // только когда blueprint явно объявляет безразмерный ответ.
      const declaresDimensionless = blueprints[pilot].answerUnit === "";
      assert.ok(task.formula.length > 0, `${task.id}: пустая формула`);
      assert.ok(
        declaresDimensionless || task.answerUnit.length > 0,
        `${task.id}: пустая единица`,
      );
      assert.ok((task.explanation ?? "").length > 0, `${task.id}: пустое объяснение`);
      assert.equal(task.answerFormat, "numeric_input");
    }
  });
}

test("average-speed-segments: numeric policy принимает полный пул до 3 знаков", () => {
  const tasks = generateTasks("average-speed-segments", 500);

  for (const task of tasks) {
    assert.ok(
      decimalsOf(task.answerValue) <= 3,
      `${task.id}: ответ ${task.answerValue} вышел за точность генератора`,
    );
  }

  assert.equal(
    tasks.some((task) => decimalsOf(task.answerValue) >= 2),
    true,
    "numeric input не должен сужать разнообразие до целых и десятых",
  );
});

test("work-force-distance: signed — встречаются и отрицательные, и положительные ответы", () => {
  const values = generateTasks("work-force-distance", 100).map((task) => task.answerValue);
  assert.equal(values.some((value) => value < 0), true, "нет отрицательных ответов");
  assert.equal(values.some((value) => value > 0), true, "нет положительных ответов");
});

test("API: numeric pilots отдают числовой контракт без фиктивных вариантов", async () => {
  for (const pilot of NUMERIC_PILOTS) {
    const data = await fetchTasks(`template=${pilot}&count=4&batch=2`);

    for (const task of data.tasks) {
      assert.equal(task.type, "numeric_input", `${pilot}: ожидался numeric_input`);
      assert.equal("options" in task, false, `${pilot}: у numeric не должно быть options`);

      const answer = task.answer as {
        value: number;
        unit: string;
        decimals: number;
        tolerance: number;
        sign: string;
      };
      assert.equal(typeof answer.value, "number");
      assert.equal(answer.unit, task.answerUnit);
      assert.equal(typeof answer.decimals, "number");
      assert.equal(answer.tolerance > 0, true);
      assert.ok(["positive", "magnitude", "signed"].includes(answer.sign));
      assert.equal(Array.isArray(task.misconceptions), true);
    }
  }
});

test("API: single_choice-шаблон сохраняет варианты", async () => {
  const data = await fetchTasks("template=newton-second&count=4");

  for (const task of data.tasks) {
    assert.equal(task.type, "single_choice");
    assert.equal(Array.isArray(task.options), true);
    assert.equal(task.options?.length, 4);
  }
});

test("каждое numeric pilot-семейство достижимо в topic-mixed на 10 задач", async () => {
  const pilotMixes: { template: string; pilot: string }[] = [
    { template: "mixed", pilot: "average-speed-segments" },
    { template: "dynamics-mixed", pilot: "work-force-distance" },
    { template: "electro-mixed", pilot: "electric-power" },
    { template: "thermo-mixed", pilot: "heat-balance-simple" },
  ];

  for (const { template, pilot } of pilotMixes) {
    let found = false;
    for (let batch = 0; batch < 5 && !found; batch += 1) {
      const data = await fetchTasks(`template=${template}&count=10&batch=${batch}`);
      found = data.tasks.some((task) => task.blueprint === pilot);
    }
    assert.equal(found, true, `${pilot} не встретился в ${template} за 5 батчей по 10 задач`);
  }
});

test("exam batch поддерживает single_choice и numeric_input в одной сессии", async () => {
  const data = await fetchTasks("template=exam&count=10&batch=2");
  const formats = new Set(data.tasks.map((task) => task.type));

  assert.deepEqual(formats, new Set(["single_choice", "numeric_input"]));
  for (const task of data.tasks) {
    if (task.type === "numeric_input") {
      assert.equal("options" in task, false);
      continue;
    }
    assert.equal(Array.isArray(task.options), true);
  }
});
