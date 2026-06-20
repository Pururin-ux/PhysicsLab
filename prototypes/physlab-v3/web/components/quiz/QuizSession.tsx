"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useMemo, useRef } from "react";
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
import { addXP, resetSessionProgress } from "../../lib/stores/session-store";
import kinematicsData from "../../content/tasks/kinematics-10.json";

interface QuizSessionProps {
  data?: QuizData;
}

const defaultQuizData = kinematicsData as QuizData;

export function QuizSession({ data = defaultQuizData }: QuizSessionProps) {
  const session = useStore($quizSession);
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
  const tasks = data.tasks;
  const currentTask = tasks[session.currentIndex];
  const isLastTask = session.currentIndex >= session.total - 1;
  const progressLabel = `${Math.min(session.currentIndex + 1, session.total)} / ${session.total}`;

  const weakTraps = useMemo(
    () =>
      session.answers
        .filter((answer) => !answer.isCorrect)
        .map((answer) => answer.trap),
    [session.answers],
  );

  useEffect(() => {
    resetSessionProgress();
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
        />
        <CoachBubble {...bubble} />
      </>
    );
  }

  if (!currentTask) return null;

  return (
    <section className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-32 sm:pb-8">
      <div className="flex items-center justify-between gap-3">
        <Badge>{progressLabel}</Badge>
        <span className="text-[12px] font-normal text-white/50">
          Серия: {session.streak}
        </span>
      </div>

      <QuestionCard
        type={currentTask.type}
        difficulty={currentTask.difficulty}
        text={currentTask.text}
        formula={currentTask.formula}
      />

      <OptionList
        task={currentTask}
        options={currentTask.options}
        session={session}
        onSelect={handleAnswer}
      />

      {session.phase === "answered" ? (
        <>
          <ExplanationSection
            explanation={currentTask.explanation}
            explanationLatex={currentTask.explanation_latex}
            trap={currentTask.trap}
          />

          <Button type="button" size="lg" onClick={handleNext}>
            {isLastTask ? "Показать итог" : "Следующая задача"}
          </Button>
        </>
      ) : null}

      <CoachBubble {...bubble} />
    </section>
  );
}
