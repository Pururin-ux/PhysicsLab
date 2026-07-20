import assert from "node:assert/strict";
import test from "node:test";
import {
  buildReviewDashboard,
  type ReviewDashboard,
} from "./review-intelligence.ts";
import {
  PROGRESS_VERSION,
  type AppProgress,
  type TopicProgress,
} from "../stores/progress-store.ts";
import { skillMetadata, type TopicId } from "./taxonomy.ts";

function emptyTopicProgress(): TopicProgress {
  return {
    solved: 0,
    correct: 0,
    completedSessions: 0,
    weakTraps: {},
    weakTrapLastSeenAt: {},
    lastPracticedAt: null,
  };
}

function progressWith(
  overrides: Partial<Record<TopicId, Partial<TopicProgress>>> = {},
): AppProgress {
  const topicIds: TopicId[] = [
    "kinematics",
    "dynamics",
    "electrodynamics",
    "thermodynamics",
  ];

  return {
    version: PROGRESS_VERSION,
    topics: Object.fromEntries(
      topicIds.map((topicId) => [
        topicId,
        { ...emptyTopicProgress(), ...overrides[topicId] },
      ]),
    ) as Record<TopicId, TopicProgress>,
  };
}

function topicById(dashboard: ReviewDashboard, topicId: TopicId) {
  const topic = dashboard.topicInsights.find((item) => item.topicId === topicId);
  assert.ok(topic);
  return topic;
}

test("buildReviewDashboard aggregates urgency, attempts and topic focus", () => {
  const oldSeenAt = "2026-07-03T10:00:00.000Z";
  const freshSeenAt = "2026-07-05T10:00:00.000Z";
  const progress = progressWith({
    kinematics: {
      solved: 8,
      correct: 5,
      completedSessions: 1,
      lastPracticedAt: oldSeenAt,
      weakTraps: {
        "vt-slope:used velocity instead of acceleration": 3,
        "vt-area:read graph height instead of area": 1,
      },
      weakTrapLastSeenAt: {
        "vt-slope:used velocity instead of acceleration": oldSeenAt,
        "vt-area:read graph height instead of area": oldSeenAt,
      },
    },
    electrodynamics: {
      solved: 4,
      correct: 2,
      completedSessions: 1,
      lastPracticedAt: freshSeenAt,
      weakTraps: {
        "ohm-law:multiplied voltage and resistance": 2,
      },
      weakTrapLastSeenAt: {
        "ohm-law:multiplied voltage and resistance": freshSeenAt,
      },
    },
  });

  const dashboard = buildReviewDashboard(
    progress,
    new Date("2026-07-05T12:00:00.000Z"),
  );

  assert.equal(dashboard.totalWeaknesses, 3);
  assert.equal(dashboard.totalAttempts, 6);
  assert.equal(dashboard.dueToday, 2);
  assert.equal(dashboard.nextSession, 1);
  assert.equal(dashboard.later, 0);
  assert.equal(dashboard.activeTopics, 2);
  assert.equal(dashboard.primaryAction?.skillId, "vt-slope");

  const kinematics = topicById(dashboard, "kinematics");
  const kinematicsSkillCount = Object.values(skillMetadata).filter(
    (skill) => skill.topicId === "kinematics",
  ).length;
  assert.equal(kinematics.tone, "gold");
  assert.equal(kinematics.dueToday, 2);
  assert.equal(kinematics.skillCoverageLabel, `2 из ${kinematicsSkillCount}`);
  assert.deepEqual(kinematics.topSkillTitles.length, 2);

  const electrodynamics = topicById(dashboard, "electrodynamics");
  const electrodynamicsSkillCount = Object.values(skillMetadata).filter(
    (skill) => skill.topicId === "electrodynamics",
  ).length;
  assert.equal(electrodynamics.tone, "cyan");
  assert.equal(electrodynamics.nextSession, 1);
  assert.equal(electrodynamics.skillCoverageLabel, `1 из ${electrodynamicsSkillCount}`);
});

test("buildReviewDashboard keeps an empty review state neutral", () => {
  const dashboard = buildReviewDashboard(
    progressWith(),
    new Date("2026-07-05T12:00:00.000Z"),
  );

  assert.equal(dashboard.plan.length, 0);
  assert.equal(dashboard.totalWeaknesses, 0);
  assert.equal(dashboard.totalAttempts, 0);
  assert.equal(dashboard.activeTopics, 0);
  assert.equal(dashboard.primaryAction, null);
  assert.ok(dashboard.topicInsights.every((topic) => topic.tone === "neutral"));
  assert.ok(dashboard.topicInsights.every((topic) => topic.intensity === 0));
});
