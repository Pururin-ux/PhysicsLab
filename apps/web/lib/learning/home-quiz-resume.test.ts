import assert from "node:assert/strict";
import test from "node:test";
import type { ActiveQuizSnapshot } from "../quiz/active-session-snapshot.ts";
import { getQuizResumeHref, getQuizResumeStep } from "./home-quiz-resume.ts";

function snapshot(
  patch: Partial<ActiveQuizSnapshot> = {},
): ActiveQuizSnapshot {
  return {
    version: 2,
    attemptId: "attempt-school-check",
    savedAt: 1,
    template: "school-check-8",
    topic: "8 класс",
    title: "Задача из изученных тем",
    sessionKind: "diagnostic",
    batch: 0,
    taskIds: ["task-1", "task-2", "task-3", "task-4", "task-5"],
    session: {
      phase: "retrying",
      currentIndex: 0,
      selectedOptionId: null,
      answers: [],
      score: 0,
      streak: 0,
      total: 5,
    },
    ...patch,
  };
}

test("class check resumes at its exact grade route", () => {
  const step = getQuizResumeStep(snapshot());

  assert.deepEqual(
    step && {
      href: step.href,
      title: step.title,
      cta: step.cta,
      body: step.body,
    },
    {
      href: "/practice/class-check/8",
      title: "Проверка 8 класса: задание\u00a01\u00a0из\u00a05",
      cta: "Продолжить проверку",
      body: "Незавершённая попытка сохранена в этой вкладке.",
    },
  );
});

test("existing diagnostic, exam and focused-practice routes remain distinct", () => {
  assert.equal(
    getQuizResumeHref(snapshot({ template: "exam" })),
    "/practice/diagnostic",
  );
  assert.equal(
    getQuizResumeHref(snapshot({ template: "exam", sessionKind: "exam" })),
    "/practice/exam-demo",
  );
  assert.equal(
    getQuizResumeHref(
      snapshot({ template: "ohm-law", sessionKind: "practice" }),
    ),
    "/practice/family/ohm-law",
  );
  assert.equal(getQuizResumeHref(snapshot({ template: "unknown" })), null);
});

test("answered class check promises the saved explanation state", () => {
  const answered = snapshot({
    session: { ...snapshot().session, phase: "answered" },
  });

  assert.equal(
    getQuizResumeStep(answered)?.body,
    "Ответ уже сохранён — можно вернуться прямо к разбору.",
  );
});
