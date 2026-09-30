import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import {
  blueprints,
  generateTasks,
  getCandidateParams,
  getTemplateIdsByGroup,
  templateRegistry,
  type TemplateId,
} from "./generate.ts";
import {
  decimalsOf,
  isNumericAnswerCorrect,
  toleranceFor,
} from "../../answer/numeric-answer.ts";
import { NUMERIC_TEMPLATE_IDS } from "./test-fixtures.ts";
import { validateGeneratedTask } from "./validator.ts";

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

test("явно перечисленные семейства используют numeric_input, остальные — single_choice", () => {
  const numeric = templateRegistry
    .filter((entry) => blueprints[entry.id].answerFormat === "numeric_input")
    .map((entry) => entry.id);

  assert.deepEqual(new Set(numeric), new Set<string>(NUMERIC_TEMPLATE_IDS));

  const single = templateRegistry.filter(
    (entry) => (blueprints[entry.id].answerFormat ?? "single_choice") === "single_choice",
  );

  assert.equal(numeric.length, NUMERIC_TEMPLATE_IDS.length);
  assert.equal(single.length, templateRegistry.length - NUMERIC_TEMPLATE_IDS.length);
  assert.ok(single.some(({ id }) => id === "contact-pressure"));
  assert.ok(single.some(({ id }) => id === "refraction-direction"));
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

for (const pilot of NUMERIC_TEMPLATE_IDS) {
  test(`${pilot}: numeric-ответ самосогласован на всём пуле и не менее 200 вариантов`, () => {
    const tasks = generateTasks(pilot, Math.max(200, getCandidateParams(pilot).length));

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

test("validator rejects a numeric distractor inside the answer tolerance", () => {
  const blueprint = blueprints["coulomb-force"];
  const task = {
    ...generateTasks(blueprint.id, 1)[0],
    params: { q1: 2, q2: 2, rCm: 40, epsilon: 2, sign: 1 },
    answer: "b" as const,
    answerValue: 0.1,
    options: [
      { id: "a" as const, text: "0,05", value: 0.05, misconception: "забываешь модуль второго заряда" },
      { id: "b" as const, text: "0,1", value: 0.1 },
      { id: "c" as const, text: "4", value: 4, misconception: "делишь на расстояние вместо его квадрата" },
      { id: "d" as const, text: "100", value: 100, misconception: "путаешь микро- и миллиньютоны" },
    ],
  };
  assert.ok(validateGeneratedTask(task, blueprint).issues.some(issue => issue.code === "numeric_distractor_tolerance"));
});

test("average-speed-segments: ответы целые, как в бланке ЦТ/ЦЭ", () => {
  const tasks = generateTasks("average-speed-segments", 500);

  // РИКЗ принимает в бланк только целое число; тренажёр не должен требовать
  // от ученика три знака после запятой (см. правила заполнения бланка ЦТ).
  for (const task of tasks) {
    assert.ok(
      Number.isInteger(task.answerValue),
      `${task.id}: ответ ${task.answerValue} не целый — расходится с форматом ЦТ`,
    );
  }

  // Разнообразие пула сохраняется за счёт параметров, а не дробной точности.
  const uniqueAnswers = new Set(tasks.map((task) => task.answerValue));
  assert.ok(
    uniqueAnswers.size >= 8,
    `слишком однообразные ответы: ${uniqueAnswers.size} уникальных`,
  );
});

test("work-force-distance: signed — встречаются и отрицательные, и положительные ответы", () => {
  const values = generateTasks("work-force-distance", 100).map((task) => task.answerValue);
  assert.equal(values.some((value) => value < 0), true, "нет отрицательных ответов");
  assert.equal(values.some((value) => value > 0), true, "нет положительных ответов");
});

test("API: все numeric-семейства отдают числовой контракт без фиктивных вариантов", async () => {
  for (const pilot of NUMERIC_TEMPLATE_IDS) {
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
      assert.equal(answer.decimals, decimalsOf(answer.value));
      assert.equal(answer.tolerance, toleranceFor(answer.value));
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

test("numeric pilot-семейства достижимы за полный цикл topic-mixed", async () => {
  const pilotMixes: { template: string; pilot: TemplateId }[] = [
    { template: "mixed", pilot: "average-speed-segments" },
    { template: "dynamics-mixed", pilot: "work-force-distance" },
    { template: "electro-mixed", pilot: "electric-power" },
    { template: "thermo-mixed", pilot: "heat-balance-simple" },
  ];

  for (const { template, pilot } of pilotMixes) {
    const batchLimit = 2 * getTemplateIdsByGroup(blueprints[pilot].group).length;
    let found = false;
    for (let batch = 0; batch < batchLimit && !found; batch += 1) {
      const data = await fetchTasks(`template=${template}&count=10&batch=${batch}`);
      found = data.tasks.some((task) => task.blueprint === pilot);
    }
    assert.equal(found, true, `${pilot} не встретился в ${template} за полный цикл`);
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
