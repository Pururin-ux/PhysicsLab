"use client";

import { useState } from "react";
import styles from "./SpringPeriodNotebook.module.css";

type Parameter = "mass" | "stiffness";

const BASE_MASS_KG = 0.2;
const BASE_STIFFNESS_N_M = 100;
const factors = [1, 2, 4] as const;

function periodSeconds(massKg: number, stiffnessNPerM: number) {
  return 2 * Math.PI * Math.sqrt(massKg / stiffnessNPerM);
}

export function SpringPeriodNotebook() {
  const [parameter, setParameter] = useState<Parameter>("mass");
  const [factor, setFactor] = useState<(typeof factors)[number]>(1);
  const initialPeriod = periodSeconds(BASE_MASS_KG, BASE_STIFFNESS_N_M);
  const massKg = parameter === "mass" ? BASE_MASS_KG * factor : BASE_MASS_KG;
  const stiffnessNPerM = parameter === "stiffness" ? BASE_STIFFNESS_N_M * factor : BASE_STIFFNESS_N_M;
  const currentPeriod = periodSeconds(massKg, stiffnessNPerM);
  const format = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

  const conclusion = factor === 1
    ? "Параметры не изменились: период остался прежним."
    : parameter === "mass"
      ? `Масса выросла в ${factor} раза, а период — только в ${format.format(Math.sqrt(factor))} раза: T ∝ √m.`
      : `Жёсткость выросла в ${factor} раза, поэтому период стал в ${format.format(Math.sqrt(factor))} раза меньше: T ∝ 1/√k.`;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <span>Запись опыта · пружинный маятник</span>
        <h2>Что изменится, если поменять один параметр?</h2>
        <p>Сравни с исходным грузом и пружиной. Остальное в модели сохраняется.</p>
      </header>

      <div className={styles.controls}>
        <fieldset className={styles.group}>
          <legend>Что меняет Мио?</legend>
          <button type="button" aria-pressed={parameter === "mass"} onClick={() => setParameter("mass")}>Массу груза</button>
          <button type="button" aria-pressed={parameter === "stiffness"} onClick={() => setParameter("stiffness")}>Жёсткость пружины</button>
        </fieldset>
        <fieldset className={styles.group}>
          <legend>{parameter === "mass" ? "Во сколько раз увеличить массу" : "Во сколько раз увеличить жёсткость"}</legend>
          {factors.map(value => (
            <button key={value} type="button" aria-pressed={factor === value} onClick={() => setFactor(value)}>
              {value === 1 ? "Как было" : `В ${value} раза`}
            </button>
          ))}
        </fieldset>
      </div>

      <div className={styles.readings} aria-label="Сравнение периода до и после изменения">
        <div className={styles.reading}>
          <h3>Исходная система</h3>
          <dl>
            <div><dt>Масса груза</dt><dd>0,20 кг</dd></div>
            <div><dt>Жёсткость</dt><dd>100 Н/м</dd></div>
            <div className={styles.result}><dt>Период</dt><dd>{format.format(initialPeriod)} с</dd></div>
          </dl>
        </div>
        <div className={`${styles.reading} ${styles.changed}`}>
          <h3>После изменения</h3>
          <dl>
            <div><dt>Масса груза</dt><dd>{format.format(massKg)} кг</dd></div>
            <div><dt>Жёсткость</dt><dd>{format.format(stiffnessNPerM)} Н/м</dd></div>
            <div className={styles.result}><dt>Период</dt><dd>{format.format(currentPeriod)} с</dd></div>
          </dl>
        </div>
      </div>

      <p className={styles.conclusion} aria-live="polite">{conclusion}</p>
      <details className={styles.formula}>
        <summary>Почему период меняется так?</summary>
        <p><strong>T = 2π√(m/k)</strong>. Масса стоит под корнем в числителе, жёсткость — в знаменателе.</p>
      </details>
      <p className={styles.boundary}>Это идеальная модель: пружина упругая, сопротивлением движения можно пренебречь.</p>
    </div>
  );
}
