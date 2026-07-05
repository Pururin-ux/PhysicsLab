import { atom } from "nanostores";

export const EXAM_LOG_STORAGE_KEY = "physicslab-v3-exam-log-v1";

const MAX_LOGGED_ATTEMPTS = 50;

export type ExamAttempt = {
  completedAt: string;
  score: number;
  total: number;
};

export const $examLog = atom<ExamAttempt[]>([]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeAttempt(value: unknown): ExamAttempt | null {
  if (!isRecord(value)) {
    return null;
  }

  const total =
    typeof value.total === "number" && Number.isFinite(value.total) && value.total > 0
      ? Math.floor(value.total)
      : 0;
  const score =
    typeof value.score === "number" && Number.isFinite(value.score) && value.score >= 0
      ? Math.min(Math.floor(value.score), total)
      : 0;

  if (total === 0 || typeof value.completedAt !== "string") {
    return null;
  }

  return { completedAt: value.completedAt, score, total };
}

function normalizeLog(value: unknown): ExamAttempt[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeAttempt)
    .filter((attempt): attempt is ExamAttempt => attempt !== null)
    .slice(-MAX_LOGGED_ATTEMPTS);
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function saveLog(log: ExamAttempt[]) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(EXAM_LOG_STORAGE_KEY, JSON.stringify(log));
  } catch {
    // localStorage can be unavailable in private or constrained browser modes.
  }
}

export function hydrateExamLogFromStorage() {
  if (!canUseStorage()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(EXAM_LOG_STORAGE_KEY);
    if (!raw) {
      return;
    }

    $examLog.set(normalizeLog(JSON.parse(raw)));
  } catch {
    window.localStorage.removeItem(EXAM_LOG_STORAGE_KEY);
  }
}

export function recordExamAttempt(score: number, total: number) {
  const attempt = normalizeAttempt({
    completedAt: new Date().toISOString(),
    score,
    total,
  });

  if (!attempt) {
    return;
  }

  const next = [...$examLog.get(), attempt].slice(-MAX_LOGGED_ATTEMPTS);
  $examLog.set(next);
  saveLog(next);
}

export function resetExamLog() {
  $examLog.set([]);

  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(EXAM_LOG_STORAGE_KEY);
}

export function getBestAttempt(log: ExamAttempt[]): ExamAttempt | null {
  if (log.length === 0) {
    return null;
  }

  return log.reduce((best, attempt) =>
    attempt.score / attempt.total > best.score / best.total ? attempt : best,
  );
}
