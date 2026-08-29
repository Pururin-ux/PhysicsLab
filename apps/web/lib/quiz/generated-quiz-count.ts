import { topics } from "../topics.ts";

// 5 — короткая тренировка одного семейства, 10 — обычная тренировка темы,
// 14 — диагностика: по две задачи из каждой из семи открытых тем.
export const GENERATED_QUIZ_COUNTS = [5, 10, 14] as const;

// Сколько задач берём из одной темы в диагностике.
export const EXAM_TASKS_PER_TOPIC = 2;

// Длина варианта диагностики выводится из состава открытых тем, поэтому
// при пополнении каталога новый раздел попадает и в вариант.
export const EXAM_QUESTION_COUNT = (topics.length *
  EXAM_TASKS_PER_TOPIC) as GeneratedQuizCount;

export type GeneratedQuizCount = (typeof GENERATED_QUIZ_COUNTS)[number];

export function isGeneratedQuizCount(value: unknown): value is GeneratedQuizCount {
  return GENERATED_QUIZ_COUNTS.includes(value as GeneratedQuizCount);
}
