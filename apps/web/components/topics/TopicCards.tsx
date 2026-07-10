"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopWeaknessesForTopic } from "../../lib/learning/weakness-labels";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { buildReviewPlan } from "../../lib/learning/review-plan";
import { topics, upcomingTopics } from "../../lib/topics";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import {
  $appProgress,
} from "../../lib/stores/progress-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { TopicGlyph } from "./TopicGlyph";

const topicStyles = {
  kinematics: {
    border: "border-white/[.08] border-l-nova-cyan/55",
    depth:
      "!shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.045)]",
    badge: "cyan",
    button: "mt-auto",
    tile: "border-nova-cyan/25 bg-nova-cyan/[.08] text-nova-cyan",
  },
  dynamics: {
    border: "border-white/[.08] border-l-nova-gold/55",
    depth:
      "!shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.045)]",
    badge: "gold",
    button:
      "mt-auto border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50",
    tile: "border-nova-gold/25 bg-nova-gold/[.08] text-nova-gold",
  },
  electrodynamics: {
    border: "border-white/[.08] border-l-nova-blue/55",
    depth:
      "!shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.045)]",
    badge: "blue",
    button:
      "mt-auto border-nova-blue bg-nova-blue shadow-[0_0_22px_rgba(45,156,255,0.25)] focus-visible:ring-nova-blue/50",
    tile: "border-nova-blue/25 bg-nova-blue/[.08] text-nova-blue",
  },
  thermodynamics: {
    border: "border-white/[.08] border-l-nova-ember/55",
    depth:
      "!shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.045)]",
    badge: "ember",
    button:
      "mt-auto border-nova-ember bg-nova-ember shadow-ember-glow focus-visible:ring-nova-ember/50",
    tile: "border-nova-ember/25 bg-nova-ember/[.08] text-nova-ember",
  },
} as const;

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

  return (
    <>
    {nextStep ? (
      <Card
        className={`flex flex-col gap-4 !p-4 sm:flex-row sm:items-center sm:justify-between md:!p-5 ${
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
            <h2 className="text-[18px] font-[800] leading-tight text-white">
              {nextStep.title}
            </h2>
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

    <section
      className="grid gap-4 md:grid-cols-2"
      aria-label="Темы для повторения"
    >
      {topics.map((topic) => {
        const style = topicStyles[topic.id];
        const topicProgress = mounted ? progress.topics[topic.id] : null;
        const solved = topicProgress?.solved ?? 0;
        const correct = topicProgress?.correct ?? 0;
        const sessions = topicProgress?.completedSessions ?? 0;
        const hasProgress = Boolean(
          topicProgress &&
            (topicProgress.completedSessions > 0 || topicProgress.solved > 0),
        );
        const weakTrapCount = topicProgress
          ? Object.keys(topicProgress.weakTraps).length
          : 0;
        const topWeaknesses = topicProgress
          ? getTopWeaknessesForTopic(topicProgress.weakTraps, topic.id, 2)
          : [];
        const topWeaknessLabels = Array.from(
          new Set(topWeaknesses.map((weakness) => weakness.skillTitle)),
        );
        const reviewItem = reviewPlan.find((item) => item.topicId === topic.id);

        return (
          <Card
            key={topic.id}
            variant="elevated"
            className={`card-lift flex flex-col gap-3 border-l-2 !p-4 md:!p-5 ${style.border} ${style.depth}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-option border ${style.tile}`}
              >
                <TopicGlyph topic={topic.id} className="h-7 w-7" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-lg font-[800] leading-tight text-white">
                    {topic.title}
                  </h2>
                  <Badge tone={style.badge} className="w-fit shrink-0">
                    {hasProgress ? "В процессе" : "Не начато"}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-[13px] leading-[1.5] text-white/68">
                  {topic.description}
                </p>
              </div>
            </div>

            {hasProgress ? (
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                  <span className="physics-number">{solved}</span> решено
                </span>
                <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                  <span className="physics-number">{correct}</span> верно
                </span>
                <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/70">
                  <span className="physics-number">{sessions}</span>{" "}
                  {sessions === 1 ? "тренировка" : "тренировок"}
                </span>
                {weakTrapCount > 0 ? (
                  <span
                    className="rounded-badge border border-nova-gold/25 bg-nova-gold/[.06] px-2 py-1 text-[11px] font-semibold leading-none text-nova-gold/85"
                    title={topWeaknessLabels.join(", ")}
                  >
                    {weakTrapCount === 1 ? "1 слабое место" : `${weakTrapCount} слабых места`}
                  </span>
                ) : null}
                {reviewItem ? (
                  <span
                    className={
                      reviewItem.urgency === "today"
                        ? "rounded-badge border border-nova-gold/25 bg-nova-gold/[.07] px-2 py-1 text-[11px] font-semibold leading-none text-nova-gold/90"
                        : "rounded-badge border border-nova-cyan/20 bg-nova-cyan/[.05] px-2 py-1 text-[11px] font-semibold leading-none text-nova-cyan/80"
                    }
                    title={reviewItem.reason}
                  >
                    {reviewItem.dueLabel}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="text-[12px] font-semibold leading-[1.5] text-white/60">
                Короткая тренировка из 10 задач.
              </p>
            )}

            <Button asChild size="sm" className={style.button}>
              <Link href={topic.href}>{hasProgress ? "Продолжить" : "Начать"}</Link>
            </Button>
          </Card>
        );
      })}
    </section>

    <section aria-label="Смешанная тренировка">
      <Card
        variant="elevated"
        className="card-lift flex flex-col gap-4 border-l-2 border-nova-gold/30 !p-5 md:flex-row md:items-center md:justify-between md:!p-6"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Badge tone="gold">Смешанная тренировка</Badge>
            <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/60">
              открытые темы
            </span>
          </div>
          <p className="text-[14px] leading-[1.65] text-white/70">
            10 задач: механика, электродинамика и термодинамика вперемешку.
            Это тренировка по открытым темам, не полный вариант ЦТ/ЦЭ.
          </p>
          {bestExam ? (
            <p className="text-[12px] font-semibold text-white/50">
              Лучший результат:{" "}
              <span className="physics-number text-nova-gold">
                {bestExam.score}/{bestExam.total}
              </span>
            </p>
          ) : null}
        </div>
        <Button
          asChild
          className="shrink-0 border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
        >
          <Link href="/practice/exam-demo">
            {bestExam ? "Ещё тренировка" : "Начать тренировку"}
          </Link>
        </Button>
      </Card>
    </section>

    <section aria-label="Будущие темы" className="flex flex-col gap-3">
      <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
        Скоро
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        {upcomingTopics.map((topic) => (
          <Card
            key={topic.id}
            className="flex flex-1 flex-col gap-3 border-white/[.07] bg-space-900/60 !p-5 shadow-none sm:max-w-sm"
          >
            <Badge className="w-fit">Скоро</Badge>
            <h3 className="text-[17px] font-[800] leading-snug text-white/85">
              {topic.title}
            </h3>
            <p className="text-[13px] leading-[1.65] text-white/55">
              {topic.description}
            </p>
            <p className="mt-auto pt-1 text-[12px] font-semibold leading-[1.5] text-white/50">
              Задачи и разборы готовятся — тема откроется позже.
            </p>
          </Card>
        ))}
      </div>
    </section>
    </>
  );
}
