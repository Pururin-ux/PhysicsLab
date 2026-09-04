"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  getLessonStageDefinition,
  type LessonStageSequenceItem,
} from "../../lib/learning/lesson-stage-contract";

type LessonStageEngineClasses = {
  root: string;
  header: string;
  progressMeta: string;
  progressTrack: string;
  stageShell: string;
  stage: string;
  footer: string;
  backButton: string;
  nextButton: string;
};

type LessonStageEngineProps = {
  ariaLabelledBy?: string;
  identity: ReactNode;
  progressAriaLabel: string;
  stages: readonly LessonStageSequenceItem[];
  activeIndex: number;
  canContinue: boolean;
  onActiveIndexChange: (index: number) => void;
  reduceMotion: boolean;
  classes: LessonStageEngineClasses;
  children: ReactNode;
  className?: string;
  backLabel?: ReactNode;
  renderNextLabel?: (label: string) => ReactNode;
  themePreserveDark?: boolean;
};

type LessonStagePanelProps = {
  focusOnMount: boolean;
  reduceMotion: boolean;
  stageId: string;
  className: string;
  children: ReactNode;
};

function LessonStagePanel({
  focusOnMount,
  reduceMotion,
  stageId,
  className,
  children,
}: LessonStagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusOnMount) return;

    // This component mounts only after AnimatePresence has actually replaced
    // the previous stage. Focusing here avoids guessing the exit duration and
    // also works when reduced motion makes that duration zero.
    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;

      const heading = panel.querySelector<HTMLElement>(
        "[data-lesson-stage-heading], h2[tabindex='-1'], h3[tabindex='-1']",
      );

      panel.parentElement?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      heading?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusOnMount, reduceMotion, stageId]);

  return (
    <motion.div
      ref={panelRef}
      className={className}
      data-lesson-stage-panel={stageId}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -7 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function LessonStageEngine({
  ariaLabelledBy,
  identity,
  progressAriaLabel,
  stages,
  activeIndex,
  canContinue,
  onActiveIndexChange,
  reduceMotion,
  classes,
  children,
  className,
  backLabel = "Назад",
  renderNextLabel = (label) => label,
  themePreserveDark = false,
}: LessonStageEngineProps) {
  const focusStageAfterNavigationRef = useRef(false);
  const activeStage = stages[activeIndex];

  if (!activeStage) {
    throw new Error(`Lesson stage index ${activeIndex} is outside the configured sequence.`);
  }

  const rootClassName = className ? `${classes.root} ${className}` : classes.root;
  const nextAction = activeStage.nextAction;

  function navigateToStage(index: number) {
    focusStageAfterNavigationRef.current = true;
    onActiveIndexChange(index);
  }

  return (
    <section
      className={rootClassName}
      aria-labelledby={ariaLabelledBy}
      data-theme-preserve={themePreserveDark ? "dark" : undefined}
      data-lesson-engine="concept-first-v2"
      data-lesson-stage={activeStage.id}
    >
      <header className={classes.header}>
        {identity}
        <div className={classes.progressMeta}>
          <span>
            <b>{getLessonStageDefinition(activeStage.id).label}</b> · {activeIndex + 1} из {stages.length}
          </span>
          <div
            className={classes.progressTrack}
            role="progressbar"
            aria-label={progressAriaLabel}
            aria-valuemin={1}
            aria-valuemax={stages.length}
            aria-valuenow={activeIndex + 1}
            aria-valuetext={`${getLessonStageDefinition(activeStage.id).label}, шаг ${activeIndex + 1} из ${stages.length}`}
          >
            <motion.span
              initial={false}
              animate={{ scaleX: (activeIndex + 1) / stages.length }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      <div className={classes.stageShell}>
        <AnimatePresence mode="wait" initial={false}>
          <LessonStagePanel
            key={activeStage.id}
            focusOnMount={focusStageAfterNavigationRef.current}
            reduceMotion={reduceMotion}
            stageId={activeStage.id}
            className={classes.stage}
          >
            {children}
          </LessonStagePanel>
        </AnimatePresence>
      </div>

      <footer className={classes.footer}>
        <button
          type="button"
          className={classes.backButton}
          onClick={() => navigateToStage(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          {backLabel}
        </button>
        {nextAction ? (
          <button
            type="button"
            className={classes.nextButton}
            onClick={() => navigateToStage(Math.min(stages.length - 1, activeIndex + 1))}
            disabled={!canContinue}
          >
            {renderNextLabel(nextAction)}
          </button>
        ) : null}
      </footer>
    </section>
  );
}
