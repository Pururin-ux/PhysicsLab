import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("rectangular block volume uses all three measured lengths and converts millimetres before multiplying", () => {
  const blueprint = getBlueprint("rectangular-block-volume");
  const tasks = generateTasks("rectangular-block-volume", 48);
  const seenUnits = new Set<string>();

  assert.equal(tasks.length, 48);
  for (const task of tasks) {
    const edge = task.text.match(/a = (\d+) (мм|см), b = (\d+) см, c = (\d+) см/u);
    assert.ok(edge, task.text);
    const aCm = Number(edge[1]) / (edge[2] === "мм" ? 10 : 1);
    const bCm = Number(edge[3]);
    const cCm = Number(edge[4]);

    seenUnits.add(edge[2]);
    assert.equal(task.answerValue, aCm * bCm * cCm);
    assert.equal(task.answerUnit, "см³");
    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.difficulty, edge[2] === "мм" ? 2 : 1);
    assert.ok(task.explanation?.includes("косвенно"));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }

  assert.deepEqual([...seenUnits].sort(), ["мм", "см"]);
});
