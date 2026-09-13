import test from "node:test";
import assert from "node:assert/strict";
import { buildSnapshot, fingerprintTasks, snapshotMatches } from "./active-session-snapshot.ts";
import type { QuizTask } from "../../components/quiz/quiz-session-store.ts";
import { readSavedMotionPractice, writeSavedMotionPractice, SAVED_MOTION_PRACTICE_KEY, resetSavedMotionPractice } from "./saved-motion-practice.ts";
import { buildExportFile, applyImport, summarizeExport } from "../stores/progress-export.ts";

const snapshot = buildSnapshot({
  attemptId: "attempt-motion-0001", template: "average-speed-segments", topic: "Кинематика",
  title: "Средняя скорость", topicId: "kinematics", sessionKind: "practice", batch: 3, taskIds: ["motion-task-1"],
  session: { phase: "active", currentIndex: 0, selectedOptionId: null, answers: [], score: 0, streak: 0, total: 1 },
  numericDraft: { taskId: "motion-task-1", raw: "2," }, now: 0,
})!;

function withStorage(run: (data: Map<string, string>) => void) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  } } });
  try { run(data); } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("practice survives without sessionStorage or daily expiry and enters backup", () => withStorage(data => {
  assert.ok(writeSavedMotionPractice(snapshot, null).ok);
  const read = readSavedMotionPractice().result;
  assert.ok(read.ok);
  assert.deepEqual(read.snapshot, snapshot);
  const backup = buildExportFile();
  assert.ok(backup.stores[SAVED_MOTION_PRACTICE_KEY]);
  assert.ok(summarizeExport(backup));
  data.delete(SAVED_MOTION_PRACTICE_KEY);
  assert.equal(applyImport(backup), true);
  const restored = readSavedMotionPractice().result;
  assert.ok(restored.ok);
  assert.equal(restored.snapshot.numericDraft?.raw, "2,");
  assert.equal(restored.snapshot.attemptId, snapshot.attemptId);
  assert.equal(restored.snapshot.batch, 3);
  resetSavedMotionPractice();
  assert.equal(data.has(SAVED_MOTION_PRACTICE_KEY), false);
}));

test("stale tab cannot overwrite or clear a newer answer of the same attempt", () => withStorage(() => {
  const first = writeSavedMotionPractice(snapshot, null);
  assert.ok(first.ok);
  const newer = { ...snapshot, savedAt: 2, numericDraft: { taskId: "motion-task-1", raw: "2,5" } };
  const second = writeSavedMotionPractice(newer, first.token);
  assert.ok(second.ok);
  assert.deepEqual(writeSavedMotionPractice(snapshot, first.token), { ok: false, reason: "conflict" });
  assert.deepEqual(writeSavedMotionPractice(null, first.token), { ok: false, reason: "conflict" });
  assert.equal(readSavedMotionPractice().token, second.token);
  assert.ok(writeSavedMotionPractice(null, second.token).ok);
}));

test("corrupt, future and unrelated records remain untouched", () => withStorage(data => {
  for (const raw of ["{broken", JSON.stringify({ version: 99, data: snapshot }), JSON.stringify({ version: 1, data: { ...snapshot, sessionKind: "exam" } })]) {
    data.set(SAVED_MOTION_PRACTICE_KEY, raw);
    assert.equal(readSavedMotionPractice().result.ok, false);
    assert.equal(writeSavedMotionPractice(snapshot, raw).ok, false);
    assert.equal(data.get(SAVED_MOTION_PRACTICE_KEY), raw);
  }
}));

test("invalid numeric drafts and denied storage cannot report a successful save", () => withStorage(data => {
  for (const numericDraft of [{ taskId: "another-task", raw: "2" }, { taskId: "motion-task-1", raw: "2".repeat(1001) }]) {
    assert.deepEqual(writeSavedMotionPractice({ ...snapshot, numericDraft }, null), { ok: false, reason: "invalid" });
  }
  assert.equal(data.size, 0);
  Object.defineProperty(window, "localStorage", { get() { throw new Error("Denied"); } });
  assert.equal(readSavedMotionPractice().result.ok, false);
  assert.deepEqual(writeSavedMotionPractice(snapshot, null), { ok: false, reason: "no-storage" });
}));

test("changed content with the same task ID cannot receive an old answer", () => {
  const task: QuizTask = { id: "motion-task-1", type: "single_choice", blueprint: "average-speed-segments", difficulty: 1,
    text: "Путь 40 м, время 20 с. Найди скорость.", options: [{ id: "a", text: "2 м/с" }], answer: "a",
    explanation: "40 / 20 = 2", trap: "", coach_lines: { correct: "Верно", wrong: "Проверь время", hint: "Весь путь / всё время" } };
  const original = fingerprintTasks([task]);
  const changed = fingerprintTasks([{ ...task, text: "Путь 40 м, время 10 с. Найди скорость." }]);
  assert.notEqual(changed, original);
  const context = { attemptId: snapshot.attemptId, template: snapshot.template, topic: snapshot.topic,
    topicId: snapshot.topicId, sessionKind: snapshot.sessionKind, taskIds: snapshot.taskIds, taskFingerprint: original };
  assert.ok(snapshotMatches({ ...snapshot, taskFingerprint: original }, context));
  assert.equal(snapshotMatches({ ...snapshot, taskFingerprint: original }, { ...context, taskFingerprint: changed }), false);
});
