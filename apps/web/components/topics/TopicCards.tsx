"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopWeaknessesForTopic } from "../../lib/learning/weakness-labels";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { buildReviewPlan } from "../../lib/learning/review-plan";
import { topics, upcomingTopics } from "../../lib/topics";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { $appProgress } from "../../lib/stores/progress-store";
import { getTopicAccent } from "./topic-accents";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { TopicGlyph } from "./TopicGlyph";

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
    <div className="flex flex-col gap-8">
      {nextStep ? (
        <Card
          className={`flex flex-col gap-4 !p-5 sm:flex-row sm:items-center sm:justify-between md:!p-6 ${
            nextStep.tone === "gold"
              ? "border-nova-gold/25 bg-nova-gold/[.055]"
              : "border-nova-cyan/22 bg-nova-cyan/[.045]"
          }`}
          aria-label="Что сделать сейчас"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <p
              className={`text-[11px] font-bold uppercase tracking-[.14em] ${
                nextStep.tone === "gold" ? "text-nova-gold/80" : "text-nova-cyan/80"
              }`}
            >
              {nextStep.label}
            </p>
            <div className="flex flex-col gap-1">
              <h2 className="text-[19px] font-[800] leading-tight text-white">{nextStep.title}</h2>
              <p className="max-w-[680px] text-[13px] leading-[1.65] text-white/68">
                <MathText text={nextStep.body} />
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className={
              nextStep.tone === "gold"
                ? "shrink-0 border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
                : "shrink-0"
            }
          >
            <Link href={nextStep.href}>{nextStep.cta}</Link>
          </Button>
        </Card>
      ) : null}

      <section className="flex flex-col gap-4" aria-labelledby="topics-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="topics-title" className="text-[20px] font-[800] text-white">
              Темы
            </h2>
            <p className="text-[13px] leading-[1.6] text-white/55">
              Внутри темы — опорные идеи, типы задач и тренировка. Решено всего:{" "}
              <span className="physics-number text-white/80">{mounted ? totalSolved : "—"}</span>
            </p>
          </div>
          <Button asChild size="sm" variant="ghost" className="shrink-0">
            <Link href="/tasks">Каталог типов задач</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => {
            const style = getTopicAccent(topic.id);
            const topicProgress = mounted ? progress.topics[topic.id] : null;
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const sessions = topicProgress?.completedSessions ?? 0;
            const hasProgress = Boolean(
              topicProgress && (topicProgress.completedSessions > 0 || topicProgress.solved > 0),
            );
            const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : null;
            const weakTrapCount = topicProgress ? Object.keys(topicProgress.weakTraps).length : 0;
            const reviewItem = reviewPlan.find((item) => item.topicId === topic.id);

            return (
              <Card
                key={topic.id}
                variant="elevated"
                className={`card-lift flex flex-col gap-4 border-l-2 !p-5 ${style.border}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-option border ${style.tile}`}>
                    <TopicGlyph topic={topic.id} className="h-7 w-7" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-lg font-[800] leading-tight text-white">{topic.title}</h3>
                      <Badge tone={hasProgress ? style.badge : "neutral"} className="w-fit shrink-0">
                        {hasProgress ? "В работе" : "Не начато"}
                      </Badge>
                    </div>
                    <p className="text-[13px] leading-[1.55] text-white/68">{topic.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                    <span className="physics-number">{mounted ? solved : "—"}</span> решено
                  </span>
                  {accuracy !== null ? (
                    <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                      точность <span className="physics-number">{mounted ? accuracy : "—"}%</span>
                    </span>
                  ) : null}
                  <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                    <span className="physics-number">{mounted ? sessions : "—"}</span>{" "}
                    {sessions === 1 ? "тренировка" : "тренировок"}
                  </span>
                  <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                    <span className="physics-number">{topic.skillsCount}</span> навыков
                  </span>
                  {weakTrapCount > 0 ? (
                    <span className="rounded-badge border border-nova-gold/25 bg-nova-gold/[.06] px-2 py-1 text-[11px] font-semibold leading-none text-nova-gold/85">
                      {weakTrapCount === 1 ? "1 слабое место" : `${weakTrapCount} слабых места`}
                    </span>
                  ) : null}
                  {reviewItem ? (
                    <span
                      className={`rounded-badge px-2 py-1 text-[11px] font-semibold leading-none ${
                        reviewItem.urgency === "today"
                          ? "border border-nova-gold/25 bg-nova-gold/[.07] text-nova-gold/90"
                          : "border border-nova-cyan/20 bg-nova-cyan/[.05] text-nova-cyan/80"
                      }`}
                      title={reviewItem.reason}
                    >
                      {reviewItem.dueLabel}
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="sm" className="sm:flex-1">
                    <Link href={`/topics/${topic.id}`}>
                      {hasProgress ? "Продолжить урок" : "Урок темы"}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="sm:flex-1">
                    <Link href={topic.href}>10 задач</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-label="Диагностика" className="grid gap-4 lg:grid-cols-2">
        <Card
          variant="elevated"
          className="card-lift flex flex-col gap-4 border-l-2 border-l-nova-gold/50 !p-5 md:!p-6"
        >
          <div className="flex items-center gap-2.5">
            <Badge tone="gold">Диагностика</Badge>
            <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/60">
              10 задач · открытые темы
            </span>
          </div>
          <p className="text-[14px] leading-[1.65] text-white/70">
            Задачи из всех пяти тем вперемешку: видно, что держится, а что рассыпается без
            подсказок темы. Это не полный вариант ЦТ/ЦЭ — квантовая и атомная физика пока не
            включены.
          </p>
          {bestExam ? (
            <p className="text-[12px] font-semibold text-white/50">
              Лучший результат:{" "}
              <span className="physics-number text-white/80">
                {bestExam.score}/{bestExam.total}
              </span>
            </p>
          ) : null}
          <Button asChild size="sm" className="mt-auto w-fit border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50">
            <Link href="/exam">Пройти диагностику</Link>
          </Button>
        </Card>

        <Card variant="elevated" className="card-lift flex flex-col gap-4 !p-5 md:!p-6">
          <div className="flex items-center gap-2.5">
            <Badge tone="cyan">Справочник</Badge>
            <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/60">
              формулы и условия
            </span>
          </div>
          <p className="text-[14px] leading-[1.65] text-white/70">
            Формулы с обозначениями и ограничениями: когда формула работает, а когда её
            применять рано. Открывается по ходу тренировки, но можно и полистать.
          </p>
          <Button asChild size="sm" variant="ghost" className="mt-auto w-fit">
            <Link href="/formulas">Открыть справочник</Link>
          </Button>
        </Card>
      </section>

      {upcomingTopics.length > 0 ? (
        <section aria-labelledby="upcoming-title" className="flex flex-col gap-3">
          <h2 id="upcoming-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
            Готовится
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingTopics.map((topic) => (
              <Card key={topic.id} className="flex flex-col gap-2 border-white/[.08] !p-4">
                <h3 className="text-[15px] font-[800] text-white/85">{topic.title}</h3>
                <p className="text-[13px] leading-[1.6] text-white/55">{topic.description}</p>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/40">
                  Скоро
                </p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
