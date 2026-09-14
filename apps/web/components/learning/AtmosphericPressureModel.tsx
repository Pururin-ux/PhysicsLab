"use client";

import Image from "next/image";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./AtmosphericPressureModel.module.css";

const heights = [120, 240, 360] as const;

const initial = {
  stage: 0,
  height: 240,
  answer: "",
  summaryText: "",
  summarySaved: false,
};

export function AtmosphericPressureModel() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(
    "textbook-atmospheric-pressure",
    state,
    setState,
    1,
    "lesson",
    { saveInitial: false },
  );

  const pressureChange = state.height / 12;
  const expectedPressure = 760 - pressureChange;
  const options = [
    { id: "lower", label: `${expectedPressure} мм рт. ст.`, correct: true },
    { id: "same", label: "760 мм рт. ст.", correct: false },
    { id: "higher", label: `${760 + pressureChange} мм рт. ст.`, correct: false },
  ];
  const answer = options.find((option) => option.id === state.answer);

  if (!draft.ready) {
    return <div className={styles.model}><p className={styles.loading}>Готовлю барометр…</p></div>;
  }

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Барометр в рюкзаке</p>
        <h2>Что изменится при подъёме?</h2>
        <p>
          У подножия барометр показал 760 мм рт. ст. Поднимемся выше при
          неизменной погоде и проверим направление изменения.
        </p>
      </header>

      <section className={styles.stage} aria-labelledby="atmospheric-pressure-question">
        <figure className={styles.figure}>
          <Image
            src="/images/evidence/atmospheric-pressure-aneroid.jpg"
            alt="Круглый механический барометр-анероид со стрелкой и шкалой давления"
            fill
            sizes="(max-width: 720px) 100vw, 48vw"
            priority
          />
          <figcaption>
            Барометр-анероид. Фото показывает устройство, а значения опыта задаются в условии.
            <a href="https://commons.wikimedia.org/wiki/File:Modern_Aneroid_Barometer.jpg" target="_blank" rel="noreferrer">
              Agnellous · public domain
            </a>
          </figcaption>
        </figure>

        <div className={styles.questionPanel}>
          <p className={styles.stepLabel}>Сначала выбери высоту</p>
          <div className={styles.heightOptions} role="group" aria-label="Высота подъёма">
            {heights.map((height) => (
              <button
                key={height}
                type="button"
                aria-pressed={state.height === height}
                onClick={() => setState((current) => ({ ...current, height, answer: "" }))}
              >
                +{height} м
              </button>
            ))}
          </div>

          <h3 id="atmospheric-pressure-question">
            Какое давление покажет барометр после подъёма на {state.height} м?
          </h3>
          <p className={styles.condition}>
            Используй школьное приближение: на каждые 12 м подъёма давление уменьшается на 1 мм рт. ст.
          </p>

          <div className={styles.options}>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={state.answer === option.id}
                onClick={() => setState((current) => ({ ...current, answer: option.id }))}
              >
                {option.label}
              </button>
            ))}
          </div>

          {answer ? (
            <>
              <p className={answer.correct ? styles.correct : styles.correction} role="status">
                {answer.correct
                  ? "Верно. Выше остаётся меньший столб воздуха, поэтому атмосферное давление уменьшается."
                  : "При подъёме давление должно уменьшиться. Сначала найди, на сколько миллиметров ртутного столба изменится показание."}
              </p>
              <div className={styles.reading} aria-label="Расчёт изменения атмосферного давления">
                <p><span>Подъём</span><strong>{state.height} м</strong></p>
                <p><span>Уменьшение</span><strong>{state.height} ÷ 12 = {pressureChange} мм</strong></p>
                <p><span>Новое давление</span><strong>760 − {pressureChange} = {expectedPressure} мм рт. ст.</strong></p>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {draft.error ? <p className={styles.storageError} role="alert">{draft.error}</p> : null}
    </div>
  );
}
