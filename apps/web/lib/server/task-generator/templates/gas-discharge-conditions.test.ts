import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("gas discharge distinguishes external ionization, self-sustained discharge, and carriers", () => {
  const blueprint = getBlueprint("gas-discharge-conditions");
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 2 }), { caseId: 2 }) ?? "", /электроны и ионы/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 3 }), { caseId: 3 }) ?? "", /рекомбинирует/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 4 }), { caseId: 4 }) ?? "", /Самостоятельный/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 5 }), { caseId: 5 }) ?? "", /катоду.*аноду/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 6 }), { caseId: 6 }) ?? "", /электрически нейтральной/);
  const tasks = generateTasks("gas-discharge-conditions", 6);
  assert.equal(tasks.length, 6);
  for (const task of tasks) {
    assert.equal(task.answerFormat, "single_choice");
    assert.equal(new Set(task.options.map(option => option.text)).size, 4);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
