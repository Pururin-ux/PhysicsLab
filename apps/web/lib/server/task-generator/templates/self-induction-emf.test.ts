import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("self-induction tasks use L, current change and duration with coherent milli-units", () => {
  const blueprint = getBlueprint("self-induction-emf");
  const tasks = generateTasks("self-induction-emf", 50);
  assert.equal(tasks.length, 50);
  assert.equal(new Set(tasks.map(task => task.text)).size, 50);
  assert.equal(blueprint.solver({ inductanceMilliHenries: 40, currentChangeAmperes: 2, durationMilliseconds: 10 }), 8);
  assert.equal(blueprint.solver({ inductanceMilliHenries: 40, currentChangeAmperes: 2, durationMilliseconds: 20 }), 4);

  for (const task of tasks) {
    const { inductanceMilliHenries, currentChangeAmperes, durationMilliseconds } = task.params;
    const expected = (inductanceMilliHenries * 1e-3) * currentChangeAmperes / (durationMilliseconds * 1e-3);
    assert.ok(Math.abs(task.answerValue - expected) < 1e-9);
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /равномерно выросла/);
    assert.ok(task.explanation?.includes("\\text{Гн}"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
