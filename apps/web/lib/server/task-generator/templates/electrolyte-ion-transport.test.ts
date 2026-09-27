import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("electrolyte questions keep carriers and electrode polarity distinct", () => {
  const blueprint = getBlueprint("electrolyte-ion-transport");
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 2 }), { caseId: 2 }) ?? "", /отрицательному катоду/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 3 }), { caseId: 3 }) ?? "", /положительному аноду/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 4 }), { caseId: 4 }) ?? "", /теперь соединён с минусом/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 5 }), { caseId: 5 }) ?? "", /проводах электроны; в растворе/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 6 }), { caseId: 6 }) ?? "", /нет заметного свечения/);
  const tasks = generateTasks("electrolyte-ion-transport", 6);
  assert.equal(tasks.length, 6);
  for (const task of tasks) {
    assert.equal(task.answerFormat, "single_choice");
    assert.equal(new Set(task.options.map(option => option.text)).size, 4);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
