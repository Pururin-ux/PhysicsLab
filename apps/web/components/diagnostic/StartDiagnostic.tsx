"use client";

import { QuizSession } from "../quiz/QuizSession";

export function StartDiagnostic() {
  return (
    <section aria-label="Стартовая диагностика" className="min-w-0">
      <QuizSession
        generatedTemplate="exam"
        generatedTopic="Стартовая диагностика"
        generatedTitle="Задача для старта"
        generatedCount={10}
        sessionKind="diagnostic"
        summaryVariant="diagnostic"
        preAnswerGuidance="unlabelled"
        restartLabel="Попробовать другой микс"
        nextHref="/profile"
        nextLabel="Посмотреть прогресс"
      />
    </section>
  );
}
