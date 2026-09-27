"use client";

import { useId, useState } from "react";
import styles from "./CoulombNotebook.module.css";

const left = 68;
const right = 568;
const top = 22;
const bottom = 238;
const maxForce = 16;

function forceAt(distanceCm: number): number {
  // q₁ = 4 нКл, |q₂| = 4 нКл, k ≈ 9·10⁹ Н·м²/Кл², вакуум.
  return 1440 / (distanceCm * distanceCm);
}

function xAt(distanceCm: number): number {
  return left + (distanceCm - 10) * (right - left) / 50;
}

function yAt(forceMicroNewtons: number): number {
  return bottom - forceMicroNewtons * (bottom - top) / maxForce;
}

const curve = Array.from({ length: 101 }, (_, index) => {
  const distance = 10 + index / 2;
  return `${index === 0 ? "M" : "L"}${xAt(distance).toFixed(2)} ${yAt(forceAt(distance)).toFixed(2)}`;
}).join(" ");

function formatForce(value: number): string {
  return Number(value.toFixed(2)).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

export function CoulombNotebook() {
  const [distance, setDistance] = useState(20);
  const [opposite, setOpposite] = useState(true);
  const sliderId = useId();
  const force = forceAt(distance);
  const doubledForce = forceAt(2 * distance);

  return (
    <div className={styles.notebook}>
      <div className={styles.heading}>
        <span>Проверь зависимость</span>
        <strong>Что станет с силой, если расстояние увеличить вдвое?</strong>
        <p>Два неподвижных точечных заряда в вакууме: +4 нКл и {opposite ? "−4" : "+4"} нКл.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.distanceControl}>
          <label htmlFor={sliderId}>Расстояние между зарядами</label>
          <output htmlFor={sliderId}>{distance} см</output>
          <input
            id={sliderId}
            type="range"
            min="10"
            max="30"
            step="5"
            value={distance}
            onChange={event => setDistance(Number(event.currentTarget.value))}
          />
        </div>
        <div className={styles.signControl} role="group" aria-label="Знак второго заряда">
          <span>Второй заряд</span>
          <div>
            <button type="button" aria-pressed={opposite} onClick={() => setOpposite(true)}>−4 нКл</button>
            <button type="button" aria-pressed={!opposite} onClick={() => setOpposite(false)}>+4 нКл</button>
          </div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <div className={styles.chartHeading}>
          <strong>Модуль силы F при расстоянии r</strong>
          <span>Заряды постоянны · вакуум</span>
        </div>
        <svg
          className={styles.chart}
          viewBox="0 0 600 280"
          role="img"
          aria-label={`График обратной квадратичной зависимости силы от расстояния. При ${distance} сантиметрах сила ${formatForce(force)} микроньютона, при ${2 * distance} сантиметрах — ${formatForce(doubledForce)} микроньютона, в четыре раза меньше.`}
        >
          {[0, 4, 8, 12, 16].map(value => (
            <g key={value}>
              <line className={styles.grid} x1={left} x2={right} y1={yAt(value)} y2={yAt(value)} />
              <text className={styles.tick} x={left - 12} y={yAt(value) + 4} textAnchor="end">{value}</text>
            </g>
          ))}
          {[10, 20, 30, 40, 50, 60].map(value => (
            <g key={value}>
              <line className={styles.grid} x1={xAt(value)} x2={xAt(value)} y1={top} y2={bottom} />
              <text className={styles.tick} x={xAt(value)} y={bottom + 19} textAnchor="middle">{value}</text>
            </g>
          ))}
          <text className={styles.axisLabel} x={left} y="13">F, мкН</text>
          <text className={styles.axisLabel} x={right} y="13" textAnchor="end">r, см</text>
          <path className={styles.curve} d={curve} />
          <line className={styles.markerGuide} x1={xAt(distance)} x2={xAt(distance)} y1={yAt(force)} y2={bottom} />
          <line className={styles.markerGuide} x1={xAt(2 * distance)} x2={xAt(2 * distance)} y1={yAt(doubledForce)} y2={bottom} />
          <circle className={styles.markerPrimary} cx={xAt(distance)} cy={yAt(force)} r="6" />
          <circle className={styles.markerSecondary} cx={xAt(2 * distance)} cy={yAt(doubledForce)} r="6" />
        </svg>
        <div className={styles.readout} aria-live="polite">
          <div><span>При r = {distance} см</span><strong>{formatForce(force)} мкН</strong></div>
          <span className={styles.ratio} aria-hidden="true">÷ 4</span>
          <div><span>При 2r = {2 * distance} см</span><strong>{formatForce(doubledForce)} мкН</strong></div>
        </div>
      </div>

      <p className={styles.conclusion} aria-live="polite">
        {opposite ? "Разные знаки: заряды притягиваются." : "Одинаковые знаки: заряды отталкиваются."}
        {" "}Знак меняет направление, но не модуль силы. При удвоении расстояния сила становится в 4 раза меньше.
      </p>
    </div>
  );
}
