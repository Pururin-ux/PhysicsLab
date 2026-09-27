import assert from "node:assert/strict";
import test from "node:test";
import {
  readReviewResumeCandidates,
  reviewResumeCandidatesFromSnapshots,
} from "./review-resume.ts";
import {
  ACTIVE_QUIZ_SNAPSHOT_KEY,
  ACTIVE_QUIZ_SNAPSHOT_VERSION,
  type ActiveQuizSnapshot,
} from "../quiz/active-session-snapshot.ts";
import { SAVED_MOTION_PRACTICE_KEY } from "../quiz/saved-motion-practice.ts";

function snapshot(template: string, attemptId: string, savedAt = Date.now()): ActiveQuizSnapshot {
  return {
    version: ACTIVE_QUIZ_SNAPSHOT_VERSION,
    attemptId,
    savedAt,
    template,
    topic: "Кинематика",
    title: "Задачи",
    topicId: "kinematics",
    sessionKind: "practice",
    batch: 0,
    taskIds: ["task-1"],
    taskFingerprint: "task-content-fingerprint",
    session: {
      phase: "answered",
      currentIndex: 0,
      selectedOptionId: "wrong",
      answers: [{
        taskId: "task-1",
        blueprint: template,
        isCorrect: false,
        attempt: 1,
        taskTrap: "проверить шаг",
        format: "single_choice",
        response: { kind: "single_choice", optionId: "wrong" },
        selectedOptionId: "wrong",
        correctOptionId: "right",
      }],
      score: 0,
      streak: 0,
      total: 1,
    },
  };
}

test("review uses the durable motion draft selected by QuizSession", () => {
  const saved = snapshot("average-speed-segments", "saved-attempt", 100);
  const olderTab = snapshot("average-speed-segments", "older-tab-attempt", 90);
  const newerTab = snapshot("average-speed-segments", "newer-tab-attempt", 110);

  assert.deepEqual(
    reviewResumeCandidatesFromSnapshots(olderTab, saved).map((item) => item.sessionId),
    ["average-speed-segments:0:saved-attempt"],
  );
  assert.deepEqual(
    reviewResumeCandidatesFromSnapshots(newerTab, saved).map((item) => item.sessionId),
    ["average-speed-segments:0:newer-tab-attempt"],
  );
  assert.deepEqual(
    reviewResumeCandidatesFromSnapshots(snapshot("unit-conversion-speed", "other-tab"), saved)
      .map((item) => item.sessionId),
    ["unit-conversion-speed:0:other-tab", "average-speed-segments:0:saved-attempt"],
  );
  assert.deepEqual(
    reviewResumeCandidatesFromSnapshots({ ...saved, taskFingerprint: undefined }, null),
    [],
  );
});

test("review reads tab and durable drafts without deleting or replacing them", () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  const tab = snapshot("unit-conversion-speed", "tab-attempt");
  const saved = snapshot("average-speed-segments", "saved-attempt");
  const tabRaw = JSON.stringify(tab);
  const savedRaw = JSON.stringify({ version: 1, data: saved });
  const tabData = new Map([[ACTIVE_QUIZ_SNAPSHOT_KEY, tabRaw]]);
  const savedData = new Map([[SAVED_MOTION_PRACTICE_KEY, savedRaw]]);
  let writes = 0;
  let removes = 0;
  const storage = (data: Map<string, string>) => ({
    getItem: (key: string) => data.get(key) ?? null,
    setItem: () => { writes += 1; },
    removeItem: () => { removes += 1; },
  });

  try {
    (globalThis as { window?: unknown }).window = {
      sessionStorage: storage(tabData),
      localStorage: storage(savedData),
    };
    const candidates = readReviewResumeCandidates();
    assert.deepEqual(candidates.map((item) => item.sessionId), [
      "unit-conversion-speed:0:tab-attempt",
      "average-speed-segments:0:saved-attempt",
    ]);
    assert.equal(writes, 0);
    assert.equal(removes, 0);
    assert.equal(tabData.get(ACTIVE_QUIZ_SNAPSHOT_KEY), tabRaw);
    assert.equal(savedData.get(SAVED_MOTION_PRACTICE_KEY), savedRaw);
  } finally {
    if (originalWindow === undefined) delete (globalThis as { window?: unknown }).window;
    else (globalThis as { window?: unknown }).window = originalWindow;
  }
});
