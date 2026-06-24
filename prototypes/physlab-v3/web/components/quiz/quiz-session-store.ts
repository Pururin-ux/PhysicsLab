import { atom } from "nanostores";
import type { OptionState } from "./OptionItem";

export type QuizOption = {
  id: string;
  text: string;
  value?: number;
  correct?: boolean;
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

export type QuizTask = {
  id: string;
  type: "single_choice";
  blueprint: string;
  difficulty: 1 | 2 | 3;
  text: string;
  formula?: string;
  graph?: QuizGraph | null;
  options: QuizOption[];
  answer: string;
  explanation: string;
  explanation_latex?: string;
  trap: string;
  coach_lines: {
    correct: string;
    wrong: string;
    hint: string;
  };
};

export type QuizData = {
  id: string;
  topic: string;
  title: string;
  tasks: QuizTask[];
};

export type AnswerRecord = {
  taskId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  attempt: number;
  blueprint: string;
  trap: string;
};

export type QuizPhase = "active" | "answered" | "completed";

export type QuizSessionState = {
  phase: QuizPhase;
  currentIndex: number;
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

export function answerCurrentTask(
  task: QuizTask,
  selectedOptionId: string,
): AnswerResult | null {
  const state = $quizSession.get();

  if (state.phase !== "active") return null;
  if (!task.options.some((option) => option.id === selectedOptionId)) return null;

  const isCorrect = selectedOptionId === task.answer;
  const attempt = 1;
  const streak = isCorrect ? state.streak + 1 : 0;
  const score = isCorrect ? state.score + 1 : state.score;

  const answer: AnswerRecord = {
    taskId: task.id,
    selectedOptionId,
    correctOptionId: task.answer,
    isCorrect,
    attempt,
    blueprint: task.blueprint,
    trap: task.trap,
  };

  $quizSession.set({
    ...state,
    phase: "answered",
    selectedOptionId,
    answers: [...state.answers, answer],
    score,
    streak,
  });

  return { isCorrect, streak, score, attempt };
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
  task: QuizTask,
  optionId: string,
  session: QuizSessionState,
): OptionState {
  if (session.phase === "active" || !session.selectedOptionId) return "idle";
  if (optionId === task.answer) return "correct";
  if (optionId === session.selectedOptionId) return "wrong";
  return "dimmed";
}
