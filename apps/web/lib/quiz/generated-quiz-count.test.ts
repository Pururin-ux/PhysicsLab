import assert from "node:assert/strict";
import test from "node:test";
import {
  GENERATED_QUIZ_COUNTS,
  isGeneratedQuizCount,
} from "./generated-quiz-count.ts";

test("generated quiz count contract allows only focused 5 and standard 10", () => {
  assert.deepEqual(GENERATED_QUIZ_COUNTS, [5, 10]);
  assert.equal(isGeneratedQuizCount(5), true);
  assert.equal(isGeneratedQuizCount(10), true);
  assert.equal(isGeneratedQuizCount(1), false);
  assert.equal(isGeneratedQuizCount(20), false);
  assert.equal(isGeneratedQuizCount("5"), false);
});
