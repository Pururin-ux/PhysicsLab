import assert from "node:assert/strict";
import test from "node:test";
import {
  $appProgress,
  PROGRESS_VERSION,
  migrateStoredProgress,
  recordCompletedSession,
  resetProgress,
} from "./progress-store.ts";
import type { AnswerRecord } from "../../components/quiz/quiz-session-store.ts";

test("progress store records completed topic sessions as aggregates", () => {
  resetProgress();

  const answers: AnswerRecord[] = [
    {
      format: "single_choice",
      taskId: "d-01",
      response: { kind: "single_choice", optionId: "a" },
      selectedOptionId: "a",
      correctOptionId: "a",
      isCorrect: true,
      attempt: 1,
      blueprint: "newton-second",
      taskTrap: "единицы",
    },
    {
      format: "single_choice",
      taskId: "d-02",
      response: { kind: "single_choice", optionId: "b" },
      selectedOptionId: "b",
      correctOptionId: "c",
      isCorrect: false,
      attempt: 1,
      blueprint: "friction-force",
      taskTrap: "перепутал N и mg",
      selectedMisconception: "подставил массу вместо реакции опоры",
    },
    {
      format: "single_choice",
      taskId: "d-03",
      response: { kind: "single_choice", optionId: "b" },
      selectedOptionId: "b",
      correctOptionId: "c",
      isCorrect: false,
      attempt: 1,
      blueprint: "friction-force",
      taskTrap: "",
    },
  ];

  recordCompletedSession({
    topicId: "dynamics",
    score: 1,
    total: 3,
    answers,
  });

  const progress = $appProgress.get().topics.dynamics;

  assert.equal(progress.solved, 3);
  assert.equal(progress.correct, 1);
  assert.equal(progress.completedSessions, 1);
  assert.equal(progress.weakTraps["friction-force:подставил массу вместо реакции опоры"], 1);
  assert.equal(progress.weakTraps.undefined, undefined);
  assert.equal(typeof progress.lastPracticedAt, "string");
});

test("миграция v1 -> v2: weakTrapLastSeenAt дополняется пустым словарём", () => {
  const storedV1 = {
    version: 1,
    topics: {
      dynamics: {
        solved: 7,
        correct: 5,
        completedSessions: 2,
        weakTraps: { "friction-force:забыл g": 2 },
        lastPracticedAt: "2026-07-01T10:00:00.000Z",
      },
    },
  };

  const migrated = migrateStoredProgress(storedV1);

  assert.ok(migrated);
  assert.equal(migrated.version, PROGRESS_VERSION);
  assert.equal(migrated.topics.dynamics.solved, 7);
  assert.equal(migrated.topics.dynamics.weakTraps["friction-force:забыл g"], 2);
  assert.deepEqual(migrated.topics.dynamics.weakTrapLastSeenAt, {});
});

test("миграция: незнакомая версия хранилища сбрасывается в null", () => {
  assert.equal(migrateStoredProgress({ version: 99, topics: {} }), null);
  assert.equal(migrateStoredProgress({ topics: {} }), null);
  assert.equal(migrateStoredProgress("мусор"), null);
});
