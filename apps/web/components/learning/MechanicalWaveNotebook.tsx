"use client";

import { useState } from "react";
import styles from "./MechanicalWaveNotebook.module.css";

const FREQUENCIES_HZ = [2, 4, 5] as const;
const WAVE_SPEED_M_PER_S = 2;

function format(value: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value);
}

export function MechanicalWaveNotebook() {
  const [frequencyHz, setFrequencyHz] = useState<(typeof FREQUENCIES_HZ)[number]>(2);
  const periodS = 1 / frequencyHz;
  const wavelengthM = WAVE_SPEED_M_PER_S / frequencyHz;

  return (
    <section className={styles.notebook} aria-labelledby="mechanical-wave-title">
      <header className={styles.heading}>
        <span>Модель · та же натянутая струна</span>
        <h2 id="mechanical-wave-title">Как меняется длина волны?</h2>
        <p>Натяжение струны не меняется, поэтому скорость здесь постоянна: 2 м/с. Выбери частоту источника и сравни длину волны.</p>
      </header>

      <fieldset className={styles.frequencies}>
        <legend>Частота источника</legend>
        {FREQUENCIES_HZ.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={frequencyHz === value}
            onClick={() => setFrequencyHz(value)}
          >
            {value} Гц
          </button>
        ))}
      </fieldset>

      <p className={styles.state} aria-live="polite">
        За один период возмущение проходит {format(wavelengthM)} м вдоль струны.
      </p>

      <dl className={styles.readings} aria-label="Расчётные характеристики волны">
        <div><dt>Частота источника</dt><dd>{format(frequencyHz)} Гц</dd></div>
        <div><dt>Период</dt><dd>{format(periodS)} с</dd></div>
        <div><dt>Длина волны</dt><dd>{format(wavelengthM)} м</dd></div>
        <div className={styles.speed}><dt>Скорость в среде</dt><dd>{format(WAVE_SPEED_M_PER_S)} м/с</dd></div>
      </dl>

      <p className={styles.conclusion}>
        Частота растёт — длина волны уменьшается. Их произведение остаётся равным скорости распространения.
      </p>

      <details className={styles.formula}>
        <summary>Как связаны эти величины?</summary>
        <p>За период <strong>T</strong> волна проходит одну длину <strong>λ</strong>, поэтому <strong>λ = vT</strong>. Так как <strong>ν = 1/T</strong>, получаем <strong>v = λν</strong>.</p>
      </details>
      <p className={styles.boundary}>
        Модель одной струны при неизменном натяжении: скорость задана и не меняется. Числа рассчитаны, это не показания прибора.
      </p>
    </section>
  );
}
