import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("parallel household loads calculate total current below, at, and above the model limit", () => {
  const blueprint = getBlueprint("household-load-current");
  const tasks = generateTasks("household-load-current", 5);

  assert.deepEqual(tasks.map(task => task.answerValue), [8, 9, 10, 11, 12]);

  for (const task of tasks) {
    const { firstPowerW, secondPowerW } = task.params;
    assert.equal(task.answerValue, (firstPowerW + secondPowerW) / 220);
    assert.equal(task.answerUnit, "А");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /220 В/u);
    assert.match(task.text, /только ток в амперах/u);
    assert.match(task.explanation ?? "", /P_\{\\Sigma\}/u);
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }

  assert.match(tasks[0].explanation ?? "", /ниже заданного.*10 А/u);
  assert.match(tasks[2].explanation ?? "", /ровно заданный.*10 А; превышения нет/u);
  assert.match(tasks[4].explanation ?? "", /выше заданного.*10 А/u);
  assert.match(tasks[2].text, /условным пределом 10 А/u);
});
