"use client";

import { useState } from "react";
import styles from "./ResonanceNotebook.module.css";

const NATURAL_FREQUENCY_HZ = 1;
const DAMPING_RATIO = 0.18;
const MIN_RATIO = 0.5;
const MAX_RATIO = 1.5;
const GRAPH = { left: 42, right: 344, top: 14, bottom: 172 } as const;

function format(value: number, digits = 2) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits }).format(value);
}

function relativeAmplitude(frequencyRatio: number) {
  const denominator = Math.hypot(1 - frequencyRatio ** 2, 2 * DAMPING_RATIO * frequencyRatio);
  return 1 / denominator;
}

function graphX(ratio: number) {
  return GRAPH.left + ((ratio - MIN_RATIO) / (MAX_RATIO - MIN_RATIO)) * (GRAPH.right - GRAPH.left);
}

function graphY(amplitude: number) {
  return GRAPH.bottom - (amplitude / 3.2) * (GRAPH.bottom - GRAPH.top);
}

const curve = Array.from({ length: 101 }, (_, index) => {
  const ratio = MIN_RATIO + (index / 100) * (MAX_RATIO - MIN_RATIO);
  return `${index === 0 ? "M" : "L"}${graphX(ratio).toFixed(2)},${graphY(relativeAmplitude(ratio)).toFixed(2)}`;
}).join(" ");

export function ResonanceNotebook() {
  const [frequencyRatio, setFrequencyRatio] = useState(0.5);
  const driveFrequencyHz = NATURAL_FREQUENCY_HZ * frequencyRatio;
  const amplitude = relativeAmplitude(frequencyRatio);
  const nearResonance = Math.abs(frequencyRatio - 1) <= 0.12;
  const currentX = graphX(frequencyRatio);
  const currentY = graphY(amplitude);

  return (
    <section className={styles.notebook} aria-labelledby="resonance-notebook-title">
      <header className={styles.heading}>
        <span>Запись модели · вынужденные колебания</span>
        <h2 id="resonance-notebook-title">Попади в ритм системы</h2>
        <p>Меняй частоту внешних толчков и наблюдай за амплитудой одного и того же маятника.</p>
      </header>

      <div className={styles.conditions}>
        <p><span>Собственная частота</span><strong>{format(NATURAL_FREQUENCY_HZ)} Гц</strong></p>
        <p><span>Частота толчков</span><strong>{format(driveFrequencyHz)} Гц</strong></p>
      </div>

      <label className={styles.control} htmlFor="resonance-drive-frequency">
        <span>Частота внешнего воздействия</span>
        <input
          id="resonance-drive-frequency"
          type="range"
          min={MIN_RATIO}
          max={MAX_RATIO}
          step={0.05}
          value={frequencyRatio}
          aria-describedby="resonance-frequency-hint"
          onChange={(event) => setFrequencyRatio(Number(event.currentTarget.value))}
        />
        <span className={styles.rangeEnds} aria-hidden="true"><span>медленнее</span><span>быстрее</span></span>
      </label>
      <p className={styles.hint} id="resonance-frequency-hint">Передвигай ползунок. На графике вертикальная отметка показывает собственную частоту.</p>

      <figure className={styles.graph}>
        <svg viewBox="0 0 360 214" role="img" aria-labelledby="resonance-graph-title resonance-graph-description">
          <title id="resonance-graph-title">Амплитуда вынужденных колебаний зависит от частоты толчков</title>
          <desc id="resonance-graph-description">Кривая достигает наибольшей высоты возле совпадения частоты внешнего воздействия с собственной частотой маятника. Текущий результат отмечен точкой.</desc>
          {[0, 1, 2, 3].map((value) => {
            const y = graphY(value);
            return <g key={value}>
              <line x1={GRAPH.left} x2={GRAPH.right} y1={y} y2={y} className={styles.grid} />
              <text x={GRAPH.left - 8} y={y + 4} textAnchor="end" className={styles.tick}>{value}</text>
            </g>;
          })}
          {[0.5, 1, 1.5].map((value) => <g key={value}>
            <line x1={graphX(value)} x2={graphX(value)} y1={GRAPH.top} y2={GRAPH.bottom} className={value === 1 ? styles.natural : styles.grid} />
            <text x={graphX(value)} y={GRAPH.bottom + 17} textAnchor="middle" className={styles.tick}>{format(value, 1)}</text>
          </g>)}
          <line x1={GRAPH.left} x2={GRAPH.left} y1={GRAPH.top} y2={GRAPH.bottom} className={styles.axis} />
          <line x1={GRAPH.left} x2={GRAPH.right} y1={GRAPH.bottom} y2={GRAPH.bottom} className={styles.axis} />
          <path d={curve} className={styles.curve} />
          <circle cx={currentX} cy={currentY} r="6" className={styles.current} />
          <text x={(GRAPH.left + GRAPH.right) / 2} y="210" textAnchor="middle" className={styles.axisLabel}>частота толчков / собственная частота</text>
          <text x={GRAPH.left} y="10" className={styles.axisLabel}>относительная амплитуда</text>
        </svg>
        <figcaption>Относительная амплитуда (×) · отметка у 1 означает совпадение частот</figcaption>
      </figure>

      <p className={styles.reading} aria-live="polite">
        <strong>Амплитуда модели: {format(amplitude)}×</strong>
        <span>{nearResonance ? "Частоты близки — отклик особенно велик." : "Ритм толчков отличается от собственного ритма маятника."}</span>
      </p>

      <details className={styles.details}>
        <summary>Что здесь называют резонансом?</summary>
        <p>Вынужденные колебания идут в ритме внешней силы. Резонанс возникает, когда этот ритм близок к собственной частоте системы. Высота графика сравнивает амплитуду с откликом от такой же силы без колебаний; реальные метры зависят от маятника. Сопротивление ограничивает амплитуду, а числа здесь расчётные.</p>
      </details>
    </section>
  );
}
