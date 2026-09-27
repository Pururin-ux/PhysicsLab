import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("Lorentz force family converts mT to T and keeps the answer in microNewtons", () => {
  const blueprint = getBlueprint("lorentz-force-magnitude");
  assert.equal(blueprint.solver({ chargeMicroCoulombs: 2, speedMetresPerSecond: 200, inductionMilliTeslas: 100 }), 40);
  const tasks = generateTasks("lorentz-force-magnitude", 20);
  assert.equal(tasks.length, 20);
  for (const task of tasks) {
    const { chargeMicroCoulombs, speedMetresPerSecond, inductionMilliTeslas } = task.params;
    assert.equal(task.answerValue, chargeMicroCoulombs * speedMetresPerSecond * inductionMilliTeslas / 1000);
    assert.equal(task.answerUnit, "мкН");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
