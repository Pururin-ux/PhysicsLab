import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import {
  getReferenceSolution,
  referencePilotIds,
  referenceSolutions,
  type ReferenceSolution,
} from "./reference-solutions.ts";

const expectedPilotIds = [
  "average-speed-segments",
  "friction-force",
  "heat-balance-simple",
  "ohm-law",
  "thin-lens-image-distance",
  "vt-area",
] as const;

function entries(): ReferenceSolution[] {
  return Object.values(referenceSolutions).filter(
    (solution): solution is ReferenceSolution => solution !== undefined,
  );
}

test("reference registry contains exactly the six approved pilots", () => {
  assert.equal(entries().length, 6);
  assert.deepEqual([...referencePilotIds].sort(), [...expectedPilotIds]);
  assert.deepEqual(entries().map(({ familyId }) => familyId).sort(), [...expectedPilotIds]);
});
test("every reference pilot belongs to the generator registry and has no orphan key", () => {
  const templateIds = new Set(templateRegistry.map(({ id }) => id));

  for (const [key, solution] of Object.entries(referenceSolutions)) {
    assert.ok(solution);
    assert.ok(templateIds.has(solution.familyId), `${solution.familyId} must exist in generator`);
    assert.equal(key, solution.familyId, "registry key and familyId must match");
  }

  assert.equal(getReferenceSolution("free-fall"), undefined);
});

test("reference content is complete, finite and serializable", () => {
  for (const solution of entries()) {
    assert.equal(solution.label, "Учебный пример");
    assert.ok(solution.statement.trim());
    assert.ok(solution.question.trim());
    assert.ok(solution.model.explanation.trim());
    assert.ok(solution.law.explanation.trim());
    assert.ok(solution.substitution.equations.length > 0);
    assert.ok(solution.answer.sentence.trim());
    assert.ok(solution.typicalMistake.title.trim());
    assert.ok(solution.typicalMistake.explanation.trim());

    for (const given of solution.givens) {
      assert.ok(given.symbol.trim());
      assert.ok(given.name.trim());
      assert.ok(given.displayValue.trim());
      assert.ok(Number.isFinite(given.value));
    }

    const expressions = [
      ...solution.law.formulas,
      ...solution.substitution.equations,
      solution.answer.expression,
      ...(solution.check?.expression ? [solution.check.expression] : []),
    ];
    for (const expression of expressions) {
      assert.ok(expression.latex.trim());
      assert.ok(expression.accessibleText.trim());
    }

    const json = JSON.stringify(solution);
    assert.ok(json.length > 0);
    assert.doesNotMatch(json, /https?:\/\//i);
    assert.doesNotMatch(json, /решу|adukar|sourceId|competitor/i);
    assert.deepEqual(JSON.parse(json), solution);
  }
});

test("visual discriminants are limited to the graph and lens pilots", () => {
  const visualPilots = entries()
    .filter((solution) => solution.visual)
    .map((solution) => [solution.familyId, solution.visual?.kind]);

  assert.deepEqual(visualPilots, [
    ["vt-area", "graph"],
    ["thin-lens-image-distance", "optics"],
  ]);

  const graph = getReferenceSolution("vt-area")?.visual;
  assert.equal(graph?.kind, "graph");
  const lens = getReferenceSolution("thin-lens-image-distance")?.visual;
  assert.equal(lens?.kind, "optics");
  if (lens?.kind === "optics") {
    assert.equal(lens.spec.scene, "thin_lens");
  }
});
