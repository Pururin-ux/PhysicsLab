"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CoachBubble } from "../coach/CoachBubble";
import { useCoach } from "../coach/useCoach";
import { ExplanationSection } from "./ExplanationSection";
import { OptionList } from "./OptionList";
import { QuestionCard } from "./QuestionCard";
import { SessionSummary } from "./SessionSummary";
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
import {
  recordCompletedSession,
  type TopicId,
} from "../../lib/stores/progress-store";
import { addXP, resetSessionProgress } from "../../lib/stores/session-store";
import kinematicsData from "../../content/tasks/kinematics-10.json";

interface QuizSessionProps {
  data?: QuizData;
  mode?: "static" | "generated";
  generatedTemplate?: string;
  generatedTopic?: string;
  generatedTitle?: string;
  pedagogyMode?: PedagogyMode;
  topicId?: TopicId;
}

export type PedagogyMode = "learn" | "practice" | "exam";

const defaultQuizData = kinematicsData as QuizData;
const emptyTasks: QuizData["tasks"] = [];

export function QuizSession({
  data = defaultQuizData,
  mode = "static",
  generatedTemplate = "free-fall",
  generatedTopic = "Кинематика",
  generatedTitle = "Задачи",
  pedagogyMode = "practice",
  topicId,
}: QuizSessionProps) {
  const session = useStore($quizSession);
  const [generatedData, setGeneratedData] = useState<QuizData | null>(null);
  const [generatedStatus, setGeneratedStatus] = useState<"idle" | "loading" | "ready" | "error">(
    mode === "generated" ? "loading" : "idle",
  );
  const [generatedError, setGeneratedError] = useState<string | null>(null);
  const [generatedBatch, setGeneratedBatch] = useState(0);
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
  const sessionRecordedRef = useRef(false);
  const activeData = mode === "generated" ? generatedData : data;
  const tasks = activeData?.tasks ?? emptyTasks;
  const currentTask = tasks[session.currentIndex];
  const isLastTask = session.currentIndex >= session.total - 1;
  const progressLabel = `${Math.min(session.currentIndex + 1, session.total)} / ${session.total}`;

  const weakTraps = useMemo(
    () =>
      session.answers
        .filter((answer) => !answer.isCorrect && answer.trap)
        .map((answer) => answer.trap),
    [session.answers],
  );

  useEffect(() => {
    if (mode !== "generated") {
      return;
    }

    const controller = new AbortController();

    async function loadGeneratedTasks() {
      setGeneratedStatus("loading");
      setGeneratedError(null);

      try {
        const params = new URLSearchParams({
          template: generatedTemplate,
          count: "10",
          batch: String(generatedBatch),
        });
        const response = await fetch(`/api/tasks?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Не удалось сгенерировать задачи.");
        }

        setGeneratedData({
          id: `generated-${generatedTemplate}-${generatedBatch}`,
          topic: generatedTopic,
          title: generatedTitle,
          tasks: payload.tasks,
        });
        setGeneratedStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setGeneratedStatus("error");
        setGeneratedError(error instanceof Error ? error.message : "Не удалось сгенерировать задачи.");
      }
    }

    loadGeneratedTasks();

    return () => {
      controller.abort();
    };
  }, [generatedBatch, generatedTemplate, generatedTitle, generatedTopic, mode]);

  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    resetSessionProgress();
    resetQuizSession(tasks.length);
    sessionRecordedRef.current = false;

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
  }, [clearPauseTimer, emitCoachEvent, startPauseTimer, tasks]);

  function handleAnswer(optionId: string) {
    if (!currentTask || session.phase !== "active") return;

    const result = answerCurrentTask(currentTask, optionId);
    if (!result) return;

    clearPauseTimer();

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
      addXP(0);
      emitCoachEvent(
        {
          type: "wrong_answer",
          attempt: result.attempt,
          taskId: currentTask.id,
        },
        currentTask.coach_lines,
      );
    }
  }

  function handleNext() {
    if (!currentTask || session.phase !== "answered") return;

    hideCoach();

    if (isLastTask && topicId && !sessionRecordedRef.current) {
      sessionRecordedRef.current = true;
      recordCompletedSession({
        topicId,
        score: session.score,
        total: session.total,
        answers: session.answers,
      });
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
    sessionRecordedRef.current = false;

    if (mode === "generated") {
      resetSessionProgress();
      hideCoach();
      setGeneratedData(null);
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
    return (
      <>
        <SessionSummary
          score={session.score}
          total={session.total}
          weakTraps={weakTraps}
          onRestart={handleRestart}
          restartLabel={mode === "generated" ? "Ещё 10 задач" : undefined}
          topic={activeData?.topic}
        />
        <CoachBubble {...bubble} />
      </>
    );
  }

  if (mode === "generated" && generatedStatus === "loading") {
    return (
      <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-32 sm:pb-8">
        <Card className="flex flex-col gap-3">
          <Badge tone="cyan">{generatedTitle}</Badge>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            Генерирую новый набор задач...
          </p>
        </Card>
      </section>
    );
  }

  if (mode === "generated" && generatedStatus === "error") {
    return (
      <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-32 sm:pb-8">
        <Card className="flex flex-col gap-4">
          <Badge tone="gold">Ошибка генерации</Badge>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            {generatedError}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setGeneratedBatch((current) => current + 1)}
          >
            Повторить запрос
          </Button>
        </Card>
      </section>
    );
  }

  if (!currentTask) return null;

  return (
    <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-32 sm:pb-8">
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
        formula={currentTask.formula}
        graph={currentTask.graph}
        showSolutionContent={session.phase === "answered"}
      />

      <OptionList
        task={currentTask}
        options={currentTask.options}
        session={session}
        onSelect={handleAnswer}
      />

      {session.phase === "answered" ? (
        <>
          <CoachBubble {...bubble} placement="inline" />

          <ExplanationSection
            explanation={currentTask.explanation}
            explanationLatex={currentTask.explanation_latex}
            trap={currentTask.trap}
            pedagogyMode={pedagogyMode}
            isCorrect={session.answers.at(-1)?.isCorrect ?? false}
          />

          <Button type="button" size="lg" onClick={handleNext}>
            {isLastTask ? "Показать итог" : "Следующая задача"}
          </Button>
        </>
      ) : null}

      {session.phase !== "answered" ? (
        <CoachBubble {...bubble} placement="floating" />
      ) : null}
    </section>
  );
}
