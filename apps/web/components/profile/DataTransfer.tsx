"use client";

import { useEffect, useRef, useState } from "react";
import {
  applyImport,
  buildExportFile,
  parseExportFile,
  summarizeExport,
  type ExportSummary,
  type ProgressExportFile,
} from "../../lib/stores/progress-export";
import { Button } from "../ui/Button";

type PendingImport = {
  file: ProgressExportFile;
  summary: ExportSummary;
};

type BackupReceipt = Pick<
  ExportSummary,
  "solved" | "examAttempts" | "practicedDays" | "exportedAt"
>;

const BACKUP_RECEIPT_KEY = "physicslab-progress-backup-receipt-v1";

function readBackupReceipt(): BackupReceipt | null {
  try {
    const raw = window.localStorage.getItem(BACKUP_RECEIPT_KEY);
    if (!raw) return null;
    const receipt = JSON.parse(raw) as Partial<BackupReceipt>;
    return typeof receipt.solved === "number" &&
      typeof receipt.examAttempts === "number" &&
      typeof receipt.practicedDays === "number" &&
      typeof receipt.exportedAt === "string"
      ? (receipt as BackupReceipt)
      : null;
  } catch {
    return null;
  }
}

function writeBackupReceipt(summary: ExportSummary) {
  try {
    window.localStorage.setItem(
      BACKUP_RECEIPT_KEY,
      JSON.stringify({
        solved: summary.solved,
        examAttempts: summary.examAttempts,
        practicedDays: summary.practicedDays,
        exportedAt: summary.exportedAt,
      } satisfies BackupReceipt),
    );
  } catch {
    // Если storage недоступен, сам экспорт всё равно работает через живые stores.
  }
}

function hasMeaningfulProgressSinceBackup(
  summary: ExportSummary,
  receipt: BackupReceipt | null,
) {
  const hasProgress =
    summary.solved >= 5 || summary.examAttempts > 0 || summary.practicedDays > 0;
  if (!hasProgress) return false;
  if (!receipt) return true;

  return (
    summary.solved >= receipt.solved + 10 ||
    summary.examAttempts > receipt.examAttempts ||
    summary.practicedDays > receipt.practicedDays
  );
}

function formatExportDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "неизвестно когда"
    : date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// Экспорт/импорт прогресса файлом: страховка от очистки браузера и способ
// перенести данные на другое устройство, пока аккаунтов нет.
export function DataTransfer({
  suggestBackup = false,
  backupFingerprint = "",
}: {
  suggestBackup?: boolean;
  backupFingerprint?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [showBackupReminder, setShowBackupReminder] = useState(false);

  useEffect(() => {
    if (!suggestBackup) {
      setShowBackupReminder(false);
      return;
    }

    const summary = summarizeExport(buildExportFile());
    setShowBackupReminder(
      summary ? hasMeaningfulProgressSinceBackup(summary, readBackupReceipt()) : false,
    );
  }, [backupFingerprint, suggestBackup]);

  function handleExport() {
    const file = buildExportFile();
    const summary = summarizeExport(file);
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `physicslab-progress-${file.exportedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    if (summary) writeBackupReceipt(summary);
    setShowBackupReminder(false);
    setDone("Копия скачана. Сохрани файл там, где не потеряешь.");
  }

  async function handleFileChosen(chosen: File) {
    setError(null);
    setDone(null);
    setPending(null);

    const text = await chosen.text();
    const file = parseExportFile(text);
    if (!file) {
      setError("Это не файл экспорта PhysicsLab.");
      return;
    }

    const summary = summarizeExport(file);
    if (!summary) {
      setError("Файл повреждён — данные из него прочитать нельзя.");
      return;
    }

    setPending({ file, summary });
  }

  function handleConfirmImport() {
    if (!pending) {
      return;
    }

    const applied = applyImport(pending.file);
    setPending(null);
    if (!applied) {
      setError("Файл повреждён — данные из него прочитать нельзя.");
      return;
    }

    setDone("Прогресс восстановлен из файла.");
  }

  return (
    <div className="flex flex-col gap-3" data-testid="data-transfer">
      {showBackupReminder ? (
        <section
          className="rounded-option border border-[var(--mode-learn-accent)]/28 bg-[var(--mode-learn-soft)] px-4 py-3.5"
          aria-labelledby="backup-reminder-title"
          data-testid="backup-reminder"
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 id="backup-reminder-title" className="text-[14px] font-[800] text-[var(--text-strong)]">
                Сохрани копию прогресса
              </h3>
              <p className="mt-1 max-w-[620px] text-[12px] leading-[1.55] text-[var(--text-default)]">
                В этом браузере уже есть история занятий. PhysicsLab пока без
                аккаунта, поэтому очистка данных браузера удалит историю.
              </p>
            </div>
            <Button size="sm" onClick={handleExport} className="shrink-0">
              Скачать копию
            </Button>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {!showBackupReminder ? (
          <Button size="sm" variant="ghost" onClick={handleExport}>
            Скачать прогресс
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          Восстановить из файла
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          data-testid="import-file-input"
          onChange={(event) => {
            const chosen = event.target.files?.[0];
            if (chosen) {
              void handleFileChosen(chosen);
            }
            event.target.value = "";
          }}
        />
      </div>

      {pending ? (
        <div
          className="flex flex-col gap-2.5 rounded-option border border-feedback-warning/30 bg-feedback-warning/[.06] px-4 py-3"
          data-testid="import-confirm"
        >
          <p className="text-[13px] leading-[1.6] text-[var(--text-strong)]">
            В файле: решено{" "}
            <span className="physics-number font-semibold">{pending.summary.solved}</span> задач,{" "}
            <span className="physics-number font-semibold">{pending.summary.xp}</span> XP, попыток
            смешанной тренировки: <span className="physics-number font-semibold">{pending.summary.examAttempts}</span>.
            Экспортирован {formatExportDate(pending.summary.exportedAt)}.
          </p>
          <p className="text-[12px] leading-[1.5] text-[var(--text-default)]">
            Текущий прогресс в этом браузере будет заменён данными из файла.
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleConfirmImport}>
              Заменить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPending(null)}>
              Отмена
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-[12px] font-semibold leading-[1.5] text-[var(--feedback-danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="text-[12px] font-semibold leading-[1.5] text-[var(--feedback-success)]" role="status">
          {done}
        </p>
      ) : null}
    </div>
  );
}
