"use client";

import { useId, useState } from "react";
import styles from "./GasWorkNotebook.module.css";

const LOWER_PRESSURE_KPA = 100;
const VOLUME_CHANGE_L = 10;

export function GasWorkNotebook() {
  const [upperPressure, setUpperPressure] = useState(200);
  const id = useId();
  const lowerY = 250;
  const upperY = 340 - upperPressure * 0.9;
  // 1 кПа · 1 л = 1 Дж. Вертикальные (изохорные) участки работы не дают.
  const upperWork = upperPressure * VOLUME_CHANGE_L;
  const lowerWork = LOWER_PRESSURE_KPA * VOLUME_CHANGE_L;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>§ 12 · 10 класс</p>
        <h2>Одни начало и конец. Почему работа разная?</h2>
        <span>Газ расширяется от 10 до 20 л. Сравни два пути между состояниями 1 и 3: один проходит при большем давлении, другой — при меньшем.</span>
      </header>

      <div className={styles.workbench}>
        <figure className={styles.graph}>
          <svg viewBox="0 0 660 390" role="img" aria-labelledby={id + "-title " + id + "-description"}>
            <title id={id + "-title"}>Два пути расширения газа на графике давления от объёма</title>
            <desc id={id + "-description"}>
              Путь 1–2–3 расширяет газ при {upperPressure} килопаскалях и даёт работу {upperWork} джоулей.
              Путь 1–4–3 расширяет его при 100 килопаскалях и даёт {lowerWork} джоулей.
              Вертикальные участки имеют постоянный объём и не дают работы. Начальное и конечное состояния у путей общие.
            </desc>
            <defs>
              <marker id={id + "-upper-arrow"} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker>
              <marker id={id + "-lower-arrow"} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker>
            </defs>
            <path className={styles.axis} d="M95 55V340H605" />
            <text className={styles.axisLabel} x="63" y="65">p</text>
            <text className={styles.axisLabel} x="597" y="374">V</text>
            <text className={styles.pressureLabel} x="86" y={upperY + 6} textAnchor="end">{upperPressure}</text>
            <text className={styles.pressureLabel} x="86" y={lowerY + 6} textAnchor="end">100</text>
            <text className={styles.unitLabel} x="40" y="95">кПа</text>
            <path className={styles.pressureGuide} d={"M95 " + upperY + "H150M95 " + lowerY + "H150"} />
            <path className={styles.guide} d="M150 340V250M540 340V250" />
            <rect className={styles.extraArea} x="150" y={upperY} width="390" height={lowerY - upperY} />
            <path className={styles.upperPath} markerEnd={"url(#" + id + "-upper-arrow)"} d={"M150 " + lowerY + "V" + upperY + "H540"} />
            <path className={styles.lowerPath} markerEnd={"url(#" + id + "-lower-arrow)"} d={"M150 " + lowerY + "H540V" + upperY} />
            <g className={styles.state}><circle cx="150" cy={lowerY} r="20" /><text x="150" y={lowerY + 8}>1</text></g>
            <g className={styles.state}><circle cx="150" cy={upperY} r="20" /><text x="150" y={upperY + 8}>2</text></g>
            <g className={styles.state}><circle cx="540" cy={upperY} r="20" /><text x="540" y={upperY + 8}>3</text></g>
            <g className={styles.state}><circle cx="540" cy={lowerY} r="20" /><text x="540" y={lowerY + 8}>4</text></g>
            <text className={styles.upperLabel} x="260" y={upperY - 15}>1 → 2 → 3</text>
            <text className={styles.lowerLabel} x="260" y={lowerY + 36}>1 → 4 → 3</text>
            <text className={styles.volumeLabel} x="132" y="370">10 л</text>
            <text className={styles.volumeLabel} x="520" y="370">20 л</text>
          </svg>
          <figcaption>Цветная полоса — дополнительная площадь под верхним путём. На графике <var>p</var>(<var>V</var>) площадь равна работе газа.</figcaption>
        </figure>

        <div className={styles.reading}>
          <label htmlFor={id + "-pressure"}>Давление на верхнем пути <output htmlFor={id + "-pressure"}>{upperPressure} кПа</output></label>
          <input
            id={id + "-pressure"}
            type="range"
            min="150"
            max="250"
            step="25"
            value={upperPressure}
            onChange={event => setUpperPressure(Number(event.currentTarget.value))}
            aria-describedby={id + "-pressure-note"}
          />
          <p id={id + "-pressure-note"} className={styles.note}>При каждом выборе оба пути имеют общие состояния 1 и 3. Объём меняется на 10 л.</p>
          <div className={styles.result}>
            <p><span>Путь 1 → 2 → 3</span><strong>{upperPressure} × 10 = {upperWork} Дж</strong></p>
            <p><span>Путь 1 → 4 → 3</span><strong>100 × 10 = {lowerWork} Дж</strong></p>
          </div>
          <p className={styles.conclusion}>Разница <strong>{upperWork - lowerWork} Дж</strong> — это цветная площадь между путями. Изменение внутренней энергии между теми же состояниями при этом одинаково.</p>
        </div>
      </div>
      <p className={styles.boundary}>Расширение даёт положительную работу газа. При сжатии работа газа отрицательна. В обоих случаях работа внешних сил над газом имеет противоположный знак.</p>
    </div>
  );
}
