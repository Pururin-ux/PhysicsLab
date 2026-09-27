import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("oscillation energy subtracts spring energy from the conserved total", () => {
  const tasks = generateTasks("oscillation-energy", 30);
  const blueprint = getBlueprint("oscillation-energy");
  const answers = new Set<number>();
  const expectedByCase = new Map([[1, 0.32], [2, 0.58], [3, 0.64], [4, 0.52], [5, 1.04]]);

  for (const task of tasks) {
    const expected = expectedByCase.get(task.params.caseId);

    assert.ok(expected !== undefined);
    assert.equal(task.answerValue, expected);
    assert.equal(task.answerUnit, "Дж");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("вертикальной пружине"));
    assert.ok(task.explanation?.includes("W_k"));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
    answers.add(expected);
  }

  assert.equal(answers.size, 5);
});
