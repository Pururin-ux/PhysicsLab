import assert from "node:assert/strict";
import test from "node:test";
import { buildReviewPlan, countDueReviews } from "./review-plan.ts";
import type { AppProgress } from "../stores/progress-store.ts";

function progressWithWeaknesses(
  weakTraps: Record<string, number>,
  lastPracticedAt = "2000-01-01T10:00:00.000Z",
  weakTrapLastSeenAt: Record<string, string> = Object.fromEntries(
    Object.keys(weakTraps).map((key) => [key, lastPracticedAt]),
  ),
): AppProgress {
  return {
    version: 1,
    topics: {
      kinematics: {
        solved: 10,
        correct: 7,
        completedSessions: 1,
        weakTraps,
        weakTrapLastSeenAt,
        lastPracticedAt,
      },
      dynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        lastPracticedAt: null,
      },
      electrodynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        lastPracticedAt: null,
      },
      thermodynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        lastPracticedAt: null,
      },
    },
  };
}

test("buildReviewPlan promotes repeated or old misconceptions to due today", () => {
  const progress = progressWithWeaknesses({
    "vt-area:прочитал высоту вместо площади": 1,
    "vt-slope:взял скорость вместо наклона": 3,
  });

  const plan = buildReviewPlan(progress, 5, new Date("2026-07-05T10:00:00.000Z"));

  assert.equal(plan[0].skillId, "vt-slope");
  assert.equal(plan[0].urgency, "today");
  assert.equal(plan[0].dueLabel, "Повторить сегодня");
  assert.equal(countDueReviews(progress), 2);
});

test("fresh single misconception can wait", () => {
  const progress = progressWithWeaknesses(
    { "vt-area:прочитал высоту вместо площади": 1 },
    "2026-07-05T10:00:00.000Z",
  );

  const plan = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"));

  assert.equal(plan.length, 1);
  assert.equal(plan[0].urgency, "later");
  assert.equal(plan[0].dueLabel, "Можно позже");
});

test("fresh misconception age is tracked per weakness, not per topic", () => {
  const progress = progressWithWeaknesses(
    { "vt-area:прочитал высоту вместо площади": 1 },
    "2026-07-01T10:00:00.000Z",
    { "vt-area:прочитал высоту вместо площади": "2026-07-05T10:00:00.000Z" },
  );

  const plan = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"));

  assert.equal(plan[0].urgency, "later");
});
