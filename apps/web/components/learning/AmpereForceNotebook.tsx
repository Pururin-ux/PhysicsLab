"use client";

import { useId, useState } from "react";
import { calculateAmpereForce } from "../../lib/physics/ampere-force-model";
import styles from "./AmpereForceNotebook.module.css";

const fields = [0.2, 0.4] as const;
const currents = [2, 4] as const;
const angles = [0, 30, 90, 150, 180] as const;
const LENGTH_METRES = 0.5;
const SCALE_NEWTONS = 0.8;
const format = (value: number, digits = 2) => value.toLocaleString("ru-RU", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});

export function AmpereForceNotebook() {
  const headingId = useId();
  const [field, setField] = useState<(typeof fields)[number]>(0.4);
  const [current, setCurrent] = useState<(typeof currents)[number]>(2);
  const [angle, setAngle] = useState<(typeof angles)[number]>(90);
  const reading = calculateAmpereForce({
    magneticInductionTeslas: field,
    currentAmperes: current,
    conductorLengthMetres: LENGTH_METRES,
    angleDegrees: angle,
  });

  const plotX = (degrees: number) => degrees / 180 * 600;
  const plotY = (newtons: number) => 165 - newtons / SCALE_NEWTONS * 150;
  const curve = Array.from({ length: 37 }, (_, index) => {
    const degrees = index * 5;
    const value = calculateAmpereForce({
      magneticInductionTeslas: field,
      currentAmperes: current,
      conductorLengthMetres: LENGTH_METRES,
      angleDegrees: degrees,
    }).forceNewtons;
    return `${index === 0 ? "M" : "L"}${plotX(degrees).toFixed(2)} ${plotY(value).toFixed(2)}`;
  }).join(" ");
  const observation = angle === 0 || angle === 180
    ? "Проводник направлен вдоль поля: сила Ампера равна нулю."
    : angle === 90
      ? "Проводник поперёк поля: сила максимальна при выбранных B и I."
      : "Проводник расположен под углом: действует только поперечная составляющая поля.";

  return <section className={styles.notebook} aria-labelledby={headingId}>
    <header className={styles.heading}>
      <span>Опыт на полях блокнота</span>
      <h2 id={headingId}>То же поле. Другая сила.</h2>
      <p>Участок провода длиной 0,50 м находится в однородном внешнем поле. Меняй по одному условию и сравни силу.</p>
    </header>

    <div className={styles.controls} aria-label="Условия опыта">
      <fieldset>
        <legend>Индукция внешнего поля B</legend>
        <div className={styles.choices}>{fields.map(value => <button key={value} type="button" aria-pressed={field === value} onClick={() => setField(value)}>{format(value, 1)} Тл</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>Ток в проводнике I</legend>
        <div className={styles.choices}>{currents.map(value => <button key={value} type="button" aria-pressed={current === value} onClick={() => setCurrent(value)}>{value} А</button>)}</div>
      </fieldset>
      <fieldset className={styles.angleControl}>
        <legend>Угол между током и полем α</legend>
        <div className={styles.choices}>{angles.map(value => <button key={value} type="button" aria-pressed={angle === value} onClick={() => setAngle(value)}>{value}°</button>)}</div>
      </fieldset>
    </div>

    <div className={styles.record}>
      <figure className={styles.plot}>
        <div className={styles.plotHeading}><span>Сила при повороте проводника</span><strong>B = {format(field, 1)} Тл · I = {current} А</strong></div>
        <div className={styles.plotArea}>
          <div className={styles.yLabels} aria-hidden="true"><span>0,8</span><span>0,4</span><span>0</span></div>
          <div className={styles.graph}>
            <svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M0 90H600M0 15H600" className={styles.grid} />
              <path d="M0 15V165H600" className={styles.axis} />
              <path d="M300 15V165" className={styles.midline} />
              <path d={curve} className={styles.curve} />
              <path d={`M${plotX(angle)} ${plotY(reading.forceNewtons)}V165`} className={styles.selectedLine} />
              <circle cx={plotX(angle)} cy={plotY(reading.forceNewtons)} r="7" className={styles.selectedPoint} />
            </svg>
            <div className={styles.xLabels} aria-hidden="true"><span>0°</span><span>90°</span><span>180°</span></div>
          </div>
        </div>
        <figcaption>По вертикали — модуль силы в ньютонах; шкала 0–0,8 Н одинакова во всех состояниях. По горизонтали — угол α.</figcaption>
      </figure>

      <div className={styles.finding}>
        <p className={styles.announcement} role="status">Угол {angle} градусов, B {format(field, 1)} тесла, ток {current} ампера. Сила Ампера {format(reading.forceNewtons)} ньютона.</p>
        <span className={styles.resultLabel}>Модуль силы Ампера</span>
        <output>{format(reading.forceNewtons)} <small>Н</small></output>
        <p className={styles.observation}>{observation}</p>
        {angle !== 90 && <div className={styles.comparison}><span>При 90° с теми же B и I</span><strong>{format(reading.maximumForceNewtons)} Н</strong></div>}
      </div>
    </div>

    <p className={styles.boundary}>График показывает модуль по закону F = BIℓ sin α. Направление силы определяют отдельно по правилу левой руки. Поле провода и движение реальной установки здесь не рассчитываются.</p>
  </section>;
}
