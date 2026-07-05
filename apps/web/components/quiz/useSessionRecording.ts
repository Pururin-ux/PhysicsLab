"use client";

import { useCallback, useRef } from "react";
import { recordExamAttempt } from "../../lib/stores/exam-log-store";
import {
  recordCompletedSession,
  recordExamSession,
  type TopicId,
} from "../../lib/stores/progress-store";
import type { QuizSessionState } from "./quiz-session-store";

type UseSessionRecordingOptions = {
  // "exam" пишет в журнал пробных вариантов и слабые места тем,
  // не увеличивая счётчик тренировок темы.
  sessionKind: "practice" | "exam";
  topicId?: TopicId;
};

// Единственное место, где завершённая сессия попадает в persistent-сторы.
// Хук гарантирует идемпотентность: повторный вызов для той же сессии
// (двойной клик по «Показать итог», ре-рендер) ничего не запишет дважды.
export function useSessionRecording({ sessionKind, topicId }: UseSessionRecordingOptions) {
  const recordedRef = useRef(false);

  const resetRecording = useCallback(() => {
    recordedRef.current = false;
  }, []);

  const recordSessionResult = useCallback(
    (session: Pick<QuizSessionState, "answers" | "score" | "total">) => {
      if (recordedRef.current) {
        return;
      }

      if (sessionKind === "exam") {
        recordedRef.current = true;
        recordExamSession(session.answers);
        recordExamAttempt(session.score, session.total);
        return;
      }

      if (topicId) {
        recordedRef.current = true;
        recordCompletedSession({
          topicId,
          score: session.score,
          total: session.total,
          answers: session.answers,
        });
      }
    },
    [sessionKind, topicId],
  );

  return { recordSessionResult, resetRecording };
}
