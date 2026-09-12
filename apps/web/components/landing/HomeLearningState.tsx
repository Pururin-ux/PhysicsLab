"use client";

import { useStore } from "@nanostores/react";
import { ArrowRight, CheckCircle, ChartLineUp } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLearningNextStep } from "../../lib/learning/next-step";
import { mixedPracticeHrefByTopic } from "../../lib/learning/topic-practice-routes";
import { getLearningDestinationForFamily } from "../../lib/learning/learning-links";
import {
  readActiveQuizSnapshot,
  type ActiveQuizSnapshot,
} from "../../lib/quiz/active-session-snapshot";
import { topics } from "../../lib/topics";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { $appProgress } from "../../lib/stores/progress-store";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";

function getResumeHref(snapshot: ActiveQuizSnapshot) {
  if (snapshot.sessionKind === "diagnostic" && snapshot.template === "exam") {
    return "/practice/diagnostic";
  }

  if (snapshot.sessionKind === "exam" && snapshot.template === "exam") {
    return "/practice/exam-demo";
  }

  const focusedDestination = getLearningDestinationForFamily(snapshot.template);
  if (focusedDestination) {
    return focusedDestination.practiceHref;
  }

  return snapshot.topicId && snapshot.topicId in mixedPracticeHrefByTopic
    ? mixedPracticeHrefByTopic[snapshot.topicId as keyof typeof mixedPracticeHrefByTopic]
    : null;
}

function getResumeStep(snapshot: ActiveQuizSnapshot) {
  const href = getResumeHref(snapshot);
  if (!href) return null;

  const currentTaskNumber = snapshot.session.currentIndex + 1;
  const isExam = snapshot.sessionKind === "exam";
  const isDiagnostic = snapshot.sessionKind === "diagnostic";

  return {
    label: "Продолжить",
    title: `${isExam || isDiagnostic ? "Диагностика" : snapshot.title}: задание\u00a0${currentTaskNumber}\u00a0из\u00a0${snapshot.session.total}`,
    body:
      snapshot.session.phase === "answered"
        ? "Ответ уже сохранён — можно вернуться прямо к разбору."
        : "Незавершённая попытка сохранена в этой вкладке.",
    reason: "Сначала возвращаем точное место остановки, чтобы не терять уже сделанную работу.",
    href,
    cta: isExam || isDiagnostic ? "Продолжить диагностику" : "Продолжить тренировку",
    tone: (isExam ? "gold" : "cyan") as "gold" | "cyan",
    mode: (isExam ? "exam" : "learn") as "exam" | "learn",
  };
}

export function useHomeLearningState() {
  const progress = useStore($appProgress);
  const examLog = useStore($examLog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return useMemo(() => {
    const hasProgress = mounted && Object.values(progress.topics).some(
      (topic) => topic.solved > 0 || topic.completedSessions > 0,
    );
    const bestExam = mounted ? getBestAttempt(examLog) : null;
    const snapshotResult = mounted ? readActiveQuizSnapshot() : null;
    const resumeStep = snapshotResult?.ok ? getResumeStep(snapshotResult.snapshot) : null;
    // Активная попытка и результат диагностики тоже делают человека
    // возвращающимся пользователем, даже если он ещё не закрыл тему в
    // общем прогрессе. Главная не должна показывать ему экран новичка.
    const hasActivity = hasProgress || Boolean(bestExam) || Boolean(resumeStep);
    const nextStep = resumeStep ?? getLearningNextStep(progress, Boolean(bestExam));
    const targetTopic = topics.find((topic) => topic.href === nextStep.href);
    const solved = mounted
      ? Object.values(progress.topics).reduce((sum, topic) => sum + topic.solved, 0)
      : 0;
    const started = mounted
      ? Object.values(progress.topics).filter(
          (topic) => topic.solved > 0 || topic.completedSessions > 0,
        ).length
      : 0;

    return {
      hasProgress,
      hasActivity,
      nextStep,
      solved,
      started,
      // Новичку следующий шаг подбирает next-step (диагностика из 10 задач);
      // продолжающему — его текущая тема.
      primaryLabel: hasActivity
        ? targetTopic
          ? `Продолжить: ${targetTopic.title}`
          : nextStep.cta
        : nextStep.cta,
      primaryHref: nextStep.href,
    };
  }, [examLog, mounted, progress]);
}

export function HomePrimaryAction() {
  const state = useHomeLearningState();

  return (
    <Button asChild size="lg" className="w-auto gap-2 px-7">
      <Link href={state.primaryHref}>
        {state.primaryLabel}
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </Link>
    </Button>
  );
}

export function HomeNextStep() {
  const state = useHomeLearningState();
  const routeProgress = Math.round((state.started / topics.length) * 100);

  return (
    <div className="relative overflow-hidden rounded-card border border-white/[.12] bg-space-900 p-4 shadow-[0_26px_60px_rgba(0,0,0,.34)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[.08] pb-5">
        <div className="max-w-[620px]">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-mode-learn">
            {state.nextStep.label}
          </p>
          <h3 className="mt-2 text-[22px] font-[800] text-white">
            {state.nextStep.title}
          </h3>
          <p className="mt-1 text-[13px] leading-[1.6] text-white/60">
            <MathText text={state.nextStep.body} />
          </p>
          <p className="mt-2 text-[12px] leading-[1.55] text-white/50">
            Почему сейчас: {state.nextStep.reason}
          </p>
        </div>
        <span className="rounded-full border border-white/[.1] px-3 py-1.5 text-[12px] font-bold text-white/58">
          {state.hasActivity ? "Продолжить" : "Диагностика"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[16px] border border-white/[.09] bg-space-950/52 p-4">
          <div className="flex items-center gap-2 text-[13px] font-bold text-white/68">
            <CheckCircle size={18} weight="duotone" className="text-nova-cyan" />
            Решено задач
          </div>
          <p className="mt-4 text-[42px] font-[800] leading-none text-white">{state.solved}</p>
        </div>
        <div className="rounded-[16px] border border-white/[.09] bg-space-950/52 p-4">
          <div className="flex items-center gap-2 text-[13px] font-bold text-white/68">
            <ChartLineUp size={18} weight="duotone" className="text-mode-learn" />
            Темы начаты
          </div>
          <p className="mt-4 text-[42px] font-[800] leading-none text-white">
            {state.started}<span className="text-[20px] text-white/36"> / {topics.length}</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[.07]">
            <div className="h-full rounded-full bg-nova-cyan" style={{ width: `${routeProgress}%` }} />
          </div>
        </div>
      </div>

      <Button asChild className="mt-4 w-full gap-2 sm:w-auto">
        <Link href={state.primaryHref}>
          {state.primaryLabel}
          <ArrowRight size={17} weight="bold" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
