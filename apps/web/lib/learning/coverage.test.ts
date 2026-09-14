import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { buildCoverageSections, EXAM_PROGRAM_SOURCE } from "./coverage.ts";

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
  assert.deepEqual(
    mechanics?.catalogDestinations.map(({ id, familyCount }) => ({
      id,
      familyCount,
    })).sort((a,b)=>a.id.localeCompare(b.id)),
    [
      { id: "family:density-volume-ratio", familyCount: 1 },
      { id: "topic:dynamics", familyCount: 18 },
      { id: "topic:kinematics", familyCount: 9 },
    ],
  );
  assert.deepEqual(quantum?.catalogDestinations, []);
  assert.deepEqual(atomic?.catalogDestinations, []);
});

test("coverage follows the verified 2026 exam sections", () => {
  const coverage = buildCoverageSections(templateRegistry.map((template) => template.id));
  const mechanics = coverage.find((section) => section.id === "mechanics");
  const molecular = coverage.find((section) => section.id === "molecular");

  assert.equal(EXAM_PROGRAM_SOURCE.verificationStatus, "verified");
  assert.equal(
    coverage.reduce((sum, section) => sum + section.officialTaskCount, 0),
    30,
  );
  assert.ok(mechanics?.familyIds.includes("density-volume-ratio"));
  assert.ok(!molecular?.familyIds.includes("density-volume-ratio"));
  assert.equal(
    mechanics?.catalogDestinations.find(
      (destination) => destination.id === "family:density-volume-ratio",
    )?.href,
    "/tasks/density-volume-ratio?from=exam-program",
  );
});

test("coverage status follows the actual available catalog",()=>{
  assert.ok(buildCoverageSections([]).every(section=>section.status==="not-covered"&&section.familyCount===0));
  const onlyPressure=buildCoverageSections(["contact-pressure"]);
  assert.deepEqual(onlyPressure.filter(section=>section.status==="partial").map(section=>section.id),["mechanics"]);
});
