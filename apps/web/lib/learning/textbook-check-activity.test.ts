import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../../app/api/textbook-checks/route.ts";
import {
  classifyTextbookCheckActivity,
  type TextbookCheckActivityDefinition,
} from "./textbook-check-activity.ts";
import { textbookChapterIds } from "./textbook-index.ts";

const definition: TextbookCheckActivityDefinition = {
  id: "reading-scales",
  title: "Как читать шкалу прибора",
  grade: 7,
  questionKey: JSON.stringify(["Цена деления?", ["4 см", "5 см"]]),
  correct: 1,
};
const answer = { questionKey: definition.questionKey, answer: "4 см", checked: true };

test("saved textbook checks distinguish current work from errors and stale questions", () => {
  assert.equal(classifyTextbookCheckActivity(definition, null), "untouched");
  assert.equal(classifyTextbookCheckActivity(definition, { ...answer, answer: "" }), "untouched");
  assert.equal(classifyTextbookCheckActivity(definition, { ...answer, checked: false }), "draft");
  assert.equal(classifyTextbookCheckActivity(definition, answer), "retry");
  assert.equal(classifyTextbookCheckActivity(definition, { ...answer, answer: "5 см" }), "correct");
  assert.equal(classifyTextbookCheckActivity(definition, { ...answer, questionKey: "old question" }), "updated");
  assert.equal(classifyTextbookCheckActivity(definition, { ...answer, answer: "removed option" }), "unavailable");
});

test("textbook check endpoint returns only requested known definitions", async () => {
  const response = GET(new Request("http://localhost/api/textbook-checks?id=reading-scales&id=unknown&id=reading-scales"));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.definitions.length, 1);
  assert.deepEqual(Object.keys(payload.definitions[0]).sort(), ["correct", "grade", "id", "questionKey", "title"]);
  assert.equal(payload.definitions[0].id, "reading-scales");
});

test("textbook check endpoint rejects requests above the chapter bound", () => {
  const query = new URLSearchParams();
  for (let index = 0; index <= textbookChapterIds.length; index++) query.append("id", "reading-scales");
  const response = GET(new Request(`http://localhost/api/textbook-checks?${query}`));
  assert.equal(response.status, 400);
});

test("textbook check endpoint accepts the complete known chapter index", async () => {
  const query = new URLSearchParams();
  for (const id of textbookChapterIds) query.append("id", id);
  const response = GET(new Request(`http://localhost/api/textbook-checks?${query}`));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.definitions.map((definition: { id: string }) => definition.id), [...textbookChapterIds]);
});
