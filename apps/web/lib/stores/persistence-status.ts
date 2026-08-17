// Клиентский статус персистентности. НЕ хранится в localStorage (это как раз
// тот слой, который может быть сломан) — только in-memory атом + dismiss в
// sessionStorage, чтобы уведомление не появлялось на каждом route в одной
// вкладке.

import { atom } from "nanostores";
import type { ReadResult, WriteResult } from "./storage-envelope.ts";

export type PersistenceStatus =
  | "checking"
  | "available"
  | "unavailable"
  | "quota"
  | "recovered-corrupt"
  | "future-version";

export const $persistenceStatus = atom<PersistenceStatus>("checking");

const DISMISS_KEY = "physicslab-v3-persistence-notice-dismissed";

// future-version прогресс работает в режиме «только чтение по умолчанию»:
// запись затёрла бы данные более новой версии приложения.
let futureVersionKeys = new Set<string>();

export function isWriteBlockedForKey(key: string): boolean {
  return futureVersionKeys.has(key);
}

// Только явное пользовательское действие (reset/import) может снять защиту.
export function allowWriteForKey(key: string): void {
  futureVersionKeys.delete(key);
}

function escalate(next: PersistenceStatus) {
  const current = $persistenceStatus.get();
  // Порядок серьёзности: сообщение о невозможности сохранить важнее
  // одноразового «данные были сброшены».
  const weight: Record<PersistenceStatus, number> = {
    checking: 0,
    available: 1,
    "recovered-corrupt": 2,
    "future-version": 3,
    quota: 4,
    unavailable: 5,
  };
  if (weight[next] > weight[current]) {
    $persistenceStatus.set(next);
  }
}

// Вызывается каждым store при hydration с результатом чтения.
export function reportReadResult(key: string, result: ReadResult<unknown>): void {
  if (result.ok) {
    escalate("available");
    return;
  }

  switch (result.reason) {
    case "empty":
      escalate("available");
      return;
    case "corrupt":
      escalate("recovered-corrupt");
      return;
    case "future-version":
      futureVersionKeys.add(key);
      escalate("future-version");
      return;
    case "no-storage":
      escalate("unavailable");
      return;
  }
}

// Вызывается при записи: неуспешная запись не должна выдаваться за success.
export function reportWriteResult(result: WriteResult): void {
  switch (result) {
    case "success":
      escalate("available");
      return;
    case "quota":
      escalate("quota");
      return;
    case "no-storage":
    case "error":
      escalate("unavailable");
      return;
  }
}

export function isNoticeDismissed(): boolean {
  try {
    return typeof window !== "undefined" &&
      window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissNotice(): void {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // dismiss останется in-memory через компонент
  }
}

// Для unit-тестов.
export function resetPersistenceStatusForTests(): void {
  $persistenceStatus.set("checking");
  futureVersionKeys = new Set();
}
