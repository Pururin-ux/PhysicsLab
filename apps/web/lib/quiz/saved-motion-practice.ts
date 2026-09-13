import { decodeQuizSnapshot, type ActiveQuizSnapshot, type SnapshotReadResult } from "./active-session-snapshot.ts";
import { decodeStoredValue, type StoreCodec } from "../stores/storage-envelope.ts";

export const SAVED_MOTION_PRACTICE_KEY = "physicslab-saved-motion-practice-v1";
export const isMotionPractice = (template: string, kind: string) => template === "average-speed-segments" && kind === "practice";

export const savedMotionPracticeCodec: StoreCodec<ActiveQuizSnapshot> = {
  key: SAVED_MOTION_PRACTICE_KEY,
  currentVersion: 1,
  sniffLegacy: (raw) => {
    const result = decodeQuizSnapshot(raw);
    return result.ok ? { version: 1, data: result.snapshot } : null;
  },
  migrate: (data, version) => {
    if (version !== 1) return null;
    const result = decodeQuizSnapshot(JSON.stringify(data));
    return result.ok && isMotionPractice(result.snapshot.template, result.snapshot.sessionKind) ? result.snapshot : null;
  },
};

function decodeSaved(raw: string): SnapshotReadResult {
  const result = decodeStoredValue(savedMotionPracticeCodec, raw);
  return result.ok ? { ok: true, snapshot: result.value } : result;
}

export function readSavedMotionPractice(): { result: SnapshotReadResult; token: string | null } {
  try {
    const token = window.localStorage.getItem(SAVED_MOTION_PRACTICE_KEY);
    if (token === null) return { result: { ok: false, reason: "empty" }, token };
    const result = decodeSaved(token);
    if (result.ok && !isMotionPractice(result.snapshot.template, result.snapshot.sessionKind)) {
      return { result: { ok: false, reason: "corrupt" }, token };
    }
    return { result, token };
  } catch {
    return { result: { ok: false, reason: "no-storage" }, token: null };
  }
}

// Compare with the exact value this tab read or last wrote. A different tab's
// update, an unreadable record, or a newer format must not be overwritten.
export function writeSavedMotionPractice(snapshot: ActiveQuizSnapshot | null, expectedToken: string | null):
  { ok: true; token: string | null } | { ok: false; reason: "conflict" | "no-storage" | "invalid" } {
  if (snapshot && (!isMotionPractice(snapshot.template, snapshot.sessionKind) || !decodeQuizSnapshot(JSON.stringify(snapshot)).ok)) {
    return { ok: false, reason: "invalid" };
  }
  try {
    const store = window.localStorage;
    const current = store.getItem(SAVED_MOTION_PRACTICE_KEY);
    if (current !== expectedToken || (current !== null && !decodeSaved(current).ok)) {
      return { ok: false, reason: "conflict" };
    }
    const token = snapshot ? JSON.stringify({ version: savedMotionPracticeCodec.currentVersion, data: snapshot }) : null;
    if (token === null) store.removeItem(SAVED_MOTION_PRACTICE_KEY);
    else store.setItem(SAVED_MOTION_PRACTICE_KEY, token);
    return { ok: true, token };
  } catch {
    return { ok: false, reason: "no-storage" };
  }
}

export function resetSavedMotionPractice() {
  try { window.localStorage.removeItem(SAVED_MOTION_PRACTICE_KEY); } catch { /* Storage can be unavailable. */ }
}
