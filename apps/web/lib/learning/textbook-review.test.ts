import assert from "node:assert/strict";
import test from "node:test";
import type { TextbookChapter } from "./textbook.ts";
import { checkQuestionKey } from "./textbook-check-state.ts";
import { buildTextbookReviewItem } from "./textbook-review.ts";

const chapter: TextbookChapter = {
  id: "sample",
  title: "Путь и перемещение",
  grade: 9,
  unit: "Движение",
  lead: "",
  prerequisite: "",
  sections: [],
  example: { question: "", steps: [], conclusion: "" },
  check: {
    question: "Когда перемещение равно нулю?",
    options: ["После возвращения", "После любого движения"],
    correct: 0,
    feedback: ["Верно", "Проверь начальную и конечную точки."],
  },
  source: { section: "§ 1", printedPage: 1 },
  practice: { href: "/practice/motion", label: "Попробовать в задаче" },
};

const currentAnswer = {
  stage: 0,
  summaryText: "",
  summarySaved: false,
  answer: "После любого движения",
  checked: true,
  questionKey: checkQuestionKey(chapter.check),
};

test("review item is created only for a checked incorrect current answer", () => {
  const item = buildTextbookReviewItem(chapter, currentAnswer);
  assert.equal(item?.href, "/learn/sample#self-check");
  assert.equal(item?.selectedAnswer, "После любого движения");
  assert.equal(item?.feedback, "Проверь начальную и конечную точки.");

  assert.equal(buildTextbookReviewItem(chapter, { ...currentAnswer, checked: false }), null);
  assert.equal(buildTextbookReviewItem(chapter, { ...currentAnswer, answer: "После возвращения" }), null);
  assert.equal(buildTextbookReviewItem(chapter, { ...currentAnswer, questionKey: "old-question" }), null);
});
