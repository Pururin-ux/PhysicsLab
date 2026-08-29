"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { buildReviewPlan } from "../../lib/learning/review-plan";
import { topics, upcomingTopics } from "../../lib/topics";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { $appProgress } from "../../lib/stores/progress-store";
import { getTopicAccent } from "./topic-accents";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionHeading } from "../ui/SectionHeading";
import { MathText } from "../ui/MathText";
import { TopicGlyph } from "./TopicGlyph";
import { cn } from "../../lib/utils";

export function TopicCards() {
  const progress = useStore($appProgress);
  const examLog = useStore($examLog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bestExam = mounted ? getBestAttempt(examLog) : null;
  const nextStep = mounted ? getLearningNextStep(progress, Boolean(bestExam)) : null;
  const reviewPlan = mounted ? buildReviewPlan(progress, 8) : [];
  const totalSolved = mounted
    ? topics.reduce((sum, topic) => sum + (progress.topics[topic.id]?.solved ?? 0), 0)
    : 0;

  return (
    <div className="flex flex-col gap-10">
      {nextStep ? (
        <Card
          padding="lg"
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            nextStep.tone === "gold"
              ? "border-nova-gold/30 bg-nova-gold/[.055]"
              : "border-nova-cyan/25 bg-nova-cyan/[.045]",
          )}
          aria-label="Что сделать сейчас"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <p
              className={cn(
                "pl-eyebrow",
                nextStep.tone === "gold" ? "text-nova-gold/85" : "text-nova-cyan/85",
              )}
            >
              {nextStep.label}
            </p>
            <h2 className="pl-h2">{nextStep.title}</h2>
            <p className="pl-body max-w-[62ch] text-[14px]">
              <MathText text={nextStep.body} />
            </p>
          </div>
          <Button
            asChild
            variant={nextStep.tone === "gold" ? "gold" : "primary"}
            className="shrink-0"
          >
            <Link href={nextStep.href}>{nextStep.cta}</Link>
          </Button>
        </Card>
      ) : null}

      <section aria-labelledby="topics-title" className="flex flex-col gap-5">
        <SectionHeading
          id="topics-title"
          eyebrow="Программа"
          title="Темы"
          description="Внутри темы — опорные идеи, типы задач и тренировка."
          actions={
            <Button asChild size="sm" variant="secondary">
              <Link href="/tasks">Каталог типов задач</Link>
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);
            const topicProgress = mounted ? progress.topics[topic.id] : null;
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const sessions = topicProgress?.completedSessions ?? 0;
            const hasProgress = Boolean(
              topicProgress && (topicProgress.completedSessions > 0 || topicProgress.solved > 0),
            );
            const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;
            const weakTrapCount = topicProgress ? Object.keys(topicProgress.weakTraps).length : 0;
            const reviewItem = reviewPlan.find((item) => item.topicId === topic.id);

            return (
              <Card
                key={topic.id}
                variant="raised"
                padding="md"
                interactive
                className={cn("flex flex-col gap-4 border-l-2", accent.border)}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-option border",
                      accent.tile,
                    )}
                  >
                    <TopicGlyph topic={topic.id} className="h-7 w-7" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="pl-h3">{topic.title}</h3>
                      <Badge
                        size="sm"
                        tone={hasProgress ? accent.badge : "neutral"}
                        className="w-fit shrink-0"
                      >
                        {hasProgress ? "В работе" : "Не начато"}
                      </Badge>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-ink-muted">{topic.description}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-ink-soft">
                    <span>
                      <span className="physics-number text-white/85">{mounted ? solved : "—"}</span>{" "}
                      решено
                    </span>
                    <span aria-hidden="true" className="text-white/20">
                      ·
                    </span>
                    <span>
                      <span className="physics-number text-white/85">
                        {mounted ? sessions : "—"}
                      </span>{" "}
                      тренировок
                    </span>
                    <span aria-hidden="true" className="text-white/20">
                      ·
                    </span>
                    <span>
                      <span className="physics-number text-white/85">{topic.skillsCount}</span>{" "}
                      навыков
                    </span>
                    {weakTrapCount > 0 ? (
                      <Badge size="sm" tone="gold">
                        {weakTrapCount === 1 ? "1 слабое место" : `${weakTrapCount} слабых места`}
                      </Badge>
                    ) : null}
                    {reviewItem ? (
                      <Badge size="sm" tone={reviewItem.urgency === "today" ? "gold" : "cyan"}>
                        {reviewItem.dueLabel}
                      </Badge>
                    ) : null}
                  </div>

                  {hasProgress ? (
                    <ProgressBar
                      value={accuracy}
                      size="sm"
                      tone={accent.badge === "neutral" ? "neutral" : accent.badge}
                      label={`Точность по теме ${topic.title}`}
                    />
                  ) : null}
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="sm" className="sm:flex-1">
                    <Link href={`/topics/${topic.id}`}>
                      {hasProgress ? "Продолжить урок" : "Урок темы"}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary" className="sm:flex-1">
                    <Link href={topic.href}>10 задач</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-[13px] leading-[1.7] text-ink-soft">
          Всего решено: <span className="physics-number text-white/85">{mounted ? totalSolved : "—"}</span>
        </p>
      </section>

      <section aria-label="Проверка и справочник" className="grid gap-4 lg:grid-cols-2">
        <Card
          variant="raised"
          padding="lg"
          interactive
          className="flex flex-col gap-4 border-l-2 border-l-nova-gold/55"
        >
          <div className="flex items-center gap-2.5">
            <Badge tone="gold" size="sm" dot>
              Диагностика
            </Badge>
            <span className="pl-eyebrow">14 задач · открытые темы</span>
          </div>
          <p className="text-[14px] leading-[1.7] text-ink-muted">
            Задачи из всех пяти тем вперемешку: видно, что держится, а что рассыпается без
            подсказок темы. Это не полный вариант ЦТ/ЦЭ — квантовая и атомная физика пока не
            включены.
          </p>
          {bestExam ? (
            <p className="text-[13px] font-semibold text-ink-soft">
              Лучший результат:{" "}
              <span className="physics-number text-white/85">
                {bestExam.score}/{bestExam.total}
              </span>
            </p>
          ) : null}
          <Button asChild variant="gold" className="mt-auto w-fit">
            <Link href="/exam">Пройти диагностику</Link>
          </Button>
        </Card>

        <Card variant="raised" padding="lg" interactive className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Badge tone="cyan" size="sm" dot>
              Справочник
            </Badge>
            <span className="pl-eyebrow">формулы и условия</span>
          </div>
          <p className="text-[14px] leading-[1.7] text-ink-muted">
            Формулы с обозначениями и ограничениями: когда формула работает, а когда её применять
            рано. Открывается по ходу тренировки, но можно и полистать.
          </p>
          <Button asChild variant="secondary" className="mt-auto w-fit">
            <Link href="/formulas">Открыть справочник</Link>
          </Button>
        </Card>
      </section>

      {upcomingTopics.length > 0 ? (
        <section aria-labelledby="upcoming-title" className="flex flex-col gap-4">
          <SectionHeading
            id="upcoming-title"
            eyebrow="В планах"
            title="Готовится"
            description="Разделы программы, для которых задач в каталоге пока нет."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingTopics.map((topic) => (
              <Card key={topic.id} padding="sm" className="flex flex-col gap-2">
                <h3 className="pl-h3 text-white/85">{topic.title}</h3>
                <p className="text-[13px] leading-[1.6] text-ink-soft">{topic.description}</p>
                <p className="pl-eyebrow pt-0.5">Скоро</p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
