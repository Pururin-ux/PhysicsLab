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
import { MathText } from "../ui/MathText";

// Шаблон смешанной тренировки по разделу живёт на своей страницеpractice;
// одиночные шаблоны — на странице серии из пяти задач.
const mixRoutes: Record<string, string> = {
  mixed: "/practice/kinematics-demo",
  "dynamics-mixed": "/practice/dynamics-demo",
  "electro-mixed": "/practice/electro-demo",
  "thermo-mixed": "/practice/thermo-demo",
  "optics-mixed": "/practice/optics-demo",
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

// Серверный (и первый клиентский) рендер — онбординг: он же полезен
// поиску и первому визиту. После монтирования, когда localStorage прочитан,
// компонент сам заменяет онбординг на дашборд — данные в effect, поэтому
// расхождения гидрации нет.

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

  if (!mounted) {
    return <StartHere />;
  }

  const hasHistory = totals.solved > 0 || xp > 0 || examLog.length > 0;

  // Первый визит: вместо пустых цифр показываем, с чего начать.
  if (!hasHistory) {
    return <StartHere />;
  }

  const bestExam = getBestAttempt(examLog);
  const review = buildReviewDashboard(progress);
  const nextStep = getLearningNextStep(progress, Boolean(bestExam));
  const streak = calcStreak(practiceLog, today);
  const last14 = getLastDays(practiceLog, today, 14);
  const accuracy = totals.solved > 0 ? Math.round((totals.correct / totals.solved) * 100) : null;
  const startedTopics = topics.filter((topic) => (progress.topics[topic.id]?.solved ?? 0) > 0);

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Сводка дня">
        <Card className="flex flex-col gap-5 !p-5 md:!p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-cyan/80">
                Сегодня
              </p>
              <h2 className="text-[22px] font-[800] leading-tight text-white">
                {streak > 1 ? `${streak} ${pluralDays(streak)} подряд` : "Пора вернуться к задачам"}
              </h2>
              <p className="text-[13px] leading-[1.6] text-white/60">
                {streak > 1
                  ? "Серия держится, пока день заканчивается хотя бы одной тренировкой."
                  : "Одна тренировка в день — и серия снова растёт."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="gold">{xp} XP</Badge>
              <Link
                href="/profile"
                className="rounded-option px-1 text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
              >
                Весь прогресс
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">Решено</dt>
              <dd className="physics-number mt-1 text-[22px] font-bold leading-none text-white">
                {totals.solved}
              </dd>
            </div>
            <div className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">Точность</dt>
              <dd className="physics-number mt-1 text-[22px] font-bold leading-none text-white">
                {accuracy === null ? "—" : `${accuracy}%`}
              </dd>
            </div>
            <div className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">Тренировок</dt>
              <dd className="physics-number mt-1 text-[22px] font-bold leading-none text-white">
                {totals.sessions}
              </dd>
            </div>
            <div className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-[.1em] text-white/45">Слабых мест</dt>
              <dd
                className={`physics-number mt-1 text-[22px] font-bold leading-none ${
                  totals.traps > 0 ? "text-nova-gold" : "text-white"
                }`}
              >
                {totals.traps}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/45">
              Последние 14 дней
            </p>
            <div className="flex gap-1.5" aria-hidden="true">
              {last14.map((day) => (
                <span
                  key={day.key}
                  className={`h-2.5 flex-1 rounded-full ${
                    day.practiced ? "bg-nova-cyan" : "bg-white/[.08]"
                  }`}
                />
              ))}
            </div>
            <p className="sr-only">
              Занятий за последние 14 дней: {last14.filter((day) => day.practiced).length}
            </p>
          </div>
        </Card>
      </section>

      {snapshot ? (
        <section aria-labelledby="resume-title">
          <Card className="flex flex-col gap-4 border-nova-cyan/25 bg-nova-cyan/[.045] !p-5 sm:flex-row sm:items-center sm:justify-between md:!p-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-cyan/80">
                Незавершённая тренировка
              </p>
              <h2 id="resume-title" className="text-[18px] font-[800] leading-snug text-white">
                {snapshot.title}
              </h2>
              <p className="text-[13px] leading-[1.6] text-white/65">
                Остановился на задании {snapshot.session.currentIndex + 1} из {snapshot.session.total} —
                ответы сохранены, можно продолжить.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={resumeHref(snapshot)}>Продолжить</Link>
            </Button>
          </Card>
        </section>
      ) : null}

      <section aria-labelledby="next-step-title">
        <Card
          className={`flex flex-col gap-4 !p-5 md:!p-6 ${
            nextStep.tone === "gold"
              ? "border-nova-gold/25 bg-nova-gold/[.05]"
              : "border-nova-cyan/22 bg-nova-cyan/[.04]"
          }`}
        >
          <div className="flex flex-col gap-2">
            <p
              className={`text-[11px] font-bold uppercase tracking-[.14em] ${
                nextStep.tone === "gold" ? "text-nova-gold/80" : "text-nova-cyan/80"
              }`}
            >
              {nextStep.label}
            </p>
            <h2 id="next-step-title" className="text-[20px] font-[800] leading-tight text-white">
              {nextStep.title}
            </h2>
            <p className="max-w-[640px] text-[13px] leading-[1.65] text-white/68">
              <MathText text={nextStep.body} />
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className={
              nextStep.tone === "gold"
                ? "w-fit border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
                : "w-fit"
            }
          >
            <Link href={nextStep.href}>{nextStep.cta}</Link>
          </Button>
        </Card>
      </section>

      <section aria-labelledby="topics-progress-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="topics-progress-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
            Темы
          </h2>
          <Link
            href="/topics"
            className="rounded-option text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            Все уроки
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);
            const topicProgress = progress.topics[topic.id];
            const solved = topicProgress?.solved ?? 0;
            const correct = topicProgress?.correct ?? 0;
            const topicAccuracy = solved > 0 ? Math.round((correct / solved) * 100) : null;

            return (
              <Card key={topic.id} className="flex flex-col gap-3 border-white/[.08] !p-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-option border ${accent.tile}`}>
                    <TopicGlyph topic={topic.id} className="h-6 w-6" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/topics/${topic.id}`}
                      className="truncate rounded-option text-[15px] font-[800] text-white transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                    >
                      {topic.title}
                    </Link>
                    <p className="text-[12px] font-semibold text-white/55">
                      {solved > 0 ? (
                        <>
                          <span className="physics-number">{solved}</span> решено
                          {topicAccuracy !== null ? (
                            <>
                              {" · "}
                              <span className="physics-number">{topicAccuracy}%</span> верно
                            </>
                          ) : null}
                        </>
                      ) : (
                        "ещё не начато"
                      )}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost" className="shrink-0">
                    <Link href={topic.href}>10 задач</Link>
                  </Button>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[.06]">
                  <div
                    className={`h-full rounded-full ${accent.bar}`}
                    style={{ width: `${topicAccuracy ?? 0}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="review-title" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="review-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
              Что повторить
            </h2>
            <Link
              href="/mistakes"
              className="rounded-option text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
            >
              Все ошибки
            </Link>
          </div>

          <Card className="flex flex-col gap-3 border-white/[.08] !p-4">
            {review.plan.length === 0 ? (
              <p className="text-[13px] leading-[1.65] text-white/60">
                {totals.solved > 0
                  ? "Повторяющихся ловушек пока нет: после нескольких тренировок здесь появится очередь возврата."
                  : "Реши первую тренировку — после неё ошибки превратятся в план повторения."}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {review.plan.slice(0, 3).map((item) => (
                  <li key={item.key} className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={item.urgency === "today" ? "gold" : "cyan"}>{item.dueLabel}</Badge>
                      <span className="text-[13px] font-[800] text-white">{item.skillTitle}</span>
                    </div>
                    <p className="text-[12px] leading-[1.55] text-white/58">
                      <MathText text={item.hint} />
                    </p>
                    {item.practiceHref ? (
                      <Link
                        href={item.practiceHref}
                        className="w-fit rounded-option text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                      >
                        Решить 5 похожих
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section aria-labelledby="exam-title" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="exam-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
              Диагностика
            </h2>
            <Link
              href="/formulas"
              className="rounded-option text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
            >
              Справочник формул
            </Link>
          </div>

          <Card className="flex flex-col gap-3 border-white/[.08] !p-4">
            <p className="text-[13px] leading-[1.65] text-white/62">
              10 задач по пяти открытым темам вперемешку. Результат показывает не балл на
              экзамене, а то, какие навыки держатся без подсказок.
            </p>
            <p className="text-[13px] font-semibold text-white/70">
              {bestExam ? (
                <>
                  Лучший результат:{" "}
                  <span className="physics-number text-nova-cyan">
                    {bestExam.score}/{bestExam.total}
                  </span>{" "}
                  · попыток: <span className="physics-number">{examLog.length}</span>
                </>
              ) : startedTopics.length > 0 ? (
                "Диагностика ещё не пройдена — самое время проверить себя вперемешку."
              ) : (
                "Сначала пройди урок темы, потом приходи за проверкой."
              )}
            </p>
            <Button asChild size="sm" className="w-fit">
              <Link href="/exam">{bestExam ? "Пройти снова" : "Пройти диагностику"}</Link>
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
