import type { TextbookChapter } from "./textbook.ts";
import {
  checkQuestionKey,
  classifyTextbookCheck,
  type TextbookCheckState,
} from "./textbook-check-state.ts";

// This is serialized to the browser only for chapters with a saved answer.
// Keep explanations, feedback, and the rest of the textbook on the server.
export type TextbookCheckActivityDefinition = {
  id: string;
  title: string;
  grade: number;
  questionKey: string;
  correct: number;
};

export function projectTextbookCheckActivity(
  chapter: TextbookChapter,
): TextbookCheckActivityDefinition {
  return {
    id: chapter.id,
    title: chapter.title,
    grade: chapter.grade,
    questionKey: checkQuestionKey(chapter.check),
    correct: chapter.check.correct,
  };
}

export function classifyTextbookCheckActivity(
  definition: TextbookCheckActivityDefinition,
  draft: Record<string, unknown> | null,
): TextbookCheckState {
  if (!draft || draft.answer === "") return "untouched";
  if (draft.questionKey !== definition.questionKey) return "updated";

  // The existing key is JSON.stringify([question, options]). Parse it only
  // for a saved answer so unknown answer strings remain "unavailable", as in
  // the textbook contents and mistakes views.
  let parsed: unknown;
  try {
    parsed = JSON.parse(definition.questionKey);
  } catch {
    return "unavailable";
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length !== 2 ||
    typeof parsed[0] !== "string" ||
    !Array.isArray(parsed[1]) ||
    !parsed[1].every((option: unknown) => typeof option === "string") ||
    !Number.isInteger(definition.correct) ||
    definition.correct < 0 ||
    definition.correct >= parsed[1].length
  ) {
    return "unavailable";
  }

  return classifyTextbookCheck(
    { question: parsed[0], options: parsed[1], correct: definition.correct },
    draft,
  );
}
