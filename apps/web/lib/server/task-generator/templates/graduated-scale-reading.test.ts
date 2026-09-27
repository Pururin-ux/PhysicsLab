import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("graduated scale readings subtract one mark to count intervals, then start at the labelled mark", () => {
  const templateId = "graduated-scale-reading";
  const blueprint = getBlueprint(templateId);
  const tasks = generateTasks(templateId, 72);

  assert.equal(tasks.length, 72);
  for (const task of tasks) {
    const match = task.text.match(/между отметками (\d+) мл и (\d+) мл нанесено (\d+) штрихов, включая крайние\. Все промежутки равны\. Нижняя точка мениска совпадает с делением №(\d+) после отметки (\d+) мл/u);
    assert.ok(match, task.text);
    const [, lowerRaw, upperRaw, markCountRaw, positionRaw, repeatedLowerRaw] = match;
    const lower = Number(lowerRaw);
    const upper = Number(upperRaw);
    const markCount = Number(markCountRaw);
    const position = Number(positionRaw);
    assert.equal(Number(repeatedLowerRaw), lower);
    assert.ok(position < markCount - 1);
    const expected = lower + ((upper - lower) / (markCount - 1)) * position;

    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.answerUnit, "мл");
    assert.equal(task.answerValue, expected);
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});
