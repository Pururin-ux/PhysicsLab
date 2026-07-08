import assert from "node:assert/strict";
import test from "node:test";
import {
  getDefaultHelpTarget,
  getHelpTargetForMistake,
  getHelpTargetForTask,
  topicHelpSections,
  type HelpableQuizTask,
} from "./topic-help.ts";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata } from "./taxonomy.ts";

function task(overrides: Partial<HelpableQuizTask>): HelpableQuizTask {
  return {
    blueprint: "unknown",
    text: "Задача без явной темы.",
    ...overrides,
  };
}

test("task learning metadata covers every generator template", () => {
  const templateIds = templateRegistry.map((entry) => entry.id).sort();
  const metadataIds = Object.keys(taskLearningMetadataByTemplateId).sort();

  assert.deepEqual(
    templateIds.filter((id) => !taskLearningMetadataByTemplateId[id]),
    [],
  );
  assert.deepEqual(
    metadataIds.filter((id) => !templateIds.includes(id as (typeof templateIds)[number])),
    [],
  );
});

test("task learning metadata points to valid help sections and skills", () => {
  for (const metadata of Object.values(taskLearningMetadataByTemplateId)) {
    assert.equal(metadata.templateId in taskLearningMetadataByTemplateId, true);
    assert.equal(metadata.skillId in skillMetadata, true, metadata.templateId);
    assert.equal(
      topicHelpSections[metadata.topicId].some(
        (section) => section.id === metadata.helpSectionId,
      ),
      true,
      `${metadata.templateId} -> ${metadata.topicId}/${metadata.helpSectionId}`,
    );
  }
});

test("explicit template metadata wins before regex fallback", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "kinetic-energy",
      text: "На графике v(t) сила меняется, но вопрос про энергию движения.",
      formula: "E_k = \\frac{mv^2}{2}",
    }),
  );

  assert.equal(target.topicId, "dynamics");
  assert.equal(target.sectionId, "kinetic-energy");
  assert.equal(target.reason, "task");
});

test("stable misconception id can override task metadata", () => {
  const target = getHelpTargetForMistake(
    task({
      blueprint: "newton-second",
      formula: "F = ma",
    }),
    "wrong-force-direction",
  );

  assert.equal(target.topicId, "dynamics");
  assert.equal(target.sectionId, "resultant-force");
  assert.equal(target.reason, "mistake");
});

test("v(t) graph task maps to motion graphs", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "graph-area",
      graph: { type: "vt" },
      text: "Найди перемещение по графику v(t).",
    }),
  );

  assert.equal(target.topicId, "kinematics");
  assert.equal(target.sectionId, "motion-graphs");
});

test("v(t) area or slope wording wins over generic formula substitution", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "formula-substitution",
      text: "На графике v(t) найди перемещение как площадь под линией.",
      formula: "s = S_{v(t)}",
    }),
    "kinematics",
  );

  assert.equal(target.topicId, "kinematics");
  assert.equal(target.sectionId, "motion-graphs");
});

test("accelerated formula maps to accelerated motion", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "formula-substitution",
      formula: "x = x_0 + v_0 t + \\frac{a t^2}{2}",
    }),
    "kinematics",
  );

  assert.equal(target.sectionId, "accelerated-motion");
});

test("F=ma task maps to Newton second law", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "newton-second",
      formula: "F = ma",
    }),
  );

  assert.equal(target.topicId, "dynamics");
  assert.equal(target.sectionId, "newton-second-law");
});

test("Ohm task maps to Ohm law", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "ohm-law",
      formula: "I = \\frac{U}{R}",
    }),
  );

  assert.equal(target.topicId, "electrodynamics");
  assert.equal(target.sectionId, "ohms-law");
});

test("charge sharing task maps to charge sharing", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "charge-sharing",
      text: "Два одинаковых проводника привели в контакт. Найди заряд после контакта.",
    }),
  );

  assert.equal(target.sectionId, "charge-sharing");
});

test("gas equation task maps to gas equation", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "ideal-gas-state",
      formula: "pV = nRT",
    }),
  );

  assert.equal(target.topicId, "thermodynamics");
  assert.equal(target.sectionId, "gas-equation");
});

test("heating and melting task maps to staged heating", () => {
  const target = getHelpTargetForTask(
    task({
      blueprint: "phase-change-heat",
      text: "Лёд сначала нагревается, потом плавится.",
    }),
  );

  assert.equal(target.sectionId, "heating-melting");
});

test("unknown task falls back to first section of hinted topic", () => {
  const target = getHelpTargetForTask(task({ blueprint: "unknown" }), "thermodynamics");
  const fallback = getDefaultHelpTarget("thermodynamics");

  assert.equal(target.topicId, "thermodynamics");
  assert.equal(target.sectionId, fallback.sectionId);
  assert.equal(target.reason, fallback.reason);
});

test("mistake trap can override task target", () => {
  const target = getHelpTargetForMistake(
    task({
      blueprint: "formula-substitution",
      formula: "x = x_0 + v_0 t + \\frac{a t^2}{2}",
    }),
    "Взял площадь/наклон графика v(t) не с того участка.",
    "kinematics",
  );

  assert.equal(target.reason, "mistake");
  assert.equal(target.sectionId, "motion-graphs");
});
