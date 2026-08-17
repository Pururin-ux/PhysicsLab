import assert from "node:assert/strict";
import test from "node:test";
import {
  $appProgress,
  PROGRESS_VERSION,
  migrateStoredProgress,
  recordCompletedSession,
  recordExamSession,
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

test("миграция v1 -> v3: weakTrapLastSeenAt и пустая оптика дополняются", () => {
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
  // Новая тема optics появляется с пустым прогрессом.
  assert.equal(migrated.topics.optics.solved, 0);
  assert.deepEqual(migrated.topics.optics.weakTraps, {});
});

test("миграция v2 -> v3: старые темы сохраняются, optics добавляется пустой", () => {
  const storedV2 = {
    version: 2,
    topics: {
      kinematics: {
        solved: 12,
        correct: 9,
        completedSessions: 3,
        weakTraps: { "vt-area:площадь": 1 },
        weakTrapLastSeenAt: { "vt-area:площадь": "2026-07-01T10:00:00.000Z" },
        lastPracticedAt: "2026-07-01T10:00:00.000Z",
      },
    },
  };

  const migrated = migrateStoredProgress(storedV2);

  assert.ok(migrated);
  assert.equal(migrated.version, PROGRESS_VERSION);
  assert.equal(migrated.topics.kinematics.solved, 12);
  assert.equal(
    migrated.topics.kinematics.weakTrapLastSeenAt["vt-area:площадь"],
    "2026-07-01T10:00:00.000Z",
  );
  assert.equal(migrated.topics.optics.completedSessions, 0);
  assert.equal(migrated.topics.optics.lastPracticedAt, null);
});

test("миграция v3: round-trip без потерь; битая optics нормализуется", () => {
  const storedV3 = {
    version: PROGRESS_VERSION,
    topics: {
      optics: {
        solved: 4,
        correct: 3,
        completedSessions: 1,
        weakTraps: { "reflection-angle:от зеркала": 1 },
        weakTrapLastSeenAt: {},
        lastPracticedAt: "2026-07-09T10:00:00.000Z",
      },
    },
  };

  const roundTrip = migrateStoredProgress(storedV3);
  assert.ok(roundTrip);
  assert.equal(roundTrip.topics.optics.solved, 4);
  assert.equal(roundTrip.topics.optics.weakTraps["reflection-angle:от зеркала"], 1);

  // Битое значение optics не роняет чтение и не трогает остальные темы.
  const malformed = migrateStoredProgress({
    version: PROGRESS_VERSION,
    topics: {
      kinematics: storedV3.topics.optics,
      optics: "мусор",
    },
  });
  assert.ok(malformed);
  assert.equal(malformed.topics.kinematics.solved, 4);
  assert.equal(malformed.topics.optics.solved, 0);
});

test("оптическая сессия записывается в прогресс как обычная тема", () => {
  resetProgress();

  recordCompletedSession({
    topicId: "optics",
    score: 2,
    total: 3,
    answers: [
      {
        format: "single_choice",
        taskId: "o-01",
        response: { kind: "single_choice", optionId: "a" },
        selectedOptionId: "a",
        correctOptionId: "b",
        isCorrect: false,
        attempt: 1,
        blueprint: "reflection-angle",
        taskTrap: "углы от нормали",
        selectedMisconception: "отсчитал угол от зеркала, а не от нормали",
      },
    ],
  });

  const progress = $appProgress.get();
  assert.equal(progress.topics.optics.completedSessions, 1);
  assert.equal(progress.topics.optics.solved, 3);
  assert.equal(progress.topics.optics.correct, 2);
  assert.equal(
    progress.topics.optics.weakTraps[
      "reflection-angle:отсчитал угол от зеркала, а не от нормали"
    ],
    1,
  );
});

test("оптический ответ из смешанной тренировки записывается в optics", () => {
  resetProgress();

  recordExamSession([
    {
      format: "numeric_input",
      taskId: "o-exam-01",
      response: { kind: "numeric_input", raw: "40", value: 40 },
      correctValue: 40,
      unit: "см",
      isCorrect: false,
      attempt: 1,
      blueprint: "plane-mirror-separation",
      taskTrap: "расстояние между предметом и изображением",
      selectedMisconception: "взял расстояние до зеркала вместо расстояния между предметом и изображением",
    },
  ]);

  const optics = $appProgress.get().topics.optics;
  assert.equal(optics.solved, 1);
  assert.equal(optics.correct, 0);
  assert.equal(
    optics.weakTraps[
      "plane-mirror-separation:взял расстояние до зеркала вместо расстояния между предметом и изображением"
    ],
    1,
  );
});

test("миграция: незнакомая версия хранилища сбрасывается в null", () => {
  assert.equal(migrateStoredProgress({ version: 99, topics: {} }), null);
  assert.equal(migrateStoredProgress({ topics: {} }), null);
  assert.equal(migrateStoredProgress("мусор"), null);
});
