import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("metal-temperature cases distinguish fixed U from fixed I", () => {
  const blueprint = getBlueprint("metal-temperature-current");
  assert.equal(blueprint.solver({ caseId: 1 }), 1);
  assert.equal(blueprint.solver({ caseId: 2 }), 3);
  assert.equal(blueprint.solver({ caseId: 3 }), 2);
  assert.equal(blueprint.solver({ caseId: 4 }), 4);
  assert.equal(blueprint.solver({ caseId: 5 }), 1);
  const tasks = generateTasks("metal-temperature-current", 6);
  assert.equal(tasks.length, 6);
  for (const task of tasks) {
    assert.equal(task.answerFormat, "single_choice");
    assert.equal(task.answerUnit, "");
    assert.equal(new Set(task.options.map(option => option.text)).size, 4);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
