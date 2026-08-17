"use client";

import { useRef, useState } from "react";
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

function formatExportDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "неизвестно когда"
    : date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// Экспорт/импорт прогресса файлом: страховка от очистки браузера и способ
// перенести данные на другое устройство, пока аккаунтов нет.
export function DataTransfer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function handleExport() {
    const file = buildExportFile();
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `physicslab-progress-${file.exportedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
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
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="ghost" onClick={handleExport}>
          Скачать прогресс
        </Button>
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
          className="flex flex-col gap-2.5 rounded-option border border-nova-gold/25 bg-nova-gold/[.05] px-4 py-3"
          data-testid="import-confirm"
        >
          <p className="text-[13px] leading-[1.6] text-white/80">
            В файле: решено{" "}
            <span className="physics-number font-semibold">{pending.summary.solved}</span> задач,{" "}
            <span className="physics-number font-semibold">{pending.summary.xp}</span> XP, попыток
            смешанной тренировки: <span className="physics-number font-semibold">{pending.summary.examAttempts}</span>.
            Экспортирован {formatExportDate(pending.summary.exportedAt)}.
          </p>
          <p className="text-[12px] leading-[1.5] text-white/60">
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
        <p className="text-[12px] font-semibold leading-[1.5] text-nova-ember" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="text-[12px] font-semibold leading-[1.5] text-nova-cyan" role="status">
          {done}
        </p>
      ) : null}
    </div>
  );
}
