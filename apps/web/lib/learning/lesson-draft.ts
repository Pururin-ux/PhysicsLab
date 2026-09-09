import { clearStore, decodeStoredValue, writeStore, type StoreCodec, type StoredEnvelope } from "../stores/storage-envelope.ts";
import { textbookChapters } from "./textbook.ts";

export type DraftValue = string | number | boolean | null | { [key: string]: DraftValue };
export type LessonDraft = Record<string, DraftValue>;

const liveDrafts = new Map<string, LessonDraft>();
const draftIds = ["acceleration", "dynamics", "electro", "density", "optics", "average-speed", ...textbookChapters.map(chapter=>`textbook-check-${chapter.id}`)];

function isDraftValue(value: unknown, depth = 0): value is DraftValue {
  if (value === null || typeof value === "boolean") return true;
  if (typeof value === "string") return value.length <= 10000;
  if (typeof value === "number") return Number.isFinite(value);
  if (!value || typeof value !== "object" || Array.isArray(value) || depth > 3) return false;
  const entries = Object.entries(value);
  return entries.length <= 40 && entries.every(([key, child]) => !["__proto__", "prototype", "constructor"].includes(key) && isDraftValue(child, depth + 1));
}

export const lessonDraftExportCodecs: StoreCodec<LessonDraft>[] = draftIds.map((id) => ({
  key: `physicslab-lesson-draft-${id}`,
  currentVersion: 1,
  sniffLegacy: () => null,
  migrate: (data, version) => {
    if (version !== 1 || !data || typeof data !== "object" || Array.isArray(data) || !isDraftValue(data)) return null;
    const draft = data as LessonDraft;
    if (id.startsWith("textbook-check-") && (draft.stage !== 0 || typeof draft.answer !== "string" || typeof draft.checked !== "boolean" || typeof draft.questionKey !== "string")) return null;
    const index = draft[id === "acceleration" ? "screen" : id === "dynamics" ? "step" : "stage"];
    return typeof index === "number" && Number.isInteger(index) && index >= 0 && index < 10 && typeof draft.summaryText === "string" && typeof draft.summarySaved === "boolean" ? draft : null;
  },
}));

export function getLessonDraftExportEntries(): [string, StoredEnvelope][] {
  return lessonDraftExportCodecs.flatMap((codec) => {
    const stored = readLessonDraft(codec);
    const value = liveDrafts.get(codec.key) ?? (stored.ok ? stored.value : null);
    return value ? [[codec.key, { version: codec.currentVersion, data: value }] as [string, StoredEnvelope]] : [];
  });
}

export function resetLessonDrafts() {
  liveDrafts.clear();
  for (const codec of lessonDraftExportCodecs) clearStore(codec);
}

export function replaceLiveLessonDraft(key: string, value: LessonDraft | null) {
  if (value) liveDrafts.set(key, value);
  else liveDrafts.delete(key);
}

// Only restore the fields this lesson currently understands. A corrupt step
// must never be allowed to index outside LessonStageEngine's sequence.
export function restoreLessonDraft<T extends LessonDraft>(raw: unknown, defaults: T, stageCount: number): T | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const source = raw as Record<string, unknown>;
  const result: LessonDraft = {};
  for (const [key, fallback] of Object.entries(defaults)) {
    const value = source[key];
    if (value === undefined) { result[key] = fallback; continue; }
    if (fallback !== null && typeof fallback === "object") {
      const nested = restoreLessonDraft(value, fallback, stageCount);
      if (!nested) return null;
      result[key] = nested;
    } else {
      if (fallback === null ? value !== null && typeof value !== "string" : typeof value !== typeof fallback) return null;
      if (typeof value === "number" && !Number.isFinite(value)) return null;
      if (typeof value === "string" && value.length > 10000) return null;
      if (["screen", "step", "stage"].includes(key) && (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value >= stageCount)) return null;
      result[key] = value as DraftValue;
    }
  }
  return result as T;
}

export function lessonDraftCodec<T extends LessonDraft>(id: string, defaults: T, stageCount: number): StoreCodec<T> {
  return {
    key: `physicslab-lesson-draft-${id}`,
    currentVersion: 1,
    sniffLegacy: () => null,
    migrate: (data, version) => version === 1 ? restoreLessonDraft(data, defaults, stageCount) : null,
  };
}

// Unlike practice statistics, a malformed personal draft is preserved for
// recovery. A future version is read-only until a compatible app opens it.
export function readLessonDraft<T>(codec: StoreCodec<T>) {
  try {
    const raw = window.localStorage.getItem(codec.key);
    return raw === null ? { ok: false as const, reason: "empty" as const } : decodeStoredValue(codec, raw);
  } catch {
    return { ok: false as const, reason: "no-storage" as const };
  }
}

export function writeLessonDraft<T extends LessonDraft>(codec: StoreCodec<T>, value: T) {
  liveDrafts.set(codec.key, value);
  return writeStore(codec, value);
}
