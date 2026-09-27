"use client";

import { useId, useState } from "react";
import { calculateMetalTemperature } from "../../lib/physics/metal-temperature-model";
import styles from "./MetalTemperatureNotebook.module.css";

const temperatures = [20, 40, 60, 80, 100] as const;
const model = {
  referenceTemperatureCelsius: 20,
  referenceResistanceOhms: 10,
  temperatureCoefficientPerCelsius: 0.004,
  voltageVolts: 12,
};
const format = (value: number) => value.toLocaleString("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const plotX = (temperature: number) => 10 + (temperature - 20) / 80 * 340;
const plotY = (resistance: number) => 150 - (resistance - 10) / 4 * 125;
const curve = Array.from({ length: 17 }, (_, index) => {
  const temperature = 20 + index * 5;
  const resistance = calculateMetalTemperature({ ...model, temperatureCelsius: temperature }).resistanceOhms;
  return (index === 0 ? "M" : "L") + plotX(temperature).toFixed(2) + " " + plotY(resistance).toFixed(2);
}).join(" ");

export function MetalTemperatureNotebook() {
  const headingId = useId();
  const [temperature, setTemperature] = useState<(typeof temperatures)[number]>(20);
  const reading = calculateMetalTemperature({ ...model, temperatureCelsius: temperature });
  const baseline = calculateMetalTemperature({ ...model, temperatureCelsius: 20 });
  const hotter = temperature > 20;

  return <section className={styles.notebook} aria-labelledby={headingId}>
    <header className={styles.heading}>
      <span>Запись в блокноте</span>
      <h2 id={headingId}>Нагрели металл. Что стало с током?</h2>
      <p>Источник держит 12 В. Выбери температуру того же проводника и сравни сопротивление и ток.</p>
    </header>
    <div className={styles.experiment}>
      <fieldset className={styles.conditions}>
        <legend>Температура проводника</legend>
        <div className={styles.choices}>{temperatures.map(value =>
          <button key={value} type="button" aria-pressed={temperature === value} onClick={() => setTemperature(value)}>{value} °C</button>
        )}</div>
        <p>Напряжение не меняем: <strong>12 В</strong></p>
      </fieldset>
      <figure className={styles.figure}>
        <div className={styles.figureHeading}><strong>Сопротивление при нагреве</strong><span>Одна шкала для всех состояний</span></div>
        <div className={styles.graphLayout}>
          <div className={styles.yLabels} aria-hidden="true"><span>14</span><span>12</span><span>10</span></div>
          <div className={styles.graph}>
            <svg viewBox="0 0 360 170" preserveAspectRatio="none" role="img" aria-label={"График учебной модели: сопротивление растёт от 10 ом при 20 градусах до 13,2 ома при 100 градусах. Выбрано " + temperature + " градусов, сопротивление " + format(reading.resistanceOhms) + " ома."}>
              <path d="M10 25H350M10 87.5H350M10 150H350" className={styles.grid} />
              <path d="M10 15V150H350" className={styles.axis} />
              <path d={curve} className={styles.curve} />
              <path d={"M" + plotX(temperature) + " " + plotY(reading.resistanceOhms) + "V150"} className={styles.guide} />
              <circle cx={plotX(temperature)} cy={plotY(reading.resistanceOhms)} r="7" className={styles.point} />
            </svg>
            <div className={styles.xLabels} aria-hidden="true"><span>20</span><span>60</span><span>100 °C</span></div>
          </div>
        </div>
        <figcaption>По вертикали R в омах, по горизонтали температура в °C. Показана заданная линейная модель, а не измерения образца.</figcaption>
      </figure>
      <div className={styles.finding}>
        <p className={styles.status} role="status">Температура {temperature} градусов, напряжение 12 вольт, сопротивление {format(reading.resistanceOhms)} ома, ток {format(reading.currentAmperes)} ампера. {hotter ? "По сравнению с 20 градусами сопротивление больше, ток меньше." : "Это исходное состояние для сравнения."}</p>
        <div className={styles.measure}><span>Сопротивление R</span><output>{format(reading.resistanceOhms)} <small>Ом</small></output></div>
        <div className={styles.measure}><span>Ток I при 12 В</span><output>{format(reading.currentAmperes)} <small>А</small></output></div>
        <p className={styles.conclusion}>{hotter
          ? "При том же напряжении сопротивление выросло, поэтому ток стал меньше."
          : "Исходная запись: 10,00 Ом и 1,20 А. Нагрей проводник и сравни."}</p>
        {hotter && <p className={styles.comparison}>При 20 °C: R = {format(baseline.resistanceOhms)} Ом, I = {format(baseline.currentAmperes)} А.</p>}
      </div>
    </div>
    <p className={styles.boundary}>Числа заданы для учебной модели обычного металла: при 20 °C сопротивление 10 Ом, а каждые 20 °C добавляют 0,8 Ом. Это не показания реальных приборов. Сверхпроводимость при очень низкой температуре — отдельное явление; продолжать эту прямую до неё нельзя.</p>
  </section>;
}
