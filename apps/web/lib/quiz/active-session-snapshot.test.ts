import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVE_QUIZ_SNAPSHOT_KEY,
  ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS,
  ACTIVE_QUIZ_SNAPSHOT_VERSION,
  buildSnapshot,
  clearActiveQuizSnapshot,
  readActiveQuizSnapshot,
  snapshotMatches,
  writeActiveQuizSnapshot,
  type ActiveQuizSnapshot,
} from "./active-session-snapshot.ts";
import type { QuizSessionState } from "../../components/quiz/quiz-session-store.ts";

// sessionStorage-стаб для node-тестов.
function installSessionStorage(overrides: Partial<Storage> = {}) {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    get length() {
      return data.size;
    },
    ...overrides,
  } as Storage;

  (globalThis as { window?: unknown }).window = { sessionStorage: storage };
  return data;
}

function uninstall() {
  delete (globalThis as { window?: unknown }).window;
}

const activeSession: QuizSessionState = {
  phase: "active",
  currentIndex: 3,
  selectedOptionId: null,
  answers: [
    {
      format: "single_choice",
      taskId: "t-1",
      blueprint: "free-fall",
      isCorrect: true,
      attempt: 1,
      taskTrap: "ловушка",
      response: { kind: "single_choice", optionId: "a" },
      selectedOptionId: "a",
      correctOptionId: "a",
    },
    {
      format: "numeric_input",
      taskId: "t-2",
      blueprint: "plane-mirror-separation",
      isCorrect: false,
      attempt: 1,
      taskTrap: "ловушка",
      selectedMisconception: "взял d",
      response: { kind: "numeric_input", raw: "40", value: 40 },
      correctValue: 80,
      unit: "см",
    },
    {
      format: "single_choice",
      taskId: "t-3",
      blueprint: "vt-slope",
      isCorrect: true,
      attempt: 1,
      taskTrap: "",
      response: { kind: "single_choice", optionId: "b" },
      selectedOptionId: "b",
      correctOptionId: "b",
    },
  ],
  score: 2,
  streak: 1,
  total: 10,
};

const taskIds = ["t-1", "t-2", "t-3", "t-4", "t-5", "t-6", "t-7", "t-8", "t-9", "t-10"];

function makeSnapshot(now = Date.now()): ActiveQuizSnapshot {
  const snapshot = buildSnapshot({
    sessionId: "mixed:2:test",
    template: "mixed",
    topic: "Кинематика",
    title: "Кинематика",
    sessionKind: "practice",
    batch: 2,
    taskIds,
    session: activeSession,
    now,
  });
  assert.ok(snapshot);
  return snapshot!;
}

test("round-trip: снапшот пишется и читается", () => {
  installSessionStorage();
  try {
    writeActiveQuizSnapshot(makeSnapshot());
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.snapshot.batch, 2);
      assert.equal(result.snapshot.sessionId, "mixed:2:test");
      assert.equal(result.snapshot.title, "Кинематика");
      assert.equal(result.snapshot.session.currentIndex, 3);
      assert.equal(result.snapshot.session.answers.length, 3);
      assert.equal(result.snapshot.version, ACTIVE_QUIZ_SNAPSHOT_VERSION);
    }
  } finally {
    uninstall();
  }
});

test("answered-фаза: ответов на один больше индекса", () => {
  installSessionStorage();
  try {
    const answered = buildSnapshot({
      sessionId: "mixed:0:test",
      template: "mixed",
      topic: "Кинематика",
      title: "Кинематика",
      sessionKind: "practice",
      batch: 0,
      taskIds,
      session: { ...activeSession, phase: "answered", currentIndex: 2 },
    });
    assert.ok(answered);
    writeActiveQuizSnapshot(answered!);
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok, true);
  } finally {
    uninstall();
  }
});

test("completed не сохраняется", () => {
  const snapshot = buildSnapshot({
    sessionId: "mixed:0:test",
    template: "mixed",
    topic: "Кинематика",
    title: "Кинематика",
    sessionKind: "practice",
    batch: 0,
    taskIds,
    session: { ...activeSession, phase: "completed" as never },
  });
  assert.equal(snapshot, null);
});

test("повреждённый JSON сбрасывается в corrupt и очищается", () => {
  const data = installSessionStorage();
  try {
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, "{broken json");
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "corrupt");
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false, "битый снапшот удалён");
  } finally {
    uninstall();
  }
});

test("несогласованное состояние (answers != index) — corrupt", () => {
  const data = installSessionStorage();
  try {
    const broken = makeSnapshot();
    broken.session.answers = broken.session.answers.slice(0, 1);
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(broken));
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "corrupt");
  } finally {
    uninstall();
  }
});

test("ответы с чужими taskId — corrupt", () => {
  const data = installSessionStorage();
  try {
    const broken = makeSnapshot();
    broken.session.answers[1] = { ...broken.session.answers[1], taskId: "other" };
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(broken));
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "corrupt");
  } finally {
    uninstall();
  }
});

test("просроченный снапшот отбрасывается и очищается", () => {
  const data = installSessionStorage();
  try {
    const old = makeSnapshot(Date.now() - ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS - 1000);
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(old));
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "expired");
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);
  } finally {
    uninstall();
  }
});

test("future-version не используется и НЕ удаляется", () => {
  const data = installSessionStorage();
  try {
    const future = { ...makeSnapshot(), version: ACTIVE_QUIZ_SNAPSHOT_VERSION + 1 };
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(future));
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "future-version");
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true, "данные из будущего не тронуты");
  } finally {
    uninstall();
  }
});

test("snapshotMatches: другой template/набор задач не совпадает", () => {
  const snapshot = makeSnapshot();
  assert.equal(
    snapshotMatches(snapshot, { sessionId: "mixed:2:test", template: "mixed", topic: "Кинематика", sessionKind: "practice", taskIds }),
    true,
  );
  assert.equal(
    snapshotMatches(snapshot, { sessionId: "mixed:2:test", template: "exam", topic: "Кинематика", sessionKind: "practice", taskIds }),
    false,
  );
  assert.equal(
    snapshotMatches(snapshot, { sessionId: "mixed:2:test", template: "mixed", topic: "Кинематика", sessionKind: "exam", taskIds }),
    false,
  );
  assert.equal(
    snapshotMatches(snapshot, {
      template: "mixed",
      sessionId: "mixed:2:test",
      topic: "Кинематика",
      sessionKind: "practice",
      taskIds: [...taskIds.slice(0, 9), "other"],
    }),
    false,
  );
});

test("бросающий sessionStorage не роняет чтение/запись/очистку", () => {
  installSessionStorage({
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  });
  try {
    assert.equal(readActiveQuizSnapshot().ok, false);
    assert.doesNotThrow(() => writeActiveQuizSnapshot(makeSnapshot()));
    assert.doesNotThrow(() => clearActiveQuizSnapshot());
  } finally {
    uninstall();
  }
});
