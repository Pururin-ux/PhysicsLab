import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("resonance practice matches the driving frequency to the natural frequency", () => {
  const tasks = generateTasks("resonance-frequency-match", 5);
  const expected = [0.5, 0.8, 1.2, 1.5, 2.5];
  const blueprint = getBlueprint("resonance-frequency-match");

  assert.deepEqual(tasks.map(task => task.answerValue), expected);
  for (const task of tasks) {
    assert.equal(task.answerUnit, "Гц");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("Собственная частота маятника"));
    assert.ok(task.explanation?.includes("\\nu_{\\text{внеш}}"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
