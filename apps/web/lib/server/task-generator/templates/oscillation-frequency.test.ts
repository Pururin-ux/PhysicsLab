import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks } from "../generate.ts";

test("oscillation frequency variants preserve cycles per second and period units", () => {
  const tasks = generateTasks("oscillation-frequency", 4);

  assert.equal(tasks.length, 4);
  assert.deepEqual(new Set(tasks.map(task => task.answerValue)), new Set([4, 3, 5]));
  assert.ok(tasks.every(task => task.answerUnit === "Гц"));
  assert.ok(tasks.every(task => task.explanation?.toLowerCase().includes("период")));
});
