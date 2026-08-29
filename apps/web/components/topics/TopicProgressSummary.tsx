"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buildReviewPlan } from "../../lib/learning/review-plan";
import { getTopWeaknessesForTopic } from "../../lib/learning/weakness-labels";
import type { TopicId } from "../../lib/learning/taxonomy.ts";
import { $appProgress } from "../../lib/stores/progress-store";
import { getTopicAccent } from "./topic-accents";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

interface TopicProgressSummaryProps {
  topicId: TopicId;
  practiceHref: string;
  skillsCount: number;
  practiceLabel: string;
}

export function TopicProgressSummary({
  topicId,
  practiceHref,
  skillsCount,
  practiceLabel,
}: TopicProgressSummaryProps) {
  const progress = useStore($appProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accent = getTopicAccent(topicId);
  const topicProgress = mounted ? progress.topics[topicId] : null;
  const solved = topicProgress?.solved ?? 0;
  const correct = topicProgress?.correct ?? 0;
  const sessions = topicProgress?.completedSessions ?? 0;
  const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : null;
  const trapCount = topicProgress ? Object.keys(topicProgress.weakTraps).length : 0;
  const topWeakness = topicProgress
    ? getTopWeaknessesForTopic(topicProgress.weakTraps, topicId, 1)[0] ?? null
    : null;
  const reviewItem = mounted
    ? (buildReviewPlan(progress, 12).find((item) => item.topicId === topicId) ?? null)
    : null;

  return (
    <Card
      className={`flex flex-col gap-4 border-l-2 ${accent.border} !p-5`}
      aria-label="Твой прогресс по теме"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Твой прогресс
          </p>
          <p className="flex items-baseline gap-1.5">
            <span className="physics-number text-[26px] font-bold leading-none text-white">
              {mounted ? solved : "—"}
            </span>
            <span className="text-[12px] font-semibold text-white/55">задач решено</span>
          </p>
        </div>
        <Badge tone={sessions > 0 ? accent.badge : "neutral"} className="shrink-0">
          {sessions > 0 ? "В работе" : "Не начато"}
        </Badge>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-option border border-white/[.08] bg-white/[.025] px-2 py-2.5">
          <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">
            Тренировок
          </dt>
          <dd className="physics-number mt-1 text-[17px] font-bold leading-none text-white">
            {mounted ? sessions : "—"}
          </dd>
        </div>
        <div className="rounded-option border border-white/[.08] bg-white/[.025] px-2 py-2.5">
          <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">
            Точность
          </dt>
          <dd className="physics-number mt-1 text-[17px] font-bold leading-none text-white">
            {mounted && accuracy !== null ? `${accuracy}%` : "—"}
          </dd>
        </div>
        <div className="rounded-option border border-white/[.08] bg-white/[.025] px-2 py-2.5">
          <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">
            Ловушек
          </dt>
          <dd
            className={`physics-number mt-1 text-[17px] font-bold leading-none ${
              trapCount > 0 ? "text-nova-gold" : "text-white"
            }`}
          >
            {mounted ? trapCount : "—"}
          </dd>
        </div>
      </dl>

      {mounted && topWeakness ? (
        <div className="flex flex-col gap-1.5 rounded-option border border-nova-gold/25 bg-nova-gold/[.06] px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-nova-gold/85">
            Слабое место
          </p>
          <p className="text-[13px] font-semibold leading-snug text-white">
            {topWeakness.skillTitle}
          </p>
          <p className="text-[12px] leading-[1.55] text-white/62">
            <MathText text={topWeakness.hint} />
          </p>
        </div>
      ) : null}

      {mounted && reviewItem ? (
        <p className="text-[12px] font-semibold leading-[1.55] text-white/58">
          План повторения: {reviewItem.dueLabel.toLowerCase()} — {reviewItem.reason}.
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-2">
        <Button asChild size="lg" className="!w-full">
          <Link href={practiceHref}>{sessions > 0 ? "Продолжить тренировку" : practiceLabel}</Link>
        </Button>
        <p className="text-[11px] leading-[1.5] text-white/45">
          Одна тренировка — 10 задач по {skillsCount}{" "}
          {skillsCount === 1 ? "навыку" : "навыкам"} темы.
        </p>
      </div>
    </Card>
  );
}
