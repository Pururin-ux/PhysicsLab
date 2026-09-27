import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("irregular body volume uses the rise between two complete water readings", () => {
  const blueprint = getBlueprint("irregular-body-volume");
  const tasks = generateTasks("irregular-body-volume", 48);

  assert.equal(blueprint.group, "measurements");
  assert.equal(blueprint.params.initialReadingMl.step, 2);
  assert.equal(blueprint.params.finalReadingMl.step, 2);
  assert.equal(tasks.length, 48);

  for (const task of tasks) {
    const { initialReadingMl, finalReadingMl } = task.params;
    const rise = finalReadingMl - initialReadingMl;

    assert.equal(initialReadingMl % 2, 0);
    assert.equal(finalReadingMl % 2, 0);
    assert.ok(rise >= 4 && rise <= 20);
    assert.equal(task.answerValue, rise);
    assert.equal(task.answerUnit, "см³");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes(`V₁ = ${initialReadingMl} мл`), task.text);
    assert.ok(task.text.includes(`V₂ = ${finalReadingMl} мл`), task.text);
    assert.deepEqual(task.diagram, {
      kind: "displacement-volume",
      spec: { initialReadingMl, finalReadingMl, divisionMl: 2 },
    });
    assert.match(task.text, /2 мл/u);
    assert.match(task.text, /полностью погрузила/u);
    assert.match(task.text, /не прол/u);
    assert.match(task.text, /пузырьков[^.]*нет/u);
    assert.deepEqual(
      new Set(task.options.map((option) => option.value)),
      new Set([rise, finalReadingMl, initialReadingMl + finalReadingMl, initialReadingMl]),
    );
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }

  assert.ok(new Set(tasks.map((task) => task.text)).size > 1);
});
