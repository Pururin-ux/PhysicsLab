import assert from "node:assert/strict";
import test from "node:test";
import {
  $appProgress,
  PROGRESS_VERSION,
  combineWeakTraps,
  migrateStoredProgress,
  recordCompletedSession,
  recordExamSession,
  recordMistakeImmediately,
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

test("миграция v1 -> v6: даты, оптика, pending и evidence дополняются", () => {
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
  assert.deepEqual(migrated.topics.optics.skillEvidence, {});
  assert.deepEqual(migrated.pendingMistakes, {});
});

test("миграция v2 -> v6: старые темы сохраняются, новые поля дополняются", () => {
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
  assert.deepEqual(migrated.pendingMistakes, {});
});

test("миграция v3 -> v6 сохраняет темы и добавляет pendingMistakes", () => {
  const storedV3 = {
    version: 3,
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
  assert.deepEqual(roundTrip.pendingMistakes, {});

  // Битое значение optics не роняет чтение и не трогает остальные темы.
  const malformed = migrateStoredProgress({
    version: 3,
    topics: {
      kinematics: storedV3.topics.optics,
      optics: "мусор",
    },
  });
  assert.ok(malformed);
  assert.equal(malformed.topics.kinematics.solved, 4);
  assert.equal(malformed.topics.optics.solved, 0);
});

test("миграция v4 -> v6 сохраняет pendingMistake и добавляет безопасный resumeHref", () => {
  const migrated = migrateStoredProgress({
    version: 4,
    topics: {},
    pendingMistakes: {
      "mixed:0:old::task-1": {
        sessionId: "mixed:0:old",
        taskId: "task-1",
        topicId: "kinematics",
        blueprint: "unit-conversion-speed",
        misconception: "перевёл только скорость",
        recordedAt: "2026-07-05T11:00:00.000Z",
      },
    },
  });

  assert.ok(migrated);
  assert.equal(migrated.version, PROGRESS_VERSION);
  assert.equal(
    migrated.pendingMistakes["mixed:0:old::task-1"]?.resumeHref,
    null,
  );
});

test("миграция v5 -> v6 сохраняет resumeHref и добавляет skillEvidence", () => {
  const migrated = migrateStoredProgress({
    version: 5,
    topics: {
      kinematics: {
        solved: 5,
        correct: 5,
        completedSessions: 1,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        lastPracticedAt: "2026-08-31T10:00:00.000Z",
      },
    },
    pendingMistakes: {},
  });

  assert.ok(migrated);
  assert.equal(migrated.version, PROGRESS_VERSION);
  assert.deepEqual(migrated.topics.kinematics.skillEvidence, {});
});

test("unlabelled transfer требует first try и повтор через 24 часа", () => {
  resetProgress();
  const correct: AnswerRecord = {
    format: "single_choice",
    taskId: "transfer-1",
    response: { kind: "single_choice", optionId: "c" },
    selectedOptionId: "c",
    correctOptionId: "c",
    isCorrect: true,
    attempt: 1,
    blueprint: "unit-conversion-speed",
    taskTrap: "перевёл только одну величину",
  };

  recordCompletedSession({
    topicId: "kinematics",
    score: 1,
    total: 1,
    answers: [correct],
    evidenceMode: "guided",
    completedAt: "2026-08-30T10:00:00.000Z",
  });
  assert.deepEqual($appProgress.get().topics.kinematics.skillEvidence, {});

  recordCompletedSession({
    topicId: "kinematics",
    score: 1,
    total: 1,
    answers: [correct],
    evidenceMode: "transfer",
    completedAt: "2026-08-31T10:00:00.000Z",
  });
  assert.deepEqual(
    $appProgress.get().topics.kinematics.skillEvidence["unit-conversion-speed"],
    {
      transferPassedAt: "2026-08-31T10:00:00.000Z",
      delayedRecallPassedAt: null,
    },
  );

  recordCompletedSession({
    topicId: "kinematics",
    score: 1,
    total: 1,
    answers: [correct],
    evidenceMode: "transfer",
    completedAt: "2026-09-01T09:59:59.000Z",
  });
  assert.equal(
    $appProgress.get().topics.kinematics.skillEvidence["unit-conversion-speed"]
      ?.delayedRecallPassedAt,
    null,
  );

  recordCompletedSession({
    topicId: "kinematics",
    score: 1,
    total: 1,
    answers: [correct],
    evidenceMode: "transfer",
    completedAt: "2026-09-01T10:00:00.000Z",
  });
  assert.equal(
    $appProgress.get().topics.kinematics.skillEvidence["unit-conversion-speed"]
      ?.delayedRecallPassedAt,
    "2026-09-01T10:00:00.000Z",
  );
});

test("незавершённая ошибка видна сразу и при завершении не считается дважды", () => {
  resetProgress();

  const answer: AnswerRecord = {
    format: "single_choice",
    taskId: "vt-pending-01",
    response: { kind: "single_choice", optionId: "a" },
    selectedOptionId: "a",
    correctOptionId: "d",
    isCorrect: false,
    attempt: 1,
    blueprint: "vt-slope",
    taskTrap: "разделил скорость на время вместо Δv/Δt",
    selectedMisconception: "разделил скорость на время вместо Δv/Δt",
  };
  const sessionId = "vt-slope:0:pending-test-attempt";

  assert.equal(
    recordMistakeImmediately({
      sessionId,
      topicId: "kinematics",
      answer,
      resumeHref: "/practice/kinematics-demo",
    }),
    true,
  );
  assert.equal(
    recordMistakeImmediately({ sessionId, topicId: "kinematics", answer }),
    false,
    "повторный submit того же task не создаёт дубль",
  );
  assert.equal(Object.keys($appProgress.get().pendingMistakes).length, 1);
  assert.equal(
    Object.values($appProgress.get().pendingMistakes)[0]?.resumeHref,
    "/practice/kinematics-demo",
  );
  assert.equal(
    combineWeakTraps($appProgress.get())[
      "vt-slope:разделил скорость на время вместо Δv/Δt"
    ],
    1,
  );
  assert.equal($appProgress.get().topics.kinematics.solved, 0);

  recordCompletedSession({
    topicId: "kinematics",
    score: 0,
    total: 1,
    answers: [answer],
    sessionId,
  });

  const completed = $appProgress.get();
  assert.deepEqual(completed.pendingMistakes, {});
  assert.equal(
    completed.topics.kinematics.weakTraps[
      "vt-slope:разделил скорость на время вместо Δv/Δt"
    ],
    1,
  );
  assert.equal(completed.topics.kinematics.solved, 1);
});

test("новое first-try решение закрывает старый pending, но сохраняет ошибку в истории", () => {
  resetProgress();
  const wrong: AnswerRecord = {
    format: "single_choice",
    taskId: "old-task",
    response: { kind: "single_choice", optionId: "a" },
    selectedOptionId: "a",
    correctOptionId: "c",
    isCorrect: false,
    attempt: 1,
    blueprint: "unit-conversion-speed",
    taskTrap: "перевёл только скорость",
    selectedMisconception: "перевёл только скорость",
  };
  recordMistakeImmediately({
    sessionId: "old-session",
    topicId: "kinematics",
    answer: wrong,
    resumeHref: "/practice/kinematics-demo",
  });

  recordCompletedSession({
    topicId: "kinematics",
    score: 1,
    total: 1,
    sessionId: "new-session",
    evidenceMode: "transfer",
    completedAt: "2026-09-01T12:00:00.000Z",
    answers: [{
      ...wrong,
      taskId: "new-task",
      response: { kind: "single_choice", optionId: "c" },
      selectedOptionId: "c",
      isCorrect: true,
    }],
  });

  const progress = $appProgress.get();
  assert.deepEqual(progress.pendingMistakes, {});
  assert.equal(
    progress.topics.kinematics.weakTraps[
      "unit-conversion-speed:перевёл только скорость"
    ],
    1,
  );
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
