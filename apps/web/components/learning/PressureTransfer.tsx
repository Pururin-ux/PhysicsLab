"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./PressureTransfer.module.css";

const initialDraft = { force: null as string | null };

/** Широкая грань — 40 см²; давление считаем от неё. */
function pressureKPa(forceN: number) {
  return forceN / 0.004 / 1_000;
}

/** Применение: при той же площади давление растёт вместе с силой. */
export function PressureTransfer() {
  const [state, setState] = useState(initialDraft);
  const draft = useLessonDraft(
    "textbook-pressure-transfer",
    state,
    setState,
    1,
    "lesson",
    { saveInitial: false },
  );

  if (!draft.ready) {
    return <p role="status">Открываю задание…</p>;
  }

  const force = state.force === null ? null : (Number(state.force) as 40 | 80);
  const pressure = force === null ? null : pressureKPa(force);
  const solved = force === 80;

  return (
    <div className={styles.transfer} data-testid="pressure-transfer">
      <div className={styles.options} role="group" aria-label="Сила на широкую грань">
        {([40, 80] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={force === value}
            onClick={() => setState({ force: String(value) })}
          >
            {value} Н
          </button>
        ))}
      </div>
      {force !== null && pressure !== null ? (
        <div
          className={solved ? styles.feedbackCorrect : styles.feedbackRetry}
          role="status"
          data-testid="pressure-transfer-feedback"
        >
          <p>
            {solved
              ? "Верно. Сила увеличилась вдвое, и давление тоже:"
              : "Пока ничего не изменилось: давление осталось 10 кПа. Чтобы при той же площади получить вдвое большее давление, увеличь силу вдвое."}
          </p>
          <MathText
            className={styles.formula}
            text={String.raw`$\frac{${force}\ \mathrm{Н}}{0{,}004\ \mathrm{м^2}}=${pressure}\ \mathrm{кПа}$`}
          />
        </div>
      ) : null}
      {draft.error ? (
        <p role="alert" className={styles.error}>
          {draft.error}
        </p>
      ) : null}
    </div>
  );
}
