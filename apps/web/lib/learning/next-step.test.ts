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

test("старое доказательство измерения ведёт к той же семье после переноса темы", () => {
  const progress = migrateStoredProgress({
    version: 6,
    topics: {
      kinematics: {
        solved: 5,
        correct: 5,
        completedSessions: 1,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {
          "graduated-scale-reading": {
            transferPassedAt: "2026-08-31T10:00:00.000Z",
            delayedRecallPassedAt: null,
          },
        },
        lastPracticedAt: "2026-08-31T10:00:00.000Z",
      },
    },
    pendingMistakes: {},
  });
  assert.ok(progress);

  const step = getLearningNextStep(progress, false, new Date("2026-09-01T10:00:00.000Z"));
  assert.equal(step.label, "Проверка после паузы");
  assert.equal(step.href, "/practice/family/graduated-scale-reading");
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
    [{ sessionId: "newton:pending", taskId: "task-1", blueprint: "newton-second" }],
  );

  assert.equal(step.title, "Вернуться к ошибке: Второй закон Ньютона");
  assert.equal(step.href, "/practice/dynamics-demo");
  assert.equal(step.cta, "Открыть попытку");
});

test("старый pending без снимка не обещает продолжение задачи", () => {
  const step = getLearningNextStep(
    progressWithTransfer({ pending: true }),
    false,
    new Date("2026-09-01T10:00:00.000Z"),
  );

  assert.equal(step.label, "Проверка после паузы");
  assert.notEqual(step.cta, "Открыть попытку");
});

test("новая тема не выдаётся за продолжение уже начатой", () => {
  const progress = migrateStoredProgress({
    version: 6,
    topics: {
      thermodynamics: {
        solved: 5,
        correct: 4,
        completedSessions: 1,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: "2026-09-13T10:00:00.000Z",
      },
    },
    pendingMistakes: {},
  });

  assert.ok(progress);

  const step = getLearningNextStep(
    progress,
    false,
    new Date("2026-09-13T12:00:00.000Z"),
  );

  assert.equal(step.label, "Новая тема");
  assert.match(step.reason, /ещё не пробовал/);
});

test("после одних измерений профиль не ведёт к ускорению 9 класса", () => {
  const progress = migrateStoredProgress({
    version: 6,
    topics: {
      measurements: {
        solved: 5,
        correct: 5,
        completedSessions: 1,
        weakTraps: {},
        weakTrapLastSeenAt: {},
        skillEvidence: {},
        lastPracticedAt: "2026-09-13T10:00:00.000Z",
      },
    },
    pendingMistakes: {},
  });
  assert.ok(progress);

  const step = getLearningNextStep(progress, false, new Date("2026-09-13T12:00:00.000Z"));
  assert.equal(step.href, "/topics?grade=7");
  assert.equal(step.cta, "Выбрать вопрос");
  assert.match(step.reason, /не означают/);
});

test("ошибочная самопроверка без практики ведёт к тому же вопросу", () => {
  const progress = migrateStoredProgress({ version: 6, topics: {}, pendingMistakes: {} });
  assert.ok(progress);
  const check = {
    id: "reading-scales" as const,
    title: "Как читать шкалу прибора",
    grade: 7,
    status: "retry" as const,
    href: "/learn/reading-scales#self-check",
  };

  const step = getLearningNextStep(progress, false, new Date("2026-09-13T12:00:00.000Z"), [], [check]);
  assert.equal(step.href, check.href);
  assert.equal(step.label, "Самопроверка");
  assert.match(step.reason, /не оценка всей темы/);
});

test("незаконченный ответ остаётся черновиком, а верный ведёт к выбору темы", () => {
  const progress = migrateStoredProgress({ version: 6, topics: {}, pendingMistakes: {} });
  assert.ok(progress);
  const check = {
    id: "reading-scales" as const,
    title: "Как читать шкалу прибора",
    grade: 7,
    href: "/learn/reading-scales#self-check",
  };

  const draft = getLearningNextStep(progress, false, new Date("2026-09-13T12:00:00.000Z"), [], [{ ...check, status: "draft" }]);
  assert.equal(draft.href, check.href);
  assert.equal(draft.label, "Незаконченная самопроверка");

  const correct = getLearningNextStep(progress, false, new Date("2026-09-13T12:00:00.000Z"), [], [{ ...check, status: "correct" }]);
  assert.equal(correct.href, "/topics?grade=7");
  assert.match(correct.reason, /не означает/);
});

test("сохранённая попытка задачи остаётся выше самопроверки учебника", () => {
  const step = getLearningNextStep(
    progressWithTransfer({ pending: true }),
    false,
    new Date("2026-09-01T10:00:00.000Z"),
    [{ sessionId: "newton:pending", taskId: "task-1", blueprint: "newton-second" }],
    [{ id: "reading-scales", title: "Как читать шкалу прибора", grade: 7, status: "retry", href: "/learn/reading-scales#self-check" }],
  );
  assert.equal(step.href, "/practice/dynamics-demo");
});
