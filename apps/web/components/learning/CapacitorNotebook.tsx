"use client";

import { useState } from "react";
import { capacitancePf, disconnectedVoltageV, DISCONNECTED_CHARGE_NC } from "../../lib/physics/capacitor-model";
import styles from "./CapacitorNotebook.module.css";

const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export function CapacitorNotebook() {
  const [overlapCm2, setOverlapCm2] = useState(100);
  const [gapMm, setGapMm] = useState(2);
  const [relativePermittivity, setRelativePermittivity] = useState(1);
  const capacitance = capacitancePf({ overlapCm2, gapMm, relativePermittivity });
  const voltage = disconnectedVoltageV(capacitance);
  const plateHeight = overlapCm2 === 100 ? 180 : 90;
  const top = 190 - plateHeight / 2;
  const bottom = 190 + plateHeight / 2;
  const gap = gapMm === 2 ? 72 : 144;
  const left = 360 - gap / 2;
  const right = 360 + gap / 2;
  const chargeY = [0.18, 0.39, 0.61, 0.82].map(fraction => top + plateHeight * fraction);

  return <div className={styles.notebook}>
    <header className={styles.heading}>
      <span>Лабораторная запись · конденсатор</span>
      <h2>Заряд остался. Что изменится?</h2>
      <p>Пластины зарядили и отключили от источника. Теперь меняй их устройство и сравни показания.</p>
    </header>

    <div className={styles.controls}>
      <div className={styles.control} role="group" aria-label="Площадь перекрытия обкладок">
        <span>Перекрытие S</span>
        {[50, 100].map(area => <button key={area} type="button" aria-pressed={overlapCm2 === area} onClick={() => setOverlapCm2(area)}>{area} см²</button>)}
      </div>
      <div className={styles.control} role="group" aria-label="Расстояние между обкладками">
        <span>Зазор d</span>
        {[2, 4].map(distance => <button key={distance} type="button" aria-pressed={gapMm === distance} onClick={() => setGapMm(distance)}>{distance} мм</button>)}
      </div>
      <div className={styles.control} role="group" aria-label="Среда между обкладками">
        <span>Между пластинами</span>
        <button type="button" aria-pressed={relativePermittivity === 1} onClick={() => setRelativePermittivity(1)}>Воздух</button>
        <button type="button" aria-pressed={relativePermittivity === 2} onClick={() => setRelativePermittivity(2)}>Диэлектрик ε = 2</button>
      </div>
    </div>

    <div className={styles.observation}>
      <figure className={styles.figure}>
        <svg viewBox="0 0 720 375" role="img" aria-label={`Две противоположно заряженные параллельные обкладки. Площадь перекрытия ${overlapCm2} квадратных сантиметров, расстояние ${gapMm} миллиметра, относительная диэлектрическая проницаемость ${relativePermittivity}. Заряды обкладок остаются плюс и минус один нанокулон.`}>
          <path className={styles.baseline} d="M118 321 H602" />
          <path className={styles.plateSide} d={`M${left - 17} ${top - 11} L${left} ${top} V${bottom} L${left - 17} ${bottom - 11} Z`} />
          <path className={styles.plateFace} d={`M${left} ${top} H${left + 9} V${bottom} H${left} Z`} />
          <path className={styles.plateSide} d={`M${right} ${top} L${right + 17} ${top - 11} V${bottom - 11} L${right} ${bottom} Z`} />
          <path className={styles.plateFace} d={`M${right - 9} ${top} H${right} V${bottom} H${right - 9} Z`} />
          {relativePermittivity === 2 && <path className={styles.dielectric} d={`M${left + 11} ${top + 6} H${right - 11} V${bottom - 6} H${left + 11} Z`} />}
          {chargeY.map((y, index) => <g key={index} className={styles.charges}>
            <text x={left + 12} y={y}>+</text><text x={right - 22} y={y}>−</text>
          </g>)}
          <path className={styles.measure} d={`M${left} 313 V327 H${right} V313`} />
          <text className={styles.measureLabel} x="360" y="356" textAnchor="middle">d = {gapMm} мм</text>
          <path className={styles.areaMeasure} d={`M${left - 37} ${top} H${left - 47} V${bottom} H${left - 37}`} />
          <text className={styles.areaLabel} x={left - 56} y="190" textAnchor="middle" transform={`rotate(-90 ${left - 56} 190)`}>S = {overlapCm2} см²</text>
          {relativePermittivity === 2 && <text className={styles.dielectricLabel} x="360" y="56" textAnchor="middle">ε = 2</text>}
        </svg>
        <figcaption>Показана центральная область пластин. При большем перекрытии видимая высота обкладок растёт; при большем зазоре расстояние на схеме удваивается.</figcaption>
      </figure>

      <div className={styles.readout} aria-live="polite">
        <p className={styles.fixed}><span>Источник отключён · заряд каждой обкладки по модулю</span><strong>q = {number.format(DISCONNECTED_CHARGE_NC)} нКл</strong></p>
        <p><span>Электроёмкость</span><strong>C = {number.format(capacitance)} пФ</strong></p>
        <p className={styles.voltage}><span>Напряжение между обкладками</span><strong>U = {number.format(voltage)} В</strong></p>
        <p className={styles.relation}>C = εε₀S / d <span aria-hidden="true">·</span> U = q / C</p>
      </div>
    </div>

    <p className={styles.inference}>Проверь: когда ёмкость увеличивается при неизменном заряде, напряжение уменьшается. Само отношение q/U не заставляет ёмкость меняться — её задают обкладки и среда.</p>
    <p className={styles.boundary}>Модель плоского конденсатора: параллельные обкладки, однородный диэлектрик и зазор намного меньше размеров пластин. Поле у краёв здесь не рассчитывается.</p>
  </div>;
}
