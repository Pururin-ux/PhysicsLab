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
import {
  $learnerGoal,
  hydrateLearnerGoal,
  learnerGoalOptions,
  setLearnerGoal,
} from "../../lib/stores/learner-goal-store";
import { topics } from "../../lib/topics";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { DataTransfer } from "./DataTransfer";

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
    <Card variant="semantic" className={`flex flex-col gap-1 !p-4 ${className ?? ""}`}>
      <p className="type-meta">
        {label}
      </p>
      <p className="text-[24px] font-[800] leading-none tabular-nums text-[var(--text-strong)] sm:text-[26px]">
        {value}
      </p>
      {hint ? (
        <p className="text-[11px] leading-[1.45] text-[var(--text-default)]">{hint}</p>
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
              ? "h-2 w-2 rounded-full bg-[var(--mode-learn-accent)] shadow-[0_0_0_3px_var(--mode-learn-soft)]"
              : "h-2 w-2 rounded-full border border-[var(--border-muted)] bg-[var(--surface-hover)]"
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
        variant="semanticElevated"
        className="flex min-h-[220px] flex-col justify-center gap-3 !p-5 md:!p-6"
      >
        <Badge tone="gold" className="w-fit">
          Секунду
        </Badge>
        <h2 className="text-[20px] font-[800] leading-tight text-[var(--text-strong)] md:text-[22px]">
          Вспоминаем, где ты остановился
        </h2>
        <p className="max-w-[560px] text-[13px] leading-[1.65] text-[var(--text-default)]">
          Следующий подход уже почти готов.
        </p>
        <div className="mt-2 h-2 w-full max-w-[420px] overflow-hidden rounded-badge bg-[var(--surface-panel)]" aria-hidden="true">
          <span className="block h-full w-2/3 rounded-badge bg-[var(--mode-learn-accent)] opacity-45" />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <Card key={item} variant="semantic" className="flex min-h-[92px] flex-col gap-3 !p-4">
            <span className="h-2 w-2/3 rounded-badge bg-[var(--border-emphasis)]" />
            <span className="h-6 w-1/3 rounded-badge bg-[var(--border-muted)]" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyProgress() {
  return (
    <Card variant="semantic" className="grid overflow-hidden !p-0 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="p-6 sm:p-8 lg:pr-10">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--mode-learn-accent)]">
          Пока без истории
        </p>
        <h2 className="mt-3 max-w-[640px] text-[clamp(26px,4vw,38px)] font-[800] leading-[1.05] tracking-[-.035em] text-[var(--text-strong)]">
          Здесь появится твой прогресс
        </h2>
        <p className="mt-3 max-w-[600px] text-[14px] leading-[1.7] text-[var(--text-default)]">
          После первой темы или тренировки здесь будут видны решённые задачи,
          места для повторения и следующее действие.
        </p>
        <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/topics">Выбрать тему</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href="/practice/diagnostic">Попробовать 10 задач</Link>
          </Button>
        </div>
      </div>
      <div
        className="flex min-h-[190px] flex-col justify-between border-t border-[var(--border-muted)] bg-[var(--surface-panel-raised)] px-6 py-6 lg:min-h-full lg:border-l lg:border-t-0 lg:px-7"
        aria-label="Что сохраняется в прогрессе"
      >
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[var(--text-quiet)]">
          После первого шага
        </p>
        <ul className="grid gap-3 text-[12px] font-semibold leading-[1.5] text-[var(--text-default)]">
          <li>Решённые задачи</li>
          <li>Темы для повторения</li>
          <li>Место, где можно продолжить</li>
        </ul>
      </div>
    </Card>
  );
}

// Выбор цели вынесен в отдельную тонкую строку. Раньше он жил внутри «плана на
// сегодня» вместе с пояснением и добавлял ещё один ярус мелкого текста.
function GoalRow({ goal }: { goal: string | null }) {
  return (
    <section
      aria-label="Цель занятий"
      className="flex flex-wrap items-center gap-2 rounded-card border border-[var(--border-muted)] bg-[var(--surface-panel)] px-4 py-3"
    >
      <span className="text-[12px] font-semibold text-[var(--text-default)]">Готовлюсь к</span>
      {learnerGoalOptions.map((option) => {
        const active = goal === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => setLearnerGoal(active ? null : option.id)}
            className={`min-h-8 rounded-option border px-3 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
              active
                ? "border-[var(--mode-learn-accent)] bg-[var(--mode-learn-soft)] text-[var(--mode-learn-accent)]"
                : "border-[var(--border-muted)] bg-transparent text-[var(--text-default)] hover:border-[var(--border-emphasis)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-strong)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </section>
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
  const evidenceEntries = perTopic.flatMap(({ progress: topicProgress }) =>
    Object.entries(topicProgress?.skillEvidence ?? {}),
  );
  const transferEvidenceCount = new Set(
    evidenceEntries.map(([blueprint]) => blueprint),
  ).size;
  const delayedRecallCount = new Set(
    evidenceEntries
      .filter(([, evidence]) => Boolean(evidence.delayedRecallPassedAt))
      .map(([blueprint]) => blueprint),
  ).size;
  const streak = calcStreak(practiceLog, toDayKey(new Date()));
  const bestExam = getBestAttempt(examLog);
  const nextStep = getLearningNextStep(progress, Boolean(bestExam));
  const reviewPlan = buildReviewPlan(progress, 3);
  const dueReviews = countDueReviews(progress);
  const hasPendingMistakes = Object.keys(progress.pendingMistakes).length > 0;
  const isFirstVisit =
    totalSolved === 0 &&
    totalSessions === 0 &&
    examLog.length === 0 &&
    !hasPendingMistakes;

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
      {isFirstVisit ? (
        <>
          {/* Первый визит: одна ясная карточка «с чего начать» вместо двух
              соперничающих призывов. Дальше — только выбор цели. */}
          <EmptyProgress />
          <GoalRow goal={learnerGoal} />
        </>
      ) : (
      <>
      {/* План на сегодня: заголовок и одна кнопка ведут, остальное — тонким
          вторым планом. Раньше карточка складывала шесть ярусов мелкого текста. */}
      <section aria-label="План на сегодня">
        <Card
          variant="semanticElevated"
          className={`flex flex-col gap-4 border-l-2 !p-5 md:!p-6 ${
            nextStep.tone === "gold"
              ? "border-l-[var(--feedback-warning)]"
              : "border-l-[var(--mode-learn-accent)]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className={`text-[11px] font-bold uppercase tracking-[.14em] ${
                  nextStep.tone === "gold" ? "text-[var(--feedback-warning)]" : "text-[var(--mode-learn-accent)]"
                }`}
              >
                Дальше
              </p>
              <h2 className="mt-1.5 text-[21px] font-[800] leading-tight text-[var(--text-strong)]">
                {nextStep.title}
              </h2>
              <p className="mt-1.5 max-w-[560px] text-[14px] leading-[1.6] text-[var(--text-default)]">
                <MathText text={nextStep.body} />
              </p>
              <p className="mt-2 max-w-[560px] text-[12px] leading-[1.55] text-[var(--text-quiet)]">
                Почему сейчас: {nextStep.reason}
              </p>
            </div>
            <div className="flex shrink-0 items-baseline gap-1.5" title="Опыт за верные ответы">
              <span className="text-[22px] font-[800] leading-none tabular-nums text-mode-learn">
                {xp}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[.1em] text-[var(--text-default)]">
                XP
              </span>
            </div>
          </div>

          {totalSolved < 10 ? (
            <div aria-label="Первый десяток задач" className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-[12px] font-semibold text-[var(--text-default)]">
                <span>Собери первый десяток решений</span>
                <span className="physics-number text-[var(--text-strong)]">{totalSolved} / 10</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--mode-learn-accent)] transition-[width]"
                  style={{ width: `${Math.min(100, totalSolved * 10)}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-muted)] pt-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {dueReviews > 0 ? (
                <Badge tone="gold">
                  {dueReviews === 1 ? "1 повторение сегодня" : `${dueReviews} повторения сегодня`}
                </Badge>
              ) : null}
              <p className="min-w-0 text-[12px] leading-[1.5] text-[var(--text-default)]">
                {hasPendingMistakes
                  ? "Ошибка уже сохранена — можно продолжить с места, где ответ сбился."
                  : totalSolved === 0
                  ? "Один короткий подход — и будет от чего оттолкнуться."
                  : `${totalCorrect} из ${totalSolved} решений сошлись с ответом.`}
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={nextStep.href}>{nextStep.cta}</Link>
            </Button>
          </div>
        </Card>
      </section>

      <GoalRow goal={learnerGoal} />

      {transferEvidenceCount > 0 ? (
        <section className="flex flex-col gap-3" aria-label="Проверки понимания">
          <div>
            <h2 className="type-h2 text-[var(--text-strong)]">Что уже проверено</h2>
            <p className="mt-1 max-w-[680px] text-[12px] leading-[1.55] text-[var(--text-default)]">
              Здесь считаются отдельные навыки, а не вся тема: сначала задача без подсказки,
              затем повторное решение после перерыва не меньше суток.
            </p>
          </div>
          <Card variant="semantic" className="grid gap-3 !p-4 sm:grid-cols-2">
            <div className="rounded-option bg-[var(--surface-panel)] p-4">
              <p className="type-meta">Перенос без подсказки</p>
              <p className="mt-1 text-[26px] font-[800] tabular-nums text-[var(--text-strong)]">
                {transferEvidenceCount}
              </p>
              <p className="mt-1 text-[11px] leading-[1.45] text-[var(--text-default)]">
                навыков получилось распознать в смешанном наборе
              </p>
            </div>
            <div className="rounded-option bg-[var(--surface-panel)] p-4">
              <p className="type-meta">Воспроизведено позже</p>
              <p className="mt-1 text-[26px] font-[800] tabular-nums text-[var(--text-strong)]">
                {delayedRecallCount}
              </p>
              <p className="mt-1 text-[11px] leading-[1.45] text-[var(--text-default)]">
                навыков повторно решены с первой попытки спустя минимум сутки
              </p>
            </div>
          </Card>
        </section>
      ) : null}

      {/* Плитки статистики: 2 в ряд уже на телефоне, а не цепочкой в столбик. */}
      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-5"
        aria-label="Как идут занятия"
      >
        <StatCard
          label="Решено"
          value={String(totalSolved)}
          hint={totalSolved > 0 ? `${totalCorrect} ответов сошлись` : undefined}
        />
        <StatCard
          label="Подходов"
          value={String(totalSessions)}
          hint={`${topicsStarted} из ${topics.length} тем попробовано`}
        />
        <StatCard
          label="Вернуться сегодня"
          value={String(dueReviews)}
          hint={dueReviews > 0 ? "коротких повторений" : "можно двигаться дальше"}
        />
        <StatCard
          label="Смешанных заходов"
          value={String(examLog.length)}
          hint={bestExam ? `в одном сошлось ${bestExam.score} из ${bestExam.total}` : "10 задач · 5 тем"}
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
          <h2 className="type-h2 text-[var(--text-strong)]">
            Что повторить
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {reviewPlan.map((item) => (
              <Card
                key={item.key}
                variant="semantic"
                className="flex flex-col gap-3 !p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={item.urgency === "today" ? "gold" : "cyan"}>
                    {item.dueLabel}
                  </Badge>
                  {item.topicTitle ? (
                    <span className="text-[11px] font-bold uppercase tracking-[.1em] text-[var(--text-quiet)]">
                      {item.topicTitle}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h3 className="text-[15px] font-[800] leading-snug text-[var(--text-strong)]">
                    {item.skillTitle}
                  </h3>
                  <p className="text-[12px] leading-[1.55] text-[var(--text-default)]">
                    <MathText text={item.hint} />
                  </p>
                  <p className="text-[11px] font-semibold leading-[1.45] text-[var(--text-quiet)]">
                    {item.reason}
                  </p>
                </div>
                <div className="mt-auto flex flex-col items-start gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={item.practiceHref ?? item.fallbackHref}>
                      {item.isPending
                        ? "Продолжить задачу"
                        : item.practiceHref
                          ? "Решить 5 похожих"
                          : "Открыть каталог"}
                    </Link>
                  </Button>
                  {item.taskHref ? (
                    <Link
                      href={item.taskHref}
                      className="rounded-option px-1 text-[12px] font-semibold text-[var(--mode-learn-accent)] transition-colors hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      {item.hasReferenceSolution ? "Открыть решение" : "Открыть тип"}
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3" aria-label="Прогресс по темам">
        <h2 className="type-h2 text-[var(--text-strong)]">
          По темам
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perTopic.map(({ topic, progress: topicProgress }) => {
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const sessions = topicProgress?.completedSessions ?? 0;
            const lastPracticed = formatLastPracticed(
              topicProgress?.lastPracticedAt ?? null,
            );

            return (
              <Card
                key={topic.id}
                variant="semantic"
                className="flex flex-col gap-2.5 !p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-[15px] font-[800] text-[var(--text-strong)]">
                    {topic.title}
                  </h3>
                  <span className="shrink-0 text-[11px] font-semibold text-[var(--text-quiet)]">
                    {solved === 0 ? "ещё не пробовал" : `${correct} из ${solved} сошлись`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 text-[12px] font-semibold leading-[1.5] text-[var(--text-default)]">
                    Решено{" "}
                    <span className="physics-number text-[var(--text-strong)]">{solved}</span>
                    {" · "}
                    <span className="physics-number text-[var(--text-strong)]">{sessions}</span>{" "}
                    трен.
                    {lastPracticed ? (
                      <span className="block text-[var(--text-quiet)]">
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
        id="data-management"
        className="flex flex-col gap-3 rounded-card border border-[var(--border-muted)] bg-[var(--surface-panel)] px-5 py-4"
        aria-label="Управление данными"
      >
        <p className="text-[12px] leading-[1.6] text-[var(--text-default)]">
          Все данные хранятся только в этом браузере и не переносятся сами.
          Файл прогресса пригодится после очистки браузера или на другом устройстве.
        </p>
        <DataTransfer
          suggestBackup={!isFirstVisit}
          backupFingerprint={`${totalSolved}:${totalSessions}:${examLog.length}:${practiceLog.length}`}
        />
        <div className="flex flex-col items-start gap-2 border-t border-[var(--border-muted)] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[11px] leading-[1.5] text-[var(--text-quiet)]">
            Сброс удалит историю из этого браузера без возможности отмены.
            Если она нужна, сначала скачай копию.
          </p>
          <Button size="sm" variant="ghost" className="shrink-0" onClick={handleReset}>
            Сбросить прогресс
          </Button>
        </div>
      </section>
    </div>
  );
}
