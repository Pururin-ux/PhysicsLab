"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildReviewDashboard,
  type ReviewDashboard,
  type ReviewTopicInsight,
  type ReviewTopicTone,
} from "../../lib/learning/review-intelligence";
import type { ReviewPlanItem, ReviewUrgency } from "../../lib/learning/review-plan";
import { $appProgress } from "../../lib/stores/progress-store";
import { topics } from "../../lib/topics";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

const MAX_WEAKNESSES = 12;

type ReviewQueueFilter = "all" | ReviewUrgency;

const FILTERS = [
  { id: "today", label: "Сегодня" },
  { id: "next-session", label: "Следующая" },
  { id: "later", label: "Позже" },
  { id: "all", label: "Все" },
] as const satisfies readonly { id: ReviewQueueFilter; label: string }[];

function toneForUrgency(urgency: ReviewUrgency) {
  if (urgency === "today") return "gold";
  if (urgency === "next-session") return "cyan";
  return "neutral";
}

function topicBadgeTone(tone: ReviewTopicTone) {
  if (tone === "gold") return "gold";
  if (tone === "cyan") return "cyan";
  return "neutral";
}

function filterCount(dashboard: ReviewDashboard, filter: ReviewQueueFilter) {
  if (filter === "all") return dashboard.plan.length;
  if (filter === "today") return dashboard.dueToday;
  if (filter === "next-session") return dashboard.nextSession;
  return dashboard.later;
}

function normalizeFilter(
  dashboard: ReviewDashboard,
  filter: ReviewQueueFilter,
): ReviewQueueFilter {
  return filter === "all" || filterCount(dashboard, filter) > 0 ? filter : "all";
}

function visiblePlan(
  dashboard: ReviewDashboard,
  filter: ReviewQueueFilter,
): ReviewPlanItem[] {
  const plan =
    filter === "all"
      ? dashboard.plan
      : dashboard.plan.filter((item) => item.urgency === filter);

  return plan.slice(0, MAX_WEAKNESSES);
}

function Metric({
  value,
  label,
  tone = "neutral",
}: {
  value: number;
  label: string;
  tone?: "neutral" | "gold" | "cyan";
}) {
  return (
    <div
      className={cn(
        "rounded-option border bg-white/[.025] p-3",
        tone === "gold" && "border-nova-gold/25 bg-nova-gold/[.06]",
        tone === "cyan" && "border-nova-cyan/25 bg-nova-cyan/[.06]",
        tone === "neutral" && "border-white/[.08]",
      )}
    >
      <p
        className={cn(
          "physics-number text-[24px] font-bold leading-none text-white",
          tone === "gold" && "text-nova-gold",
          tone === "cyan" && "text-nova-cyan",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[12px] font-semibold leading-tight text-white/55">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ totalSolved }: { totalSolved: number }) {
  return (
    <Card className="flex flex-col items-start gap-4 !p-6 md:!p-8">
      {totalSolved > 0 ? (
        <>
          <Badge tone="cyan">Контроль ошибок</Badge>
          <h2 className="text-lg font-[800] text-white">
            Записанных ловушек нет
          </h2>
          <p className="max-w-[560px] text-[14px] leading-[1.7] text-white/65">
            Решено задач: <span className="physics-number">{totalSolved}</span>.
            Повторяющиеся слабые места пока не проявились. Когда ошибка
            повторится или станет старой, здесь появится конкретный план
            возврата.
          </p>
        </>
      ) : (
        <>
          <Badge tone="gold">Review Intelligence</Badge>
          <h2 className="text-lg font-[800] text-white">
            Здесь появится очередь повторения
          </h2>
          <p className="max-w-[560px] text-[14px] leading-[1.7] text-white/65">
            После первой тренировки PhysicsLab сохранит ловушки, сгруппирует их
            по навыкам и покажет, что стоит вернуть сегодня, а что можно
            оставить на следующую сессию.
          </p>
        </>
      )}
      <Button asChild>
        <Link href="/topics">К темам</Link>
      </Button>
    </Card>
  );
}

function TopicInsightCard({ insight }: { insight: ReviewTopicInsight }) {
  const barWidth =
    insight.intensity === 0 ? 0 : Math.max(14, Math.round(insight.intensity * 100));

  return (
    <Card
      className="card-lift flex min-h-[220px] flex-col gap-4 border-white/[.08] !p-5"
      aria-label={`${insight.topicTitle}: ${insight.summary}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone={topicBadgeTone(insight.tone)}>{insight.statusLabel}</Badge>
        <span className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/60">
          <span className="physics-number">{insight.skillCoverageLabel}</span>{" "}
          навыков
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="text-[15px] font-[800] leading-snug text-white">
          {insight.topicTitle}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.55] text-white/58">
          {insight.summary}
        </p>
      </div>

      <div
        className="h-2 overflow-hidden rounded-badge bg-white/[.06]"
        aria-hidden="true"
      >
        <div
          className={cn(
            "h-full rounded-badge transition-[width]",
            insight.tone === "gold" && "bg-nova-gold",
            insight.tone === "cyan" && "bg-nova-cyan",
            insight.tone === "neutral" && "bg-white/18",
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex min-h-[52px] flex-wrap content-start gap-1.5">
        {insight.topSkillTitles.length > 0 ? (
          insight.topSkillTitles.map((skillTitle) => (
            <span
              key={skillTitle}
              className="rounded-badge border border-white/[.08] bg-white/[.03] px-2 py-1 text-[11px] font-semibold leading-none text-white/68"
            >
              {skillTitle}
            </span>
          ))
        ) : (
          <span className="text-[12px] font-semibold text-white/40">
            Нет активных ловушек
          </span>
        )}
      </div>

      <Button asChild variant="ghost" size="sm" className="mt-auto w-full">
        <Link href={insight.href}>Тренировать тему</Link>
      </Button>
    </Card>
  );
}

function ReviewQueueCard({ weakness }: { weakness: ReviewPlanItem }) {
  return (
    <Card className="card-lift flex flex-col gap-4 border-white/[.08] !p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={weakness.topicId === "dynamics" ? "gold" : "cyan"}>
            {weakness.skillTitle}
          </Badge>
          {weakness.topicTitle ? (
            <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/40">
              {weakness.topicTitle}
            </span>
          ) : null}
          <Badge tone={toneForUrgency(weakness.urgency)}>
            {weakness.dueLabel}
          </Badge>
          <span
            className="physics-number text-[12px] font-semibold text-white/45"
            title="Сколько раз встретилась эта ошибка"
          >
            ×{weakness.count}
          </span>
        </div>
        <h3 className="text-[16px] font-[800] leading-snug text-white">
          {weakness.title}
        </h3>
        <p className="text-[13px] leading-[1.65] text-white/62">
          <MathText text={weakness.hint} />
        </p>
        <p className="text-[12px] font-semibold leading-[1.5] text-white/45">
          {weakness.reason}
        </p>
      </div>

      <Button asChild size="sm" className="shrink-0">
        <Link href={weakness.href}>Потренировать</Link>
      </Button>
    </Card>
  );
}

export function MistakesList() {
  const progress = useStore($appProgress);
  const dashboard = useMemo(() => buildReviewDashboard(progress), [progress]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<ReviewQueueFilter>("today");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalSolved = topics.reduce(
    (sum, topic) => sum + (progress.topics[topic.id]?.solved ?? 0),
    0,
  );

  if (dashboard.plan.length === 0) {
    return <EmptyState totalSolved={totalSolved} />;
  }

  const activeFilter = normalizeFilter(dashboard, filter);
  const queue = visiblePlan(dashboard, activeFilter);
  const primaryAction = dashboard.primaryAction;

  return (
    <div className="flex flex-col gap-6" aria-label="План повторения ошибок">
      <Card
        variant="elevated"
        glow={dashboard.dueToday > 0 ? "gold" : "cyan"}
        className="!p-5 md:!p-7"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={dashboard.dueToday > 0 ? "gold" : "cyan"}>
                Review Intelligence
              </Badge>
              <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/40">
                ловушки · срочность · темы
              </span>
            </div>
            <h2 className="mt-4 text-[26px] font-[900] leading-tight text-white sm:text-[32px]">
              План восстановления
            </h2>
            <p className="mt-3 max-w-[680px] text-[14px] leading-[1.7] text-white/65">
              {dashboard.recoveryNote}
            </p>
          </div>

          {primaryAction ? (
            <Button asChild className="w-full max-w-full sm:w-auto">
              <Link href={primaryAction.href}>
                Начать: {primaryAction.skillTitle}
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric value={dashboard.dueToday} label="на сегодня" tone="gold" />
          <Metric
            value={dashboard.totalWeaknesses}
            label="типов ловушек"
            tone="cyan"
          />
          <Metric value={dashboard.totalAttempts} label="ошибочных следов" />
          <Metric value={dashboard.activeTopics} label="темы затронуты" />
        </div>

        <p className="mt-4 text-[12px] font-semibold leading-[1.6] text-white/45">
          {dashboard.recoveryLabel}
        </p>
      </Card>

      <section className="flex flex-col gap-3" aria-labelledby="review-map-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="review-map-title"
              className="text-[17px] font-[850] leading-tight text-white"
            >
              Карта тем
            </h2>
            <p className="mt-1 text-[13px] leading-[1.6] text-white/50">
              Где ошибки уже требуют возврата, а где пока чисто.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.topicInsights.map((insight) => (
            <TopicInsightCard key={insight.topicId} insight={insight} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="review-queue-title">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="review-queue-title"
              className="text-[17px] font-[850] leading-tight text-white"
            >
              Очередь повторения
            </h2>
            <p className="mt-1 text-[13px] leading-[1.6] text-white/50">
              Сначала старые и повторяющиеся ловушки, затем свежие одиночные.
            </p>
          </div>

          <div
            className="flex flex-wrap gap-1 rounded-option border border-white/[.08] bg-white/[.025] p-1"
            role="group"
            aria-label="Фильтр очереди повторения"
          >
            {FILTERS.map((item) => {
              const count = filterCount(dashboard, item.id);
              const selected = activeFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={count === 0}
                  aria-pressed={selected}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "min-h-9 rounded-badge px-3 text-[12px] font-bold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50",
                    selected
                      ? "bg-nova-cyan text-space-950"
                      : "text-white/62 hover:bg-white/[.06] hover:text-white",
                    count === 0 && "cursor-not-allowed opacity-35 hover:bg-transparent",
                  )}
                >
                  {item.label}
                  <span className="physics-number ml-1">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {queue.map((weakness) => (
            <ReviewQueueCard key={weakness.key} weakness={weakness} />
          ))}
        </div>
      </section>
    </div>
  );
}
