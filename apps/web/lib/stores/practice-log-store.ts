import { atom } from "nanostores";
import {
  clearStore,
  readStore,
  writeStore,
  type StoreCodec,
} from "./storage-envelope.ts";

export const PRACTICE_LOG_STORAGE_KEY = "physicslab-v3-practice-log-v1";

const MAX_LOGGED_DAYS = 400;

// Отсортированный список локальных дат "YYYY-MM-DD" с хотя бы одной
// завершённой тренировкой. Хранится отдельно от прогресса тем, чтобы
// не менять формат physicslab-v3-progress-v1.
export const $practiceLog = atom<string[]>([]);

export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDayKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeLog(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter(isDayKey))]
    .sort()
    .slice(-MAX_LOGGED_DAYS);
}

// v1 — голый массив "YYYY-MM-DD" (до конверта). Конверт v1 — тот же массив.
export const practiceLogCodec: StoreCodec<string[]> = {
  key: PRACTICE_LOG_STORAGE_KEY,
  currentVersion: 1,
  sniffLegacy: (_raw, parsed) =>
    Array.isArray(parsed) ? { version: 1, data: parsed } : null,
  migrate: (data) => (Array.isArray(data) ? normalizeLog(data) : null),
};

function saveLog(log: string[]) {
  writeStore(practiceLogCodec, log);
}

export function hydratePracticeLogFromStorage() {
  const result = readStore(practiceLogCodec);
  if (!result.ok) {
    return;
  }

  $practiceLog.set(result.value);
  if (result.migrated) {
    writeStore(practiceLogCodec, result.value);
  }
}

export function logPracticeDay(date: Date = new Date()) {
  const key = toDayKey(date);
  const current = $practiceLog.get();

  if (current.includes(key)) {
    return;
  }

  const next = normalizeLog([...current, key]);
  $practiceLog.set(next);
  saveLog(next);
}

export function resetPracticeLog() {
  $practiceLog.set([]);
  clearStore(practiceLogCodec);
}

function previousDayKey(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);

  return toDayKey(date);
}

// Серия: подряд идущие дни, заканчивающиеся сегодня или вчера.
// Вчерашний хвост не обнуляем — сегодня серию ещё можно продолжить.
export function calcStreak(log: string[], today: string): number {
  const days = new Set(log);
  let cursor = days.has(today) ? today : previousDayKey(today);

  if (!days.has(cursor)) {
    return 0;
  }

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = previousDayKey(cursor);
  }

  return streak;
}

export function getLastDays(log: string[], today: string, count: number) {
  const days = new Set(log);
  const result: { key: string; practiced: boolean }[] = [];
  let cursor = today;

  for (let index = 0; index < count; index += 1) {
    result.unshift({ key: cursor, practiced: days.has(cursor) });
    cursor = previousDayKey(cursor);
  }

  return result;
}
