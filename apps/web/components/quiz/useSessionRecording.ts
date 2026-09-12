"use client";

import { useCallback, useRef } from "react";
import { recordExamAttempt } from "../../lib/stores/exam-log-store";
import {
  recordCompletedSession,
  recordCrossTopicSession,
  type TopicId,
} from "../../lib/stores/progress-store";
import type { QuizSessionKind } from "../../lib/quiz/active-session-snapshot";
import type { QuizSessionState } from "./quiz-session-store";
import { isSessionCompleted, markSessionCompleted } from "../../lib/quiz/session-completion";

type UseSessionRecordingOptions = {
  // Cross-topic режимы пишут слабые места по затронутым темам, не увеличивая
  // счётчик тренировок одной темы. Только exam попадает в журнал ЦТ/ЦЭ.
  sessionKind: QuizSessionKind;
  topicId?: TopicId;
  sessionId: string | null;
  evidenceMode: "guided" | "transfer";
};

// Единственное место, где завершённая сессия попадает в persistent-сторы.
// Хук гарантирует идемпотентность: повторный вызов для той же сессии
// (двойной клик по «Показать итог», ре-рендер) ничего не запишет дважды.
export function useSessionRecording({ sessionKind, topicId, sessionId, evidenceMode }: UseSessionRecordingOptions) {
  const recordedRef = useRef(false);

  const resetRecording = useCallback(() => {
    recordedRef.current = false;
  }, []);

  const recordSessionResult = useCallback(
    (session: Pick<QuizSessionState, "answers" | "score" | "total">) => {
      if (!sessionId || recordedRef.current || isSessionCompleted(sessionId)) {
        return;
      }

      if (sessionKind === "exam" || sessionKind === "diagnostic") {
        recordedRef.current = true;
        recordCrossTopicSession(session.answers, sessionId);
        if (sessionKind === "exam") {
          recordExamAttempt(session.score, session.total);
        }
        markSessionCompleted(sessionId);
        return;
      }

      if (topicId) {
        recordedRef.current = true;
        recordCompletedSession({
          topicId,
          score: session.score,
          total: session.total,
          answers: session.answers,
          sessionId,
          evidenceMode,
        });
        markSessionCompleted(sessionId);
      }
    },
    [evidenceMode, sessionId, sessionKind, topicId],
  );

  return { recordSessionResult, resetRecording };
}
