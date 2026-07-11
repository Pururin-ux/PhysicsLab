import { useCallback, useEffect, useRef, useState } from "react";
import type { QuizData } from "./quiz-session-store";
import {
  classifyFetchFailure,
  classifyHttpError,
  emptyPayloadError,
  integrityError,
  invalidPayloadError,
  type GeneratedQuizError,
} from "../../lib/quiz/quiz-load-error";
import { parseQuizTasksPayload } from "../../lib/quiz/quiz-payload";

export type GeneratedQuizStatus = "idle" | "loading" | "ready" | "error";

const TASK_COUNT = 10;
// 12 секунд: достаточно для холодного сервера, но не «вечная» загрузка.
// В тестах переопределяется через window-хук, чтобы не ждать реальные секунды.
const DEFAULT_TIMEOUT_MS = 12000;

declare global {
  interface Window {
    // Test-only hook: e2e переопределяет таймаут, не production integrity.
    __physlabQuizTimeoutMs?: number;
    // Legacy test fixture field; runtime intentionally ignores it.
    __physlabQuizExpectedCount?: number;
  }
}

function resolveTimeoutMs(): number {
  if (typeof window !== "undefined" && typeof window.__physlabQuizTimeoutMs === "number") {
    return window.__physlabQuizTimeoutMs;
  }
  return DEFAULT_TIMEOUT_MS;
}

function resolveExpectedCount(): number {
  if (
    process.env.NODE_ENV !== "production" &&
    typeof window !== "undefined" &&
    typeof window.__physlabQuizExpectedCount === "number" &&
    Number.isInteger(window.__physlabQuizExpectedCount) &&
    window.__physlabQuizExpectedCount > 0
  ) {
    return window.__physlabQuizExpectedCount;
  }
  return TASK_COUNT;
}

type UseGeneratedQuizDataInput = {
  enabled: boolean;
  template: string;
  topic: string;
  title: string;
  batch: number;
};

export function useGeneratedQuizData({
  enabled,
  template,
  topic,
  title,
  batch,
}: UseGeneratedQuizDataInput) {
  const [data, setData] = useState<QuizData | null>(null);
  const [status, setStatus] = useState<GeneratedQuizStatus>(
    enabled ? "loading" : "idle",
  );
  const [error, setError] = useState<GeneratedQuizError | null>(null);
  // retry() повторяет ТОТ ЖЕ template/count/batch: меняется только attempt.
  // Новый batch создают только явные Restart / «Ещё 10 задач» / «Новый вариант».
  const [attempt, setAttempt] = useState(0);
  // Поколение запроса: устаревший ответ (смена template/batch/attempt или
  // unmount) не имеет права перезаписать состояние нового запроса.
  const generationRef = useRef(0);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setStatus("idle");
      setError(null);
      return;
    }

    const generation = ++generationRef.current;
    const controller = new AbortController();
    // Отличаем наш таймаут от abort при unmount/смене параметров.
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, resolveTimeoutMs());

    const isCurrent = () => generationRef.current === generation;

    function fail(nextError: GeneratedQuizError) {
      if (!isCurrent()) return;
      setStatus("error");
      setError(nextError);
    }

    async function loadGeneratedTasks() {
      setData(null);
      setStatus("loading");
      setError(null);

      let response: Response;
      try {
        const params = new URLSearchParams({
          template,
          count: String(TASK_COUNT),
          batch: String(batch),
        });
        response = await fetch(`/api/tasks?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
      } catch {
        clearTimeout(timer);
        // Abort из-за unmount/смены параметров — не ошибка для пользователя.
        if (controller.signal.aborted && !timedOut) return;
        fail(classifyFetchFailure(timedOut));
        return;
      }

      if (!isCurrent()) return;

      if (!response.ok) {
        clearTimeout(timer);
        fail(classifyHttpError(response.status));
        return;
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        clearTimeout(timer);
        if (controller.signal.aborted && !timedOut) return;
        fail(timedOut ? classifyFetchFailure(true) : invalidPayloadError());
        return;
      }

      clearTimeout(timer);

      if (!isCurrent()) return;

      const parsed = parseQuizTasksPayload(payload, { expectedCount: resolveExpectedCount() });
      if (!parsed.ok) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[quiz] payload rejected: ${parsed.issue.code} — ${parsed.issue.detail}`);
        }
        if (parsed.issue.code === "tasks_empty") {
          fail(emptyPayloadError());
        } else if (parsed.issue.code === "not_object" || parsed.issue.code === "tasks_missing") {
          fail(invalidPayloadError());
        } else {
          fail(integrityError());
        }
        return;
      }

      setData({
        id: `generated-${template}-${batch}`,
        topic,
        title,
        tasks: parsed.tasks,
      });
      setStatus("ready");
    }

    loadGeneratedTasks();

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt, batch, enabled, template, title, topic]);

  return { data, error, status, retry };
}
