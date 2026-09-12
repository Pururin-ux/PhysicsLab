import assert from "node:assert/strict";
import test from "node:test";
import { migrateStoredProgress } from "../stores/progress-store.ts";
import { getLearningNextStep } from "./next-step.ts";

function progressWithTransfer(options?: { delayed?: boolean; pending?: boolean }) {
  const progress = migrateStoredProgress({
    version: 6,
    topics: {
      kinematics: {
        solved: 10,
        correct: 10,
        completedSessions: 1,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {
          "unit-conversion-speed": {
            transferPassedAt: "2026-08-31T10:00:00.000Z",
            delayedRecallPassedAt: options?.delayed
              ? "2026-09-01T10:00:00.000Z"
              : null,
          },
        },
        lastPracticedAt: "2026-08-31T10:00:00.000Z",
      },
    },
    pendingMistakes: options?.pending
      ? {
          "newton:pending::task-1": {
            sessionId: "newton:pending",
            taskId: "task-1",
            topicId: "dynamics",
            blueprint: "newton-second",
            misconception: "сложил данные вместо второго закона Ньютона",
            recordedAt: "2026-09-01T09:00:00.000Z",
            resumeHref: "/practice/dynamics-demo",
          },
        }
      : {},
  });

  assert.ok(progress);
  return progress;
}

test("delayed recall не предлагается раньше 24 часов", () => {
  const step = getLearningNextStep(
    progressWithTransfer(),
    false,
    new Date("2026-09-01T09:59:59.000Z"),
  );

  assert.notEqual(step.label, "Проверка после паузы");
});

test("просроченный transfer ведёт в unlabelled topic route", () => {
  const step = getLearningNextStep(
    progressWithTransfer(),
    false,
    new Date("2026-09-01T10:00:00.000Z"),
  );

  assert.equal(step.label, "Проверка после паузы");
  assert.equal(step.title, "Вспомнить: Единицы скорости");
  assert.equal(step.href, "/practice/kinematics-demo");
  assert.equal(step.cta, "Проверить без подсказки");
});

test("полученный delayed recall больше не ставится в следующий шаг", () => {
  const step = getLearningNextStep(
    progressWithTransfer({ delayed: true }),
    false,
    new Date("2026-09-02T10:00:00.000Z"),
  );

  assert.notEqual(step.label, "Проверка после паузы");
});

test("pending ошибка остаётся выше delayed recall", () => {
  const step = getLearningNextStep(
    progressWithTransfer({ pending: true }),
    false,
    new Date("2026-09-01T10:00:00.000Z"),
  );

  assert.equal(step.title, "Вернуться к ошибке: Второй закон Ньютона");
  assert.equal(step.href, "/practice/dynamics-demo");
  assert.equal(step.cta, "Продолжить задачу");
});
