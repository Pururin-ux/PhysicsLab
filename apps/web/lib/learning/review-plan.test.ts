import assert from "node:assert/strict";
import test from "node:test";
import { buildReviewPlan, countDueReviews } from "./review-plan.ts";
import { PROGRESS_VERSION, type AppProgress } from "../stores/progress-store.ts";

function progressWithWeaknesses(
  weakTraps: Record<string, number>,
  lastPracticedAt = "2000-01-01T10:00:00.000Z",
  weakTrapLastSeenAt: Record<string, string> = Object.fromEntries(
    Object.keys(weakTraps).map((key) => [key, lastPracticedAt]),
  ),
): AppProgress {
  return {
    version: PROGRESS_VERSION,
    pendingMistakes: {},
    topics: {
      measurements: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: null,
      },
      kinematics: {
        solved: 10,
        correct: 7,
        completedSessions: 1,
        weakTraps,
        weakTrapLastSeenAt,
        skillEvidence: {},
        lastPracticedAt,
      },
      dynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: null,
      },
      electrodynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: null,
      },
      thermodynamics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: null,
      },
      optics: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: null,
      },
      quantum: {
        solved: 0,
        correct: 0,
        completedSessions: 0,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
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

test("fresh single misconception gets an explicit delayed revisit", () => {
  const progress = progressWithWeaknesses(
    { "vt-area:прочитал высоту вместо площади": 1 },
    "2026-07-05T10:00:00.000Z",
  );

  const plan = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"));

  assert.equal(plan.length, 1);
  assert.equal(plan[0].urgency, "later");
  assert.equal(plan[0].dueLabel, "Вернуться завтра");
  assert.equal(
    plan[0].reason,
    "сначала оставим короткую паузу, затем проверим ещё раз",
  );
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

test("pending mistake resumes its exact session route", () => {
  const progress = progressWithWeaknesses({});
  progress.pendingMistakes["mixed:0:attempt::task-1"] = {
    sessionId: "mixed:0:attempt",
    taskId: "task-1",
    topicId: "kinematics",
    blueprint: "unit-conversion-speed",
    misconception: "перевёл только скорость",
    recordedAt: "2026-07-05T11:00:00.000Z",
    resumeHref: "/practice/kinematics-demo",
  };

  const plan = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"), [{
    sessionId: "mixed:0:attempt",
    taskId: "task-1",
    blueprint: "unit-conversion-speed",
  }]);

  assert.equal(plan[0].isPending, true);
  assert.equal(plan[0].practiceHref, "/practice/kinematics-demo");
  assert.equal(plan[0].dueLabel, "Есть черновик задачи");
});

test("resumable mistake stays in a short plan despite older frequent weaknesses", () => {
  const progress = progressWithWeaknesses({
    "vt-area:ошибка площади": 5,
    "vt-slope:ошибка наклона": 4,
    "average-speed-segments:ошибка среднего": 3,
  });
  progress.pendingMistakes["mixed:0:attempt::task-1"] = {
    sessionId: "mixed:0:attempt",
    taskId: "task-1",
    topicId: "kinematics",
    blueprint: "unit-conversion-speed",
    misconception: "перевёл только скорость",
    recordedAt: "2026-07-05T11:00:00.000Z",
    resumeHref: "/practice/kinematics-demo",
  };

  const plan = buildReviewPlan(progress, 3, new Date("2026-07-05T12:00:00.000Z"), [{
    sessionId: "mixed:0:attempt",
    taskId: "task-1",
    blueprint: "unit-conversion-speed",
  }]);

  assert.equal(plan.length, 3);
  assert.equal(plan[0].isPending, true);
  assert.equal(plan[0].practiceHref, "/practice/kinematics-demo");
});

test("pending mistake without a matching snapshot remains ordinary review", () => {
  const progress = progressWithWeaknesses({});
  progress.pendingMistakes["mixed:0:attempt::task-1"] = {
    sessionId: "mixed:0:attempt",
    taskId: "task-1",
    topicId: "kinematics",
    blueprint: "unit-conversion-speed",
    misconception: "перевёл только скорость",
    recordedAt: "2026-07-05T11:00:00.000Z",
    resumeHref: "/practice/kinematics-demo",
  };

  const missing = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"));
  const replaced = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"), [{
    sessionId: "mixed:0:another-attempt",
    taskId: "task-1",
    blueprint: "unit-conversion-speed",
  }]);
  const advanced = buildReviewPlan(progress, 5, new Date("2026-07-05T12:00:00.000Z"), [{
    sessionId: "mixed:0:attempt",
    taskId: "task-2",
    blueprint: "unit-conversion-speed",
  }]);

  for (const plan of [missing, replaced, advanced]) {
    assert.equal(plan[0].isPending, false);
    assert.equal(plan[0].practiceHref, "/practice/family/unit-conversion-speed");
    assert.notEqual(plan[0].dueLabel, "Есть черновик задачи");
  }
  assert.equal(Object.keys(progress.pendingMistakes).length, 1);
});
