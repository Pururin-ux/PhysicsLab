import { atom } from "nanostores";

// Цель обучения — лёгкая настройка профиля: меняет формулировки плана и
// помогает ученику назвать, зачем он здесь. Никакой скрытой логики за ней
// нет (честность: контент один и тот же), поэтому хранится просто.
export type LearnerGoal = "ce" | "ct" | "review";

const STORAGE_KEY = "physicslab-learner-goal-v1";

export const learnerGoalOptions: { id: LearnerGoal; label: string; note: string }[] = [
  { id: "ce", label: "Готовлюсь к ЦЭ", note: "11 класс, экзамен в школе + вуз" },
  { id: "ct", label: "Готовлюсь к ЦТ", note: "поступление, тест РИКЗ" },
  { id: "review", label: "Просто повторяю", note: "без привязки к экзамену" },
];

export const $learnerGoal = atom<LearnerGoal | null>(null);

function isLearnerGoal(value: string | null): value is LearnerGoal {
  return value === "ce" || value === "ct" || value === "review";
}

export function hydrateLearnerGoal() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLearnerGoal(stored)) {
      $learnerGoal.set(stored);
    }
  } catch {
    // Хранилище недоступно — цель живёт в памяти до перезагрузки.
  }
}

export function setLearnerGoal(goal: LearnerGoal | null) {
  $learnerGoal.set(goal);
  try {
    if (goal) {
      window.localStorage.setItem(STORAGE_KEY, goal);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // См. hydrateLearnerGoal.
  }
}
