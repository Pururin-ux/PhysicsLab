import assert from "node:assert/strict";
import test from "node:test";
import { topics, upcomingTopics } from "./topics.ts";

test("product topics: пять активных тем и одна будущая", () => {
  assert.deepEqual(
    topics.map((topic) => topic.id),
    ["kinematics", "dynamics", "electrodynamics", "thermodynamics", "optics"],
  );
  assert.deepEqual(upcomingTopics.map((topic) => topic.id), ["quantum"]);
});

test("optics topic ведёт в тренировку и содержит семь навыков", () => {
  const optics = topics.find((topic) => topic.id === "optics");

  assert.ok(optics);
  assert.equal(optics.href, "/practice/optics-demo");
  assert.equal(optics.skillsCount, 7);
});
