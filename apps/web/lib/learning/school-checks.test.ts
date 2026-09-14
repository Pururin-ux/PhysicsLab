import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import {
  getSchoolCheckByGrade,
  getSchoolCheckByTemplate,
  schoolChecks,
} from "./school-checks.ts";

test("school checks use only existing families with exact explanations", () => {
  const availableFamilies = new Set(templateRegistry.map((entry) => entry.id));

  for (const check of schoolChecks) {
    assert.ok(check.familyIds.length >= 2);
    assert.equal(new Set(check.familyIds).size, check.familyIds.length);
    assert.equal(check.skills.length, check.familyIds.length);

    for (const familyId of check.familyIds) {
      assert.ok(availableFamilies.has(familyId));
      assert.ok(
        getLearningDestinationForFamily(familyId)?.explanation,
        `${familyId} must have an exact explanation before entering a class check`,
      );
    }
  }
});

test("school checks resolve only supported grades and template ids", () => {
  assert.equal(getSchoolCheckByGrade("7")?.template, "school-check-7");
  assert.equal(getSchoolCheckByGrade("7")?.href, "/practice/class-check/7");
  assert.equal(getSchoolCheckByGrade(8)?.template, "school-check-8");
  assert.deepEqual(
    {
      grade: getSchoolCheckByTemplate("school-check-9")?.grade,
      href: getSchoolCheckByTemplate("school-check-9")?.href,
    },
    { grade: 9, href: "/practice/class-check/9" },
  );
  assert.equal(getSchoolCheckByGrade("10"), null);
  assert.equal(getSchoolCheckByTemplate("exam"), null);
});

test("grade 9 check includes the available Archimedes-force lesson", () => {
  const gradeNine = getSchoolCheckByGrade(9);
  assert.ok(gradeNine?.familyIds.includes("archimedes-force"));
  assert.equal(gradeNine?.familyIds.length, gradeNine?.skills.length);
});
