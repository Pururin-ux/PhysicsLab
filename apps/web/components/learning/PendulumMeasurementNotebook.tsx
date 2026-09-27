"use client";

import { useState } from "react";
import styles from "./PendulumMeasurementNotebook.module.css";

const cycles = 10;
const measurements = [
  { lengthM: 0.25, timeSeconds: 10.0 },
  { lengthM: 0.5, timeSeconds: 14.2 },
  { lengthM: 1, timeSeconds: 20.1 },
] as const;

function period(lengthM: number, timeSeconds: number) {
  return timeSeconds / cycles;
}

function gravity(lengthM: number, timeSeconds: number) {
  const measuredPeriod = period(lengthM, timeSeconds);
  return (4 * Math.PI ** 2 * lengthM) / measuredPeriod ** 2;
}

const number = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const oneDecimal = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function PendulumMeasurementNotebook() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = measurements[selectedIndex];
  const selectedPeriod = period(selected.lengthM, selected.timeSeconds);
  const estimatedGravity = gravity(selected.lengthM, selected.timeSeconds);

  return (
    <section className={styles.notebook} aria-labelledby="pendulum-record-title">
      <header className={styles.heading}>
        <span>Запись измерений · математический маятник</span>
        <h2 id="pendulum-record-title">Сравни длину и время десяти колебаний</h2>
        <p>Выбери строку: разберём, как из времени десяти циклов получить один период и оценить ускорение свободного падения.</p>
      </header>

      <fieldset className={styles.records}>
        <legend>Длина нити измеряется от точки подвеса до центра груза</legend>
        {measurements.map((measurement, index) => {
          const measuredPeriod = period(measurement.lengthM, measurement.timeSeconds);
          const estimatedG = gravity(measurement.lengthM, measurement.timeSeconds);

          return (
            <button
              key={measurement.lengthM}
              type="button"
              aria-pressed={selectedIndex === index}
              aria-label={`Длина ${number.format(measurement.lengthM)} метра; десять колебаний за ${oneDecimal.format(measurement.timeSeconds)} секунды; период ${number.format(measuredPeriod)} секунды; оценка g ${number.format(estimatedG)} метра на секунду в квадрате`}
              className={styles.record}
              onClick={() => setSelectedIndex(index)}
            >
              <span className={styles.length}><small>Длина l</small><strong>{number.format(measurement.lengthM)} м</strong></span>
              <span><small>10 колебаний</small><strong>{oneDecimal.format(measurement.timeSeconds)} с</strong></span>
              <span><small>Период T</small><strong>{number.format(measuredPeriod)} с</strong></span>
              <span><small>Оценка g</small><strong>{number.format(estimatedG)} м/с²</strong></span>
            </button>
          );
        })}
      </fieldset>

      <div className={styles.calculation} aria-live="polite">
        <h3>Разбор выбранной записи</h3>
        <p>
          <span>Один период</span>
          <strong>T = Δt/N = {oneDecimal.format(selected.timeSeconds)} / {cycles} = {number.format(selectedPeriod)} с</strong>
        </p>
        <p>
          <span>Оценка ускорения свободного падения</span>
          <strong>g = 4π²l/T² = 4π² · {number.format(selected.lengthM)} / {number.format(selectedPeriod)}² ≈ {number.format(estimatedGravity)} м/с²</strong>
        </p>
      </div>

      <p className={styles.observation}>
        При увеличении длины с 0,25 до 1,00 м она выросла в 4 раза, а период — примерно в 2 раза. Оценки g близки к 9,8 м/с².
      </p>
      <p className={styles.boundary}>
        Это учебные показания для разбора расчёта, а не результаты реального опыта. Формула работает для малых углов; в опыте считают полные циклы и не меняют угол сильно.
      </p>
    </section>
  );
}
