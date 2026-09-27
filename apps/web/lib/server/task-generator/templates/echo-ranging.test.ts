import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("echo ranging divides the round-trip path by two", () => {
  const tasks = generateTasks("echo-ranging", 5);
  const expected = new Map([[1, 150], [2, 222], [3, 290], [4, 182.5], [5, 90]]);
  const blueprint = getBlueprint("echo-ranging");

  for (const task of tasks) {
    assert.equal(task.answerValue, expected.get(task.params.caseId));
    assert.equal(task.answerUnit, "м");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /эхолот|сигнал|глубин/i);
    assert.ok(task.explanation?.includes("\\Delta t"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }

  assert.equal(new Set(tasks.map(task => task.answerValue)).size, 5);
  assert.match(tasks.find(task => task.params.caseId === 4)?.text ?? "", /0,25 с/u);
  assert.doesNotMatch(tasks.find(task => task.params.caseId === 4)?.text ?? "", /\{,\}/u);
});
