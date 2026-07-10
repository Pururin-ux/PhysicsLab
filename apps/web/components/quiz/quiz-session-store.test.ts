import assert from "node:assert/strict";
import test from "node:test";
import {
  $quizSession,
  answerCurrentNumericTask,
  answerCurrentTask,
  getOptionState,
  moveToNextTask,
  resetQuizSession,
  type NumericInputQuizTask,
  type SingleChoiceQuizTask,
} from "./quiz-session-store.ts";

const numericTask: NumericInputQuizTask = {
  id: "n-test",
  type: "numeric_input",
  blueprint: "average-speed-segments",
  difficulty: 1,
  text: "Числовая задача.",
  explanation: "Проверочное объяснение.",
  trap: "Проверочная ловушка",
  coach_lines: {
    correct: "Верно.",
    wrong: "Проверь шаг.",
    hint: "Подсказка.",
  },
  answer: { value: 3.2, unit: "м/с", decimals: 1, tolerance: 0.05, sign: "positive" },
  misconceptions: [{ value: 5, label: "усреднил скорости без учёта времени" }],
};

const task: SingleChoiceQuizTask = {
  id: "k-test",
  type: "single_choice",
  blueprint: "test-blueprint",
  difficulty: 1,
  text: "Тестовая физическая ситуация.",
  options: [
    { id: "a", text: "1 м", misconception: "сложил величины без модели" },
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
  assert.equal(state.answers[0].taskTrap, "Проверочная ловушка");
  assert.equal(state.answers[0].selectedMisconception, "сложил величины без модели");
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

test("numeric: правильный ответ с запятой засчитывается", () => {
  resetQuizSession(10);
  const result = answerCurrentNumericTask(numericTask, "3,2");
  const state = $quizSession.get();

  assert.deepEqual(result, { isCorrect: true, streak: 1, score: 1, attempt: 1 });
  assert.equal(state.phase, "answered");
  assert.equal(state.score, 1);
  const record = state.answers[0];
  assert.equal(record.format, "numeric_input");
  assert.equal(record.isCorrect, true);
  if (record.format === "numeric_input") {
    assert.equal(record.response.raw, "3,2");
    assert.equal(record.response.value, 3.2);
    assert.equal(record.correctValue, 3.2);
    assert.equal(record.unit, "м/с");
  }
});

test("numeric: неверный ответ у дистрактора даёт реальный misconception", () => {
  resetQuizSession(10);
  const result = answerCurrentNumericTask(numericTask, "5");
  const state = $quizSession.get();

  assert.equal(result?.isCorrect, false);
  assert.equal(state.score, 0);
  assert.equal(state.streak, 0);
  assert.equal(
    state.answers[0].selectedMisconception,
    "усреднил скорости без учёта времени",
  );
});

test("numeric: неверный ответ вне дистракторов не выдумывает misconception", () => {
  resetQuizSession(10);
  answerCurrentNumericTask(numericTask, "9");
  const state = $quizSession.get();

  assert.equal(state.answers[0].isCorrect, false);
  assert.equal(state.answers[0].selectedMisconception, undefined);
  assert.equal(state.answers[0].taskTrap, "Проверочная ловушка");
});

test("numeric: второй ответ после первого игнорируется", () => {
  resetQuizSession(10);
  answerCurrentNumericTask(numericTask, "9");
  const result = answerCurrentNumericTask(numericTask, "3,2");

  assert.equal(result, null);
  assert.equal($quizSession.get().answers.length, 1);
});

test("смешанная сессия: single_choice и numeric в одной сессии", () => {
  resetQuizSession(2);

  answerCurrentTask(task, "b");
  assert.equal($quizSession.get().answers[0].format, "single_choice");
  assert.equal(moveToNextTask(), true);

  answerCurrentNumericTask(numericTask, "3,2");
  const state = $quizSession.get();
  assert.equal(state.answers[1].format, "numeric_input");
  assert.equal(state.score, 2);
  assert.equal(moveToNextTask(), true);
  assert.equal($quizSession.get().phase, "completed");
});

test("numeric: store не записывает непарсящийся ответ", () => {
  resetQuizSession(10);

  assert.equal(answerCurrentNumericTask(numericTask, "2+2"), null);
  assert.equal($quizSession.get().phase, "active");
  assert.equal($quizSession.get().answers.length, 0);
});
