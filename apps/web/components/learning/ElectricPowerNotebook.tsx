"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./ElectricPowerNotebook.module.css";

const VOLTAGE = 12;
const CURRENT_OPTIONS = [1, 2, 3] as const;
const TIME_OPTIONS = [5, 10, 20] as const;

function EnergyRectangle({ power, seconds, work }: { power: number; seconds: number; work: number }) {
  const plotLeft = 88;
  const plotBottom = 226;
  const plotWidth = 450;
  const plotHeight = 168;
  const width = (seconds / 20) * plotWidth;
  const height = (power / 36) * plotHeight;
  const x2 = plotLeft + width;
  const y = plotBottom - height;

  return (
    <svg
      className={styles.graph}
      viewBox="0 0 590 280"
      role="img"
      aria-label={`График мощности от времени: постоянная мощность ${power} ватт действует ${seconds} секунд. Площадь прямоугольника соответствует работе ${work} джоулей.`}
    >
      <path className={styles.grid} d="M88 58H538M88 114H538M88 170H538M200.5 58V226M313 58V226M425.5 58V226M538 58V226" />
      <path className={styles.axis} d="M88 40V226H556M82 58H94M82 114H94M82 170H94M200.5 220V232M313 220V232M425.5 220V232M538 220V232" />
      <rect className={styles.energyArea} x={plotLeft} y={y} width={width} height={height} />
      <path className={styles.powerLine} d={`M${plotLeft} ${y}H${x2}`} />
      <text className={styles.axisLabel} x="40" y="48">P, Вт</text>
      <text className={styles.axisLabel} x="552" y="258">t, с</text>
      <text className={styles.tick} x="72" y="64" textAnchor="end">36</text>
      <text className={styles.tick} x="72" y="120" textAnchor="end">24</text>
      <text className={styles.tick} x="72" y="176" textAnchor="end">12</text>
      <text className={styles.tick} x="200.5" y="251" textAnchor="middle">5</text>
      <text className={styles.tick} x="313" y="251" textAnchor="middle">10</text>
      <text className={styles.tick} x="425.5" y="251" textAnchor="middle">15</text>
      <text className={styles.tick} x="538" y="251" textAnchor="middle">20</text>
      <text className={styles.powerTag} x={Math.min(x2 + 8, 522)} y={Math.max(y - 9, 25)} textAnchor={x2 > 500 ? "end" : "start"}>P = {power} Вт</text>
      <text className={styles.areaLabel} x={plotLeft + width / 2} y={y + height / 2 + 7} textAnchor="middle">A = {work} Дж</text>
    </svg>
  );
}

export function ElectricPowerNotebook() {
  const [current, setCurrent] = useState<(typeof CURRENT_OPTIONS)[number]>(2);
  const [seconds, setSeconds] = useState<(typeof TIME_OPTIONS)[number]>(10);
  const power = VOLTAGE * current;
  const work = power * seconds;
  const resistance = VOLTAGE / current;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Запись измерений</p>
        <h2>Ватты показывают темп. Джоули — итог.</h2>
        <span>Напряжение постоянно. Измени ток или время и посмотри, какая величина отвечает за каждое изменение.</span>
      </header>

      <div className={styles.workspace}>
        <section className={styles.measurements} aria-label="Условия опыта">
          <div className={styles.meters}>
            <div><span>Вольтметр</span><output>12 В</output></div>
            <div><span>Амперметр</span><output>{current} А</output></div>
            <div><span>Секундомер</span><output>{seconds} с</output></div>
          </div>

          <fieldset className={styles.selector}>
            <legend>Сила тока</legend>
            <div>{CURRENT_OPTIONS.map(value => <button type="button" key={value} aria-pressed={current === value} onClick={() => setCurrent(value)}>{value} А</button>)}</div>
          </fieldset>
          <fieldset className={styles.selector}>
            <legend>Время работы</legend>
            <div>{TIME_OPTIONS.map(value => <button type="button" key={value} aria-pressed={seconds === value} onClick={() => setSeconds(value)}>{value} с</button>)}</div>
          </fieldset>

          <div className={styles.derivation} aria-live="polite">
            <div>
              <span>За одну секунду</span>
              <MathText className={styles.formula} text={`$P=UI=12\\cdot${current}=${power}\\,\\text{Вт}$`} />
            </div>
            <div>
              <span>За всё время</span>
              <MathText className={styles.formula} text={`$A=Pt=${power}\\cdot${seconds}=${work}\\,\\text{Дж}$`} />
            </div>
          </div>
        </section>

        <figure className={styles.figure}>
          <EnergyRectangle power={power} seconds={seconds} work={work} />
          <figcaption>Высота показывает энергию за секунду, ширина — число секунд. Поэтому площадь прямоугольника равна всей переданной энергии.</figcaption>
        </figure>
      </div>

      <div className={styles.marginNote}>
        <span>Поправка Мио</span>
        <p><s>P = {power} Вт — энергия</s><strong>P = {power} Вт означает {power} Дж каждую секунду.</strong></p>
        <small>Если вся эта энергия превращается во внутреннюю энергию резистора, то <MathText text="$Q=A=I^2Rt$" />.</small>
      </div>

      <div className={styles.checkline}>
        <span>Проверка по закону Ома</span>
        <MathText text={`$R=\\dfrac{U}{I}=\\dfrac{12}{${current}}=${resistance}\\,\\text{Ом},\\qquad P=I^2R=${current}^2\\cdot${resistance}=${power}\\,\\text{Вт}$`} />
      </div>
    </div>
  );
}
