"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./VolumeObservation.module.css";

const blockVolumeCm3 = 4 * 3 * 2;

export function VolumeObservation() {
  const [answer, setAnswer] = useState("");
  const [checkedAnswer, setCheckedAnswer] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const isNumber = checkedAnswer !== null && /^\d+(?:[,.]\d+)?$/.test(checkedAnswer);
  const isCorrect = isNumber && Number(checkedAnswer.replace(",", ".")) === blockVolumeCm3;

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckedAnswer(answer.trim());
    setShowSolution(false);
  }

  return (
    <div className={styles.composition}>
      <article className={styles.notebook} aria-labelledby="volume-observation-title">
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Журнал наблюдения</p>
          <h2 id="volume-observation-title">Что показывает прибор?</h2>
          <p>Сравни два отдельных измерения объёма.</p>
        </header>

        <div className={styles.record}>
          <div>
            <h3>Вода · прямое показание</h3>
            <p>Мио расположила глаза на уровне нижней точки мениска и записала <strong>32 мл</strong>. Значение объёма уже прочитано с прибора.</p>
          </div>
          <div>
            <h3>Брусок · измеренные рёбра</h3>
            <p>Линейкой получили длины рёбер: <strong>4 см, 3 см и 2 см</strong>. Объём бруска ещё нужно найти.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={checkAnswer}>
          <label htmlFor="block-volume-answer">Вычисли объём бруска, см³</label>
          <div className={styles.answerRow}>
            <span className={styles.answerSymbol} aria-hidden="true">V =</span>
            <input
              id="block-volume-answer"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              required
              value={answer}
              onChange={(event) => { setAnswer(event.target.value); setCheckedAnswer(null); setShowSolution(false); }}
              aria-describedby="block-volume-hint"
            />
            <span className={styles.unit}>см³</span>
            <button type="submit">Проверить</button>
          </div>
          <p id="block-volume-hint" className={styles.hint}>Введи только число: единица уже указана.</p>
        </form>

        {checkedAnswer !== null && (
          <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
            <p className={styles.verdict}>
              {isCorrect ? "Верно: объём бруска — 24 см³." : isNumber ? "Пока не сходится. Перемножь все три ребра и попробуй ещё раз." : "Введи число без единицы измерения."}
            </p>
            {(isCorrect || showSolution) ? <>
              <p><strong>V = 4 см · 3 см · 2 см = 24 см³.</strong> Длины измерили линейкой, а объём бруска вычислили по ним — это косвенное определение объёма.</p>
              <p><strong>32 мл</strong> — прямое показание мензурки для воды. Это объём другого объекта, его не подставляют в расчёт бруска.</p>
            </> : isNumber ? <button className={styles.solutionButton} type="button" onClick={() => setShowSolution(true)}>Показать разбор</button> : null}
          </div>
        )}
      </article>

      <figure className={styles.illustration}>
        <Image
          className={styles.art}
          src={MIO_SCENES.measurement}
          alt="Мио рассматривает мензурку на уровне глаз"
          width={1536}
          height={1024}
          sizes="(max-width: 700px) 100vw, 250px"
        />
        <figcaption>Мио сверяет положение глаз с уровнем жидкости.</figcaption>
      </figure>
    </div>
  );
}
