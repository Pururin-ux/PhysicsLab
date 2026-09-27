import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("length conversion keeps the measured length when each metric prefix changes", () => {
  const templateId = "length-unit-conversion";
  const blueprint = getBlueprint(templateId);
  const tasks = generateTasks(templateId, 48);
  const metersPerUnit: Record<string, number> = {
    км: 1000,
    дм: 0.1,
    см: 0.01,
    мм: 0.001,
  };
  const seenUnits = new Set<string>();

  assert.equal(tasks.length, 48);
  for (const task of tasks) {
    const measurement = task.text.match(/равна ([\d\s,]+) (км|дм|см|мм)\./u);
    assert.ok(measurement, task.text);
    const value = Number(measurement[1].replace(/[\s\u00a0\u202f]/gu, "").replace(",", "."));
    const unit = measurement[2];

    seenUnits.add(unit);
    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.answerUnit, "м");
    assert.equal(value * metersPerUnit[unit], task.answerValue);
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }

  assert.deepEqual([...seenUnits].sort(), ["дм", "км", "мм", "см"].sort());
});
