import assert from "node:assert/strict";
import test from "node:test";
import { formulaReference } from "../physics/formula-reference.ts";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { checkBySkill } from "./task-focus.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata, type SkillId } from "./taxonomy.ts";
import { weaknessCopyBySkill } from "./weakness-labels.ts";

// Learning-словари разбросаны по нескольким файлам (taxonomy, task-focus,
// weakness-labels) и связаны с генератором только строковыми id. Этот тест —
// страж от дрейфа: новый шаблон нельзя добавить, не заведя навык и копию
// во всех словарях, иначе ученик увидит generic-fallback вместо разбора.

const skillIds = Object.keys(skillMetadata) as SkillId[];
const templateIds = templateRegistry.map((entry) => entry.id as string);
const formulaReferenceSkillIds = new Set<SkillId>(
  formulaReference.flatMap((group) =>
    group.entries.flatMap((entry) => entry.relatedSkillIds),
  ),
);

const pr6FormulaReferenceSkillIds = [
  "average-speed-segments",
  "unit-conversion-speed",
  "work-force-distance",
  "electric-power",
  "gas-state-ratio",
  "heat-balance-simple",
] as const satisfies readonly SkillId[];

test("каждый шаблон генератора описан в таксономии навыков", () => {
  for (const id of templateIds) {
    assert.ok(
      id in skillMetadata,
      `Шаблон "${id}" не описан в skillMetadata (lib/learning/taxonomy.ts)`,
    );
  }
});

test("каждый навык таксономии имеет шаблон в генераторе", () => {
  for (const id of skillIds) {
    assert.ok(
      templateIds.includes(id),
      `Навык "${id}" есть в таксономии, но шаблона в генераторе нет — мёртвая запись?`,
    );
  }
});

test("группа шаблона совпадает с topicId навыка", () => {
  for (const entry of templateRegistry) {
    const skill = skillMetadata[entry.id as SkillId];
    assert.equal(
      entry.group,
      skill.topicId,
      `У "${entry.id}" group="${entry.group}", а в таксономии topicId="${skill.topicId}"`,
    );
  }
});

test("для каждого навыка есть копия в weakness-labels и task-focus", () => {
  for (const id of skillIds) {
    assert.ok(
      weaknessCopyBySkill[id],
      `Для "${id}" нет записи в weaknessCopyBySkill (раздел «Ошибки» покажет fallback)`,
    );
    assert.ok(
      checkBySkill[id],
      `Для "${id}" нет записи в checkBySkill (блок «Сейчас тренируем» покажет описание из таксономии)`,
    );
  }
});

test("every generated task skill is covered by formulaReference", () => {
  const missingMetadata = templateIds.filter((id) => !taskLearningMetadataByTemplateId[id]);
  assert.deepEqual(missingMetadata, []);

  for (const metadata of Object.values(taskLearningMetadataByTemplateId)) {
    assert.ok(
      metadata.skillId in skillMetadata,
      `${metadata.templateId} points to missing skillMetadata entry "${metadata.skillId}"`,
    );
  }

  const missingFormulaReferences = Object.values(taskLearningMetadataByTemplateId)
    .filter((metadata) => !formulaReferenceSkillIds.has(metadata.skillId as SkillId))
    .map((metadata) => `${metadata.templateId} -> ${metadata.skillId}`);

  assert.deepEqual(missingFormulaReferences, []);

  const referencedSkillIds = formulaReference.flatMap((group) =>
    group.entries.flatMap((entry) => entry.relatedSkillIds),
  );
  assert.ok(referencedSkillIds.every((skillId) => skillId in skillMetadata));

  for (const skillId of pr6FormulaReferenceSkillIds) {
    assert.ok(
      formulaReferenceSkillIds.has(skillId),
      `PR #6 task family "${skillId}" must keep a formulaReference entry`,
    );
  }
});
