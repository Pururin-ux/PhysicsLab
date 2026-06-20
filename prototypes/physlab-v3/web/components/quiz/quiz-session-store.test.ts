import assert from "node:assert/strict";
import test from "node:test";
import {
  $quizSession,
  answerCurrentTask,
  getOptionState,
  moveToNextTask,
  resetQuizSession,
  type QuizTask,
} from "./quiz-session-store.ts";

const task: QuizTask = {
  id: "k-test",
  type: "single_choice",
  blueprint: "test-blueprint",
  difficulty: 1,
  text: "Тестовая физическая ситуация.",
  options: [
    { id: "a", text: "1 м" },
    { id: "b", text: "2 м" },
    { id: "c", text: "3 м" },
    { id: "d", text: "4 м" },
  ],
  answer: "b",
  explanation: "Проверочное объяснение.",
  trap: "Проверочная ловушка",
  coach_lines: {
    correct: "Верно.",
    wrong: "Проверь шаг.",
    hint: "Подсказка.",
  },
};

test("does not move to next task before answer", () => {
  resetQuizSession(10);
  assert.equal(moveToNextTask(), false);
  assert.equal($quizSession.get().currentIndex, 0);
});

test("correct answer increments score and streak", () => {
  resetQuizSession(10);
  const result = answerCurrentTask(task, "b");
  const state = $quizSession.get();

  assert.deepEqual(result, {
    isCorrect: true,
    streak: 1,
    score: 1,
    attempt: 1,
  });
  assert.equal(state.phase, "answered");
  assert.equal(state.score, 1);
  assert.equal(state.streak, 1);
  assert.equal(getOptionState(task, "b", state), "correct");
  assert.equal(getOptionState(task, "a", state), "dimmed");
});

test("wrong answer resets streak and completes the task", () => {
  resetQuizSession(10);
  const result = answerCurrentTask(task, "a");
  const state = $quizSession.get();

  assert.deepEqual(result, {
    isCorrect: false,
    streak: 0,
    score: 0,
    attempt: 1,
  });
  assert.equal(state.phase, "answered");
  assert.equal(state.score, 0);
  assert.equal(state.streak, 0);
  assert.equal(getOptionState(task, "a", state), "wrong");
  assert.equal(getOptionState(task, "b", state), "correct");
  assert.equal(getOptionState(task, "c", state), "dimmed");
});

test("second answer after a wrong answer is ignored", () => {
  resetQuizSession(10);
  answerCurrentTask(task, "a");
  const result = answerCurrentTask(task, "b");
  const state = $quizSession.get();

  assert.equal(result, null);
  assert.equal(state.phase, "answered");
  assert.equal(state.score, 0);
  assert.equal(state.answers.length, 1);
  assert.equal(state.answers[0].isCorrect, false);
});

test("moving after answer advances one task at a time", () => {
  resetQuizSession(10);
  answerCurrentTask(task, "b");

  assert.equal(moveToNextTask(), true);
  assert.equal($quizSession.get().phase, "active");
  assert.equal($quizSession.get().currentIndex, 1);
});

test("last answered task completes the session", () => {
  resetQuizSession(1);
  answerCurrentTask(task, "b");

  assert.equal(moveToNextTask(), true);
  assert.equal($quizSession.get().phase, "completed");
});
