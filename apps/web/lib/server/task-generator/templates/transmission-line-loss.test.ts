import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("line heating uses current squared for each active-line case", () => {
  const tasks = generateTasks("transmission-line-loss", 5);
  const blueprint = getBlueprint("transmission-line-loss");
  const cases = [
    { watts: 120, volts: 24, ohms: 0.4, loss: 10 },
    { watts: 120, volts: 60, ohms: 0.4, loss: 1.6 },
    { watts: 96, volts: 24, ohms: 0.5, loss: 8 },
    { watts: 96, volts: 48, ohms: 0.5, loss: 2 },
    { watts: 60, volts: 30, ohms: 0.25, loss: 1 },
  ];

  assert.deepEqual(tasks.map(task => task.answerValue), cases.map(item => item.loss));
  for (const task of tasks) {
    const item = cases[task.params.caseId - 1];
    assert.equal((item.watts / item.volts) ** 2 * item.ohms, item.loss);
    assert.ok(item.loss < item.watts);
    assert.equal(task.answerUnit, "Вт");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("активное сопротивление"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
