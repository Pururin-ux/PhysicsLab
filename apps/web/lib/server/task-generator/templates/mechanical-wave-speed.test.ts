import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("mechanical wave speed uses wavelength times source frequency", () => {
  const tasks = generateTasks("mechanical-wave-speed", 5);
  const expected = new Map([[1, 2], [2, 3], [3, 1.8], [4, 2.7], [5, 4.4]]);
  const blueprint = getBlueprint("mechanical-wave-speed");

  for (const task of tasks) {
    assert.equal(task.answerValue, expected.get(task.params.caseId));
    assert.equal(task.answerUnit, "м/с");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("поперечная волна"));
    assert.ok(task.explanation?.includes("\\lambda"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }

  assert.equal(new Set(tasks.map(task => task.answerValue)).size, 5);
});
