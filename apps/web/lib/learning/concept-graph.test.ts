import assert from "node:assert/strict";
import test from "node:test";
import { formulaReference } from "../physics/formula-reference.ts";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { topics } from "../topics.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { topicHelpSections } from "./topic-help.ts";
import {
  ACTIVE_TOPIC_IDS,
  conceptNodes,
  getConceptNodeForTaskFamily,
  getIntroductoryConceptNode,
  getNextActiveTopicId,
  getPrerequisiteClosure,
  getStagePlanForConceptNode,
  isConceptPrerequisite,
  learningStagePlans,
  orderTaskFamiliesByConceptGraph,
  taskFamilyConceptNodeIds,
  topologicallySortConceptNodes,
  validateConceptGraph,
} from "./concept-graph.ts";

test("concept graph maps every one of the 35 task families exactly once", () => {
  const templateIds = templateRegistry.map((entry) => entry.id).sort();
  const mappedFamilyIds = Object.keys(taskFamilyConceptNodeIds).sort();

  assert.equal(templateIds.length, 35);
  assert.deepEqual(mappedFamilyIds, templateIds);
  assert.equal(new Set(mappedFamilyIds).size, templateIds.length);

  for (const template of templateRegistry) {
    const node = getConceptNodeForTaskFamily(template.id);
    assert.ok(node, `${template.id} must resolve to a concept node`);
    assert.equal(
      node.domainId,
      template.group,
      `${template.id} is mapped to ${node.domainId}, expected ${template.group}`,
    );
  }

  assert.equal(getConceptNodeForTaskFamily("not-a-family"), null);
});

test("concept graph has no missing prerequisites or cycles", () => {
  const validation = validateConceptGraph();
  assert.deepEqual(validation.issues, []);
  assert.equal(validation.valid, true);

  const sorted = topologicallySortConceptNodes();
  assert.equal(sorted.length, conceptNodes.length);
  assert.equal(new Set(sorted.map((node) => node.id)).size, conceptNodes.length);

  const positions = new Map(sorted.map((node, index) => [node.id, index]));
  for (const node of conceptNodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      assert.ok(
        (positions.get(prerequisiteId) ?? Number.MAX_SAFE_INTEGER) <
          (positions.get(node.id) ?? -1),
        `${prerequisiteId} must precede ${node.id}`,
      );
    }
  }
});

test("dynamics teaches interactions and resultant force before Newton and friction", () => {
  const sortedIds = topologicallySortConceptNodes().map((node) => node.id);
  const position = (id: (typeof sortedIds)[number]) => sortedIds.indexOf(id);

  assert.ok(position("dynamics-interactions") < position("dynamics-resultant-force-1d"));
  assert.ok(position("dynamics-resultant-force-1d") < position("dynamics-newton-second-law"));
  assert.ok(position("dynamics-newton-second-law") < position("dynamics-normal-force"));
  assert.ok(position("dynamics-normal-force") < position("dynamics-friction"));

  assert.ok(isConceptPrerequisite("dynamics-interactions", "dynamics-friction"));
  assert.ok(isConceptPrerequisite("dynamics-resultant-force-1d", "dynamics-friction"));
  assert.ok(isConceptPrerequisite("dynamics-newton-second-law", "dynamics-friction"));
  assert.ok(isConceptPrerequisite("dynamics-normal-force", "dynamics-friction"));

  assert.deepEqual(
    getPrerequisiteClosure("dynamics-friction").map((node) => node.id).filter((id) =>
      id.startsWith("dynamics-"),
    ),
    [
      "dynamics-interactions",
      "dynamics-resultant-force-1d",
      "dynamics-newton-second-law",
      "dynamics-normal-force",
    ],
  );
});

test("task families inherit concept order instead of registry order", () => {
  assert.deepEqual(
    orderTaskFamiliesByConceptGraph([
      "friction-force",
      "work-force-distance",
      "newton-second",
      "resultant-force",
      "resultant-force-2d",
    ]),
    [
      "resultant-force",
      "resultant-force-2d",
      "newton-second",
      "friction-force",
      "work-force-distance",
    ],
  );
});

test("next topic follows introductory nodes in the concept graph", () => {
  assert.equal(getNextActiveTopicId("kinematics"), "dynamics");
  assert.equal(getNextActiveTopicId("dynamics"), "electrodynamics");
  assert.equal(getNextActiveTopicId("electrodynamics"), "thermodynamics");
  assert.equal(getNextActiveTopicId("thermodynamics"), "optics");
  assert.equal(getNextActiveTopicId("optics"), null);
});

test("every active topic has one introductory learnable concept", () => {
  assert.deepEqual(
    [...ACTIVE_TOPIC_IDS].sort(),
    topics.map((topic) => topic.id).sort(),
  );

  for (const topic of topics) {
    const introduction = getIntroductoryConceptNode(topic.id);
    assert.ok(introduction, `${topic.id} needs an introductory concept`);
    assert.equal(introduction.domainId, topic.id);
    assert.equal(introduction.availability, "learnable");
    assert.equal(introduction.isIntroduction, true);
    assert.ok(getStagePlanForConceptNode(introduction.id));
  }
});

test("stage plan preserves prediction, observation and worked-to-independent fading", () => {
  assert.deepEqual(learningStagePlans["concept-first-v1"].steps, [
    { stageId: "context", repetitions: 1 },
    { stageId: "prediction", repetitions: 1 },
    { stageId: "observation", repetitions: 1 },
    { stageId: "causal-explanation", repetitions: 1 },
    { stageId: "worked-example", repetitions: 2 },
    { stageId: "faded-example", repetitions: 2 },
    { stageId: "independent-practice", repetitions: 2 },
    { stageId: "transfer", repetitions: 1 },
  ]);

  for (const node of conceptNodes) {
    assert.equal(
      getStagePlanForConceptNode(node.id) !== null,
      node.availability === "learnable",
      `${node.id} stage plan must match availability`,
    );
  }
});

test("concept references use current help and formula ids with explicit reference-only support", () => {
  const knownHelpIds = new Set(
    Object.values(topicHelpSections).flatMap((sections) => sections.map((section) => section.id)),
  );
  const knownFormulaEntries = formulaReference.flatMap((group) => group.entries);
  const knownFormulaIds = new Set(knownFormulaEntries.map((entry) => entry.id));

  for (const node of conceptNodes) {
    for (const helpSectionId of node.helpSectionIds) {
      assert.ok(knownHelpIds.has(helpSectionId), `${node.id}: unknown help id ${helpSectionId}`);
    }
    for (const support of node.formulaSupport) {
      assert.ok(knownFormulaIds.has(support.formulaId), `${node.id}: unknown formula ${support.formulaId}`);
    }
  }

  const referenceOnlyFormulaIds = knownFormulaEntries
    .filter((entry) => entry.relatedSkillIds.length === 0)
    .map((entry) => entry.id)
    .sort();
  const graphReferenceOnlyFormulaIds = conceptNodes
    .flatMap((node) => node.formulaSupport)
    .filter((support) => support.availability === "referenceOnly")
    .map((support) => support.formulaId)
    .sort();
  assert.deepEqual(graphReferenceOnlyFormulaIds, referenceOnlyFormulaIds);

  for (const [familyId, nodeId] of Object.entries(taskFamilyConceptNodeIds)) {
    const metadata = taskLearningMetadataByTemplateId[familyId];
    const node = conceptNodes.find((candidate) => candidate.id === nodeId);
    assert.ok(metadata, `${familyId}: missing task learning metadata`);
    assert.ok(node, `${familyId}: missing mapped concept node`);
    assert.ok(
      node.helpSectionIds.includes(metadata.helpSectionId),
      `${familyId}: concept node does not expose help ${metadata.helpSectionId}`,
    );
  }
});
