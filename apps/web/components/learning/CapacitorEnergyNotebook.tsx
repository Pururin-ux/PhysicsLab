"use client";

import { useState } from "react";
import styles from "./CapacitorEnergyNotebook.module.css";

const INITIAL_CAPACITANCE_UF = 2;
const INITIAL_VOLTAGE_V = 100;
const INITIAL_CHARGE_UC = INITIAL_CAPACITANCE_UF * INITIAL_VOLTAGE_V;
const INITIAL_ENERGY_MJ = INITIAL_CAPACITANCE_UF * INITIAL_VOLTAGE_V ** 2 / 2000;

export function CapacitorEnergyNotebook() {
  const [sourceConnected, setSourceConnected] = useState(false);
  const [gapFactor, setGapFactor] = useState(1);
  const capacitanceUf = INITIAL_CAPACITANCE_UF / gapFactor;
  const chargeUc = sourceConnected ? capacitanceUf * INITIAL_VOLTAGE_V : INITIAL_CHARGE_UC;
  const voltageV = sourceConnected ? INITIAL_VOLTAGE_V : chargeUc / capacitanceUf;
  const energyMj = capacitanceUf * voltageV ** 2 / 2000;
  const formatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

  const condition = sourceConnected
    ? "Источник удерживает напряжение. Заряд меняется вместе с ёмкостью."
    : "Источник отключён. Заряд обкладок сохраняется."
  const conclusion = gapFactor === 1
    ? `Зазор пока не менялся: W = ${formatter.format(energyMj)} мДж.`
    : sourceConnected
      ? `При том же U энергия стала ${formatter.format(energyMj)} мДж — вдвое меньше исходной.`
      : `При том же q энергия стала ${formatter.format(energyMj)} мДж — вдвое больше исходной.`;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <span>Запись опыта · конденсатор</span>
        <h2>Что изменится при увеличении зазора?</h2>
        <p>Сравни два одинаковых изменения пластин. Меняется только то, подключён ли источник.</p>
      </header>

      <div className={styles.controls}>
        <fieldset className={styles.group}>
          <legend>Подключение источника</legend>
          <button type="button" aria-pressed={!sourceConnected} onClick={() => setSourceConnected(false)}>Отключён</button>
          <button type="button" aria-pressed={sourceConnected} onClick={() => setSourceConnected(true)}>Подключён</button>
        </fieldset>
        <fieldset className={styles.group}>
          <legend>Расстояние между пластинами</legend>
          {[1, 2].map((factor) => (
            <button key={factor} type="button" aria-pressed={gapFactor === factor} onClick={() => setGapFactor(factor)}>
              {factor === 1 ? "Исходное" : "В 2 раза больше"}
            </button>
          ))}
        </fieldset>
      </div>

      <p className={styles.condition}>{condition}</p>

      <div className={styles.readings} aria-label="Показания до и после изменения зазора">
        <div className={styles.readingColumn}>
          <h3>Сначала</h3>
          <dl>
            <div><dt>Заряд обкладки</dt><dd>q = 200 мкКл</dd></div>
            <div><dt>Ёмкость</dt><dd>C = 2 мкФ</dd></div>
            <div><dt>Напряжение</dt><dd>U = 100 В</dd></div>
            <div className={styles.energy}><dt>Энергия поля</dt><dd>W = 10 мДж</dd></div>
          </dl>
        </div>
        <div className={`${styles.readingColumn} ${styles.current}`}>
          <h3>После изменения</h3>
          <dl>
            <div><dt>Заряд обкладки</dt><dd>q = {formatter.format(chargeUc)} мкКл</dd></div>
            <div><dt>Ёмкость</dt><dd>C = {formatter.format(capacitanceUf)} мкФ</dd></div>
            <div><dt>Напряжение</dt><dd>U = {formatter.format(voltageV)} В</dd></div>
            <div className={styles.energy}><dt>Энергия поля</dt><dd>W = {formatter.format(energyMj)} мДж</dd></div>
          </dl>
        </div>
      </div>

      <p className={styles.conclusion} aria-live="polite">{conclusion}</p>
      <details className={styles.formula}>
        <summary>Как посчитать энергию</summary>
        <p>Используй ту запись формулы, где известны величины: <strong>W = CU² / 2 = qU / 2 = q² / (2C)</strong>.</p>
      </details>
      <p className={styles.boundary}>Здесь показана идеальная модель плоского конденсатора: при удвоении зазора его ёмкость уменьшается вдвое; краевыми эффектами пренебрегаем.</p>
    </div>
  );
}
