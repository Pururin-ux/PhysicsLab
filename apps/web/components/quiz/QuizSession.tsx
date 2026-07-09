"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CoachBubble } from "../coach/CoachBubble";
import { useCoach } from "../coach/useCoach";
import { AnswerFeedback } from "./AnswerFeedback";
import { OptionList } from "./OptionList";
import { QuestionCard } from "./QuestionCard";
import { SessionSummary } from "./SessionSummary";
import { useGeneratedQuizData } from "./useGeneratedQuizData";
import {
  $quizSession,
  answerCurrentTask,
  moveToNextTask,
  resetQuizSession,
  restartQuizSession,
  type QuizData,
} from "./quiz-session-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { getTaskFocus } from "../../lib/learning/task-focus";
import {
  getHelpTargetForMistake,
  getHelpTargetForTask,
  type HelpTarget,
} from "../../lib/learning/topic-help";
import type { TopicId } from "../../lib/stores/progress-store";
import { addXP, resetSessionProgress } from "../../lib/stores/session-store";
import { useSessionRecording } from "./useSessionRecording";
import kinematicsData from "../../content/tasks/kinematics-10.json";

interface QuizSessionProps {
  data?: QuizData;
  mode?: "static" | "generated";
  generatedTemplate?: string;
  generatedTopic?: string;
  generatedTitle?: string;
  topicId?: TopicId;
  // "exam" пишет результат в журнал пробных вариантов и слабые места тем,
  // не увеличивая счётчик тренировок темы.
  sessionKind?: "practice" | "exam";
  onHelpTargetChange?: (target: HelpTarget) => void;
  onOpenHelpTarget?: (target: HelpTarget) => void;
  suppressCoachBubble?: boolean;
}

const nextStepByTopic: Record<string, { href: string; label: string }> = {
  kinematics: { href: "/practice/dynamics-demo", label: "Дальше: Динамика" },
  dynamics: { href: "/practice/exam-demo", label: "Дальше: Пробный вариант" },
  electrodynamics: { href: "/practice/thermo-demo", label: "Дальше: Термодинамика" },
  thermodynamics: { href: "/topics", label: "К темам" },
};

const defaultQuizData = kinematicsData as QuizData;
const emptyTasks: QuizData["tasks"] = [];

export function QuizSession({
  data = defaultQuizData,
  mode = "static",
  generatedTemplate = "free-fall",
  generatedTopic = "Кинематика",
  generatedTitle = "Задачи",
  topicId,
  sessionKind = "practice",
  onHelpTargetChange,
  onOpenHelpTarget,
  suppressCoachBubble = false,
}: QuizSessionProps) {
  const session = useStore($quizSession);
  const [generatedBatch, setGeneratedBatch] = useState(0);
  const {
    data: generatedData,
    error: generatedError,
    status: generatedStatus,
  } = useGeneratedQuizData({
    enabled: mode === "generated",
    template: generatedTemplate,
    topic: generatedTopic,
    title: generatedTitle,
    batch: generatedBatch,
  });
  const {
    bubble,
    emitCoachEvent,
    startPauseTimer,
    clearPauseTimer,
    hideCoach,
  } = useCoach();
  const sessionStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { recordSessionResult, resetRecording } = useSessionRecording({
    sessionKind,
    topicId,
  });
  const reactionRef = useRef<HTMLDivElement>(null);
  const activeData = mode === "generated" ? generatedData : data;
  const tasks = activeData?.tasks ?? emptyTasks;
  const currentTask = tasks[session.currentIndex];
  const isLastTask = session.currentIndex >= session.total - 1;
  const progressLabel = `${Math.min(session.currentIndex + 1, session.total)} / ${session.total}`;
  const currentHelpTarget = useMemo(
    () => (currentTask ? getHelpTargetForTask(currentTask, topicId) : null),
    [currentTask, topicId],
  );

  const weakTraps = useMemo(
    () =>
      session.answers
        .filter((answer) => !answer.isCorrect)
        .map((answer) => answer.selectedMisconception || answer.taskTrap)
        .filter((trap) => trap.length > 0),
    [session.answers],
  );

  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    resetSessionProgress();
    resetQuizSession(tasks.length);
    resetRecording();

    if (sessionStartTimerRef.current) {
      clearTimeout(sessionStartTimerRef.current);
    }

    sessionStartTimerRef.current = setTimeout(() => {
      emitCoachEvent({ type: "session_start" });
    }, 1200);

    if (tasks[0]) {
      startPauseTimer(tasks[0].coach_lines);
    }

    return () => {
      if (sessionStartTimerRef.current) {
        clearTimeout(sessionStartTimerRef.current);
        sessionStartTimerRef.current = null;
      }
      clearPauseTimer();
    };
  }, [clearPauseTimer, emitCoachEvent, resetRecording, startPauseTimer, tasks]);

  useEffect(() => {
    if (currentHelpTarget) {
      onHelpTargetChange?.(currentHelpTarget);
    }
  }, [currentHelpTarget, onHelpTargetChange]);

  // После ответа не двигаем страницу без необходимости: на desktop контекст
  // выбранного варианта важнее автоскролла, на mobile мягко подводим feedback
  // только если он оказался ниже видимой области.
  useEffect(() => {
    if (session.phase !== "answered") {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const reaction = reactionRef.current;
      if (!reaction) return;

      const rect = reaction.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
      if (isVisible) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile && rect.top > viewportHeight) {
        reaction.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [session.phase, session.currentIndex]);

  function handleAnswer(optionId: string) {
    if (!currentTask || session.phase !== "active") return;

    const result = answerCurrentTask(currentTask, optionId);
    if (!result) return;

    clearPauseTimer();
    hideCoach();

    if (result.isCorrect) {
      addXP(10);
      emitCoachEvent(
        {
          type: "correct_answer",
          streak: result.streak,
          taskId: currentTask.id,
        },
        currentTask.coach_lines,
      );
    } else {
      const selectedOption = currentTask.options.find(
        (option) => option.id === optionId,
      );
      const taskFocus = getTaskFocus(currentTask);
      const selectedMisconception = selectedOption?.misconception?.trim();

      addXP(0);
      emitCoachEvent(
        {
          type: "wrong_answer",
          attempt: result.attempt,
          taskId: currentTask.id,
        },
        {
          ...currentTask.coach_lines,
          // Называем конкретную ошибку выбранного варианта прямой речью;
          // без варианта-приманки берём авторскую реплику задачи (она уже
          // конкретна и с числами).
          wrong: selectedMisconception
            ? `Похоже, ты ${selectedMisconception}.`
            : currentTask.coach_lines.wrong,
          hint: taskFocus.check,
        },
      );
    }
  }

  function handleNext() {
    if (!currentTask || session.phase !== "answered") return;

    hideCoach();

    if (isLastTask) {
      recordSessionResult(session);
    }

    const nextIndex = session.currentIndex + 1;
    const moved = moveToNextTask();
    if (!moved) return;

    if (isLastTask) {
      clearPauseTimer();
      emitCoachEvent({
        type: "session_end",
        score: $quizSession.get().score,
        total: session.total,
      });
      return;
    }

    const nextTask = tasks[nextIndex];
    if (nextTask) {
      startPauseTimer(nextTask.coach_lines);
    }
  }

  function handleRestart() {
    resetRecording();

    if (mode === "generated") {
      resetSessionProgress();
      hideCoach();
      setGeneratedBatch((current) => current + 1);
      return;
    }

    resetSessionProgress();
    restartQuizSession();
    hideCoach();
    if (tasks[0]) {
      startPauseTimer(tasks[0].coach_lines);
    }
  }

  if (session.phase === "completed") {
    const nextStep =
      sessionKind === "exam"
        ? { href: "/topics", label: "К темам" }
        : topicId
          ? nextStepByTopic[topicId]
          : undefined;

    return (
      <SessionSummary
        score={session.score}
        total={session.total}
        weakTraps={weakTraps}
        onRestart={handleRestart}
        restartLabel={
          sessionKind === "exam"
            ? "Новый вариант"
            : mode === "generated"
              ? "Ещё 10 задач"
              : undefined
        }
        topic={activeData?.topic}
        nextHref={nextStep?.href}
        nextLabel={nextStep?.label}
      />
    );
  }

  if (mode === "generated" && generatedStatus === "loading") {
    return (
      <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8">
        <Card className="flex flex-col gap-3">
          <Badge tone="cyan">{generatedTitle}</Badge>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            Готовлю новый набор задач…
          </p>
        </Card>
      </section>
    );
  }

  if (mode === "generated" && generatedStatus === "error") {
    return (
      <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8">
        <Card className="flex flex-col gap-4">
          <Badge tone="gold">Не удалось загрузить задачи</Badge>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            {generatedError}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setGeneratedBatch((current) => current + 1)}
          >
            Попробовать ещё раз
          </Button>
        </Card>
      </section>
    );
  }

  if (!currentTask) return null;

  const taskFocus = getTaskFocus(currentTask);
  const latestAnswer = session.answers.at(-1);
  const answerHelpTarget =
    latestAnswer && currentTask
      ? getHelpTargetForMistake(
          currentTask,
          latestAnswer.selectedMisconception || latestAnswer.taskTrap,
          topicId,
        )
      : currentHelpTarget;

  return (
    <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8">
      <div className="flex items-center justify-between gap-3">
        <Badge>{progressLabel}</Badge>
        {session.streak > 0 ? (
          <span className="text-[12px] font-semibold text-nova-cyan/80">
            Серия: {session.streak}
          </span>
        ) : null}
      </div>

      <QuestionCard
        type={currentTask.type}
        difficulty={currentTask.difficulty}
        text={currentTask.text}
        graph={currentTask.graph}
        diagram={currentTask.diagram}
        // «Сейчас тренируем» — приминг перед ответом; после ответа его
        // работа сделана, и он лишь конкурирует с разбором за внимание.
        focus={session.phase === "answered" ? undefined : taskFocus}
        showSolutionContent={session.phase === "answered"}
      />

      <OptionList
        task={currentTask}
        options={currentTask.options}
        session={session}
        onSelect={handleAnswer}
      />

      {/* Пока ученик решает — Nova подсказывает плавающим баблом. После
          ответа её голос переезжает в карточку разбора (один голос, одна
          фокусная точка), поэтому здесь бабл скрываем. */}
      {session.phase !== "answered" && !suppressCoachBubble ? (
        <CoachBubble state={bubble.state} text={bubble.text} visible={bubble.visible} />
      ) : null}

      {session.phase === "answered" ? (
        <div ref={reactionRef} className="flex flex-col gap-4 scroll-mt-6">
          <AnswerFeedback
            isCorrect={session.answers.at(-1)?.isCorrect ?? false}
            novaState={bubble.state}
            novaText={bubble.text}
            explanation={currentTask.explanation}
            explanationLatex={currentTask.explanation_latex}
            helpTarget={answerHelpTarget ?? undefined}
            onOpenHelp={
              answerHelpTarget && onOpenHelpTarget
                ? () => onOpenHelpTarget(answerHelpTarget)
                : undefined
            }
          />

          <Button type="button" size="lg" data-testid="next-task-button" onClick={handleNext}>
            {isLastTask ? "Показать итог" : "Следующая задача"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
