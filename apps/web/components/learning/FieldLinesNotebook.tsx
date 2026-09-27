"use client";

import { useState } from "react";
import styles from "./FieldLinesNotebook.module.css";

type Configuration = "positive" | "negative" | "plates";

const directions = Array.from({ length: 8 }, (_, index) => index * Math.PI / 4);

function pointOnRay(angle: number, radius: number): string {
  return (320 + radius * Math.cos(angle)).toFixed(2) + " " +
    (180 + radius * Math.sin(angle)).toFixed(2);
}

export function FieldLinesNotebook() {
  const [configuration, setConfiguration] = useState<Configuration>("positive");
  const pointSource = configuration !== "plates";
  const positive = configuration === "positive";
  const description = configuration === "plates"
    ? "Между большими противоположно заряженными пластинами в центральной области линии параллельны и направлены от положительной пластины к отрицательной."
    : positive
      ? "Восемь условных линий расходятся от положительного точечного заряда. Точка A ближе к источнику, чем точка B."
      : "Восемь условных линий сходятся к отрицательному точечному заряду. Точка A ближе к источнику, чем точка B.";

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <span>Карта направления</span>
        <h2>Линия показывает поле, а не путь заряда</h2>
        <p>Меняй источник и читай стрелки. В выбранной точке вектор напряжённости направлен по касательной к линии.</p>
      </header>

      <div className={styles.controls} role="group" aria-label="Конфигурация зарядов">
        <button type="button" aria-pressed={configuration === "positive"} onClick={() => setConfiguration("positive")}>Один + заряд</button>
        <button type="button" aria-pressed={configuration === "negative"} onClick={() => setConfiguration("negative")}>Один − заряд</button>
        <button type="button" aria-pressed={configuration === "plates"} onClick={() => setConfiguration("plates")}>Две пластины</button>
      </div>

      <figure className={styles.figure}>
        <svg viewBox="0 0 640 360" role="img" aria-label={description}>
          <defs>
            <marker id="field-line-arrowhead" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="16" markerHeight="16" orient="auto" markerUnits="userSpaceOnUse">
              <path className={styles.arrowhead} d="M0 0 L12 5 L0 10 Z" />
            </marker>
          </defs>
          {pointSource ? (
            <>
              {directions.map((angle, index) => (
                <path
                  key={index}
                  className={styles.fieldLine}
                  d={positive
                    ? "M" + pointOnRay(angle, 43) + " L" + pointOnRay(angle, 155)
                    : "M" + pointOnRay(angle, 155) + " L" + pointOnRay(angle, 43)}
                  markerEnd="url(#field-line-arrowhead)"
                />
              ))}
              <text className={styles.sourceLabel} x="320" y="180" textAnchor="middle" dominantBaseline="middle">{positive ? "+Q" : "−Q"}</text>
              <text className={styles.pointLabel} x="390" y="158" textAnchor="middle">A</text>
              <text className={styles.pointLabel} x="450" y="158" textAnchor="middle">B</text>
            </>
          ) : (
            <>
              <path className={styles.plate} d="M0 90 H640 M0 270 H640" />
              {[190, 245, 300, 355, 410, 465].map(x => (
                <path key={x} className={styles.fieldLine} d={"M" + x + " 130 V230"} markerEnd="url(#field-line-arrowhead)" />
              ))}
              {[140, 260, 380, 500].map(x => (
                <g key={x}>
                  <text className={styles.plateSign} x={x} y="59" textAnchor="middle">+</text>
                  <text className={styles.plateSign} x={x} y="315" textAnchor="middle">−</text>
                </g>
              ))}
              <text className={styles.pointLabel} x="275" y="190" textAnchor="middle">A</text>
              <text className={styles.pointLabel} x="385" y="190" textAnchor="middle">B</text>
              <text className={styles.directionLabel} x="535" y="190" textAnchor="middle">E ↓</text>
            </>
          )}
        </svg>
        <figcaption>{pointSource
          ? "Фрагмент линий около одиночного точечного заряда. Вне рисунка линии продолжаются."
          : "Показана центральная область длинных пластин; их края за пределами рисунка, а у краёв поле уже не однородно."}</figcaption>
      </figure>

      <div className={styles.reading} aria-live="polite">
        <div>
          <span>Направление в точке</span>
          <strong>{configuration === "negative" ? "К отрицательному источнику" : configuration === "positive" ? "От положительного источника" : "От положительной пластины к отрицательной"}</strong>
        </div>
        <div>
          <span>Сравни A и B</span>
          <strong>{pointSource ? "Ближе к источнику в A: поле там сильнее" : "В центральной области E в A и B одинаково"}</strong>
        </div>
      </div>
      <p className={styles.rule}>Линии не являются траекториями частиц. Они не пересекаются; их густота на рисунке условно передаёт модуль напряжённости.</p>
    </div>
  );
}
