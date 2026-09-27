import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVE_QUIZ_SNAPSHOT_KEY,
  ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS,
  ACTIVE_QUIZ_SNAPSHOT_VERSION,
  buildSnapshot,
  clearExamResumeCandidate,
  clearActiveQuizSnapshot,
  clearActiveQuizSnapshotIfUnchanged,
  fingerprintTasks,
  readActiveQuizSnapshot,
  readExamResumeCandidate,
  snapshotMatches,
  writeActiveQuizSnapshot,
  type ActiveQuizSnapshot,
} from "./active-session-snapshot.ts";
import type { QuizSessionState, QuizTask } from "../../components/quiz/quiz-session-store.ts";

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
const taskFingerprint = "v1:unchanged-tasks";

function makeSnapshot(now = Date.now()): ActiveQuizSnapshot {
  const snapshot = buildSnapshot({
    attemptId: "attempt-test-0001",
    template: "mixed",
    topic: "Кинематика",
    title: "Кинематика",
    sessionKind: "practice",
    batch: 2,
    taskIds,
    taskFingerprint,
    session: activeSession,
    now,
  });
  assert.ok(snapshot);
  return snapshot!;
}

function makeExamSnapshot(
  phase: "active" | "answered" = "active",
  now = Date.now(),
): ActiveQuizSnapshot {
  const snapshot = buildSnapshot({
    attemptId: "exam-attempt-0001",
    template: "exam",
    topic: "Смешанная тренировка",
    title: "Смешанная тренировка · открытые темы",
    sessionKind: "exam",
    batch: 4,
    taskIds,
    taskFingerprint,
    session: {
      ...activeSession,
      phase,
      currentIndex: phase === "answered" ? 2 : 3,
    },
    now,
  });
  assert.ok(snapshot);
  return snapshot;
}

test("exam resume candidate: active and answered snapshots expose compact metadata", () => {
  installSessionStorage();
  try {
    writeActiveQuizSnapshot(makeExamSnapshot("active"));
    assert.deepEqual(readExamResumeCandidate(), {
      attemptId: "exam-attempt-0001",
      batch: 4,
      currentTaskNumber: 4,
      total: 10,
      phase: "active",
      savedAt: readExamResumeCandidate()?.savedAt,
      hasTaskFingerprint: true,
    });

    writeActiveQuizSnapshot(makeExamSnapshot("answered"));
    const answered = readExamResumeCandidate();
    assert.equal(answered?.phase, "answered");
    assert.equal(answered?.currentTaskNumber, 3);
  } finally {
    uninstall();
  }
});

test("exam resume candidate ignores and preserves practice or another template", () => {
  const data = installSessionStorage();
  try {
    const practice = makeSnapshot();
    writeActiveQuizSnapshot(practice);
    assert.equal(readExamResumeCandidate(), null);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true);

    const otherTemplate = { ...makeExamSnapshot(), template: "mixed" };
    writeActiveQuizSnapshot(otherTemplate);
    assert.equal(readExamResumeCandidate(), null);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true);
  } finally {
    uninstall();
  }
});

test("exam resume candidate follows corrupt, expired and future-version policy", () => {
  const data = installSessionStorage();
  try {
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, "{broken");
    assert.equal(readExamResumeCandidate(), null);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);

    writeActiveQuizSnapshot(
      makeExamSnapshot("active", Date.now() - ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS - 1),
    );
    assert.equal(readExamResumeCandidate(), null);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);

    data.set(
      ACTIVE_QUIZ_SNAPSHOT_KEY,
      JSON.stringify({ ...makeExamSnapshot(), version: ACTIVE_QUIZ_SNAPSHOT_VERSION + 1 }),
    );
    assert.equal(readExamResumeCandidate(), null);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true);
  } finally {
    uninstall();
  }
});

test("clearExamResumeCandidate clears only the matching exam attempt", () => {
  const data = installSessionStorage();
  try {
    writeActiveQuizSnapshot(makeExamSnapshot());
    assert.equal(clearExamResumeCandidate("another-attempt"), false);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true);
    assert.equal(clearExamResumeCandidate("exam-attempt-0001"), true);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);

    writeActiveQuizSnapshot(makeSnapshot());
    assert.equal(clearExamResumeCandidate("attempt-test-0001"), false);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), true);
  } finally {
    uninstall();
  }
});

test("exam resume candidate handles unavailable sessionStorage", () => {
  installSessionStorage({
    getItem: () => {
      throw new Error("blocked");
    },
  });
  try {
    assert.doesNotThrow(() => readExamResumeCandidate());
    assert.equal(readExamResumeCandidate(), null);
  } finally {
    uninstall();
  }
});

test("focused five-task practice snapshot remains strictly recoverable", () => {
  const focusedTaskIds = ["ohm-1", "ohm-2", "ohm-3", "ohm-4", "ohm-5"];
  const focusedSession: QuizSessionState = {
    phase: "active",
    currentIndex: 2,
    selectedOptionId: null,
    answers: activeSession.answers.slice(0, 2).map((answer, index) => ({
      ...answer,
      taskId: focusedTaskIds[index],
      blueprint: "ohm-law",
    })),
    score: 1,
    streak: 0,
    total: 5,
  };
  const snapshot = buildSnapshot({
    attemptId: "focused-attempt-0001",
    template: "ohm-law",
    topic: "Электродинамика",
    title: "Закон Ома",
    topicId: "electrodynamics",
    sessionKind: "practice",
    batch: 3,
    taskIds: focusedTaskIds,
    taskFingerprint,
    session: focusedSession,
  });

  assert.ok(snapshot);
  assert.equal(snapshot.session.total, 5);
  assert.equal(
    snapshotMatches(snapshot, {
      attemptId: "focused-attempt-0001",
      template: "ohm-law",
      topic: "Электродинамика",
      topicId: "electrodynamics",
      sessionKind: "practice",
      taskIds: focusedTaskIds,
      taskFingerprint,
    }),
    true,
  );
  assert.equal(
    snapshotMatches(snapshot, {
      attemptId: "focused-attempt-0001",
      template: "ohm-law",
      topic: "Электродинамика",
      topicId: "electrodynamics",
      sessionKind: "practice",
      taskIds: [...focusedTaskIds, "ohm-6"],
      taskFingerprint,
    }),
    false,
  );
});

test("focused answers require unchanged task content, even when task IDs match", () => {
  const task: QuizTask = {
    id: "fixed-1",
    type: "single_choice",
    blueprint: "ohm-law",
    difficulty: 1,
    text: "Найди силу тока при 4 В и 2 Ом.",
    options: [{ id: "a", text: "2 А" }, { id: "b", text: "4 А" }],
    answer: "a",
    explanation: "I = U / R",
    trap: "",
    coach_lines: { correct: "Верно", wrong: "Проверь сопротивление", hint: "Раздели напряжение на сопротивление" },
  };
  const originalFingerprint = fingerprintTasks([task]);
  const snapshot = buildSnapshot({
    attemptId: "focused-attempt-0002",
    template: "ohm-law",
    topic: "Электродинамика",
    title: "Закон Ома",
    topicId: "electrodynamics",
    sessionKind: "practice",
    batch: 0,
    taskIds: [task.id],
    taskFingerprint: originalFingerprint,
    session: {
      phase: "answered",
      currentIndex: 0,
      selectedOptionId: "a",
      answers: [{ ...activeSession.answers[0], taskId: task.id, blueprint: "ohm-law" }],
      score: 1,
      streak: 1,
      total: 1,
    },
  });
  assert.ok(snapshot);
  const context = {
    attemptId: snapshot.attemptId,
    template: snapshot.template,
    topic: snapshot.topic,
    topicId: snapshot.topicId,
    sessionKind: snapshot.sessionKind,
    taskIds: snapshot.taskIds,
    taskFingerprint: originalFingerprint,
  };
  assert.equal(snapshotMatches(snapshot, context), true);
  assert.equal(snapshotMatches(snapshot, { ...context, taskFingerprint: fingerprintTasks([{ ...task, text: "Найди силу тока при 8 В и 2 Ом." }]) }), false);
  assert.equal(snapshotMatches(snapshot, { ...context, taskFingerprint: fingerprintTasks([{ ...task, answer: "b" }]) }), false);
});

test("legacy snapshots without task fingerprint are preserved but not restored", () => {
  const data = installSessionStorage();
  try {
    const { taskFingerprint: _fingerprint, ...legacy } = makeSnapshot();
    const raw = JSON.stringify(legacy);
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, raw);
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok, true, "legacy shape stays readable without schema migration");
    if (result.ok) {
      assert.equal(snapshotMatches(result.snapshot, {
        attemptId: result.snapshot.attemptId,
        template: result.snapshot.template,
        topic: result.snapshot.topic,
        topicId: result.snapshot.topicId,
        sessionKind: result.snapshot.sessionKind,
        taskIds: result.snapshot.taskIds,
        taskFingerprint,
      }), false);
    }
    assert.equal(data.get(ACTIVE_QUIZ_SNAPSHOT_KEY), raw, "incompatible record remains intact");

    const { taskFingerprint: _examFingerprint, ...legacyExam } = makeExamSnapshot();
    const rawExam = JSON.stringify(legacyExam);
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, rawExam);
    assert.equal(readExamResumeCandidate()?.hasTaskFingerprint, false, "gate can offer an explicit fresh start");
    assert.equal(readExamResumeCandidate()?.attemptId, legacyExam.attemptId);
    assert.equal(data.get(ACTIVE_QUIZ_SNAPSHOT_KEY), rawExam);
    assert.equal(clearExamResumeCandidate("another-attempt"), false);
    assert.equal(data.get(ACTIVE_QUIZ_SNAPSHOT_KEY), rawExam);
    assert.equal(clearExamResumeCandidate(legacyExam.attemptId), true, "explicit discard remains available");
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);
  } finally {
    uninstall();
  }
});

test("explicit discard removes only the exact incompatible tab snapshot", () => {
  const data = installSessionStorage();
  try {
    const { taskFingerprint: _fingerprint, ...legacy } = makeSnapshot();
    const original = JSON.stringify(legacy);
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, original);
    const changed = { ...legacy, title: "Другая попытка" };
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(changed));
    assert.equal(clearActiveQuizSnapshotIfUnchanged(legacy), false);
    assert.equal(data.get(ACTIVE_QUIZ_SNAPSHOT_KEY), JSON.stringify(changed));
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, original);
    assert.equal(clearActiveQuizSnapshotIfUnchanged(legacy), true);
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false);
  } finally {
    uninstall();
  }
});


test("старые focused-снимки трёх измерительных семейств переживают смену темы", () => {
  const familyTaskIds = ["measure-1", "measure-2", "measure-3", "measure-4", "measure-5"];
  for (const template of ["length-unit-conversion", "graduated-scale-reading", "rectangular-block-volume"]) {
    const snapshot = buildSnapshot({
      attemptId: "measurement-attempt-0001",
      template,
      topic: "Кинематика",
      title: "Измерение",
      topicId: "kinematics",
      sessionKind: "practice",
      batch: 1,
      taskIds: familyTaskIds,
      taskFingerprint: "v1:unchanged",
      session: {
        ...activeSession,
        currentIndex: 2,
        answers: activeSession.answers.slice(0, 2).map((answer, index) => ({
          ...answer,
          taskId: familyTaskIds[index],
          blueprint: template,
        })),
        total: 5,
      },
    });
    assert.ok(snapshot);
    const context = {
      attemptId: "measurement-attempt-0001",
      template,
      topic: "Измерения",
      topicId: "measurements",
      sessionKind: "practice" as const,
      taskIds: familyTaskIds,
      taskFingerprint: "v1:unchanged",
    };
    assert.equal(snapshotMatches(snapshot, context), true, template);
    assert.equal(snapshotMatches(snapshot, { ...context, taskIds: [...familyTaskIds.slice(0, 4), "other"] }), false);
    assert.equal(snapshotMatches(snapshot, { ...context, taskFingerprint: "v1:changed" }), false);
    assert.equal(snapshotMatches(snapshot, { ...context, topicId: "dynamics" }), false);
    assert.equal(snapshotMatches(snapshot, { ...context, topic: "Другой раздел" }), false);
    assert.equal(snapshotMatches(snapshot, { ...context, template: "unit-conversion-speed" }), false);
  }
});

test("round-trip: снапшот пишется и читается", () => {
  installSessionStorage();
  try {
    writeActiveQuizSnapshot(makeSnapshot());
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.snapshot.batch, 2);
      assert.equal(result.snapshot.attemptId, "attempt-test-0001");
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
      attemptId: "attempt-test-0002",
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
    attemptId: "attempt-test-0002",
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
    snapshotMatches(snapshot, { attemptId: "attempt-test-0001", template: "mixed", topic: "Кинематика", sessionKind: "practice", taskIds, taskFingerprint }),
    true,
  );
  assert.equal(
    snapshotMatches(snapshot, { attemptId: "attempt-test-0001", template: "exam", topic: "Кинематика", sessionKind: "practice", taskIds, taskFingerprint }),
    false,
  );
  assert.equal(
    snapshotMatches(snapshot, { attemptId: "attempt-test-0001", template: "mixed", topic: "Кинематика", sessionKind: "exam", taskIds, taskFingerprint }),
    false,
  );
  assert.equal(
    snapshotMatches(snapshot, {
      template: "mixed",
      attemptId: "attempt-test-0001",
      topic: "Кинематика",
      sessionKind: "practice",
      taskIds: [...taskIds.slice(0, 9), "other"],
      taskFingerprint,
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

test("malformed attemptId делает снапшот corrupt", () => {
  const data = installSessionStorage();
  try {
    for (const badId of ["", "short", 42, null]) {
      const broken = { ...makeSnapshot(), attemptId: badId };
      data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(broken));
      const result = readActiveQuizSnapshot();
      assert.equal(
        result.ok === false && result.reason,
        "corrupt",
        `attemptId=${JSON.stringify(badId)} должен быть отвергнут`,
      );
    }
  } finally {
    uninstall();
  }
});

test("legacy v1-снапшот (sessionId без attemptId) безопасно отбрасывается", () => {
  const data = installSessionStorage();
  try {
    const { attemptId: _dropped, ...rest } = makeSnapshot();
    const legacyV1 = { ...rest, version: 1, sessionId: "mixed:2:kin-1|kin-2" };
    data.set(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(legacyV1));
    const result = readActiveQuizSnapshot();
    assert.equal(result.ok === false && result.reason, "corrupt");
    assert.equal(data.has(ACTIVE_QUIZ_SNAPSHOT_KEY), false, "v1 отброшен (это не прогресс)");
  } finally {
    uninstall();
  }
});

test("snapshotMatches: чужой attemptId не совпадает", () => {
  const snapshot = makeSnapshot();
  assert.equal(
    snapshotMatches(snapshot, {
      attemptId: "another-attempt-id",
      template: "mixed",
      topic: "Кинематика",
      sessionKind: "practice",
      taskIds,
      taskFingerprint,
    }),
    false,
  );
});
