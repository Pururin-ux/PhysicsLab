"use client";

import { useState } from "react";
import styles from "./OscillationEnergyNotebook.module.css";

const MASS_KG = 2;
const STIFFNESS_N_PER_M = 100;
const AMPLITUDE_M = 0.08;
const positions = [-1, -0.5, 0, 0.5, 1] as const;

function format(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits }).format(value);
}

function positionLabel(ratio: (typeof positions)[number]) {
  if (ratio === -1) return "−A · крайнее положение";
  if (ratio === -0.5) return "−A/2 · ближе к равновесию";
  if (ratio === 0) return "0 · равновесие";
  if (ratio === 0.5) return "+A/2 · ближе к равновесию";
  return "+A · крайнее положение";
}

export function OscillationEnergyNotebook() {
  const [positionRatio, setPositionRatio] = useState<(typeof positions)[number]>(-1);
  const displacementM = AMPLITUDE_M * positionRatio;
  const totalEnergyJ = STIFFNESS_N_PER_M * AMPLITUDE_M ** 2 / 2;
  const elasticEnergyJ = STIFFNESS_N_PER_M * displacementM ** 2 / 2;
  const kineticEnergyJ = Math.max(0, totalEnergyJ - elasticEnergyJ);
  const speedMPerS = Math.sqrt(2 * kineticEnergyJ / MASS_KG);

  const reading = positionRatio === -1 || positionRatio === 1
    ? "В крайнем положении груз на миг останавливается: вся энергия модели связана с деформацией пружины."
    : positionRatio === 0
      ? "В положении равновесия энергия деформации, отсчитанная от равновесия, равна нулю; кинетическая энергия максимальна."
      : "Между крайним положением и равновесием есть обе энергии: одна уменьшается, другая растёт.";

  return (
    <section className={styles.notebook} aria-labelledby="oscillation-energy-title">
      <header className={styles.heading}>
        <span>Запись модели · пружинный маятник</span>
        <h2 id="oscillation-energy-title">Где энергия сейчас?</h2>
        <p>Выбери положение груза. Сумма кинетической и потенциальной энергий в идеальной модели не меняется.</p>
      </header>

      <fieldset className={styles.positions}>
        <legend>Положение относительно равновесия</legend>
        {positions.map((ratio) => (
          <button
            key={ratio}
            type="button"
            aria-pressed={positionRatio === ratio}
            onClick={() => setPositionRatio(ratio)}
          >
            {ratio === -1 ? "−A" : ratio === -0.5 ? "−A/2" : ratio === 0 ? "0" : ratio === 0.5 ? "+A/2" : "+A"}
            <span>{ratio === 0 ? "равновесие" : ratio === -1 || ratio === 1 ? "край" : "между"}</span>
          </button>
        ))}
      </fieldset>

      <p className={styles.state} aria-live="polite">{positionLabel(positionRatio)} · x = {format(displacementM, 2)} м</p>

      <dl className={styles.readings} aria-label="Энергия и скорость выбранного состояния">
        <div><dt>Скорость груза</dt><dd>{format(speedMPerS)} м/с</dd></div>
        <div><dt>Потенциальная энергия системы</dt><dd>{format(elasticEnergyJ)} Дж</dd></div>
        <div><dt>Энергия движения</dt><dd>{format(kineticEnergyJ)} Дж</dd></div>
        <div className={styles.total}><dt>Полная энергия</dt><dd>{format(totalEnergyJ)} Дж</dd></div>
      </dl>

      <p className={styles.conclusion} aria-live="polite">{reading}</p>

      <details className={styles.formula}>
        <summary>Как получаются значения?</summary>
        <p>При амплитуде A полная энергия равна <strong>W = kA²/2</strong>. Для вертикального маятника это потенциальная энергия пружины и груза относительно выбранного нуля в равновесии. На смещении x её часть <strong>Wₚ = kx²/2</strong>, поэтому <strong>Wₖ = W − Wₚ</strong>.</p>
      </details>
      <p className={styles.boundary}>Модель: m = 2,0 кг, k = 100 Н/м, A = 0,08 м. Пружина остаётся натянутой; сопротивлением пренебрегаем. Это расчётные значения модели, а не измерения реального опыта.</p>
    </section>
  );
}
