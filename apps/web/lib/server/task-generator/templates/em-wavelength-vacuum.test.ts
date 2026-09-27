import assert from "node:assert/strict";
import test from "node:test";
import { generateTasks, getBlueprint } from "../generate.ts";
import { validateGeneratedTask } from "../validator.ts";

test("vacuum wavelength converts MHz and keeps c constant", () => {
  const tasks = generateTasks("em-wavelength-vacuum", 5);
  const blueprint = getBlueprint("em-wavelength-vacuum");
  const expected = [
    { frequencyMHz: 50, wavelengthM: 6 },
    { frequencyMHz: 75, wavelengthM: 4 },
    { frequencyMHz: 100, wavelengthM: 3 },
    { frequencyMHz: 120, wavelengthM: 2.5 },
    { frequencyMHz: 200, wavelengthM: 1.5 },
  ];

  assert.deepEqual(tasks.map(task => task.answerValue), expected.map(item => item.wavelengthM));
  for (const task of tasks) {
    const item = expected[task.params.caseId - 1];
    assert.equal(item.frequencyMHz * 1_000_000 * item.wavelengthM, 300_000_000);
    assert.equal(task.answerUnit, "м");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("в вакууме"));
    assert.ok(validateGeneratedTask(task, blueprint).valid);
  }
});
