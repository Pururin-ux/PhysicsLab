"use client";

import { useStore } from "@nanostores/react";
import { ChartLineUp, CheckCircle, Target } from "@phosphor-icons/react";
import Image from "next/image";
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
import {
  $learnerGoal,
  hydrateLearnerGoal,
  learnerGoalOptions,
  setLearnerGoal,
} from "../../lib/stores/learner-goal-store";
import { XP_RULES } from "../../lib/xp";
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
    <Card className={`flex flex-col gap-1 border-white/[.11] !p-4 ${className ?? ""}`}>
      <p className="text-[11px] font-bold uppercase tracking-[.1em] text-white/58">
        {label}
      </p>
      <p className="text-[24px] font-[800] leading-none tabular-nums text-white sm:text-[26px]">
        {value}
      </p>
      {hint ? (
        <p className="text-[11px] leading-[1.45] text-white/58">{hint}</p>
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

function ProfileLoadingState() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Card
        variant="elevated"
        className="flex min-h-[220px] flex-col justify-center gap-3 !p-5 md:!p-6"
      >
        <Badge tone="gold" className="w-fit">
          Прогресс
        </Badge>
        <h2 className="text-[20px] font-[800] leading-tight text-white md:text-[22px]">
          Загружаем твою картину занятий
        </h2>
        <p className="max-w-[560px] text-[13px] leading-[1.65] text-white/65">
          Собираем решённые задачи, серию и план повторения.
        </p>
        <div className="mt-2 h-2 w-full max-w-[420px] overflow-hidden rounded-badge bg-space-900" aria-hidden="true">
          <span className="block h-full w-2/3 rounded-badge bg-nova-pink/45" />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <Card key={item} className="flex min-h-[92px] flex-col gap-3 !p-4">
            <span className="h-2 w-2/3 rounded-badge bg-white/[.14]" />
            <span className="h-6 w-1/3 rounded-badge bg-white/[.09]" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileOnboarding({ href }: { href: string }) {
  const steps = [
    { icon: Target, text: "Реши первую десятку задач" },
    { icon: ChartLineUp, text: "Увидь точность и слабые места" },
    { icon: CheckCircle, text: "Вернись к конкретным ловушкам" },
  ] as const;

  return (
    <Card className="grid overflow-hidden !p-0 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="p-6 sm:p-8">
        <Badge tone="blue">Первый шаг</Badge>
        <h2 className="mt-4 text-[26px] font-[800] leading-tight tracking-[-.03em] text-white">
          Начни с диагностики из 10 задач
        </h2>
        <p className="mt-3 max-w-[600px] text-[14px] leading-[1.7] text-white/68">
          По две задачи из каждого раздела. После десяти ответов здесь появятся
          точность, темы и ошибки, к которым стоит вернуться.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[12px] font-bold leading-[1.45] text-white/68">
              <Icon size={21} weight="duotone" className="shrink-0 text-nova-blue" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-7 w-full sm:w-auto">
          <Link href={href}>Пройти диагностику</Link>
        </Button>
      </div>
      <div className="relative min-h-[250px] border-t border-white/[.1] bg-space-950 lg:min-h-full lg:border-l lg:border-t-0">
        <Image
          src="/art/production/topic-kinematics-cozy.webp"
          alt="Кот засекает движение шара по направляющей"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 340px"
          className="object-cover object-[center_45%]"
        />
      </div>
    </Card>
  );
}

export function ProfileOverview() {
  const progress = useStore($appProgress);
  const xp = useStore($xp);
  const practiceLog = useStore($practiceLog);
  const examLog = useStore($examLog);
  const learnerGoal = useStore($learnerGoal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrateLearnerGoal();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ProfileLoadingState />;
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
  const isFirstVisit = totalSolved === 0 && totalSessions === 0 && examLog.length === 0;

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
              ? "border-l-nova-pink/75 bg-space-850"
              : "border-l-nova-blue/70 bg-space-850"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p
              className={`text-[11px] font-bold uppercase tracking-[.14em] ${
                nextStep.tone === "gold" ? "text-nova-pink/80" : "text-nova-blue"
              }`}
            >
              План на сегодня
            </p>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-[800] leading-none tabular-nums text-nova-pink">
                  {xp}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[.1em] text-white/58">
                  XP
                </span>
              </div>
              <p className="text-right text-[10px] leading-[1.4] text-white/45">
                +{XP_RULES.correct_first_attempt} за верный ответ · бонусы за серию из 3 и 5
              </p>
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.11] pt-3.5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge tone={overall.tone}>{overall.label}</Badge>
              {dueReviews > 0 ? (
                <Badge tone="gold">
                  {dueReviews === 1 ? "1 повторение сегодня" : `${dueReviews} повторения сегодня`}
                </Badge>
              ) : null}
              <p className="min-w-0 text-[12px] leading-[1.5] text-white/60">
                <MathText text={overall.note} />
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={nextStep.href}>{nextStep.cta}</Link>
            </Button>
          </div>
          <div
            role="group"
            aria-label="Цель занятий"
            className="flex flex-wrap items-center gap-2 border-t border-white/[.09] pt-3.5"
          >
            <span className="text-[11px] font-bold uppercase tracking-[.1em] text-white/48">
              Цель
            </span>
            {learnerGoalOptions.map((option) => {
              const active = learnerGoal === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  title={option.note}
                  onClick={() => setLearnerGoal(active ? null : option.id)}
                  className={`min-h-8 rounded-option border px-3 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 ${
                    active
                      ? "border-nova-cyan/55 bg-nova-cyan/[.1] text-nova-cyan"
                      : "border-white/[.12] bg-white/[.02] text-white/62 hover:border-white/[.22] hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
            <span className="text-[11px] leading-[1.4] text-white/40">
              влияет на подписи плана — задачи одни и те же
            </span>
          </div>

          {totalSolved < 10 ? (
            <div aria-label="До первой оценки" className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12px] font-semibold text-white/60">
                  До первой оценки:{" "}
                  <span className="physics-number text-white/85">{totalSolved}</span> из 10 задач
                </p>
                <p className="text-[11px] text-white/45">
                  после десятого ответа появятся точность и слабые места
                </p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[.08]">
                <div
                  className="h-full rounded-full bg-nova-cyan transition-[width]"
                  style={{ width: `${Math.min(100, totalSolved * 10)}%` }}
                />
              </div>
            </div>
          ) : null}
          <p className="text-[11px] leading-[1.5] text-white/58">
            Оценка построена только на твоих ответах в тренажёре — это не
            прогноз балла на ЦЭ/ЦТ.
          </p>
        </Card>
      </section>

      {isFirstVisit ? (
        <ProfileOnboarding href={nextStep.href} />
      ) : (
      <>
      {/* Плитки статистики: 2 в ряд уже на телефоне, а не цепочкой в столбик. */}
      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-5"
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
          <h2 className="text-[13px] font-bold uppercase tracking-[.12em] text-white/58">
            Что повторить
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {reviewPlan.map((item) => (
              <Card
                key={item.key}
                className="flex flex-col gap-3 border-white/[.11] !p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={item.urgency === "today" ? "gold" : "cyan"}>
                    {item.dueLabel}
                  </Badge>
                  {item.topicTitle ? (
                    <span className="text-[11px] font-bold uppercase tracking-[.1em] text-white/58">
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
                  <p className="text-[11px] font-semibold leading-[1.45] text-white/58">
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
                      className="rounded-option px-1 text-[12px] font-semibold text-nova-cyan/80 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
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
        <h2 className="text-[13px] font-bold uppercase tracking-[.12em] text-white/58">
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
                className="flex flex-col gap-2.5 border-white/[.11] !p-4"
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
                      <span className="block text-white/55">
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

      </>
      )}

      <section
        className="flex flex-col gap-3 rounded-card border border-white/[.11] bg-space-925 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.035)]"
        aria-label="Управление данными"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] leading-[1.6] text-white/58">
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
