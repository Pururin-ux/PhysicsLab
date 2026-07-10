import { atom } from "nanostores";
import type { OptionState } from "./OptionItem";
import type { CircuitDiagramSpec } from "../../lib/physics/circuit-diagram-spec";
import type { VectorDiagramSpec } from "../../lib/physics/vector-diagram-spec";
import {
  getNumericMisconception,
  isNumericAnswerCorrect,
  parseNumericAnswer,
  type NumericAnswerSpec,
  type NumericMisconception,
} from "../../lib/answer/numeric-answer.ts";

export type QuizOption = {
  id: string;
  text: string;
  value?: number;
  correct?: boolean;
  misconception?: string;
};

export type QuizGraph = {
  type: "vt" | "xt" | "at";
  series: { t: number; v?: number; x?: number; a?: number }[];
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  color?: "cyan" | "gold";
};

export type QuizDiagram =
  | { kind: "vector"; spec: VectorDiagramSpec }
  | { kind: "circuit"; spec: CircuitDiagramSpec };

// Общая часть задачи, не зависящая от формата ответа.
type QuizTaskBase = {
  id: string;
  blueprint: string;
  skill?: string;
  difficulty: 1 | 2 | 3;
  text: string;
  formula?: string;
  graph?: QuizGraph | null;
  diagram?: QuizDiagram | null;
  explanation: string;
  explanation_latex?: string;
  trap: string;
  coach_lines: {
    correct: string;
    wrong: string;
    hint: string;
  };
};

export type SingleChoiceQuizTask = QuizTaskBase & {
  type: "single_choice";
  options: QuizOption[];
  answer: string;
};

export type NumericInputQuizTask = QuizTaskBase & {
  type: "numeric_input";
  // Спецификация числового ответа (значение/единица/точность/допуск/знак).
  answer: NumericAnswerSpec;
  // Значения дистракторов с метками: по ним подбирается misconception после
  // неверного ответа. Пустой список допустим.
  misconceptions: NumericMisconception[];
};

// Дискриминированный union: TypeScript заставляет компоненты явно обработать
// оба формата, а не подсовывать фиктивные options старому UI.
export type QuizTask = SingleChoiceQuizTask | NumericInputQuizTask;

export type QuizData = {
  id: string;
  topic: string;
  title: string;
  tasks: QuizTask[];
};

// Обобщённое представление отправленного ответа.
export type SubmittedResponse =
  | { kind: "single_choice"; optionId: string }
  | { kind: "numeric_input"; raw: string; value: number };

type BaseAnswerRecord = {
  taskId: string;
  blueprint: string;
  isCorrect: boolean;
  attempt: number;
  taskTrap: string;
  selectedMisconception?: string;
};

export type SingleChoiceAnswerRecord = BaseAnswerRecord & {
  format: "single_choice";
  response: { kind: "single_choice"; optionId: string };
  selectedOptionId: string;
  correctOptionId: string;
};

export type NumericAnswerRecord = BaseAnswerRecord & {
  format: "numeric_input";
  response: { kind: "numeric_input"; raw: string; value: number };
  // Каноничный ответ и единица — для показа в фидбэке после submit.
  correctValue: number;
  unit: string;
};

// AnswerRecord различает форматы, но общие поля (blueprint, isCorrect,
// taskTrap, selectedMisconception) лежат в базе — persistent-слой
// (recordCompletedSession/recordExamSession) читает только их, поэтому схема
// хранилища не меняется и миграция не нужна.
export type AnswerRecord = SingleChoiceAnswerRecord | NumericAnswerRecord;

export type QuizPhase = "active" | "answered" | "completed";

export type QuizSessionState = {
  phase: QuizPhase;
  currentIndex: number;
  // Заполняется только для single_choice (используется getOptionState);
  // для numeric остаётся null.
  selectedOptionId: string | null;
  answers: AnswerRecord[];
  score: number;
  streak: number;
  total: number;
};

export type AnswerResult = {
  isCorrect: boolean;
  streak: number;
  score: number;
  attempt: number;
};

export const initialQuizSessionState: QuizSessionState = {
  phase: "active",
  currentIndex: 0,
  selectedOptionId: null,
  answers: [],
  score: 0,
  streak: 0,
  total: 10,
};

export const $quizSession = atom<QuizSessionState>(initialQuizSessionState);

export function resetQuizSession(total: number) {
  $quizSession.set({
    ...initialQuizSessionState,
    total,
  });
}

// Общий переход состояния после любого ответа: считает счёт/серию и добавляет
// запись. Формат-специфичные обёртки строят AnswerRecord и передают его сюда.
function commitAnswer(
  isCorrect: boolean,
  record: AnswerRecord,
  selectedOptionId: string | null,
): AnswerResult {
  const state = $quizSession.get();
  const streak = isCorrect ? state.streak + 1 : 0;
  const score = isCorrect ? state.score + 1 : state.score;

  $quizSession.set({
    ...state,
    phase: "answered",
    selectedOptionId,
    answers: [...state.answers, record],
    score,
    streak,
  });

  return { isCorrect, streak, score, attempt: record.attempt };
}

export function answerCurrentTask(
  task: SingleChoiceQuizTask,
  selectedOptionId: string,
): AnswerResult | null {
  const state = $quizSession.get();

  if (state.phase !== "active") return null;
  if (!task.options.some((option) => option.id === selectedOptionId)) return null;

  const isCorrect = selectedOptionId === task.answer;
  const selectedOption = task.options.find((option) => option.id === selectedOptionId);
  const selectedMisconception = !isCorrect
    ? selectedOption?.misconception?.trim() || undefined
    : undefined;

  const record: SingleChoiceAnswerRecord = {
    format: "single_choice",
    taskId: task.id,
    blueprint: task.blueprint,
    isCorrect,
    attempt: 1,
    taskTrap: task.trap.trim(),
    selectedMisconception,
    response: { kind: "single_choice", optionId: selectedOptionId },
    selectedOptionId,
    correctOptionId: task.answer,
  };

  return commitAnswer(isCorrect, record, selectedOptionId);
}

export function answerCurrentNumericTask(
  task: NumericInputQuizTask,
  raw: string,
): AnswerResult | null {
  const state = $quizSession.get();

  if (state.phase !== "active") return null;

  const parsed = parseNumericAnswer(raw);
  if (!parsed.ok) return null;

  const value = parsed.value;

  const isCorrect = isNumericAnswerCorrect(value, task.answer);
  const selectedMisconception = !isCorrect
    ? getNumericMisconception(value, task.misconceptions, task.answer.tolerance)
    : undefined;

  const record: NumericAnswerRecord = {
    format: "numeric_input",
    taskId: task.id,
    blueprint: task.blueprint,
    isCorrect,
    attempt: 1,
    taskTrap: task.trap.trim(),
    selectedMisconception,
    response: { kind: "numeric_input", raw, value },
    correctValue: task.answer.value,
    unit: task.answer.unit,
  };

  return commitAnswer(isCorrect, record, null);
}

export function moveToNextTask() {
  const state = $quizSession.get();

  if (state.phase !== "answered") return false;

  if (state.currentIndex >= state.total - 1) {
    $quizSession.set({
      ...state,
      phase: "completed",
      selectedOptionId: null,
    });
    return true;
  }

  $quizSession.set({
    ...state,
    phase: "active",
    currentIndex: state.currentIndex + 1,
    selectedOptionId: null,
  });

  return true;
}

export function restartQuizSession() {
  resetQuizSession($quizSession.get().total);
}

export function getOptionState(
  task: SingleChoiceQuizTask,
  optionId: string,
  session: QuizSessionState,
): OptionState {
  if (session.phase === "active" || !session.selectedOptionId) return "idle";
  if (optionId === task.answer) return "correct";
  if (optionId === session.selectedOptionId) return "wrong";
  return "dimmed";
}
