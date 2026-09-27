import assert from "node:assert/strict";
import test from "node:test";
import { getBohrTransition } from "../../../physics/bohr-transition-model.ts";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

const templateId = "bohr-transition-radiation";

test("Bohr radiation tasks keep transition values and answer units aligned", () => {
  const blueprint = getBlueprint(templateId);
  const tasks = generateTasks(templateId, 8);
  const coveredVariants = new Set<string>();

  for (const task of tasks) {
    const { transitionId, quantity } = task.params;
    const levels = [
      { initialN: 3, finalN: 2 },
      { initialN: 4, finalN: 2 },
      { initialN: 5, finalN: 2 },
      { initialN: 6, finalN: 2 },
    ][transitionId - 1];

    assert.ok(levels);
    const transition = getBohrTransition(levels.initialN, levels.finalN);
    const expectedAnswer = quantity === 1
      ? Number(transition.frequency14.toFixed(2))
      : Math.round(transition.wavelengthNm);

    assert.equal(task.answerValue, expectedAnswer);
    assert.equal(task.answerUnit, quantity === 1 ? "10¹⁴ Гц" : "нм");
    assert.equal(task.answerFormat, "numeric_input");
    assert.match(task.text, /испускает фотон/);
    assert.ok(task.explanation?.includes("\\Delta E"));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
    coveredVariants.add(`${transitionId}:${quantity}`);
  }

  assert.equal(coveredVariants.size, 8);
});
