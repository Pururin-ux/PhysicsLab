"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  $examLog,
  getBestAttempt,
  resetExamLog,
} from "../../lib/stores/exam-log-store";
import {
  $practiceLog,
  calcStreak,
  getLastDays,
  resetPracticeLog,
  toDayKey,
} from "../../lib/stores/practice-log-store";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { buildReviewPlan, countDueReviews } from "../../lib/learning/review-plan";
import {
  $appProgress,
  resetProgress,
} from "../../lib/stores/progress-store";
import { $xp, resetStoredXP } from "../../lib/stores/session-store";
import { topics } from "../../lib/topics";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { DataTransfer } from "./DataTransfer";

type Readiness = {
  label: string;
  tone: "neutral" | "cyan" | "gold";
  note: string;
};

// Честная эвристика по собранным данным, не прогноз балла на экзамене.
function readinessFor(solved: number, correct: number): Readiness {
  if (solved === 0) {
    return {
      label: "Нет данных",
      tone: "neutral",
      note: "Пройди тренировку, чтобы появилась оценка.",
    };
  }

  const accuracy = correct / solved;

  if (solved < 10) {
    return {
      label: "Разогрев",
      tone: "neutral",
      note: "Мало задач для вывода — продолжай.",
    };
  }
  if (accuracy >= 0.8) {
    return {
      label: "Уверенная база",
      tone: "cyan",
      note: "**Точность высокая**, можно наращивать сложность.",
    };
  }
  if (accuracy >= 0.6) {
    return {
      label: "Середина пути",
      tone: "gold",
      note: "База есть, но ==часть ловушек ещё срабатывает==.",
    };
  }
  return {
    label: "Стоит повторить",
    tone: "gold",
    note: "Загляни в раздел «Ошибки» и разбери **слабые места**.",
  };
}

function formatLastPracticed(iso: string | null) {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

function StatCard({
  label,
  value,
  hint,
  children,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col gap-1 border-white/[.08] !p-4 ${className ?? ""}`}>
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/45">
        {label}
      </p>
      <p className="physics-number text-[24px] font-bold leading-none text-white sm:text-[26px]">
        {value}
      </p>
      {hint ? (
        <p className="text-[11px] leading-[1.45] text-white/48">{hint}</p>
      ) : null}
      {children}
    </Card>
  );
}

function WeekDots({ log }: { log: string[] }) {
  const days = getLastDays(log, toDayKey(new Date()), 7);

  return (
    <div
      className="mt-1 flex items-center gap-1.5"
      role="img"
      aria-label={`Занимался ${days.filter((day) => day.practiced).length} из последних 7 дней`}
    >
      {days.map((day) => (
        <span
          key={day.key}
          title={day.key}
          className={
            day.practiced
              ? "h-2 w-2 rounded-full bg-nova-cyan shadow-cyan-glow"
              : "h-2 w-2 rounded-full border border-white/20 bg-white/[.04]"
          }
        />
      ))}
    </div>
  );
}

export function ProfileOverview() {
  const progress = useStore($appProgress);
  const xp = useStore($xp);
  const practiceLog = useStore($practiceLog);
  const examLog = useStore($examLog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const perTopic = topics.map((topic) => ({
    topic,
    progress: progress.topics[topic.id] ?? null,
  }));

  const totalSolved = perTopic.reduce(
    (sum, { progress: p }) => sum + (p?.solved ?? 0),
    0,
  );
  const totalCorrect = perTopic.reduce(
    (sum, { progress: p }) => sum + (p?.correct ?? 0),
    0,
  );
  const totalSessions = perTopic.reduce(
    (sum, { progress: p }) => sum + (p?.completedSessions ?? 0),
    0,
  );
  const topicsStarted = perTopic.filter(
    ({ progress: p }) => (p?.completedSessions ?? 0) > 0 || (p?.solved ?? 0) > 0,
  ).length;
  const totalWeakTraps = perTopic.reduce(
    (sum, { progress: p }) => sum + Object.keys(p?.weakTraps ?? {}).length,
    0,
  );
  const accuracy =
    totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : null;
  const overall = readinessFor(totalSolved, totalCorrect);
  const streak = calcStreak(practiceLog, toDayKey(new Date()));
  const bestExam = getBestAttempt(examLog);
  const nextStep = getLearningNextStep(progress, Boolean(bestExam));
  const reviewPlan = buildReviewPlan(progress, 3);
  const dueReviews = countDueReviews(progress);

  const handleReset = () => {
    if (
      window.confirm(
        "Сбросить весь прогресс и XP? Это действие нельзя отменить.",
      )
    ) {
      resetProgress();
      resetStoredXP();
      resetPracticeLog();
      resetExamLog();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Одна «шапка» вместо двух похожих карточек подряд: план действия —
          самое ценное при возврате в профиль — ведёт, готовность и XP идут
          вторым планом внутри той же карточки. */}
      <section aria-label="План на сегодня">
        <Card
          className={`flex flex-col gap-4 border-l-2 !p-5 md:!p-6 ${
            nextStep.tone === "gold"
              ? "border-l-nova-gold/70 bg-nova-gold/[.045]"
              : "border-l-nova-cyan/70 bg-nova-cyan/[.035]"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p
              className={`text-[11px] font-bold uppercase tracking-[.14em] ${
                nextStep.tone === "gold" ? "text-nova-gold/80" : "text-nova-cyan/80"
              }`}
            >
              План на сегодня
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="physics-number text-[20px] font-bold leading-none text-nova-gold">
                {xp}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/45">
                XP
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-[800] leading-tight text-white">
              {nextStep.title}
            </h2>
            <p className="max-w-[640px] text-[13px] leading-[1.65] text-white/68">
              <MathText text={nextStep.body} />
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.08] pt-3.5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge tone={overall.tone}>{overall.label}</Badge>
              {dueReviews > 0 ? (
                <Badge tone="gold">
                  {dueReviews === 1 ? "1 повторение сегодня" : `${dueReviews} повторения сегодня`}
                </Badge>
              ) : null}
              <p className="min-w-0 text-[12px] leading-[1.5] text-white/50">
                <MathText text={overall.note} />
              </p>
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
          </div>
          <p className="text-[11px] leading-[1.5] text-white/48">
            Оценка построена только на твоих ответах в тренажёре — это не
            прогноз балла на ЦЭ/ЦТ.
          </p>
        </Card>
      </section>

      {/* Плитки статистики: 2 в ряд уже на телефоне, а не цепочкой в столбик. */}
      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Общая статистика"
      >
        <StatCard
          label="Задач решено"
          value={String(totalSolved)}
          hint={accuracy !== null ? `точность ${accuracy}%` : undefined}
        />
        <StatCard
          label="Тренировок"
          value={String(totalSessions)}
          hint={`тем: ${topicsStarted} из ${topics.length}`}
        />
        <StatCard
          label="Слабых мест"
          value={String(totalWeakTraps)}
          hint={totalWeakTraps > 0 ? "раздел «Ошибки»" : undefined}
        />
        <StatCard
          label="Смешанная тренировка"
          value={bestExam ? `${bestExam.score}/${bestExam.total}` : "—"}
          hint={
            examLog.length > 0 ? `попыток: ${examLog.length}` : "открытые темы · 10"
          }
        />
        <StatCard
          label="Дней подряд"
          value={String(streak)}
          hint="день = завершённая тренировка"
          className="col-span-2 lg:col-span-1"
        >
          <WeekDots log={practiceLog} />
        </StatCard>
      </section>

      {reviewPlan.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="План повторения">
          <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
            Что повторить
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {reviewPlan.map((item) => (
              <Card
                key={item.key}
                className="flex flex-col gap-3 border-white/[.08] !p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={item.urgency === "today" ? "gold" : "cyan"}>
                    {item.dueLabel}
                  </Badge>
                  {item.topicTitle ? (
                    <span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/48">
                      {item.topicTitle}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h3 className="text-[15px] font-[800] leading-snug text-white">
                    {item.skillTitle}
                  </h3>
                  <p className="text-[12px] leading-[1.55] text-white/58">
                    <MathText text={item.hint} />
                  </p>
                  <p className="text-[11px] font-semibold leading-[1.45] text-white/42">
                    {item.reason}
                  </p>
                </div>
                <div className="mt-auto flex flex-col items-start gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={item.practiceHref ?? item.fallbackHref}>
                      {item.practiceHref ? "Решить 5 похожих" : "Открыть каталог"}
                    </Link>
                  </Button>
                  {item.taskHref ? (
                    <Link
                      href={item.taskHref}
                      className="rounded-option px-1 text-[12px] font-semibold text-nova-cyan/80 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                    >
                      {item.hasReferenceSolution ? "Открыть разбор" : "Открыть тип"}
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3" aria-label="Прогресс по темам">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
          По темам
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perTopic.map(({ topic, progress: topicProgress }) => {
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const sessions = topicProgress?.completedSessions ?? 0;
            const readiness = readinessFor(solved, correct);
            const lastPracticed = formatLastPracticed(
              topicProgress?.lastPracticedAt ?? null,
            );
            const topicAccuracy =
              solved > 0 ? Math.round((correct / solved) * 100) : null;

            return (
              <Card
                key={topic.id}
                className="flex flex-col gap-2.5 border-white/[.08] !p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-[15px] font-[800] text-white">
                    {topic.title}
                  </h3>
                  <Badge tone={readiness.tone} className="shrink-0">
                    {readiness.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 text-[12px] font-semibold leading-[1.5] text-white/55">
                    Решено{" "}
                    <span className="physics-number text-white/80">{solved}</span>
                    {topicAccuracy !== null ? (
                      <>
                        {" "}
                        · точность{" "}
                        <span className="physics-number text-white/80">
                          {topicAccuracy}%
                        </span>
                      </>
                    ) : null}
                    {" · "}
                    <span className="physics-number text-white/80">{sessions}</span>{" "}
                    трен.
                    {lastPracticed ? (
                      <span className="block text-white/40">
                        последняя {lastPracticed}
                      </span>
                    ) : null}
                  </p>
                  <Button asChild size="sm" variant="ghost" className="shrink-0">
                    <Link href={topic.href}>
                      {solved > 0 ? "Дальше" : "Начать"}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section
        className="flex flex-col gap-3 rounded-card border border-white/[.06] bg-space-900/50 px-5 py-4"
        aria-label="Управление данными"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] leading-[1.6] text-white/45">
            Все данные хранятся только в этом браузере. Скачай файл прогресса,
            чтобы не потерять его при очистке или сменить устройство.
          </p>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Сбросить прогресс
          </Button>
        </div>
        <DataTransfer />
      </section>
    </div>
  );
}
