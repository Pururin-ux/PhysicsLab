import test from "node:test";
import assert from "node:assert/strict";
import { restoreLessonDraft, lessonDraftCodec, readLessonDraft, writeLessonDraft, replaceLiveLessonDraft } from "./lesson-draft.ts";
import { decodeStoredValue } from "../stores/storage-envelope.ts";

const defaults = { screen: 0, summaryText: "", summarySaved: false, answer: { value: "", checked: false } };
test("lesson draft restores explanation, stage and answer without awarding mastery", () => {
  const saved = { ...defaults, screen: 9, summaryText: "Ускорение — изменение скорости за секунду", summarySaved: true };
  assert.deepEqual(restoreLessonDraft(saved, defaults, 10), saved);
});
test("invalid indices, wrong field types and nested corrupt answers are rejected", () => {
  for (const patch of [{screen: -1}, {screen: 10}, {screen: 1.2}, {screen: Infinity}, {summaryText: {}}, {answer: {value: 5}}]) {
    assert.equal(restoreLessonDraft({...defaults, ...patch}, defaults, 10), null);
  }
});
test("missing new fields get defaults and future envelopes remain unread", () => {
  assert.deepEqual(restoreLessonDraft({summaryText: "draft"}, defaults, 10), {...defaults, summaryText: "draft"});
  assert.deepEqual(decodeStoredValue(lessonDraftCodec("test", defaults, 10), JSON.stringify({version: 2, data: defaults})), {ok: false, reason: "future-version"});
});

test("storage refusal cannot report saved and unreadable personal drafts stay intact", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const codec = lessonDraftCodec("test", defaults, 10);
  let raw = "{broken personal draft";
  Object.defineProperty(globalThis, "window", {configurable: true, value: {localStorage: {
    getItem: () => raw,
    setItem: () => { throw new DOMException("Full", "QuotaExceededError"); },
    removeItem: () => { throw new Error("must not delete an unreadable draft"); },
  }}});
  try {
    assert.deepEqual(readLessonDraft(codec), {ok: false, reason: "corrupt"});
    assert.equal(raw, "{broken personal draft");
    raw = JSON.stringify({version: 2, data: defaults});
    assert.deepEqual(readLessonDraft(codec), {ok: false, reason: "future-version"});
    assert.equal(writeLessonDraft(codec, defaults), "quota");
  } finally {
    replaceLiveLessonDraft(codec.key, null);
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
