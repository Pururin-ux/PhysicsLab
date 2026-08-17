import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { buildCoverageSections } from "./coverage.ts";

test("coverage map accounts for every generated family exactly once", () => {
  const familyIds = templateRegistry.map((template) => template.id);
  const coverage = buildCoverageSections(familyIds);
  const coveredFamilyIds = coverage.flatMap((section) => section.familyIds);

  assert.equal(coverage.length, 6);
  assert.equal(coveredFamilyIds.length, familyIds.length);
  assert.deepEqual(new Set(coveredFamilyIds), new Set(familyIds));
  assert.equal(new Set(coveredFamilyIds).size, familyIds.length);
});

test("coverage map remains explicit about partial and absent sections", () => {
  const coverage = buildCoverageSections(templateRegistry.map((template) => template.id));
  const mechanics = coverage.find((section) => section.id === "mechanics");
  const quantum = coverage.find((section) => section.id === "quantum");
  const atomic = coverage.find((section) => section.id === "atomic");

  assert.equal(mechanics?.status, "partial");
  assert.ok((mechanics?.familyCount ?? 0) > 0);
  assert.equal(quantum?.status, "not-covered");
  assert.equal(quantum?.familyCount, 0);
  assert.equal(atomic?.status, "not-covered");
  assert.equal(atomic?.familyCount, 0);
  assert.ok(coverage.every((section) => section.knownGaps.length > 0));
});
