import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("ideal transformer practice follows secondary-to-primary turns ratio", () => {
  const tasks = generateTasks("transformer-voltage-ratio", 5);
  const blueprint = getBlueprint("transformer-voltage-ratio");
  const cases = [
    { n1: 200, n2: 50, u1: 12, u2: 3 },
    { n1: 100, n2: 200, u1: 6, u2: 12 },
    { n1: 240, n2: 120, u1: 18, u2: 9 },
    { n1: 80, n2: 320, u1: 4, u2: 16 },
    { n1: 300, n2: 150, u1: 20, u2: 10 },
  ];

  assert.deepEqual(tasks.map(task => task.answerValue), cases.map(item => item.u2));
  for (const task of tasks) {
    const { n1, n2, u1, u2 } = cases[task.params.caseId - 1];
    assert.equal(u1 * n2 / n1, u2);
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("переменного напряжения"));
    assert.ok(task.explanation?.includes(String(n2)) && task.explanation.includes(String(n1)));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
