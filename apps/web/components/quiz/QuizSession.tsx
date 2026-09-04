"use client";

import { useStore } from "@nanostores/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
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
  retryCurrentTask,
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
  type QuizSessionKind,
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
import {
  recordMistakeImmediately,
  type TopicId,
} from "../../lib/stores/progress-store";
import { calcXP } from "../../lib/xp";
import { addXP, resetSessionProgress } from "../../lib/stores/session-store";
import { useSessionRecording } from "./useSessionRecording";
import type { GeneratedQuizCount } from "../../lib/quiz/generated-quiz-count";

interface QuizSessionProps {
  generatedTemplate: string;
  generatedTopic: string;
  generatedTitle: string;
  topicId?: TopicId;
  // Cross-topic режимы пишут слабые места по затронутым темам; только exam
  // считается попыткой ЦТ/ЦЭ.
  sessionKind?: QuizSessionKind;
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
  preAnswerGuidance?: "guided" | "unlabelled";
  summaryVariant?: "diagnostic" | "exam";
}

const nextStepByTopic: Record<string, { href: string; label: string }> = {
  kinematics: { href: "/practice/dynamics-lesson", label: "Дальше: Динамика" },
  dynamics: { href: "/practice/electro-lesson", label: "Дальше: Электричество" },
  electrodynamics: { href: "/practice/density-lesson", label: "Дальше: Плотность" },
  thermodynamics: { href: "/practice/optics-lesson", label: "Дальше: Оптика" },
  optics: { href: "/practice/exam-demo", label: "Дальше: диагностика" },
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
  preAnswerGuidance = "guided",
  summaryVariant,
}: QuizSessionProps) {
  const pathname = usePathname();
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
    evidenceMode: preAnswerGuidance === "unlabelled" ? "transfer" : "guided",
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
        .filter((answer) => !answer.isCorrect || answer.attempt > 1)
        // Префикс blueprint даёт сводке название навыка («Свободное падение»)
        // вместо безликого «Типовая ошибка» на каждом пункте.
        .map((answer) => {
          const trap = answer.selectedMisconception || answer.taskTrap;
          return trap.length > 0 ? `${answer.blueprint}:${trap}` : "";
        })
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
      // Восстанавливаем состояние сессии без повторного начисления XP.
      $quizSession.set({
        phase: pendingRestore.session.phase,
        currentIndex: pendingRestore.session.currentIndex,
        selectedOptionId: pendingRestore.session.selectedOptionId,
        answers: pendingRestore.session.answers,
        score: pendingRestore.session.score,
        streak: pendingRestore.session.streak,
        total: pendingRestore.session.total,
      });
      if (sessionId) {
        for (const answer of pendingRestore.session.answers) {
          if (!answer.isCorrect || answer.attempt > 1) {
            recordMistakeImmediately({ sessionId, topicId, answer, resumeHref: pathname });
          }
        }
      }
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
    // generatedTemplate/sessionKind стабильны для конкретного экрана.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetRecording, tasks]);

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

    // Feedback и его действие появляются в том же React-переходе. Небольшая
    // задержка даёт браузеру закончить layout; один RAF иногда измерял старую
    // высоту и оставлял retry ниже мобильного fold.
    const timer = window.setTimeout(() => {
      const reaction = reactionRef.current;
      if (!reaction) return;

      const primaryAction = reaction.querySelector<HTMLButtonElement>(
        '[data-testid="retry-task-button"], [data-testid="next-task-button"]',
      );
      if (
        latestAnswer?.format === "numeric_input" ||
        (latestAnswer?.isCorrect === false && latestAnswer.attempt === 1)
      ) {
        primaryAction?.focus({ preventScroll: true });
      }

      const rect = reaction.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
      if (isVisible) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) {
        const actionRect = primaryAction?.getBoundingClientRect();
        // Нижняя навигация занимает около 64 px плюс safe-area. Проверяем
        // именно действие, а не верх feedback-блока: раньше причина ошибки
        // была видна, а «Попробовать ещё раз» оставалось под fold.
        const safeBottom = viewportHeight - 80;
        if (
          actionRect &&
          (actionRect.top < 0 || actionRect.bottom > safeBottom)
        ) {
          primaryAction?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [latestAnswer?.format, session.phase, session.currentIndex]);

  // Единственный общий side-effect ответа вне session store — XP. Причина
  // ошибки и следующий шаг рендерятся одним видимым контуром AnswerFeedback;
  // параллельный невидимый coach-state здесь больше не создаётся.
  function recordAnswerXP(result: AnswerResult) {
    if (result.isCorrect) {
      // Правила XP живут в lib/xp.ts (база за попытку + разовые бонусы за
      // серию) — начисление и цифры в профиле ссылаются на один источник.
      addXP(calcXP({ correct: true, attempt: result.attempt, streak: result.streak }));
      return;
    }

    addXP(0);
  }

  function persistWrongAnswer(result: AnswerResult) {
    if (result.isCorrect || !sessionId) return;

    const answer = $quizSession.get().answers.at(-1);
    if (!answer) return;

    recordMistakeImmediately({ sessionId, topicId, answer, resumeHref: pathname });
  }

  function handleAnswer(optionId: string) {
    if (!currentTask || currentTask.type !== "single_choice") return;
    if (session.phase !== "active" && session.phase !== "retrying") return;

    const result = answerCurrentTask(currentTask, optionId);
    if (!result) return;

    persistWrongAnswer(result);
    recordAnswerXP(result);
  }

  function handleNumericSubmit(raw: string) {
    if (!currentTask || currentTask.type !== "numeric_input") return;
    if (session.phase !== "active" && session.phase !== "retrying") return;

    const result = answerCurrentNumericTask(currentTask, raw);
    if (!result) return;

    persistWrongAnswer(result);
    recordAnswerXP(result);
  }

  function handleNext() {
    if (!currentTask || session.phase !== "answered") return;

    setRestoredNotice(null);

    if (isLastTask) {
      // Запись результата идемпотентна (useSessionRecording); снапшот
      // очищается сразу, чтобы reload после записи не восстановил сессию
      // и не привёл к повторной записи.
      recordSessionResult(session);
      if (!snapshotWriteBlockedRef.current) clearActiveQuizSnapshot();
    }

    const moved = moveToNextTask();
    if (!moved) return;

    if (isLastTask) return;

  }

  function handleRetry() {
    if (!retryCurrentTask()) return;

    setRestoredNotice(null);
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(
          '[data-testid="numeric-answer-input"], .quiz-option:not(:disabled)',
        )
        ?.focus({ preventScroll: true });
    });
  }

  function handleRestart() {
    resetRecording();
    resetSessionProgress();
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
            ? "Новая диагностика"
            : `Ещё ${generatedCount} задач`)
        }
        topic={activeData?.topic}
        nextHref={nextStep?.href}
        nextLabel={nextStep?.label}
        variant={summaryVariant}
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
  const firstWrongAttempt =
    session.phase === "answered" &&
    latestAnswer?.isCorrect === false &&
    latestAnswer.attempt === 1;
  // Для числового ввода без распознанного misconception показываем
  // правило-ловушку задачи: реплика «а не N» называла бы дистрактор,
  // которого ученик не вводил (правильный ответ выводится отдельной строкой).
  const feedbackText =
    latestIsCorrect
      ? currentTask.coach_lines.correct
      : latestAnswer?.selectedMisconception
        ? `Ты ${latestAnswer.selectedMisconception}.`
        : latestAnswer?.format === "numeric_input"
          ? currentTask.trap
          : currentTask.coach_lines.wrong;
  const mistakeHelpTarget =
    latestAnswer && !latestAnswer.isCorrect ? answerHelpTarget : null;
  const visibleTaskFocus =
    session.phase === "retrying" ||
    (session.phase === "active" && preAnswerGuidance === "guided")
      ? taskFocus
      : undefined;

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
        focus={visibleTaskFocus}
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
          key={`${currentTask.id}:${session.phase}`}
          unit={currentTask.answer.unit}
          decimals={currentTask.answer.decimals}
          sign={currentTask.answer.sign}
          disabled={session.phase !== "active" && session.phase !== "retrying"}
          submitted={
            session.phase === "answered" &&
            latestAnswer?.format === "numeric_input"
              ? { raw: latestAnswer.response.raw, isCorrect: latestAnswer.isCorrect }
              : undefined
          }
          onSubmit={handleNumericSubmit}
        />
      )}

      {session.phase === "answered" || session.phase === "retrying" ? (
        <div ref={reactionRef} className="flex flex-col gap-4 scroll-mt-6">
          <AnswerFeedback
            isCorrect={latestIsCorrect}
            feedbackText={feedbackText}
            correctAnswer={
              latestAnswer?.format === "numeric_input" &&
              !latestAnswer.isCorrect &&
              latestAnswer.attempt > 1
                ? `${formatNumericValue(latestAnswer.correctValue)} ${latestAnswer.unit}`.trim()
                : undefined
            }
            retryHint={firstWrongAttempt || session.phase === "retrying" ? taskFocus.check : undefined}
          />

          {firstWrongAttempt ? (
            <Button type="button" size="lg" data-testid="retry-task-button" onClick={handleRetry}>
              Попробовать ещё раз
            </Button>
          ) : session.phase === "answered" ? (
            <Button type="button" size="lg" data-testid="next-task-button" onClick={handleNext}>
              {isLastTask ? "Показать итог" : "Следующая задача"}
            </Button>
          ) : null}

          {session.phase === "answered" ? (
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
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
