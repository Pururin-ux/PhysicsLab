import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import { decimalPlaces } from "./difficulty.ts";
import {
  generateTasks,
  getDifficultyCounts,
  getTemplateIdsByGroup,
  supportsDifficulty,
  templateRegistry,
} from "./generate.ts";

const groups = ["kinematics", "dynamics", "electrodynamics", "thermodynamics", "optics"] as const;

async function api(template: string, batch = 0, count = 10) {
  const response = await GET(new Request(
    `http://localhost/api/tasks?template=${template}&batch=${batch}&count=${count}`,
  ));
  assert.equal(response.status, 200);
  return (await response.json()).tasks as Array<{ id: string; blueprint: string; difficulty: 1 | 2 | 3 }>;
}

test("calibration preserves 35 templates, 8 numeric and 27 choice", () => {
  assert.equal(templateRegistry.length, 35);
  const numeric = templateRegistry.filter(({ id }) => generateTasks(id, 1)[0].answerFormat === "numeric_input");
  assert.equal(numeric.length, 8);
  assert.equal(templateRegistry.length - numeric.length, 27);
});

test("every active topic supports D1, D2 and D3", () => {
  for (const group of groups) {
    const ids = getTemplateIdsByGroup(group);
    for (const difficulty of [1, 2, 3] as const) {
      assert.ok(ids.some((id) => supportsDifficulty(id, difficulty)), `${group} lacks D${difficulty}`);
    }
  }
});

test("difficulty filtering is deterministic and never silently falls back", () => {
  for (const { id } of templateRegistry) {
    const counts = getDifficultyCounts(id);
    for (const difficulty of [1, 2, 3] as const) {
      if (counts[difficulty] > 0) {
        const first = generateTasks(id, Math.min(20, counts[difficulty]), { difficulty, offset: 7 });
        const repeat = generateTasks(id, Math.min(20, counts[difficulty]), { difficulty, offset: 7 });
        assert.deepEqual(first, repeat);
        assert.ok(first.every((task) => task.difficulty === difficulty));
      } else {
        assert.throws(() => generateTasks(id, 1, { difficulty }), /does not support difficulty/);
      }
    }
  }
});

test("numeric answer precision follows D1/D2/D3 limits", () => {
  for (const { id } of templateRegistry) {
    if (generateTasks(id, 1)[0].answerFormat !== "numeric_input") continue;
    for (const difficulty of [1, 2, 3] as const) {
      if (!supportsDifficulty(id, difficulty)) continue;
      for (const task of generateTasks(id, 500, { difficulty })) {
        assert.ok(decimalPlaces(task.answerValue) <= difficulty, `${id} D${difficulty}: ${task.answerValue}`);
      }
    }
  }
});

test("topic and general mixed sessions use 5/3/2 at count=10", async () => {
  for (const template of ["mixed", "dynamics-mixed", "electro-mixed", "thermo-mixed", "optics-mixed", "exam"]) {
    for (const batch of [0, 1, 7, 19]) {
      const tasks = await api(template, batch);
      const counts = [1, 2, 3].map((difficulty) => tasks.filter((task) => task.difficulty === difficulty).length);
      assert.deepEqual(counts, [5, 3, 2], `${template} batch ${batch}`);
      assert.equal(new Set(tasks.map((task) => task.id)).size, 10);
    }
  }
});

test("exam keeps two tasks per active topic", async () => {
  const tasks = await api("exam", 11);
  const groupsByBlueprint = new Map(templateRegistry.map((entry) => [entry.id, entry.group]));
  for (const group of groups) {
    assert.equal(tasks.filter((task) => groupsByBlueprint.get(task.blueprint as never) === group).length, 2);
  }
});

test("invalid API difficulty is rejected", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&difficulty=4"));
  assert.equal(response.status, 400);
});
