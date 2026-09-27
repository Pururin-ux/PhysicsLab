import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("spring oscillator period tasks use SI units and the rounded period formula", () => {
  const tasks = generateTasks("spring-oscillation-period", 5);

  assert.deepEqual(tasks.map((task) => task.answerValue), [0.31, 0.44, 0.63, 0.38, 0.5]);
  assert.equal(new Set(tasks.map((task) => task.answerValue)).size, tasks.length);
  assert.ok(tasks.every((task) => task.answerUnit === "с"));
  assert.ok(tasks.every((task) => task.answerFormat === "numeric_input"));
  assert.ok(tasks.every((task) => task.text.includes("кг") && task.text.includes("Н/м")));
  assert.ok(tasks.every((task) => task.formula.includes("sqrt")));
  assert.ok(tasks.every((task) => task.explanation?.includes("квадрат") || task.explanation?.includes("sqrt")));
  const blueprint = getBlueprint("spring-oscillation-period");
  assert.ok(tasks.every((task) => validateGeneratedTask(task, blueprint).valid));
});
