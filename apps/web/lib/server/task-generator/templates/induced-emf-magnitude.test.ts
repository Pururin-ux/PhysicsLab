import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("induced EMF tasks use the change of flux per turn, turn count and elapsed time", () => {
  const blueprint = getBlueprint("induced-emf-magnitude");
  const tasks = generateTasks("induced-emf-magnitude", 80);

  assert.equal(tasks.length, 80);
  assert.equal(new Set(tasks.map(task => task.text)).size, 80);
  assert.equal(blueprint.solver({ turns: 2, fluxChangeMilliWb: 6, intervalMs: 10 }), 1.2);
  assert.equal(blueprint.solver({ turns: 4, fluxChangeMilliWb: 6, intervalMs: 10 }), 2.4);
  assert.equal(blueprint.solver({ turns: 2, fluxChangeMilliWb: 6, intervalMs: 20 }), 0.6);

  for (const task of tasks) {
    const { turns, fluxChangeMilliWb, intervalMs } = task.params;
    assert.ok(Math.abs(task.answerValue - turns * (fluxChangeMilliWb * 1e-3) / (intervalMs * 1e-3)) < 1e-9);
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /через каждый виток изменился по модулю/);
    assert.match(task.text, /мВб.*модуль ЭДС/);
    assert.doesNotMatch(task.text, /направлени/);
    assert.ok(task.explanation?.includes("10^{-3}"));
    assert.ok(task.explanation?.includes("\\text{Вб}"));
    assert.ok(task.options.some(option => option.misconception === "не учитываешь число одинаково ориентированных витков" && option.value === fluxChangeMilliWb / intervalMs));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
