"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  getBohrTransition,
  type BohrTransitionDirection,
} from "../../lib/physics/bohr-transition-model";
import styles from "./BohrTransitionNotebook.module.css";

const levels = [1, 2, 3, 4, 5, 6] as const;

function format(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", ",");
}

function directionLabel(direction: BohrTransitionDirection) {
  return direction === "emission" ? "испускает фотон" : "поглощает фотон";
}

export function BohrTransitionNotebook() {
  const [initialN, setInitialN] = useState(3);
  const [finalN, setFinalN] = useState(2);
  const [prediction, setPrediction] = useState<BohrTransitionDirection | null>(null);
  const [revealed, setRevealed] = useState(false);
  const groupId = useId();
  const transition = getBohrTransition(initialN, finalN);
  const predictionCorrect = prediction === transition.direction;

  function updateLevels(nextInitial: number, nextFinal: number) {
    setInitialN(nextInitial);
    setFinalN(nextFinal);
    setPrediction(null);
    setRevealed(false);
  }

  return (
    <section className={styles.notebook}>
      <figure className={styles.scene}>
        <Image
          src="/images/mio/textbook-bohr-spectra-v1.webp"
          alt="Мио рассматривает отдельные линии спектра водорода и делает запись в научном блокноте."
          width={1536}
          height={1024}
          sizes="(max-width: 760px) 100vw, 24rem"
          loading="eager"
        />
        <figcaption>
          Мио наблюдает спектр. Сцена — реконструкция; числа справа рассчитаны для
          выбранных уровней.
        </figcaption>
      </figure>

      <div className={styles.workspace}>
        <div className={styles.note}>
          <p className={styles.eyebrow}>Запись наблюдения</p>
          <p>У водорода видны отдельные линии, а не все цвета подряд.</p>
          <p className={styles.formula}>
            E<sub>n</sub> = −13,6 / n<sup>2</sup> эВ
            <span>;</span>
            hν = |E<sub>i</sub> − E<sub>f</sub>|
          </p>
        </div>

        <div className={styles.interaction}>
          <h2>Выбери переход</h2>
          <div className={styles.levels}>
            <label>
              Начальный уровень
              <select
                value={initialN}
                onChange={(event) => {
                  const next = Number(event.currentTarget.value);
                  updateLevels(next, next === finalN ? initialN : finalN);
                }}
              >
                {levels.map((level) => (
                  <option key={level} value={level} disabled={level === finalN}>
                    n = {level}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Конечный уровень
              <select
                value={finalN}
                onChange={(event) => {
                  const next = Number(event.currentTarget.value);
                  updateLevels(next === initialN ? finalN : initialN, next);
                }}
              >
                {levels.map((level) => (
                  <option key={level} value={level} disabled={level === initialN}>
                    n = {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!revealed ? (
            <>
              <fieldset className={styles.prediction}>
                <legend>Атом водорода…</legend>
                {([
                  ["emission", "испустит фотон"],
                  ["absorption", "поглотит фотон"],
                ] as const).map(([value, label]) => {
                  const id = `${groupId}-${value}`;
                  return (
                    <label key={value} htmlFor={id}>
                      <input
                        id={id}
                        type="radio"
                        name={groupId}
                        value={value}
                        checked={prediction === value}
                        onChange={() => setPrediction(value)}
                      />
                      {label}
                    </label>
                  );
                })}
              </fieldset>
              <button
                className={styles.primaryAction}
                type="button"
                disabled={!prediction}
                onClick={() => setRevealed(true)}
              >
                Сверить с моделью
              </button>
            </>
          ) : (
            <div className={styles.result} aria-live="polite">
              <p className={styles.direction}>
                При переходе {initialN} → {finalN} атом {directionLabel(transition.direction)}.
              </p>
              <p>
                {predictionCorrect
                  ? "Верно: направление перехода определяет, отдаёт атом энергию или получает её."
                  : `Мио тоже проверила направление. При таком переходе атом ${directionLabel(transition.direction)}.`}
              </p>
              <dl>
                <div><dt>Энергия фотона</dt><dd>{format(transition.photonEnergyEv)} эВ</dd></div>
                <div><dt>Частота</dt><dd>{format(transition.frequency14)} · 10¹⁴ Гц</dd></div>
                <div><dt>Длина волны</dt><dd>{format(transition.wavelengthNm, 1)} нм</dd></div>
              </dl>
              <button
                className={styles.secondaryAction}
                type="button"
                onClick={() => {
                  setPrediction(null);
                  setRevealed(false);
                }}
              >
                Проверить другой переход
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
