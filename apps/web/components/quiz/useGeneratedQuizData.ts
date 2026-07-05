import { useEffect, useState } from "react";
import type { QuizData } from "./quiz-session-store";

export type GeneratedQuizStatus = "idle" | "loading" | "ready" | "error";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setStatus("idle");
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function loadGeneratedTasks() {
      setData(null);
      setStatus("loading");
      setError(null);

      try {
        const params = new URLSearchParams({
          template,
          count: "10",
          batch: String(batch),
        });
        const response = await fetch(`/api/tasks?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error("Не удалось загрузить задачи.");
        }

        setData({
          id: `generated-${template}-${batch}`,
          topic,
          title,
          tasks: payload.tasks,
        });
        setStatus("ready");
      } catch (unknownError) {
        if (controller.signal.aborted) {
          return;
        }

        setStatus("error");
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : "Не удалось загрузить задачи.",
        );
      }
    }

    loadGeneratedTasks();

    return () => {
      controller.abort();
    };
  }, [batch, enabled, template, title, topic]);

  return { data, error, status };
}
