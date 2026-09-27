import assert from "node:assert/strict";
import test from "node:test";
import { getNumericMisconception, isNumericAnswerCorrect, toleranceFor } from "../../../answer/numeric-answer.ts";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("LC period tasks convert microfarads to farads and seconds to milliseconds", () => {
  const tasks = generateTasks("lc-period", 5);
  const blueprint = getBlueprint("lc-period");
  const cases = [
    { inductanceH: 0.25, capacitanceMicroF: 4 },
    { inductanceH: 1, capacitanceMicroF: 4 },
    { inductanceH: 1, capacitanceMicroF: 9 },
    { inductanceH: 4, capacitanceMicroF: 4 },
    { inductanceH: 1, capacitanceMicroF: 25 },
  ];

  assert.deepEqual(tasks.map((task) => task.answerValue), [6.28, 12.56, 18.84, 25.12, 31.4]);
  assert.equal(new Set(tasks.map((task) => task.answerValue)).size, tasks.length);

  for (const task of tasks) {
    const { inductanceH, capacitanceMicroF } = cases[task.params.caseId - 1];
    const expectedMs = Math.round(2 * 3.14 * Math.sqrt(inductanceH * capacitanceMicroF * 1e-6) * 1e3 * 100) / 100;

    assert.equal(inductanceH * capacitanceMicroF, (task.params.caseId) ** 2);
    assert.equal(task.answerValue, expectedMs);
    assert.equal(task.answerUnit, "мс");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("Гн") && task.text.includes("мкФ") && task.text.includes("3,14"));
    assert.ok(task.text.includes("Сопротивлением пренебречь"));
    assert.ok(task.explanation?.includes("10^{-6}") && task.explanation.includes("\\text{мс}"));
    assert.ok(task.coach_lines.wrong.includes(`${String(task.answerValue).replace(".", ",")} мс`));
    assert.ok(task.trap.includes("мкФ") && task.trap.includes("миллисекунд"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }

  const tolerance = toleranceFor(tasks[0].answerValue);
  assert.equal(tolerance, 0.005);
  assert.ok(isNumericAnswerCorrect(6.284, { value: tasks[0].answerValue, tolerance }));
  assert.equal(isNumericAnswerCorrect(6.3, { value: tasks[0].answerValue, tolerance }), false);
  const misconceptions = tasks[0].options
    .filter((option) => option.id !== tasks[0].answer && option.misconception)
    .map((option) => ({ value: option.value, label: option.misconception as string }));
  assert.equal(getNumericMisconception(6280, misconceptions, tolerance), "не переводишь микрофарады в фарады");
});
