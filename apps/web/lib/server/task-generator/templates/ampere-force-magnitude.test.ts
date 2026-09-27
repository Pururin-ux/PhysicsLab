import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("Ampere-force family converts units and applies the angle factor", () => {
  const blueprint = getBlueprint("ampere-force-magnitude");
  assert.equal(blueprint.solver({ inductionMilliTeslas: 400, currentAmperes: 2, lengthCentimetres: 50, angleCase: 1 }), 0.2);
  assert.equal(blueprint.solver({ inductionMilliTeslas: 400, currentAmperes: 2, lengthCentimetres: 50, angleCase: 2 }), 0.4);
  const tasks = generateTasks("ampere-force-magnitude", 16);
  assert.equal(tasks.length, 16);
  for (const task of tasks) {
    const { inductionMilliTeslas, currentAmperes, lengthCentimetres, angleCase } = task.params;
    const expected = inductionMilliTeslas * 1e-3 * currentAmperes * lengthCentimetres * 1e-2 * (angleCase === 1 ? 0.5 : 1);
    assert.ok(Math.abs(task.answerValue - expected) < 1e-10);
    assert.equal(task.answerUnit, "Н");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
