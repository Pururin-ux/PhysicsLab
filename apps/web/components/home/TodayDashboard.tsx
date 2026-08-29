"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildReviewDashboard } from "../../lib/learning/review-intelligence";
import { getLearningNextStep } from "../../lib/learning/next-step";
import type { ActiveQuizSnapshot } from "../../lib/quiz/active-session-snapshot";
import { readActiveQuizSnapshot } from "../../lib/quiz/active-session-snapshot";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { $practiceLog, calcStreak, getLastDays, toDayKey } from "../../lib/stores/practice-log-store";
import { $appProgress } from "../../lib/stores/progress-store";
import { $xp } from "../../lib/stores/session-store";
import { topics } from "../../lib/topics";
import { StartHere } from "./StartHere";
import { getTopicAccent } from "../topics/topic-accents";
import { TopicGlyph } from "../topics/TopicGlyph";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionHeading } from "../ui/SectionHeading";
import { StatTile } from "../ui/StatTile";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

// Шаблон смешанной тренировки по разделу живёт на своей странице;
// одиночные шаблоны — на странице серии из пяти задач.
const mixRoutes: Record<string, string> = {
  mixed: "/practice/kinematics-demo",
  "dynamics-mixed": "/practice/dynamics-demo",
  "electro-mixed": "/practice/electro-demo",
  "thermo-mixed": "/practice/thermo-demo",
  "optics-mixed": "/practice/optics-demo",
  "oscillations-mixed": "/practice/oscillations-demo",
  "quantum-mixed": "/practice/quantum-demo",
};

function resumeHref(snapshot: ActiveQuizSnapshot): string {
  if (snapshot.sessionKind === "exam" || snapshot.template === "exam") {
    return "/exam";
  }

  return mixRoutes[snapshot.template] ?? `/practice/family/${snapshot.template}`;
}

function pluralDays(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "дней";
  if (mod10 === 1) return "день";
  if (mod10 >= 2 && mod10 <= 4) return "дня";
  return "дней";
}

export function TodayDashboard() {
  const progress = useStore($appProgress);
  const xp = useStore($xp);
  const practiceLog = useStore($practiceLog);
  const examLog = useStore($examLog);
  const [mounted, setMounted] = useState(false);
  const [snapshot, setSnapshot] = useState<ActiveQuizSnapshot | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    setMounted(true);
    setToday(toDayKey(new Date()));
    const result = readActiveQuizSnapshot();
    setSnapshot(result.ok ? result.snapshot : null);
  }, []);

  const totals = useMemo(() => {
    const solved = topics.reduce((sum, topic) => sum + (progress.topics[topic.id]?.solved ?? 0), 0);
    const correct = topics.reduce((sum, topic) => sum + (progress.topics[topic.id]?.correct ?? 0), 0);
    const sessions = topics.reduce(
      (sum, topic) => sum + (progress.topics[topic.id]?.completedSessions ?? 0),
      0,
    );
    const traps = topics.reduce(
      (sum, topic) => sum + Object.keys(progress.topics[topic.id]?.weakTraps ?? {}).length,
      0,
    );

    return { solved, correct, sessions, traps };
  }, [progress]);

  // Серверный (и первый клиентский) рендер — онбординг: он же полезен
  // поиску и первому визиту. После монтирования, когда localStorage прочитан,
  // компонент сам заменяет онбординг на дашборд — данные в effect, поэтому
  // расхождения гидрации нет.
  if (!mounted) {
    return <StartHere />;
  }

  const hasHistory = totals.solved > 0 || xp > 0 || examLog.length > 0;

  if (!hasHistory) {
    return <StartHere />;
  }

  const bestExam = getBestAttempt(examLog);
  const review = buildReviewDashboard(progress);
  const nextStep = getLearningNextStep(progress, Boolean(bestExam));
  const streak = calcStreak(practiceLog, today);
  const last14 = getLastDays(practiceLog, today, 14);
  const accuracy = totals.solved > 0 ? Math.round((totals.correct / totals.solved) * 100) : null;
  const activeDays = last14.filter((day) => day.practiced).length;

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Сводка дня" className="pl-rise">
        <Card variant="raised" padding="lg" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="pl-eyebrow text-nova-cyan/80">Сегодня</p>
              <h2 className="pl-h2">
                {streak > 1 ? `${streak} ${pluralDays(streak)} подряд` : "Пора вернуться к задачам"}
              </h2>
              <p className="text-[13px] leading-[1.6] text-ink-soft">
                {streak > 1
                  ? "Серия держится, пока каждый день заканчивается хотя бы одной тренировкой."
                  : "Одна тренировка в день — и серия снова растёт."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="gold" dot>
                {xp} XP
              </Badge>
              <Link href="/profile" className="pl-link text-[13px]">
                Весь прогресс
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Решено" value={totals.solved} />
            <StatTile label="Точность" value={accuracy === null ? "—" : `${accuracy}%`} />
            <StatTile label="Тренировок" value={totals.sessions} />
            <StatTile
              label="Слабых мест"
              value={totals.traps}
              tone={totals.traps > 0 ? "gold" : "neutral"}
            />
          </div>

          <div className="flex flex-col gap-2.5 border-t border-line-subtle pt-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="pl-eyebrow">Последние 14 дней</p>
              <p className="text-caption font-semibold text-ink-soft">
                занятий: <span className="physics-number text-white">{activeDays}</span> из 14
              </p>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {last14.map((day) => (
                <span
                  key={day.key}
                  className={cn(
                    "h-7 flex-1 rounded-[5px] border transition-colors",
                    day.practiced
                      ? "border-nova-cyan/40 bg-nova-cyan/70"
                      : "border-line-subtle bg-white/[.03]",
                  )}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-5">
          {snapshot ? (
            <Card
              padding="md"
              className="flex flex-col gap-4 border-nova-cyan/30 bg-nova-cyan/[.05] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="pl-eyebrow text-nova-cyan/85">Незавершённая тренировка</p>
                <h3 className="pl-h3 truncate">{snapshot.title}</h3>
                <p className="text-[13px] leading-[1.6] text-ink-muted">
                  Остановился на задании {snapshot.session.currentIndex + 1} из{" "}
                  {snapshot.session.total} — ответы сохранены.
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href={resumeHref(snapshot)}>Продолжить</Link>
              </Button>
            </Card>
          ) : null}

          <Card
            padding="lg"
            className={cn(
              "flex flex-col gap-5",
              nextStep.tone === "gold"
                ? "border-nova-gold/30 bg-nova-gold/[.05]"
                : "border-nova-cyan/25 bg-nova-cyan/[.04]",
            )}
            aria-labelledby="next-step-title"
          >
            <div className="flex flex-col gap-2">
              <p
                className={cn(
                  "pl-eyebrow",
                  nextStep.tone === "gold" ? "text-nova-gold/85" : "text-nova-cyan/85",
                )}
              >
                {nextStep.label}
              </p>
              <h2 id="next-step-title" className="pl-h2">
                {nextStep.title}
              </h2>
              <p className="pl-body max-w-[60ch] text-[14px]">
                <MathText text={nextStep.body} />
              </p>
            </div>
            <Button
              asChild
              variant={nextStep.tone === "gold" ? "gold" : "primary"}
              className="w-fit"
            >
              <Link href={nextStep.href}>{nextStep.cta}</Link>
            </Button>
          </Card>
        </div>

        <Card padding="lg" className="flex flex-col gap-4" aria-labelledby="review-title">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="pl-eyebrow">Повторение</p>
              <h2 id="review-title" className="pl-h3">
                {review.plan.length === 0
                  ? "Ловушек пока нет"
                  : `${review.dueToday} сегодня · ${review.nextSession} дальше`}
              </h2>
            </div>
            <Link href="/mistakes" className="pl-link shrink-0 text-[13px]">
              Все
            </Link>
          </div>

          {review.plan.length === 0 ? (
            <p className="text-[13px] leading-[1.65] text-ink-muted">
              {totals.solved > 0
                ? "Повторяющихся ловушек пока нет: после нескольких тренировок здесь появится очередь возврата."
                : "Реши первую тренировку — после неё ошибки превратятся в план повторения."}
            </p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {review.plan.slice(0, 3).map((item) => (
                <li key={item.key} className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      size="sm"
                      dot
                      tone={item.urgency === "today" ? "gold" : "cyan"}
                    >
                      {item.dueLabel}
                    </Badge>
                    <span className="text-[13px] font-bold text-white">{item.skillTitle}</span>
                  </div>
                  <p className="text-[12px] leading-[1.6] text-ink-soft">
                    <MathText text={item.hint} />
                  </p>
                  {item.practiceHref ? (
                    <Link href={item.practiceHref} className="pl-link w-fit text-[12px]">
                      Решить 5 похожих
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <section aria-labelledby="topics-progress-title" className="flex flex-col gap-4">
        <SectionHeading
          id="topics-progress-title"
          eyebrow="Прогресс"
          title="Темы"
          description="Точность считается по решённым задачам темы: полоса растёт вместе с ней."
          actions={
            <Link href="/topics" className="pl-link text-[13px]">
              Все уроки
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);
            const topicProgress = progress.topics[topic.id];
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const topicAccuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;

            return (
              <Card key={topic.id} padding="sm" interactive className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-option border",
                      accent.tile,
                    )}
                  >
                    <TopicGlyph topic={topic.id} className="h-6 w-6" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/topics/${topic.id}`}
                      className="pl-focus truncate rounded-option text-[15px] font-[800] text-white transition-colors hover:text-nova-cyan"
                    >
                      {topic.title}
                    </Link>
                    <p className="text-caption font-semibold text-ink-soft">
                      {solved > 0 ? (
                        <>
                          <span className="physics-number text-white/85">{solved}</span> решено ·{" "}
                          <span className="physics-number text-white/85">{topicAccuracy}%</span>{" "}
                          верно
                        </>
                      ) : (
                        "ещё не начато"
                      )}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="secondary" className="shrink-0">
                    <Link href={topic.href}>10 задач</Link>
                  </Button>
                </div>
                <ProgressBar
                  value={topicAccuracy}
                  size="sm"
                  tone={accent.badge === "neutral" ? "neutral" : accent.badge}
                  label={`Точность по теме ${topic.title}`}
                />
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="exam-title" className="flex flex-col gap-4">
        <SectionHeading
          id="exam-title"
          eyebrow="Проверка"
          title="Диагностика"
          description="10 задач по пяти открытым темам вперемешку. Результат показывает не балл на экзамене, а то, какие навыки держатся без подсказок."
          actions={
            <Button asChild variant={bestExam ? "secondary" : "gold"} size="sm">
              <Link href="/exam">{bestExam ? "Пройти снова" : "Пройти диагностику"}</Link>
            </Button>
          }
        />

        <Card padding="md" className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex flex-col gap-0.5">
            <p className="pl-eyebrow">Лучший результат</p>
            <p className="physics-number text-[22px] font-bold leading-none text-nova-cyan">
              {bestExam ? `${bestExam.score}/${bestExam.total}` : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="pl-eyebrow">Попыток</p>
            <p className="physics-number text-[22px] font-bold leading-none text-white">
              {examLog.length}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="pl-eyebrow">Слабых мест</p>
            <p className="physics-number text-[22px] font-bold leading-none text-white">
              {review.totalWeaknesses}
            </p>
          </div>
          <Link href="/formulas" className="pl-link ml-auto text-[13px]">
            Справочник формул
          </Link>
        </Card>
      </section>
    </div>
  );
}
