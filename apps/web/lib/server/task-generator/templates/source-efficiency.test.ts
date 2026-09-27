import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("source efficiency reports the useful share of total source power", () => {
  const tasks = generateTasks("source-efficiency", 20);
  const blueprint = getBlueprint("source-efficiency");

  assert.equal(tasks.length, 20);

  for (const task of tasks) {
    const { R, r } = task.params;

    assert.ok(R > r);
    assert.equal(task.answerValue, Math.round((100 * R) / (R + r)));
    assert.equal(task.answerUnit, "%");
    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.diagram?.kind, "circuit");
    assert.match(task.explanation ?? "", /P_R=I\^2R/u);
    assert.match(task.explanation ?? "", /P_\{\\text\{ист\}\}=I\^2\(R\+r\)/u);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
