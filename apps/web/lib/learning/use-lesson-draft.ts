"use client";

import { useEffect, useRef, useState } from "react";
import { lessonDraftCodec, readLessonDraft, writeLessonDraft, type LessonDraft } from "./lesson-draft";

export function useLessonDraft<T extends LessonDraft>(id: string, state: T, restore: (draft: T) => void, stageCount: number, kind: "lesson" | "check" = "lesson") {
  const codec = useRef(lessonDraftCodec(id, state, stageCount)).current;
  const restoreRef = useRef(restore);
  restoreRef.current = restore;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blocked = useRef(false);
  const previous = useRef("");

  useEffect(() => {
    const result = readLessonDraft(codec);
    if (result.ok) {
      previous.current = JSON.stringify(result.value);
      restoreRef.current(result.value);
    } else if (result.reason !== "empty") {
      blocked.current = result.reason === "future-version" || result.reason === "corrupt";
      setError(blocked.current
        ? "Сохранённый черновик не удалось открыть. Он сохранён без изменений; новый результат пока не записывается."
        : kind === "check" ? "Браузер не разрешает сохранить самопроверку. После закрытия страницы ответ может потеряться." : "Браузер не разрешает сохранить урок. Не закрывай страницу, пока не скопируешь своё объяснение.");
    }
    setReady(true);
  }, [codec, kind]);

  function save(next: T) {
    if (!ready || blocked.current) return false;
    const result = writeLessonDraft(codec, next);
    if (result !== "success") {
      setError(kind === "check" ? "Не удалось сохранить самопроверку в браузере. Ответ доступен на этой странице; после перезагрузки он может потеряться." : "Не удалось сохранить урок в браузере. Скопируй своё объяснение и попробуй ещё раз.");
      return false;
    }
    previous.current = JSON.stringify(next);
    setError(null);
    return true;
  }

  useEffect(() => {
    if (ready && JSON.stringify(state) !== previous.current) save(state);
  });

  return { save, error, ready };
}
