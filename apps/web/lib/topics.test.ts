import assert from "node:assert/strict";
import test from "node:test";
import { topics, upcomingTopics } from "./topics.ts";

test("product topics include the atomic transition lesson and practice family", () => {
  assert.deepEqual(
    topics.map((topic) => topic.id),
    ["measurements", "kinematics", "dynamics", "electrodynamics", "thermodynamics", "optics", "quantum"],
  );
  assert.equal(upcomingTopics.length, 0);
  const measurements = topics.find((topic) => topic.id === "measurements");
  assert.ok(measurements);
  assert.equal(measurements.skillsCount, 3);
  assert.equal(measurements.learnHref, "/learn/reading-scales");
  const quantum = topics.find((topic) => topic.id === "quantum");
  assert.ok(quantum);
  assert.equal(quantum.learnHref, "/learn/bohr-transitions");
  assert.equal(quantum.practiceHref, "/practice/family/bohr-transition-radiation");
});

test("optics topic ведёт в тренировку и содержит одиннадцать навыков", () => {
  const optics = topics.find((topic) => topic.id === "optics");

  assert.ok(optics);
  assert.equal(optics.href, "/practice/optics-lesson");
  assert.equal(optics.skillsCount, 11);
});
