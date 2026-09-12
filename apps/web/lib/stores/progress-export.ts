// Экспорт/импорт всего прогресса одним JSON-файлом — страховка от потери
// localStorage (смена браузера, очистка, другое устройство) до появления
// аккаунтов. Импорт гоняет данные через те же кодеки, что и обычная
// гидратация: отдельного валидатора (и зависимости вроде zod) не нужно.

import {
  decodeStoredValue,
  writeStore,
  type StoreCodec,
  type StoredEnvelope,
} from "./storage-envelope.ts";
import {
  $appProgress,
  progressCodec,
  hydrateProgressFromStorage,
  type AppProgress,
} from "./progress-store.ts";
import {
  $examLog,
  examLogCodec,
  hydrateExamLogFromStorage,
  type ExamAttempt,
} from "./exam-log-store.ts";
import {
  $practiceLog,
  hydratePracticeLogFromStorage,
  practiceLogCodec,
} from "./practice-log-store.ts";
import { $xp, hydrateXPFromStorage, xpCodec } from "./session-store.ts";
import {
  allowWriteForKey,
  reportWriteResult,
} from "./persistence-status.ts";
import { topics } from "../topics.ts";
import { getLessonDraftExportEntries, lessonDraftExportCodecs, replaceLiveLessonDraft, type LessonDraft } from "../learning/lesson-draft.ts";

export const EXPORT_FORMAT = "physicslab-progress-export";
export const EXPORT_FORMAT_VERSION = 1;

export type ProgressExportFile = {
  format: typeof EXPORT_FORMAT;
  formatVersion: typeof EXPORT_FORMAT_VERSION;
  exportedAt: string;
  stores: Record<string, StoredEnvelope>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Экспорт собирается из живых атомов, а не из localStorage: то, что видит
// ученик на экране, и есть то, что попадёт в файл.
export function buildExportFile(): ProgressExportFile {
  const entries: [string, StoredEnvelope][] = [
    [progressCodec.key, { version: progressCodec.currentVersion, data: $appProgress.get() }],
    [examLogCodec.key, { version: examLogCodec.currentVersion, data: $examLog.get() }],
    [practiceLogCodec.key, { version: practiceLogCodec.currentVersion, data: $practiceLog.get() }],
    [xpCodec.key, { version: xpCodec.currentVersion, data: $xp.get() }],
    ...getLessonDraftExportEntries(),
  ];

  return {
    format: EXPORT_FORMAT,
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    stores: Object.fromEntries(entries),
  };
}

export function parseExportFile(text: string): ProgressExportFile | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  if (
    !isRecord(parsed) ||
    parsed.format !== EXPORT_FORMAT ||
    parsed.formatVersion !== EXPORT_FORMAT_VERSION ||
    !isRecord(parsed.stores)
  ) {
    return null;
  }

  return parsed as ProgressExportFile;
}

export type ExportSummary = {
  solved: number;
  xp: number;
  examAttempts: number;
  practicedDays: number;
  exportedAt: string;
};

type DecodedImport = {
  valid: boolean;
  progress: AppProgress | null;
  examLog: ExamAttempt[] | null;
  practiceLog: string[] | null;
  xp: number | null;
  lessonDrafts: Record<string, LessonDraft>;
};

type DecodedStore<T> =
  | { ok: true; value: T | null }
  | { ok: false };

function decodeStore<T>(file: ProgressExportFile, codec: StoreCodec<T>): DecodedStore<T> {
  if (!Object.prototype.hasOwnProperty.call(file.stores, codec.key)) {
    return { ok: true, value: null };
  }

  const raw = JSON.stringify(file.stores[codec.key]);
  if (typeof raw !== "string") {
    return { ok: false };
  }

  const result = decodeStoredValue(codec, raw);
  return result.ok ? { ok: true, value: result.value } : { ok: false };
}

function decodeImport(file: ProgressExportFile): DecodedImport {
  const progress = decodeStore(file, progressCodec);
  const examLog = decodeStore(file, examLogCodec);
  const practiceLog = decodeStore(file, practiceLogCodec);
  const xp = decodeStore(file, xpCodec);
  const drafts = lessonDraftExportCodecs.map((codec) => ({ codec, decoded: decodeStore(file, codec) }));
  const valid = progress.ok && examLog.ok && practiceLog.ok && xp.ok && drafts.every(({decoded}) => decoded.ok);

  return {
    valid,
    progress: progress.ok ? progress.value : null,
    examLog: examLog.ok ? examLog.value : null,
    practiceLog: practiceLog.ok ? practiceLog.value : null,
    xp: xp.ok ? xp.value : null,
    lessonDrafts: Object.fromEntries(drafts.flatMap(({codec, decoded}) => decoded.ok && decoded.value ? [[codec.key, decoded.value]] : [])),
  };
}

// Файл без валидного прогресса импортировать бессмысленно; остальные
// сторы допускаем отсутствующими (старый экспорт, частичный файл).
export function summarizeExport(file: ProgressExportFile): ExportSummary | null {
  const decoded = decodeImport(file);
  if (!decoded.valid || !decoded.progress) {
    return null;
  }

  const solved = topics.reduce(
    (sum, topic) => sum + (decoded.progress?.topics[topic.id]?.solved ?? 0),
    0,
  );

  return {
    solved,
    xp: decoded.xp ?? 0,
    examAttempts: decoded.examLog?.length ?? 0,
    practicedDays: decoded.practiceLog?.length ?? 0,
    exportedAt: file.exportedAt,
  };
}

// Полная замена (не merge: суммирование счётчиков завысило бы статистику).
// Пишем в localStorage и сразу перегидрачиваем атомы — UI обновляется
// без перезагрузки страницы.
export function applyImport(file: ProgressExportFile): boolean {
  const decoded = decodeImport(file);
  if (!decoded.valid || !decoded.progress) {
    return false;
  }

  const imports = [
    [progressCodec, decoded.progress],
    [examLogCodec, decoded.examLog ?? []],
    [practiceLogCodec, decoded.practiceLog ?? []],
    [xpCodec, decoded.xp ?? 0],
  ] as const;

  // Capture the previous values before changing any store. Failed writes must
  // not be reported as a successful restore or silently mix two backups.
  const codecs = [...imports.map(([codec]) => codec), ...lessonDraftExportCodecs];
  let previous: [string, string | null][];
  try {
    previous = codecs.map((codec) => [codec.key, window.localStorage.getItem(codec.key)]);
  } catch {
    reportWriteResult("no-storage");
    return false;
  }
  let successful = true;
  for (const [codec, value] of imports) {
    const result = writeStore(codec, value);
    reportWriteResult(result);
    if (result !== "success") { successful = false; break; }
  }
  if (successful) {
    for (const codec of lessonDraftExportCodecs) {
      const value = decoded.lessonDrafts[codec.key] ?? null;
      if (value) {
        const result = writeStore(codec, value);
        reportWriteResult(result);
        if (result !== "success") { successful = false; break; }
      } else {
        try { window.localStorage.removeItem(codec.key); }
        catch { reportWriteResult("error"); successful = false; break; }
      }
    }
  }
  if (!successful) {
    for (const [key, raw] of previous) {
      try {
        if (raw === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, raw);
      } catch { reportWriteResult("error"); }
    }
    return false;
  }
  for (const codec of codecs) allowWriteForKey(codec.key);
  for (const codec of lessonDraftExportCodecs) replaceLiveLessonDraft(codec.key, decoded.lessonDrafts[codec.key] ?? null);

  hydrateProgressFromStorage();
  hydrateExamLogFromStorage();
  hydratePracticeLogFromStorage();
  hydrateXPFromStorage();

  return true;
}
