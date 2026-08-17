"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import {
  $persistenceStatus,
  dismissNotice,
  isNoticeDismissed,
  type PersistenceStatus,
} from "../../lib/stores/persistence-status";

// Небольшое уведомление о состоянии локального сохранения. Показывается
// только когда данные действительно могут не сохраниться (unavailable/quota),
// либо один раз после сброса повреждённых данных / обнаружения future-версии.
// Dismiss живёт в sessionStorage: в одной вкладке не повторяется на роутах.

const noticeByStatus: Partial<Record<PersistenceStatus, { text: string; tone: "warn" | "info" }>> = {
  unavailable: {
    text: "Браузер не разрешает сохранить прогресс. Результаты могут исчезнуть после обновления страницы.",
    tone: "warn",
  },
  quota: {
    text: "Хранилище браузера переполнено — новые результаты могут не сохраниться. Освободи место в настройках браузера.",
    tone: "warn",
  },
  "recovered-corrupt": {
    text: "Повреждённые локальные данные были сброшены. Тренировки можно продолжать как обычно.",
    tone: "info",
  },
  "future-version": {
    text: "Локальные данные созданы более новой версией приложения. Они не тронуты; эта версия работает с временным прогрессом.",
    tone: "info",
  },
};

export function PersistenceNotice() {
  const status = useStore($persistenceStatus);
  const [dismissed, setDismissed] = useState(true);

  // Читаем dismiss после mount (sessionStorage недоступен на сервере).
  useEffect(() => {
    setDismissed(isNoticeDismissed());
  }, []);

  const notice = noticeByStatus[status];
  if (!notice || dismissed) {
    return null;
  }

  return (
    <div
      data-testid="persistence-notice"
      role="status"
      aria-live="polite"
      className={`fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-[560px] items-start justify-between gap-3 rounded-option border px-4 py-3 text-[13px] leading-[1.6] shadow-[0_10px_30px_rgba(0,0,0,.4)] backdrop-blur lg:bottom-4 ${
        notice.tone === "warn"
          ? "border-nova-gold/40 bg-space-900/95 text-white/85"
          : "border-white/[.14] bg-space-900/95 text-white/75"
      }`}
    >
      <p className="min-w-0">{notice.text}</p>
      <button
        type="button"
        data-testid="persistence-notice-dismiss"
        onClick={() => {
          dismissNotice();
          setDismissed(true);
        }}
        aria-label="Скрыть уведомление о сохранении"
        className="shrink-0 rounded-badge border border-white/[.12] px-2 py-1 text-[12px] font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
      >
        Понятно
      </button>
    </div>
  );
}
