import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { formulaReference } from "../physics/formula-reference.ts";
import { getReferenceSolution, referencePilotIds } from "./reference-solutions.ts";
import {
  buildFormulaHref,
  getFormulaEntriesForSkill,
  getFormulaReferenceView,
  getLearningDestination,
  getLearningDestinationForFamily,
} from "./learning-links.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata } from "./taxonomy.ts";

test("every generated family has one exact learning destination", () => {
  for (const template of templateRegistry) {
    const destination = getLearningDestinationForFamily(template.id);
    assert.ok(destination, `${template.id} must resolve to a learning destination`);
    assert.equal(destination.familyId, template.id);
    assert.equal(destination.taskHref, `/tasks/${template.id}`);
    assert.equal(destination.practiceHref, `/practice/family/${template.id}`);
  }
});

test("learning destinations are driven by metadata, not display copy", () => {
  for (const metadata of Object.values(taskLearningMetadataByTemplateId)) {
    const destination = getLearningDestination(metadata.skillId);
    assert.ok(destination);
    assert.equal(destination.familyId, metadata.templateId);
    assert.ok(destination.skillId in skillMetadata);
  }

  assert.equal(getLearningDestination("not-a-skill"), null);
  assert.equal(getLearningDestinationForFamily("not-a-template"), null);
});

test("formula links expose related task families through canonical skill ids", () => {
  const view = getFormulaReferenceView();
  const visibleFormulaIds = new Set(view.flatMap((group) => group.entries.map((entry) => entry.id)));

  for (const group of formulaReference) {
    for (const entry of group.entries) {
      assert.ok(visibleFormulaIds.has(entry.id));
      assert.equal(buildFormulaHref(entry.id), `/formulas?formula=${encodeURIComponent(entry.id)}`);

      for (const skillId of entry.relatedSkillIds) {
        const destination = getLearningDestination(skillId);
        assert.ok(destination, `${entry.id} points to an unknown learning skill ${skillId}`);
        assert.ok(entry.relatedSkillIds.length >= 1);
      }
    }
  }

  assert.ok(getFormulaEntriesForSkill("ohm-law").some((entry) => entry.id === "ohm-law"));
  assert.deepEqual(getFormulaEntriesForSkill("not-a-skill"), []);
});

test("reference solution pilots remain an explicit subset of task families", () => {
  for (const familyId of referencePilotIds) {
    assert.ok(getLearningDestinationForFamily(familyId));
    assert.ok(getReferenceSolution(familyId));
  }

  assert.equal(getReferenceSolution("unit-conversion-speed"), undefined);
});
