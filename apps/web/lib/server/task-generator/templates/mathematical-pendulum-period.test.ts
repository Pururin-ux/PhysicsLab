import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("mathematical pendulum tasks use the small-angle period law and distinct lengths", () => {
  const tasks = generateTasks("mathematical-pendulum-period", 5);

  assert.deepEqual(tasks.map((task) => task.answerValue), [1, 1.42, 2.01, 3.01, 4.01]);
  assert.equal(new Set(tasks.map((task) => task.answerValue)).size, tasks.length);
  assert.ok(tasks.every((task) => task.answerUnit === "с"));
  assert.ok(tasks.every((task) => task.answerFormat === "numeric_input"));
  assert.ok(tasks.every((task) => task.text.includes("малых колебаний") && task.text.includes("м/с²")));
  assert.ok(tasks.every((task) => task.formula.includes("sqrt")));
  const blueprint = getBlueprint("mathematical-pendulum-period");
  assert.ok(tasks.every((task) => validateGeneratedTask(task, blueprint).valid));
});
