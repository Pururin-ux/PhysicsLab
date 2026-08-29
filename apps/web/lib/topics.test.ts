import assert from "node:assert/strict";
import test from "node:test";
import { topics, upcomingTopics } from "./topics.ts";

test("product topics: семь активных тем и разделы в планах", () => {
  assert.deepEqual(
    topics.map((topic) => topic.id),
    [
      "kinematics",
      "dynamics",
      "electrodynamics",
      "thermodynamics",
      "optics",
      "oscillations",
      "quantum",
    ],
  );
  assert.deepEqual(upcomingTopics.map((topic) => topic.id), [
    "hydrostatics",
    "statics",
    "ac-current",
    "wave-optics",
  ]);
  // Будущие разделы не должны совпадать с активными темами.
  const activeIds = new Set<string>(topics.map((topic) => topic.id));
  assert.deepEqual(
    upcomingTopics.filter((topic) => activeIds.has(topic.id)),
    [],
  );
});

test("optics topic ведёт в тренировку и содержит семь навыков", () => {
  const optics = topics.find((topic) => topic.id === "optics");

  assert.ok(optics);
  assert.equal(optics.href, "/practice/optics-demo");
  assert.equal(optics.skillsCount, 7);
});
