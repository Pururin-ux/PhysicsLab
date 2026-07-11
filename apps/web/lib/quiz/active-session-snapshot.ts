// Восстановление незавершённой тренировки после случайного refresh.
//
// sessionStorage, не localStorage: снапшот принадлежит одной вкладке, это не
// долгосрочный прогресс, не требует bump progress-версии и cross-device sync.
// Хранится только сериализуемое состояние сессии — никаких таймеров, DOM,
// React-состояния и Coach-анимаций.

import type {
  AnswerRecord,
  QuizSessionState,
} from "../../components/quiz/quiz-session-store";

export const ACTIVE_QUIZ_SNAPSHOT_KEY = "physicslab-v3-active-quiz-v1";
export const ACTIVE_QUIZ_SNAPSHOT_VERSION = 1;
// Снапшот старше суток не восстанавливаем: контекст тренировки уже потерян.
export const ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type ActiveQuizSnapshot = {
  version: number;
  sessionId: string;
  savedAt: number;
  template: string;
  topic: string;
  title: string;
  topicId?: string;
  sessionKind: "practice" | "exam";
  batch: number;
  taskIds: string[];
  session: {
    phase: "active" | "answered";
    currentIndex: number;
    selectedOptionId: string | null;
    answers: AnswerRecord[];
    score: number;
    streak: number;
    total: number;
  };
};

export type SnapshotReadResult =
  | { ok: true; snapshot: ActiveQuizSnapshot }
  | { ok: false; reason: "empty" | "corrupt" | "future-version" | "expired" | "no-storage" };

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFinitePositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidAnswerRecord(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (value.format !== "single_choice" && value.format !== "numeric_input") return false;
  if (typeof value.taskId !== "string" || value.taskId.length === 0) return false;
  if (typeof value.blueprint !== "string") return false;
  if (typeof value.isCorrect !== "boolean") return false;
  if (typeof value.taskTrap !== "string") return false;
  if (!isRecord(value.response)) return false;

  if (value.format === "single_choice") {
    return (
      (value.response as Record<string, unknown>).kind === "single_choice" &&
      typeof (value.response as Record<string, unknown>).optionId === "string" &&
      typeof value.selectedOptionId === "string" &&
      typeof value.correctOptionId === "string"
    );
  }

  return (
    (value.response as Record<string, unknown>).kind === "numeric_input" &&
    typeof (value.response as Record<string, unknown>).raw === "string" &&
    typeof (value.response as Record<string, unknown>).value === "number" &&
    Number.isFinite((value.response as Record<string, unknown>).value) &&
    typeof value.correctValue === "number" &&
    Number.isFinite(value.correctValue) &&
    typeof value.unit === "string"
  );
}

function isValidSnapshotShape(value: unknown): value is ActiveQuizSnapshot {
  if (!isRecord(value)) return false;
  if (typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt)) return false;
  if (typeof value.sessionId !== "string" || value.sessionId.length === 0) return false;
  if (typeof value.template !== "string" || value.template.length === 0) return false;
  if (typeof value.topic !== "string") return false;
  if (typeof value.title !== "string" || value.title.length === 0) return false;
  if (value.topicId !== undefined && typeof value.topicId !== "string") return false;
  if (value.sessionKind !== "practice" && value.sessionKind !== "exam") return false;
  if (!isFinitePositiveInt(value.batch)) return false;
  if (!Array.isArray(value.taskIds) || value.taskIds.length === 0) return false;
  if (!value.taskIds.every((id) => typeof id === "string" && id.length > 0)) return false;
  const taskIds = value.taskIds as string[];

  const session = value.session;
  if (!isRecord(session)) return false;
  if (session.phase !== "active" && session.phase !== "answered") return false;
  if (!isFinitePositiveInt(session.currentIndex)) return false;
  if (!isFinitePositiveInt(session.score)) return false;
  if (!isFinitePositiveInt(session.streak)) return false;
  if (!isFinitePositiveInt(session.total)) return false;
  if (session.selectedOptionId !== null && typeof session.selectedOptionId !== "string") {
    return false;
  }
  if (!Array.isArray(session.answers)) return false;
  if (!session.answers.every(isValidAnswerRecord)) return false;

  // Согласованность: total = числу задач; индекс в пределах; количество
  // ответов соответствует фазе (answered => ответ на текущую задачу есть).
  if (session.total !== value.taskIds.length) return false;
  if (session.currentIndex >= session.total) return false;
  const expectedAnswers =
    session.phase === "answered" ? session.currentIndex + 1 : session.currentIndex;
  if (session.answers.length !== expectedAnswers) return false;
  if (!session.answers.every((answer, index) => answer.taskId === taskIds[index])) return false;
  if (session.score > session.answers.length) return false;

  return true;
}

export function readActiveQuizSnapshot(now = Date.now()): SnapshotReadResult {
  const store = storage();
  if (!store) return { ok: false, reason: "no-storage" };

  let raw: string | null = null;
  try {
    raw = store.getItem(ACTIVE_QUIZ_SNAPSHOT_KEY);
  } catch {
    return { ok: false, reason: "no-storage" };
  }
  if (raw === null) return { ok: false, reason: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearActiveQuizSnapshot();
    return { ok: false, reason: "corrupt" };
  }

  if (!isRecord(parsed) || typeof parsed.version !== "number") {
    clearActiveQuizSnapshot();
    return { ok: false, reason: "corrupt" };
  }

  // Снапшот из более новой версии приложения: не используем и НЕ удаляем —
  // данные из будущего не уничтожаем без необходимости.
  if (parsed.version > ACTIVE_QUIZ_SNAPSHOT_VERSION) {
    return { ok: false, reason: "future-version" };
  }

  if (!isValidSnapshotShape(parsed)) {
    clearActiveQuizSnapshot();
    return { ok: false, reason: "corrupt" };
  }

  if (now - parsed.savedAt > ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS) {
    clearActiveQuizSnapshot();
    return { ok: false, reason: "expired" };
  }

  return { ok: true, snapshot: parsed };
}

export function writeActiveQuizSnapshot(snapshot: ActiveQuizSnapshot): void {
  const store = storage();
  if (!store) return;

  try {
    store.setItem(ACTIVE_QUIZ_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // Квота/приватный режим: восстановление — best-effort, не ломаем ответ.
  }
}

export function clearActiveQuizSnapshot(): void {
  const store = storage();
  if (!store) return;

  try {
    store.removeItem(ACTIVE_QUIZ_SNAPSHOT_KEY);
  } catch {
    // приватный режим
  }
}

// Снапшот применим к текущему экрану и загруженному набору задач?
export function snapshotMatches(
  snapshot: ActiveQuizSnapshot,
  context: {
    sessionId: string;
    template: string;
    topic: string;
    topicId?: string;
    sessionKind: "practice" | "exam";
    taskIds: string[];
  },
): boolean {
  return (
    snapshot.template === context.template &&
    snapshot.sessionId === context.sessionId &&
    snapshot.topic === context.topic &&
    snapshot.topicId === context.topicId &&
    snapshot.sessionKind === context.sessionKind &&
    snapshot.taskIds.length === context.taskIds.length &&
    snapshot.taskIds.every((id, index) => id === context.taskIds[index])
  );
}

export function buildSnapshot(input: {
  sessionId: string;
  template: string;
  topic: string;
  title: string;
  topicId?: string;
  sessionKind: "practice" | "exam";
  batch: number;
  taskIds: string[];
  session: QuizSessionState;
  now?: number;
}): ActiveQuizSnapshot | null {
  const { session } = input;
  // Сохраняем только active/answered: completed записывается в прогресс и
  // снапшот к этому моменту очищен.
  if (session.phase !== "active" && session.phase !== "answered") return null;

  return {
    version: ACTIVE_QUIZ_SNAPSHOT_VERSION,
    sessionId: input.sessionId,
    savedAt: input.now ?? Date.now(),
    template: input.template,
    topic: input.topic,
    title: input.title,
    topicId: input.topicId,
    sessionKind: input.sessionKind,
    batch: input.batch,
    taskIds: input.taskIds,
    session: {
      phase: session.phase,
      currentIndex: session.currentIndex,
      selectedOptionId: session.selectedOptionId,
      answers: session.answers.map((answer) =>
        answer.format === "single_choice"
          ? { ...answer, response: { ...answer.response } }
          : { ...answer, response: { ...answer.response } },
      ),
      score: session.score,
      streak: session.streak,
      total: session.total,
    },
  };
}
