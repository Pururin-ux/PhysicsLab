"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildReviewDashboard } from "../../lib/learning/review-intelligence";
import type { ReviewPlanItem } from "../../lib/learning/review-plan";
import { getLearningDestination } from "../../lib/learning/learning-links";
import { lessonDraftExportCodecs, readLessonDraft } from "../../lib/learning/lesson-draft";
import { textbookChapters } from "../../lib/learning/textbook";
import {
  buildTextbookReviewItem,
  type TextbookReviewItem,
} from "../../lib/learning/textbook-review";
import { $appProgress } from "../../lib/stores/progress-store";
import { topics } from "../../lib/topics";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

const MAX_REVIEW_ITEMS = 12;
const MAX_TEXTBOOK_REVIEW_ITEMS = 6;

function repeatLabel(count: number) {
  if (count < 2) return null;

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const form =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? "раз"
      : lastDigit === 1
        ? "раз"
        : lastDigit >= 2 && lastDigit <= 4
          ? "раза"
          : "раз";

  return `Повторилось ${count} ${form}`;
}

function ReviewActions({
  weakness,
  prominent = false,
}: {
  weakness: ReviewPlanItem;
  prominent?: boolean;
}) {
  const explanation = getLearningDestination(weakness.skillId)?.explanation;
  const practiceHref = weakness.practiceHref ?? weakness.fallbackHref;

  if (weakness.isPending) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-start">
        <Button asChild className={prominent ? "w-full sm:w-auto" : undefined}>
          <Link href={practiceHref}>Продолжить задачу</Link>
        </Button>
        {explanation ? (
          <Link
            href={explanation.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--action-primary)] underline underline-offset-4"
          >
            Сначала вспомнить идею
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Button asChild className={prominent ? "w-full sm:w-auto" : undefined}>
        <Link href={explanation?.href ?? practiceHref}>
          {explanation
            ? "Вспомнить идею"
            : weakness.practiceHref
              ? "Решить похожие задачи"
              : "Выбрать задачи"}
        </Link>
      </Button>
      {explanation && weakness.practiceHref ? (
        <Button asChild variant="ghost" size="sm">
          <Link href={weakness.practiceHref}>Решить 5 похожих</Link>
        </Button>
      ) : weakness.hasReferenceSolution && weakness.taskHref ? (
        <Link
          href={weakness.taskHref}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--action-primary)] underline underline-offset-4"
        >
          Посмотреть пример
        </Link>
      ) : null}
    </div>
  );
}

function EmptyState({ totalSolved }: { totalSolved: number }) {
  return (
    <Card className="flex min-h-[280px] flex-col items-start justify-center !p-6 sm:!p-9">
      <Badge tone="blue">Здесь пока пусто</Badge>
      <h2 className="mt-4 text-[25px] font-[800] leading-tight text-white">
        Возвращаться пока не к чему
      </h2>
      <p className="mt-3 max-w-[580px] text-[14px] leading-[1.7] text-white/68">
        {totalSolved > 0 ? (
          <>
            Решённые задачи уже есть. Когда какое-то место потребует ещё одной
            попытки, здесь появятся объяснение и похожие задачи.
          </>
        ) : (
          <>
            После первой тренировки здесь появятся места, к которым полезно
            вернуться, вместе с объяснениями и похожими задачами.
          </>
        )}
      </p>
      <Button asChild className="mt-6">
        <Link href="/tasks">Выбрать задачи</Link>
      </Button>
    </Card>
  );
}

function ReviewQueueCard({ weakness }: { weakness: ReviewPlanItem }) {
  const repeated = repeatLabel(weakness.count);

  return (
    <Card className="flex flex-col gap-5 border-white/[.11] !p-5 sm:flex-row sm:items-center sm:justify-between sm:!p-6">
      <div className="min-w-0 max-w-[680px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-white/58">
          {weakness.topicTitle ? <span>{weakness.topicTitle}</span> : null}
          {repeated ? <span>{repeated}</span> : null}
        </div>
        <h3 className="mt-2 text-[18px] font-[800] leading-snug text-white">
          {weakness.skillTitle}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.65] text-white/65">
          <MathText text={weakness.hint} />
        </p>
      </div>

      <div className="shrink-0">
        <ReviewActions weakness={weakness} />
      </div>
    </Card>
  );
}

function ReviewLoadingState() {
  return (
    <Card
      className="flex min-h-[240px] flex-col justify-center gap-3 !p-6 sm:!p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="h-3 w-24 animate-pulse rounded-badge bg-white/10" aria-hidden="true" />
      <span className="h-7 w-full max-w-[360px] animate-pulse rounded-option bg-white/10" aria-hidden="true" />
      <span className="h-4 w-full max-w-[560px] animate-pulse rounded-option bg-white/[.07]" aria-hidden="true" />
      <span className="sr-only">Загружаем сохранённые задачи</span>
    </Card>
  );
}

function TextbookReviewCard({ item }: { item: TextbookReviewItem }) {
  return (
    <Card className="flex flex-col gap-5 border-white/[.11] !p-5 sm:flex-row sm:items-center sm:justify-between sm:!p-6">
      <div className="min-w-0 max-w-[680px]">
        <p className="text-[12px] font-semibold text-white/58">
          {item.grade} класс · {item.unit}
        </p>
        <h3 className="mt-2 text-[18px] font-[800] leading-snug text-white">
          {item.question}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.65] text-white/65">
          {item.feedback}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-start">
        <Button asChild>
          <Link href={item.href}>Разобрать в учебнике</Link>
        </Button>
        {item.practice ? (
          <Link
            href={item.practice.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--action-primary)] underline underline-offset-4"
          >
            {item.practice.label}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}

export function MistakesList() {
  const progress = useStore($appProgress);
  const dashboard = useMemo(() => buildReviewDashboard(progress), [progress]);
  const [mounted, setMounted] = useState(false);
  const [textbookReview, setTextbookReview] = useState<TextbookReviewItem[] | null>(null);

  useEffect(() => {
    setMounted(true);
    const refreshTextbookReview = () => {
      const items = textbookChapters.flatMap((chapter) => {
        const codec = lessonDraftExportCodecs.find(
          (item) => item.key === `physicslab-lesson-draft-textbook-check-${chapter.id}`,
        );
        if (!codec) return [];

        const stored = readLessonDraft(codec);
        const item = buildTextbookReviewItem(chapter, stored.ok ? stored.value : null);
        return item ? [item] : [];
      });
      setTextbookReview(items.slice(0, MAX_TEXTBOOK_REVIEW_ITEMS));
    };

    refreshTextbookReview();
    window.addEventListener("storage", refreshTextbookReview);
    window.addEventListener("focus", refreshTextbookReview);
    window.addEventListener("pageshow", refreshTextbookReview);
    return () => {
      window.removeEventListener("storage", refreshTextbookReview);
      window.removeEventListener("focus", refreshTextbookReview);
      window.removeEventListener("pageshow", refreshTextbookReview);
    };
  }, []);

  if (!mounted || textbookReview === null) {
    return <ReviewLoadingState />;
  }

  const totalSolved = topics.reduce(
    (sum, topic) => sum + (progress.topics[topic.id]?.solved ?? 0),
    0,
  );

  if (dashboard.plan.length === 0 && textbookReview.length === 0) {
    return <EmptyState totalSolved={totalSolved} />;
  }

  const primaryAction = dashboard.primaryAction;
  const remainingItems = primaryAction ? dashboard.plan.slice(1, MAX_REVIEW_ITEMS) : [];
  const repeated = primaryAction ? repeatLabel(primaryAction.count) : null;

  return (
    <div className="flex flex-col gap-8" aria-label="Затруднения, к которым можно вернуться">
      {primaryAction ? <Card
        variant="elevated"
        glow={primaryAction.isPending ? "cyan" : dashboard.dueToday > 0 ? "gold" : undefined}
        className="!p-5 sm:!p-7"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0 max-w-[720px]">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={primaryAction.isPending ? "cyan" : "blue"}>
                {primaryAction.isPending ? "Ответ сохранён" : "Начать отсюда"}
              </Badge>
              {repeated ? (
                <span className="text-[12px] font-semibold text-white/58">{repeated}</span>
              ) : null}
            </div>
            <h2 className="mt-4 text-[27px] font-[800] leading-tight text-white sm:text-[34px]">
              {primaryAction.skillTitle}
            </h2>
            <p className="mt-3 max-w-[660px] text-[14px] leading-[1.7] text-white/68">
              {primaryAction.isPending ? (
                "Условие и ответ сохранились. Можно продолжить с того же места."
              ) : (
                <MathText text={primaryAction.hint} />
              )}
            </p>
          </div>

          <ReviewActions weakness={primaryAction} prominent />
        </div>
      </Card> : null}

      {textbookReview.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="textbook-review-title">
          <div>
            <h2 id="textbook-review-title" className="text-[19px] font-[800] leading-tight text-white">
              Самопроверка учебника
            </h2>
            <p className="mt-1 text-[13px] leading-[1.6] text-white/60">
              Вернись к вопросу и проверь новую попытку по объяснению главы.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {textbookReview.map((item) => (
              <TextbookReviewCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {remainingItems.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="more-review-title">
          <div>
            <h2 id="more-review-title" className="text-[19px] font-[800] leading-tight text-white">
              Ещё можно разобрать
            </h2>
            <p className="mt-1 text-[13px] leading-[1.6] text-white/60">
              Выбери следующее место после первого.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {remainingItems.map((weakness) => (
              <ReviewQueueCard key={weakness.key} weakness={weakness} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
