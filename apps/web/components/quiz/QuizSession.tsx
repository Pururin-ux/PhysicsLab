"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useCoach } from "../coach/useCoach";
import { AnswerFeedback } from "./AnswerFeedback";
import { NumericAnswerInput } from "./NumericAnswerInput";
import { OptionList } from "./OptionList";
import { PracticeToolbar } from "./PracticeToolbar";
import { QuestionCard } from "./QuestionCard";
import { QuizLoadErrorCard } from "./QuizLoadErrorCard";
import { QuizLoadingCard } from "./QuizLoadingCard";
import { SessionSummary } from "./SessionSummary";
import { SolutionDisclosure } from "./SolutionDisclosure";
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
import {
  buildSnapshot,
  clearActiveQuizSnapshot,
  readActiveQuizSnapshot,
  snapshotMatches,
  writeActiveQuizSnapshot,
  type ActiveQuizSnapshot,
} from "../../lib/quiz/active-session-snapshot";
import { newAttemptId } from "../../lib/quiz/attempt-id";
import { integrityError } from "../../lib/quiz/quiz-load-error";
import { Button } from "../ui/Button";
import { getTaskFocus } from "../../lib/learning/task-focus";
import {
  getHelpTargetForMistake,
  getHelpTargetForTask,
  type HelpTarget,
} from "../../lib/learning/topic-help";
import type { TopicId } from "../../lib/stores/progress-store";
import { addXP, resetSessionProgress } from "../../lib/stores/session-store";
import { useSessionRecording } from "./useSessionRecording";
import type { GeneratedQuizCount } from "../../lib/quiz/generated-quiz-count";

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
  helpOpen?: boolean;
  helpButtonRef?: RefObject<HTMLButtonElement | null>;
  recoveryMode?: "auto" | "fresh";
  freshAttemptId?: string;
  generatedCount?: GeneratedQuizCount;
  restartLabel?: string;
  nextHref?: string;
  nextLabel?: string;
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
  helpOpen = false,
  helpButtonRef,
  recoveryMode = "auto",
  freshAttemptId,
  generatedCount = 10,
  restartLabel,
  nextHref,
  nextLabel,
}: QuizSessionProps) {
  const session = useStore($quizSession);
  const snapshotWriteBlockedRef = useRef(false);
  // Кандидат на восстановление читается один раз при монтировании и до
  // первого fetch: если снапшот указывает другой batch, лишний запрос
  // batch=0 не выполняется (I4). Разметка первого рендера от этого не
  // зависит (всегда loading-карточка), поэтому hydration mismatch нет.
  const pendingRestoreRef = useRef<ActiveQuizSnapshot | null | undefined>(undefined);
  if (pendingRestoreRef.current === undefined) {
    if (typeof window === "undefined") {
      pendingRestoreRef.current = null;
    } else {
      const result = readActiveQuizSnapshot();
      snapshotWriteBlockedRef.current = !result.ok && result.reason === "future-version";
      if (recoveryMode === "fresh") {
        const isDiscardedAttempt =
          result.ok &&
          result.snapshot.attemptId === freshAttemptId &&
          result.snapshot.template === generatedTemplate &&
          result.snapshot.sessionKind === sessionKind;
        // A snapshot replaced between gate rendering and the click is not the
        // attempt the user discarded. Preserve it rather than overwriting it.
        if (result.ok && !isDiscardedAttempt) {
          snapshotWriteBlockedRef.current = true;
        }
        if (isDiscardedAttempt) {
          clearActiveQuizSnapshot();
        }
        pendingRestoreRef.current = null;
      } else {
        pendingRestoreRef.current =
          result.ok &&
          result.snapshot.template === generatedTemplate &&
          result.snapshot.sessionKind === sessionKind
            ? result.snapshot
            : null;
      }
    }
  }
  const [generatedBatch, setGeneratedBatch] = useState(
    () => pendingRestoreRef.current?.batch ?? 0,
  );
  // Идентификатор попытки: восстановление сохраняет id из снапшота, новая
  // сессия и Restart получают свежий. Две честные попытки одного batch=0
  // различимы — completion-маркер идентифицирует попытку, а не набор задач.
  const [attemptId, setAttemptId] = useState(
    () => pendingRestoreRef.current?.attemptId ?? newAttemptId(),
  );
  const [restoredNotice, setRestoredNotice] = useState<string | null>(null);
  const {
    data: generatedData,
    error: generatedError,
    status: generatedStatus,
    retry: retryGeneratedLoad,
  } = useGeneratedQuizData({
    enabled: true,
    template: generatedTemplate,
    topic: generatedTopic,
    title: generatedTitle,
    batch: generatedBatch,
    count: generatedCount,
  });
  const {
    emitCoachEvent,
    startPauseTimer,
    clearPauseTimer,
    hideCoach,
  } = useCoach();
  const sessionStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reactionRef = useRef<HTMLDivElement>(null);
  const activeData = generatedData;
  const tasks = activeData?.tasks ?? emptyTasks;
  // Identity записи прогресса: попытка, а не набор задач. taskIds при этом
  // по-прежнему строго сверяются при восстановлении снапшота.
  const sessionId = useMemo(
    () => (tasks.length > 0 ? `${generatedTemplate}:${generatedBatch}:${attemptId}` : null),
    [attemptId, generatedBatch, generatedTemplate, tasks.length],
  );
  const { recordSessionResult, resetRecording } = useSessionRecording({
    sessionKind,
    topicId,
    sessionId,
  });
  const currentTask = tasks[session.currentIndex];
  const latestAnswer = session.answers.at(-1);
  const isLastTask = session.currentIndex >= session.total - 1;
  const progressLabel = `Задание ${Math.min(session.currentIndex + 1, session.total)} из ${session.total}`;
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
    resetRecording();

    // Попытка восстановления: снапшот должен точно совпасть с загруженным
    // набором задач. При mismatch — молча начинаем новую сессию (снапшот
    // очищается: он относится к другому набору).
    const pendingRestore = pendingRestoreRef.current;
    pendingRestoreRef.current = null;
    const taskIds = tasks.map((task) => task.id);

    if (
      pendingRestore &&
      snapshotMatches(pendingRestore, {
        attemptId,
        template: generatedTemplate,
        topic: generatedTopic,
        topicId,
        sessionKind,
        taskIds,
      })
    ) {
      // Восстанавливаем состояние сессии без повторных side-эффектов:
      // XP не начисляется, coach-события не переигрываются.
      $quizSession.set({
        phase: pendingRestore.session.phase,
        currentIndex: pendingRestore.session.currentIndex,
        selectedOptionId: pendingRestore.session.selectedOptionId,
        answers: pendingRestore.session.answers,
        score: pendingRestore.session.score,
        streak: pendingRestore.session.streak,
        total: pendingRestore.session.total,
      });
      setRestoredNotice(
        `Тренировка восстановлена: задание ${pendingRestore.session.currentIndex + 1} из ${pendingRestore.session.total}.`,
      );
      return;
    }

    if (pendingRestore && !snapshotWriteBlockedRef.current) {
      clearActiveQuizSnapshot();
    }

    // Fresh-старт: если attemptId был позаимствован у не совпавшего снапшота,
    // выдаём новой попытке собственный идентификатор.
    if (pendingRestore) {
      setAttemptId(newAttemptId());
    }

    resetQuizSession(tasks.length);

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
    // generatedTemplate/sessionKind стабильны для конкретного экрана.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearPauseTimer, emitCoachEvent, resetRecording, startPauseTimer, tasks]);

  // Снапшот активной сессии: обновляется после ответов/переходов (не в
  // render). Completed не сохраняется — к этому моменту результат записан
  // в прогресс и снапшот очищен.
  useEffect(() => {
    if (!activeData || tasks.length === 0 || !sessionId || snapshotWriteBlockedRef.current) return;

    if (session.phase === "completed") {
      clearActiveQuizSnapshot();
      return;
    }

    const snapshot = buildSnapshot({
      attemptId,
      template: generatedTemplate,
      topic: generatedTopic,
      title: generatedTitle,
      topicId,
      sessionKind,
      batch: generatedBatch,
      taskIds: tasks.map((task) => task.id),
      session,
    });
    if (snapshot) {
      writeActiveQuizSnapshot(snapshot);
    }
  }, [activeData, attemptId, generatedBatch, generatedTemplate, generatedTitle, generatedTopic, session, sessionId, sessionKind, tasks, topicId]);

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
    setRestoredNotice(null);

    if (isLastTask) {
      // Запись результата идемпотентна (useSessionRecording); снапшот
      // очищается сразу, чтобы reload после записи не восстановил сессию
      // и не привёл к повторной записи.
      recordSessionResult(session);
      if (!snapshotWriteBlockedRef.current) clearActiveQuizSnapshot();
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
    setRestoredNotice(null);
    clearActiveQuizSnapshot();
    snapshotWriteBlockedRef.current = false;
    // Новая попытка получает новый идентификатор, даже если template/batch/
    // набор задач совпадут с предыдущими.
    setAttemptId(newAttemptId());
    setGeneratedBatch((current) => current + 1);
  }

  if (session.phase === "completed") {
    const nextStep =
      nextHref
        ? { href: nextHref, label: nextLabel ?? "Дальше" }
        : sessionKind === "exam"
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
          restartLabel ?? (sessionKind === "exam"
            ? "Новая тренировка"
            : `Ещё ${generatedCount} задач`)
        }
        topic={activeData?.topic}
        nextHref={nextStep?.href}
        nextLabel={nextStep?.label}
      />
    );
  }

  if (generatedStatus === "loading" || generatedStatus === "idle") {
    return <QuizLoadingCard title={generatedTitle} />;
  }

  if (generatedStatus === "error" && generatedError) {
    return <QuizLoadErrorCard error={generatedError} onRetry={retryGeneratedLoad} />;
  }

  // Ready, но текущей задачи нет (integrity-дыра): восстановимая ошибка
  // вместо пустого экрана. Retry повторяет тот же batch.
  if (!currentTask) {
    return <QuizLoadErrorCard error={integrityError()} onRetry={retryGeneratedLoad} />;
  }

  const taskFocus = getTaskFocus(currentTask);
  const answerHelpTarget =
    latestAnswer && currentTask
      ? getHelpTargetForMistake(
          currentTask,
          latestAnswer.selectedMisconception || latestAnswer.taskTrap,
          topicId,
        )
      : currentHelpTarget;
  const latestIsCorrect = latestAnswer?.isCorrect ?? false;
  const feedbackText =
    latestIsCorrect
      ? currentTask.coach_lines.correct
      : latestAnswer?.selectedMisconception
        ? `Похоже, ты ${latestAnswer.selectedMisconception}.`
        : currentTask.coach_lines.wrong;
  const mistakeHelpTarget =
    latestAnswer && !latestAnswer.isCorrect ? answerHelpTarget : null;

  return (
    <section
      data-testid="quiz-session"
      className="relative mx-auto flex w-full max-w-[640px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8"
    >
      {restoredNotice ? (
        <p
          data-testid="session-restored-notice"
          aria-live="polite"
          className="rounded-option border border-nova-cyan/20 bg-nova-cyan/[.05] px-3.5 py-2.5 text-[13px] leading-[1.6] text-white/75"
        >
          {restoredNotice}
        </p>
      ) : null}

      <PracticeToolbar
        progressLabel={progressLabel}
        helpOpen={helpOpen}
        helpButtonRef={helpButtonRef}
        onOpenHelp={
          currentHelpTarget && onOpenHelpTarget
            ? () => onOpenHelpTarget(currentHelpTarget)
            : undefined
        }
      />

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
        showMetadata={false}
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

      {session.phase === "answered" ? (
        <div ref={reactionRef} className="flex flex-col gap-4 scroll-mt-6">
          <AnswerFeedback
            isCorrect={latestIsCorrect}
            feedbackText={feedbackText}
            correctAnswer={
              latestAnswer?.format === "numeric_input" && !latestAnswer.isCorrect
                ? `${formatNumericValue(latestAnswer.correctValue)} ${latestAnswer.unit}`.trim()
                : undefined
            }
          />

          <Button type="button" size="lg" data-testid="next-task-button" onClick={handleNext}>
            {isLastTask ? "Показать итог" : "Следующая задача"}
          </Button>

          <SolutionDisclosure
            key={currentTask.id}
            explanation={currentTask.explanation}
            helpTarget={mistakeHelpTarget ?? undefined}
            onOpenHelp={
              mistakeHelpTarget && onOpenHelpTarget
                ? () => onOpenHelpTarget(mistakeHelpTarget)
                : undefined
            }
          />
        </div>
      ) : null}
    </section>
  );
}
