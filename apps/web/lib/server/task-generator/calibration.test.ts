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
import { NUMERIC_TEMPLATE_IDS, PRECISION_CALIBRATED_IDS } from "./test-fixtures.ts";
import { decimalsOf } from "../../answer/numeric-answer.ts";

// These five groups participate in the calibrated diagnostic; quantum is a
// focused partial family, not a sixth diagnostic slot (PRODUCT.md).
const groups = ["kinematics", "dynamics", "electrodynamics", "thermodynamics", "optics"] as const;

async function api(template: string, batch = 0, count = 10) {
  const response = await GET(new Request(
    `http://localhost/api/tasks?template=${template}&batch=${batch}&count=${count}`,
  ));
  assert.equal(response.status, 200);
  return (await response.json()).tasks as Array<{ id: string; blueprint: string; difficulty: 1 | 2 | 3 }>;
}

test("reviewed bank preserves 111 templates, 48 numeric and 63 choice", () => {
  assert.equal(templateRegistry.length, 111);
  const numeric = templateRegistry.filter(({ id }) => generateTasks(id, 1)[0].answerFormat === "numeric_input");
  assert.deepEqual(new Set(numeric.map(entry => entry.id)), new Set(NUMERIC_TEMPLATE_IDS));
  assert.equal(numeric.length, 48);
  assert.equal(templateRegistry.length - numeric.length, 63);
});

test("every calibrated diagnostic topic supports D1, D2 and D3", () => {
  for (const group of groups) {
    const ids = getTemplateIdsByGroup(group);
    for (const difficulty of [1, 2, 3] as const) {
      assert.ok(ids.some((id) => supportsDifficulty(id, difficulty)), `${group} lacks D${difficulty}`);
    }
  }
});

test("partial quantum coverage stays explicit and rejects unsupported levels", async () => {
  assert.deepEqual(getTemplateIdsByGroup("quantum"), ["bohr-transition-radiation"]);
  assert.deepEqual(getDifficultyCounts("bohr-transition-radiation"), { 1: 8, 2: 0, 3: 0 });
  for (const difficulty of [2, 3]) {
    const response = await GET(new Request(
      "http://localhost/api/tasks?template=bohr-transition-radiation&difficulty=" + difficulty,
    ));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "UNSUPPORTED_DIFFICULTY");
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

test("precision-calibrated numeric families keep D1/D2/D3 limits", () => {
  for (const id of PRECISION_CALIBRATED_IDS) {
    for (const difficulty of [1, 2, 3] as const) {
      if (!supportsDifficulty(id, difficulty)) continue;
      for (const task of generateTasks(id, 500, { difficulty })) {
        assert.ok(decimalPlaces(task.answerValue) <= difficulty, `${id} D${difficulty}: ${task.answerValue}`);
      }
    }
  }
});

test("all numeric answers fit the independent three-decimal answer contract", () => {
  for (const id of NUMERIC_TEMPLATE_IDS) {
    for (const task of generateTasks(id, 500)) {
      assert.ok(decimalPlaces(task.answerValue) <= 3, id + ": exceeds numeric precision");
      assert.equal(decimalsOf(task.answerValue), decimalPlaces(task.answerValue));
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

test("diagnostic keeps two tasks per included topic and no unsupported sections", async () => {
  const tasks = await api("exam", 11);
  const groupsByBlueprint = new Map(templateRegistry.map((entry) => [entry.id, entry.group]));
  for (const group of groups) {
    assert.equal(tasks.filter((task) => groupsByBlueprint.get(task.blueprint as never) === group).length, 2);
  }
  assert.equal(tasks.length, 10);
  for (const group of ["measurements", "quantum"]) {
    assert.equal(tasks.filter(task => groupsByBlueprint.get(task.blueprint as never) === group).length, 0);
  }
});

test("invalid API difficulty is rejected", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&difficulty=4"));
  assert.equal(response.status, 400);
});
