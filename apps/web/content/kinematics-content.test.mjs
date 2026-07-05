import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import katex from "katex";

const tasksData = JSON.parse(
  await readFile(new URL("./tasks/kinematics-10.json", import.meta.url), "utf8"),
);
const blueprintsData = JSON.parse(
  await readFile(new URL("./blueprints/kinematics.json", import.meta.url), "utf8"),
);
const forbiddenSolutionField = ["sol", "ution"].join("");

test("kinematics task set matches MVP constraints", () => {
  assert.equal(tasksData.tasks.length, 10);

  const taskIds = new Set();
  for (const task of tasksData.tasks) {
    assert.equal(task.type, "single_choice");
    assert.equal(task.options.length, 4);
    assert.equal(taskIds.has(task.id), false);
    taskIds.add(task.id);
    assert.equal(task.options.some((option) => option.id === task.answer), true);
    assert.equal(forbiddenSolutionField in task, false);
    assert.equal(typeof task.trap, "string");
    assert.equal(typeof task.coach_lines.correct, "string");
    assert.equal(typeof task.coach_lines.wrong, "string");
    assert.equal(typeof task.coach_lines.hint, "string");

    for (const formula of [task.formula, task.explanation_latex].filter(Boolean)) {
      assert.doesNotThrow(() =>
        katex.renderToString(formula, {
          displayMode: true,
          throwOnError: true,
          strict: false,
        }),
      );
    }
  }
});

test("kinematics blueprints cover every task exactly once", () => {
  const taskIds = new Set(tasksData.tasks.map((task) => task.id));
  const coveredTaskIds = new Set();
  const blueprintIds = new Set();

  for (const blueprint of blueprintsData.blueprints) {
    assert.equal(blueprintIds.has(blueprint.id), false);
    blueprintIds.add(blueprint.id);
    assert.equal(typeof blueprint.skill, "string");
    assert.equal(typeof blueprint.trap, "string");

    for (const taskId of blueprint.task_ids) {
      assert.equal(taskIds.has(taskId), true);
      assert.equal(coveredTaskIds.has(taskId), false);
      coveredTaskIds.add(taskId);
    }
  }

  assert.deepEqual(coveredTaskIds, taskIds);
  for (const task of tasksData.tasks) {
    assert.equal(blueprintIds.has(task.blueprint), true);
  }
});
