import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("AC oscillogram tasks use the interval between adjacent same-sign peaks as one period", () => {
  const cases = [
    { firstPeakMs: 2, secondPeakMs: 7, frequencyHz: 200 },
    { firstPeakMs: 3, secondPeakMs: 11, frequencyHz: 125 },
    { firstPeakMs: 4, secondPeakMs: 14, frequencyHz: 100 },
    { firstPeakMs: 5, secondPeakMs: 25, frequencyHz: 50 },
    { firstPeakMs: 6, secondPeakMs: 46, frequencyHz: 25 },
  ];
  const tasks = generateTasks("ac-oscillogram-frequency", 5);
  const blueprint = getBlueprint("ac-oscillogram-frequency");

  assert.deepEqual(tasks.map(task => task.answerValue), cases.map(item => item.frequencyHz));
  assert.equal(new Set(tasks.map(task => task.text)).size, cases.length);

  for (const task of tasks) {
    const { firstPeakMs, secondPeakMs, frequencyHz } = cases[task.params.caseId - 1];
    const periodMs = secondPeakMs - firstPeakMs;

    assert.ok(periodMs > 0);
    assert.equal(frequencyHz * periodMs, 1000);
    assert.equal(task.answerValue, frequencyHz);
    assert.equal(task.answerUnit, "Гц");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /два соседних положительных максимума/);
    assert.ok(task.text.includes(`t₁ = ${firstPeakMs} мс`) && task.text.includes(`t₂ = ${secondPeakMs} мс`));
    assert.ok(task.explanation?.includes(`${secondPeakMs}-${firstPeakMs}`));
    assert.ok(task.explanation?.includes("\\nu=\\frac{1}{T}"));
    assert.ok(task.options.some(option => option.misconception === "не переводишь миллисекунды в секунды" && option.value === 1 / periodMs));
    assert.ok(task.options.some(option => option.misconception === "считаешь соседние одинаковые максимумы половиной периода" && option.value === 2000 / periodMs));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
