import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { checkBySkill } from "./task-focus.ts";
import { skillMetadata, type SkillId } from "./taxonomy.ts";
import { weaknessCopyBySkill } from "./weakness-labels.ts";

// Learning-словари разбросаны по нескольким файлам (taxonomy, task-focus,
// weakness-labels) и связаны с генератором только строковыми id. Этот тест —
// страж от дрейфа: новый шаблон нельзя добавить, не заведя навык и копию
// во всех словарях, иначе ученик увидит generic-fallback вместо разбора.

const skillIds = Object.keys(skillMetadata) as SkillId[];
const templateIds = templateRegistry.map((entry) => entry.id as string);

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
