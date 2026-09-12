"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { defineLessonStageSequence } from "../../../lib/learning/lesson-stage-contract";
import { LessonStageEngine } from "../../../components/learning/LessonStageEngine";

const stages = defineLessonStageSequence([
  { id: "apply", label: "Применить", nextAction: "Сопоставить" },
  { id: "notice", label: "Заметить", nextAction: "Объяснить" },
  { id: "explain", label: "Объяснить", nextAction: "Подвести итог" },
  { id: "reflect", label: "Подвести итог" },
] as const);

const classes = {
  root: "mx-auto max-w-xl space-y-4 p-8 text-white",
  header: "space-y-2",
  progressMeta: "space-y-2",
  progressTrack: "h-1 bg-white/20 [&>span]:block [&>span]:h-full [&>span]:bg-nova-cyan",
  stageShell: "min-h-32",
  stage: "rounded-lg border border-white/20 p-5",
  footer: "flex justify-between gap-3",
  backButton: "rounded px-3 py-2 text-white",
  nextButton: "rounded bg-nova-cyan px-3 py-2 text-black",
};

export default function LessonStageEngineDevPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [firstStageConfirmed, setFirstStageConfirmed] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const activeStage = stages[activeIndex];

  return (
    <main>
      <LessonStageEngine
        identity={<h1 id="lesson-stage-engine-fixture-title">Проверка движка этапов</h1>}
        ariaLabelledBy="lesson-stage-engine-fixture-title"
        progressAriaLabel="Прогресс искусственного урока"
        stages={stages}
        activeIndex={activeIndex}
        canContinue={activeIndex > 0 || firstStageConfirmed}
        onActiveIndexChange={setActiveIndex}
        reduceMotion={reduceMotion}
        classes={classes}
      >
        <h2 data-lesson-stage-heading tabIndex={-1}>Этап: {activeStage.label}</h2>
        {activeIndex === 0 ? (
          <label>
            <input
              type="checkbox"
              checked={firstStageConfirmed}
              onChange={(event) => setFirstStageConfirmed(event.target.checked)}
            />
            Локально разрешить продолжение
          </label>
        ) : null}
      </LessonStageEngine>
    </main>
  );
}
