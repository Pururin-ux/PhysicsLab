import test from "node:test";
import assert from "node:assert/strict";
import { filterNotebook, readNotebook } from "./notebook.ts";
import { averageSpeedDraftCodec, averageSpeedInitial } from "./average-speed-draft.ts";
import { decodeStoredValue } from "../stores/storage-envelope.ts";
import { lessonDraftExportCodecs } from "./lesson-draft.ts";

test("old explanation gains an empty personal note without losing its text", () => {
  const old = { stage: 4, summaryText: "Мои прежние слова", summarySaved: true };
  const result = decodeStoredValue(averageSpeedDraftCodec, JSON.stringify({ version: 1, data: old }));
  assert.ok(result.ok);
  assert.equal(result.value.summaryText, old.summaryText);
  assert.equal(result.value.personalNote, "");
  assert.equal(result.value.summarySaved, true);
});

test("notebook distinguishes both texts, preserves old lesson rules and never writes", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const stored = new Map([
    [averageSpeedDraftCodec.key, JSON.stringify({ version: 1, data: {
      ...averageSpeedInitial, summaryText: "Объём и время — мои слова <script>text</script>",
      summarySaved: false, personalNote: "Спросить про остановку",
    } })],
    ["physicslab-lesson-draft-acceleration", JSON.stringify({ version: 1, data: {
      screen: 9, summaryText: "Ещё не добавлено в блокнот", summarySaved: false,
    } })],
    ["physicslab-lesson-draft-dynamics", JSON.stringify({ version: 1, data: {
      step: 2, summaryText: "Моё сохранённое объяснение силы", summarySaved: true,
    } })],
    ["physicslab-lesson-draft-electro", JSON.stringify({ version: 1, data: {
      stage: 9, summaryText: "Сила тока зависит от напряжения и сопротивления цепи", summarySaved: true,
    } })],
    ["physicslab-lesson-draft-density", JSON.stringify({ version: 1, data: {
      stage: 2, summaryText: "При том же объёме большая плотность означает большую массу", summarySaved: true,
      investigationCompleted: true,
    } })],
    ["physicslab-lesson-draft-optics", "{broken personal draft"],
  ]);
  const original = Array.from(stored);
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: () => { throw new Error("Read must not write"); },
    removeItem: () => { throw new Error("Read must not delete"); },
  } } });
  try {
    const { notes, investigations, unavailable } = readNotebook();
    assert.equal(notes.length, 5);
    assert.deepEqual(notes.map(note => note.kind), ["explanation", "personal", "explanation", "explanation", "explanation"]);
    assert.equal(new Set(notes.map(note => note.id)).size, 5);
    assert.equal(notes[0].text, "Объём и время — мои слова <script>text</script>");
    assert.equal(filterNotebook(notes, "объем время").length, 1);
    assert.equal(filterNotebook(notes, "спросить")[0].kind, "personal");
    assert.deepEqual(investigations.map(investigation => investigation.id), ["electro", "density"]);
    assert.equal(investigations[1].text, "При том же объёме большая плотность означает большую массу");
    assert.equal(unavailable, 1);
    assert.deepEqual(Array.from(stored), original);
    const codec = lessonDraftExportCodecs.find(item => item.key === averageSpeedDraftCodec.key)!;
    const backup = decodeStoredValue(codec, stored.get(codec.key)!);
    assert.ok(backup.ok);
    assert.equal(backup.value.personalNote, "Спросить про остановку");
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
