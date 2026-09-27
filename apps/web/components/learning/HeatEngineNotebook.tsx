"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./HeatEngineNotebook.module.css";

const HEAT_INPUT_J = 1000;

export function HeatEngineNotebook() {
  const [coolerHeat, setCoolerHeat] = useState(600);
  const cycleWork = HEAT_INPUT_J - coolerHeat;
  const efficiency = cycleWork / HEAT_INPUT_J * 100;

  return (
    <div className={styles.notebook}>
      <div className={styles.workspace}>
        <section className={styles.flow} aria-label="Энергия за один цикл теплового двигателя">
          <div className={styles.heater}>
            <span>Источник энергии</span>
            <strong>Нагреватель</strong>
            <small>температура T₁</small>
          </div>
          <div className={styles.inputFlow}><span>получено Q₁ = {HEAT_INPUT_J} Дж</span><b aria-hidden="true">↓</b></div>
          <div className={styles.workingBody}>
            <span>Внутри двигателя</span>
            <strong>Рабочее тело</strong>
            <small>После цикла возвращается в исходное состояние: ΔU<sub>цикл</sub> = 0</small>
          </div>
          <label className={styles.sliderLabel} htmlFor="heat-engine-cooler">
            Сколько энергии передано холодильнику?
            <output htmlFor="heat-engine-cooler">|Q₂| = {coolerHeat} Дж</output>
          </label>
          <input
            id="heat-engine-cooler"
            className={styles.slider}
            type="range"
            min="400"
            max="800"
            step="100"
            value={coolerHeat}
            onChange={event => setCoolerHeat(Number(event.currentTarget.value))}
            aria-describedby="heat-engine-slider-note"
          />
          <p id="heat-engine-slider-note" className={styles.sliderNote}>Сравни условные циклы при одинаковом Q₁. Меньше отдано холодильнику — больше работы за цикл.</p>
          <div
            className={styles.split}
            role="img"
            aria-label={"Из " + HEAT_INPUT_J + " джоулей, полученных от нагревателя, " +
              cycleWork + " джоулей стали работой, " + coolerHeat + " джоулей переданы холодильнику"}
          >
            <span className={styles.workShare} style={{ width: String(cycleWork / HEAT_INPUT_J * 100) + "%" }} />
            <span className={styles.coolerShare} style={{ width: String(coolerHeat / HEAT_INPUT_J * 100) + "%" }} />
          </div>
          <div className={styles.outputs} aria-live="polite">
            <div className={styles.workOutput}><span>Наружу как работа</span><strong>A<sub>ц</sub> = {cycleWork} Дж</strong></div>
            <div className={styles.coolerOutput}><span>Отдано холодильнику · T₂ &lt; T₁</span><strong>|Q₂| = {coolerHeat} Дж</strong></div>
          </div>
        </section>

        <aside className={styles.reading}>
          <span>Термический КПД</span>
          <output aria-live="polite">{efficiency} %</output>
          <p><MathText text="$\eta_{\text{т}}=\frac{A_{\text{ц}}}{Q_1}=\frac{Q_1-|Q_2|}{Q_1}$" /></p>
          <p>Q₂ для рабочего тела отрицательно: <MathText text="$Q_2=-|Q_2|$" />. Поэтому из полученной энергии вычитаем модуль теплоты, переданной холодильнику.</p>
        </aside>
      </div>

      <div className={styles.distinction}>
        <strong>Какой КПД считаем?</strong>
        <p><b>Термический</b> сравнивает работу рабочего тела за цикл с теплотой нагревателя. <b>Эффективный</b> сравнивает полезную работу всей установки с энергией топлива. Это разные показатели.</p>
      </div>
      <p className={styles.boundary}>Меняя ползунок, ты распределяешь одни и те же 1000 Дж между работой и холодильником. Это схема одного цикла, а не предсказание КПД реального двигателя по температурам T₁ и T₂.</p>
    </div>
  );
}
