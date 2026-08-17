"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { GeneratedQuizError } from "../../lib/quiz/quiz-load-error";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface QuizLoadErrorCardProps {
  error: GeneratedQuizError;
  onRetry: () => void;
}

const headingByKind: Record<GeneratedQuizError["kind"], string> = {
  offline: "Нет соединения",
  timeout: "Сервер не отвечает",
  network: "Сеть недоступна",
  http: "Сервер временно недоступен",
  invalid_payload: "Ответ повреждён",
  empty_payload: "Набор задач пуст",
  integrity: "Набор задач не прошёл проверку",
};

// Восстановимая ошибка загрузки: конкретный заголовок, короткое объяснение,
// primary retry (тот же batch) и secondary «К темам». Никаких raw status/stack.
export function QuizLoadErrorCard({ error, onRetry }: QuizLoadErrorCardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const announcedRef = useRef<GeneratedQuizError | null>(null);

  // Фокус на заголовок один раз на появление КОНКРЕТНОЙ ошибки,
  // без повторных прыжков на каждый render.
  useEffect(() => {
    if (announcedRef.current === error) return;
    announcedRef.current = error;
    headingRef.current?.focus();
  }, [error]);

  const heading = error.kind === "http" && error.retryable === false
    ? "Задачи не загрузились"
    : headingByKind[error.kind];

  return (
    <section className="relative mx-auto flex w-full max-w-[580px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8">
      <Card
        data-testid="quiz-load-error-card"
        role="alert"
        className="flex flex-col gap-4 border-l-2 border-l-nova-gold/60"
      >
        <div className="flex flex-col gap-2">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-[19px] font-[800] leading-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50"
          >
            {heading}
          </h2>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            {error.userMessage}
          </p>
          {error.kind === "offline" ? (
            <p data-testid="offline-hint" className="text-[13px] leading-[1.6] text-white/50">
              Прогресс на этой странице не потеряется: когда сеть вернётся,
              нажми «Попробовать снова».
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            data-testid="quiz-load-retry"
            onClick={onRetry}
            className="w-full sm:w-auto"
          >
            Попробовать снова
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href="/topics">К темам</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
