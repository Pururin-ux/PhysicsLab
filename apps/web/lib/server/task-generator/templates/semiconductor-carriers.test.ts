import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("semiconductor cases preserve source condition, carrier model and neutrality", () => {
  const blueprint = getBlueprint("semiconductor-carriers");
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 1 }), { caseId: 1 }) ?? "", /уменьшится.*возрастёт/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 2 }), { caseId: 2 }) ?? "", /металле R возрастает.*полупроводнике R уменьшается/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 3 }), { caseId: 3 }) ?? "", /Собственная.*электроны и дырки/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 4 }), { caseId: 4 }) ?? "", /n-тип.*электроны.*нейтральным/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 5 }), { caseId: 5 }) ?? "", /p-тип.*дырки.*нейтральным/);
  assert.match(blueprint.optionText?.(blueprint.solver({ caseId: 6 }), { caseId: 6 }) ?? "", /модель незаполненной связи/);
  const tasks = generateTasks("semiconductor-carriers", 6);
  assert.equal(tasks.length, 6);
  for (const task of tasks) {
    assert.equal(task.answerFormat, "single_choice");
    assert.equal(new Set(task.options.map(option => option.text)).size, 4);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
