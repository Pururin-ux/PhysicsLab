import { atom } from "nanostores";
import {
  clearStore,
  readStore,
  writeStore,
  type StoreCodec,
} from "./storage-envelope.ts";

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

// v1 — голый массив попыток (до конверта). Конверт v1 хранит тот же массив.
export const examLogCodec: StoreCodec<ExamAttempt[]> = {
  key: EXAM_LOG_STORAGE_KEY,
  currentVersion: 1,
  sniffLegacy: (_raw, parsed) =>
    Array.isArray(parsed) ? { version: 1, data: parsed } : null,
  migrate: (data) => (Array.isArray(data) ? normalizeLog(data) : null),
};

function saveLog(log: ExamAttempt[]) {
  writeStore(examLogCodec, log);
}

export function hydrateExamLogFromStorage() {
  const result = readStore(examLogCodec);
  if (!result.ok) {
    return;
  }

  $examLog.set(result.value);
  if (result.migrated) {
    writeStore(examLogCodec, result.value);
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
  clearStore(examLogCodec);
}

export function getBestAttempt(log: ExamAttempt[]): ExamAttempt | null {
  if (log.length === 0) {
    return null;
  }

  return log.reduce((best, attempt) =>
    attempt.score / attempt.total > best.score / best.total ? attempt : best,
  );
}
