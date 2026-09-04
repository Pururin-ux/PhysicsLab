import assert from "node:assert/strict";
import test from "node:test";
import {
  filterTaskCatalog,
  normalizeCatalogSearch,
} from "./task-catalog.ts";
import { topics } from "../topics.ts";
import { getTaskCatalog, getTaskCatalogEntry } from "../server/task-catalog.ts";
import {
  getBlueprint,
  getDifficultyCounts,
  templateRegistry,
} from "../server/task-generator/generate.ts";
import { formulaReference } from "../physics/formula-reference.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";

const catalog = getTaskCatalog();

test("task catalog exactly covers the 35 generator templates", () => {
  assert.equal(catalog.length, 35);
  assert.deepEqual(
    new Set(catalog.map((entry) => entry.id)),
    new Set(templateRegistry.map((entry) => entry.id)),
  );
  assert.equal(new Set(catalog.map((entry) => entry.slug)).size, catalog.length);
  assert.equal(getTaskCatalogEntry("not-a-family"), undefined);
});

test("task catalog keeps the 8 numeric / 27 choice contract", () => {
  assert.equal(catalog.filter((entry) => entry.answerFormat === "numeric_input").length, 8);
  assert.equal(catalog.filter((entry) => entry.answerFormat === "single_choice").length, 27);
});

test("task catalog entries have complete student-facing metadata and active topics", () => {
  const activeTopics = new Set(topics.map((topic) => topic.id));

  for (const entry of catalog) {
    assert.ok(entry.title.trim(), `${entry.id}: empty title`);
    assert.ok(entry.shortDescription.trim(), `${entry.id}: empty description`);
    assert.ok(entry.skillLabel.trim(), `${entry.id}: empty skill label`);
    assert.ok(activeTopics.has(entry.topicId), `${entry.id}: inactive topic ${entry.topicId}`);
    assert.ok(entry.searchTerms.length > 0, `${entry.id}: no search terms`);
    assert.ok(entry.searchTerms.every((term) => term.trim()), `${entry.id}: empty search term`);
    assert.ok(!entry.title.includes(entry.id), `${entry.id}: internal id leaked into title`);
  }
});

test("all 35 task families keep one semantic contract across generator, reference and catalog", () => {
  const formulaEntriesBySkill = new Map(
    catalog.map((entry) => [
      entry.id,
      formulaReference
        .flatMap((group) => group.entries)
        .filter((formula) => formula.relatedSkillIds.includes(entry.id)),
    ]),
  );

  for (const entry of catalog) {
    const blueprint = getBlueprint(entry.id);
    const metadata = taskLearningMetadataByTemplateId[entry.id];
    const formulas = formulaEntriesBySkill.get(entry.id) ?? [];

    assert.ok(metadata, `${entry.id}: missing learning metadata`);
    assert.equal(metadata.skillId, entry.id, `${entry.id}: metadata points to another family`);
    assert.equal(metadata.topicId, entry.topicId, `${entry.id}: topic drift`);

    assert.ok(blueprint.formula?.trim(), `${entry.id}: missing generator formula`);
    assert.ok(
      entry.formulaAliases.includes(blueprint.formula),
      `${entry.id}: catalog lost the generator formula`,
    );
    assert.ok(formulas.length > 0, `${entry.id}: no formula reference`);
    assert.ok(
      formulas.every((formula) => formula.limitation.trim()),
      `${entry.id}: formula has no applicability boundary`,
    );
    assert.ok(
      formulas.every(
        (formula) =>
          formula.symbols.length > 0 &&
          formula.symbols.every(
            (symbol) => symbol.latex.trim() && symbol.description.trim(),
          ),
      ),
      `${entry.id}: formula symbols or unit descriptions are incomplete`,
    );

    assert.ok(blueprint.trap?.trim(), `${entry.id}: missing family-specific mistake`);
    assert.equal(
      entry.commonMistake,
      blueprint.trap.trim(),
      `${entry.id}: task page shows a mistake from another concept`,
    );
  }
});

test("catalog difficulty ranges and visual markers come from real blueprints", () => {
  for (const entry of catalog) {
    const counts = getDifficultyCounts(entry.id);
    const supported = ([1, 2, 3] as const).filter((level) => counts[level] > 0);
    assert.equal(entry.difficultyRange.min, supported[0], `${entry.id}: wrong min difficulty`);
    assert.equal(
      entry.difficultyRange.max,
      supported[supported.length - 1],
      `${entry.id}: wrong max difficulty`,
    );

    const blueprint = getBlueprint(entry.id);
    assert.equal(entry.visualKinds.includes("graph"), Boolean(blueprint.graph));
    assert.equal(entry.visualKinds.includes("diagram"), Boolean(blueprint.diagram));
  }
});

test("catalog topic counts match the active generator distribution", () => {
  assert.deepEqual(
    Object.fromEntries(
      topics.map((topic) => [
        topic.id,
        catalog.filter((entry) => entry.topicId === topic.id).length,
      ]),
    ),
    {
      kinematics: 6,
      dynamics: 10,
      electrodynamics: 6,
      thermodynamics: 6,
      optics: 7,
    },
  );
});

test("catalog search handles names, formulas, graphs, aliases and ё/е", () => {
  const ohmResults = filterTaskCatalog(catalog, "закон Ома");
  assert.equal(ohmResults[0]?.id, "ohm-law");
  assert.ok(ohmResults.some((entry) => entry.id === "ohm-law"));
  assert.ok(filterTaskCatalog(catalog, "I=U/R").some((entry) => entry.id === "ohm-law"));
  assert.ok(filterTaskCatalog(catalog, "v(t)").some((entry) => entry.id === "vt-slope"));
  assert.ok(filterTaskCatalog(catalog, "площадь под графиком").some((entry) => entry.id === "vt-area"));
  assert.ok(
    filterTaskCatalog(catalog, "тепловой баланс").some(
      (entry) => entry.id === "heat-balance-simple",
    ),
  );
  assert.ok(filterTaskCatalog(catalog, "объём").some((entry) => entry.id === "density-volume-ratio"));
});

test("catalog filtering supports empty and combined topic queries", () => {
  assert.equal(filterTaskCatalog(catalog, "").length, 35);
  const electrodynamicsLawResults = filterTaskCatalog(
    catalog,
    "закон",
    "electrodynamics",
  );
  assert.equal(electrodynamicsLawResults[0]?.id, "ohm-law");
  assert.ok(electrodynamicsLawResults.every((entry) => entry.topicId === "electrodynamics"));
  assert.equal(filterTaskCatalog(catalog, "закон Ома", "kinematics").length, 0);
  assert.equal(normalizeCatalogSearch("  ТЁПЛОВОЙ   БАЛАНС  "), "тепловой баланс");
});
