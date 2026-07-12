export const GENERATED_QUIZ_COUNTS = [5, 10] as const;

export type GeneratedQuizCount = (typeof GENERATED_QUIZ_COUNTS)[number];

export function isGeneratedQuizCount(value: unknown): value is GeneratedQuizCount {
  return GENERATED_QUIZ_COUNTS.includes(value as GeneratedQuizCount);
}
