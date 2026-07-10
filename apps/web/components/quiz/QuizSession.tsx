"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CoachBubble } from "../coach/CoachBubble";
import { useCoach } from "../coach/useCoach";
import { AnswerFeedback } from "./AnswerFeedback";
import { NumericAnswerInput } from "./NumericAnswerInput";
import { OptionList } from "./OptionList";
import { QuestionCard } from "./QuestionCard";
import { SessionSummary } from "./SessionSummary";
import { useGeneratedQuizData } from "./useGeneratedQuizData";
import {
  $quizSession,
  answerCurrentNumericTask,
  answerCurrentTask,
  moveToNextTask,
  resetQuizSession,
  type AnswerResult,
  type QuizData,
  type QuizTask,
} from "./quiz-session-store";
import {
  formatNumericValue,
} from "../../lib/answer/numeric-answer";
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

interface QuizSessionProps {
  generatedTemplate: string;
  generatedTopic: string;
  generatedTitle: string;
  topicId?: TopicId;
  // "exam" пишет результат в журнал смешанных тренировок и слабые места тем,
  // не увеличивая счётчик тренировок темы.
  sessionKind?: "practice" | "exam";
  onHelpTargetChange?: (target: HelpTarget) => void;
  onOpenHelpTarget?: (target: HelpTarget) => void;
  suppressCoachBubble?: boolean;
}

const nextStepByTopic: Record<string, { href: string; label: string }> = {
  kinematics: { href: "/practice/dynamics-demo", label: "Дальше: Динамика" },
  dynamics: { href: "/practice/exam-demo", label: "Дальше: смешанная тренировка" },
  electrodynamics: { href: "/practice/thermo-demo", label: "Дальше: Термодинамика" },
  thermodynamics: { href: "/practice/optics-demo", label: "Дальше: Оптика" },
  optics: { href: "/practice/exam-demo", label: "Дальше: смешанная тренировка" },
};

const emptyTasks: QuizData["tasks"] = [];

export function QuizSession({
  generatedTemplate,
  generatedTopic,
  generatedTitle,
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
    enabled: true,
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
  const activeData = generatedData;
  const tasks = activeData?.tasks ?? emptyTasks;
  const currentTask = tasks[session.currentIndex];
  const latestAnswer = session.answers.at(-1);
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

      if (latestAnswer?.format === "numeric_input") {
        reaction
          .querySelector<HTMLButtonElement>('[data-testid="next-task-button"]')
          ?.focus({ preventScroll: true });
      }

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
  }, [latestAnswer?.format, session.phase, session.currentIndex]);

  // Общая реакция на любой ответ (single_choice и numeric): Nova либо хвалит,
  // либо называет конкретную ошибку прямой речью. selectedMisconception уже
  // определён вызывающим кодом по формату ответа.
  function reactToAnswer(
    task: QuizTask,
    result: AnswerResult,
    selectedMisconception: string | undefined,
  ) {
    clearPauseTimer();
    hideCoach();

    if (result.isCorrect) {
      addXP(10);
      emitCoachEvent(
        {
          type: "correct_answer",
          streak: result.streak,
          taskId: task.id,
        },
        task.coach_lines,
      );
      return;
    }

    const taskFocus = getTaskFocus(task);

    addXP(0);
    emitCoachEvent(
      {
        type: "wrong_answer",
        attempt: result.attempt,
        taskId: task.id,
      },
      {
        ...task.coach_lines,
        // Называем конкретную ошибку прямой речью; без определённого
        // misconception берём авторскую реплику задачи (она уже конкретна).
        wrong: selectedMisconception
          ? `Похоже, ты ${selectedMisconception}.`
          : task.coach_lines.wrong,
        hint: taskFocus.check,
      },
    );
  }

  function handleAnswer(optionId: string) {
    if (!currentTask || currentTask.type !== "single_choice") return;
    if (session.phase !== "active") return;

    const result = answerCurrentTask(currentTask, optionId);
    if (!result) return;

    const selectedOption = currentTask.options.find(
      (option) => option.id === optionId,
    );

    reactToAnswer(currentTask, result, selectedOption?.misconception?.trim());
  }

  function handleNumericSubmit(raw: string) {
    if (!currentTask || currentTask.type !== "numeric_input") return;
    if (session.phase !== "active") return;

    const result = answerCurrentNumericTask(currentTask, raw);
    if (!result) return;

    // Misconception по значению уже вычислен в сторе и лежит в записи ответа.
    const selectedMisconception = $quizSession
      .get()
      .answers.at(-1)?.selectedMisconception;

    reactToAnswer(currentTask, result, selectedMisconception);
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
    resetSessionProgress();
    hideCoach();
    setGeneratedBatch((current) => current + 1);
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
            : "Ещё 10 задач"
        }
        topic={activeData?.topic}
        nextHref={nextStep?.href}
        nextLabel={nextStep?.label}
      />
    );
  }

  if (generatedStatus === "loading") {
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

  if (generatedStatus === "error") {
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

      {currentTask.type === "single_choice" ? (
        <OptionList
          task={currentTask}
          options={currentTask.options}
          session={session}
          onSelect={handleAnswer}
        />
      ) : (
        <NumericAnswerInput
          key={currentTask.id}
          unit={currentTask.answer.unit}
          decimals={currentTask.answer.decimals}
          sign={currentTask.answer.sign}
          disabled={session.phase !== "active"}
          submitted={
            session.phase === "answered" &&
            latestAnswer?.format === "numeric_input"
              ? { raw: latestAnswer.response.raw, isCorrect: latestAnswer.isCorrect }
              : undefined
          }
          onSubmit={handleNumericSubmit}
        />
      )}

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
            correctAnswer={
              latestAnswer?.format === "numeric_input"
                ? `${formatNumericValue(latestAnswer.correctValue)} ${latestAnswer.unit}`.trim()
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
