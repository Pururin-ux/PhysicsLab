"use client";

import { useState } from "react";
import styles from "./VoltageDifferenceNotebook.module.css";

const FIELD_V_PER_M = 200;
const A_X = 170;

export function VoltageDifferenceNotebook() {
  const [distanceCm, setDistanceCm] = useState(20);
  const [potentialAtA, setPotentialAtA] = useState(0);
  const bX = A_X + distanceCm * 10;
  const voltage = FIELD_V_PER_M * distanceCm / 100;
  const potentialAtB = potentialAtA - voltage;

  return <div className={styles.notebook}>
    <header className={styles.heading}>
      <span>Карта потенциала · наблюдение</span>
      <h2>Две точки. Что между ними?</h2>
      <p>Поле направлено вправо. Передвинь B, затем смени ноль отсчёта потенциала.</p>
    </header>

    <div className={styles.controls} role="group" aria-label="Расстояние от A до B вдоль поля">
      <span>Положение B</span>
      {[10, 20, 30].map(cm => <button key={cm} type="button" aria-pressed={distanceCm === cm} onClick={() => setDistanceCm(cm)}>{cm} см</button>)}
    </div>

    <figure className={styles.figure}>
      <svg viewBox="0 0 640 330" role="img" aria-label={`Центральная область однородного поля между пластинами. Напряжённость 200 вольт на метр направлена вправо. Точка B находится на ${distanceCm} сантиметров правее A. На каждой вертикальной пунктирной линии потенциал постоянен, но у линий A и B он различается.`}>
        <defs>
          <marker id="voltage-field-arrow" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="16" markerHeight="16" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L12 5 L0 10 Z" className={styles.arrowhead} />
          </marker>
        </defs>
        <path className={styles.plate} d="M55 35 V270 M585 35 V270" />
        <text className={styles.plateSign} x="55" y="30" textAnchor="middle">+</text>
        <text className={styles.plateSign} x="585" y="30" textAnchor="middle">−</text>
        {[90, 230].map(y => <path key={y} className={styles.fieldLine} d={`M105 ${y} H535`} markerEnd="url(#voltage-field-arrow)" />)}
        <text className={styles.fieldLabel} x="320" y="69" textAnchor="middle">E = 200 В/м</text>
        <path className={styles.equipotential} d={`M${A_X} 125 V250 M${bX} 125 V250`} />
        <circle className={styles.point} cx={A_X} cy="180" r="9" />
        <circle className={styles.point} cx={bX} cy="180" r="9" />
        <text className={styles.pointLabel} x={A_X} y="161" textAnchor="middle">A</text>
        <text className={styles.pointLabel} x={bX} y="161" textAnchor="middle">B</text>
        <path className={styles.measure} d={`M${A_X} 274 V288 H${bX} V274`} />
        <text className={styles.distanceLabel} x={(A_X + bX) / 2} y="317" textAnchor="middle">d = {distanceCm} см</text>
      </svg>
      <figcaption>На каждой вертикальной линии потенциал постоянен; от линии A к линии B он убывает вдоль поля.</figcaption>
    </figure>

    <div className={styles.reference} role="group" aria-label="Выбор нуля отсчёта потенциала">
      <span>Ноль отсчёта</span>
      <button type="button" aria-label="Выбрать отсчёт: потенциал A равен нулю вольт" aria-pressed={potentialAtA === 0} onClick={() => setPotentialAtA(0)}>φ<sub>A</sub> = 0 В</button>
      <button type="button" aria-label="Выбрать отсчёт: потенциал A равен ста вольтам" aria-pressed={potentialAtA === 100} onClick={() => setPotentialAtA(100)}>φ<sub>A</sub> = 100 В</button>
    </div>

    <div className={styles.reading} aria-live="polite">
      <div className={styles.potentials}>
        <p>Точка A <strong>φ<sub>A</sub> = {potentialAtA} В</strong></p>
        <p>Точка B <strong>φ<sub>B</sub> = {potentialAtB} В</strong></p>
      </div>
      <p className={styles.voltage}><span>Напряжение от A к B</span><strong>U<sub>AB</sub> = φ<sub>A</sub> − φ<sub>B</sub> = {voltage} В</strong><small>E = U<sub>AB</sub> ÷ d = {FIELD_V_PER_M} В/м</small></p>
    </div>
    <p className={styles.explanation}>{potentialAtA === 0
      ? "Смени ноль отсчёта: оба потенциала получат одинаковую добавку. Проверь, изменится ли напряжение."
      : "Оба потенциала выросли на 100 В, но их разность осталась прежней. Напряжение не зависит от выбранного нуля."}</p>
    <p className={styles.boundary}>Связь E = UAB / d здесь относится к точкам на одной линии однородного электростатического поля, когда B расположена по направлению E. У краёв пластин и в неоднородном поле эта простая формула не подходит.</p>
  </div>;
}
