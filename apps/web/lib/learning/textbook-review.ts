import type { TextbookChapter } from "./textbook.ts";
import { classifyTextbookCheck } from "./textbook-check-state.ts";

export type TextbookReviewItem = {
  id: string;
  grade: number;
  unit: string;
  title: string;
  question: string;
  selectedAnswer: string;
  feedback: string;
  href: string;
  practice: TextbookChapter["practice"] | null;
};

export function buildTextbookReviewItem(
  chapter: TextbookChapter,
  data: Record<string, unknown> | null,
): TextbookReviewItem | null {
  if (classifyTextbookCheck(chapter.check, data) !== "retry") return null;

  const selectedAnswer = data?.answer;
  if (typeof selectedAnswer !== "string") return null;

  const selectedIndex = chapter.check.options.indexOf(selectedAnswer);
  if (selectedIndex < 0) return null;

  return {
    id: chapter.id,
    grade: chapter.grade,
    unit: chapter.unit ?? "Учебник",
    title: chapter.title,
    question: chapter.check.question,
    selectedAnswer,
    feedback: chapter.check.feedback[selectedIndex],
    href: `/learn/${chapter.id}#self-check`,
    practice: chapter.practice.href.startsWith("/practice/") ? chapter.practice : null,
  };
}
