"use client";

import Image from "next/image";
import { useState } from "react";
import { MathText } from "../ui/MathText";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./DensityModel.module.css";

const predictions = [
  { id: "a", label: "Образец A плотнее" },
  { id: "same", label: "Плотность одинаковая" },
  { id: "b", label: "Образец B плотнее" },
] as const;

type PredictionId = (typeof predictions)[number]["id"];

export function DensityModel() {
  const [prediction, setPrediction] = useState<PredictionId | null>(null);
  const [compared, setCompared] = useState(false);

  const choosePrediction = (value: PredictionId) => {
    setPrediction(value);
    setCompared(false);
  };

  return (
    <div className={shared.experiment}>
      <div className={styles.study}>
        <div className={styles.questionIntro}>
          <p className={styles.kicker}>Два образца · одно сравнение</p>
          <h2>Какой образец плотнее?</h2>
          <p>
            Мио измерила массу и объём двух сплошных однородных образцов при одной
            температуре. Сравни, сколько массы приходится на 1 см³ каждого.
          </p>
        </div>

        <figure className={styles.observation}>
          <div className={styles.observationFrame}>
            <Image
              className={styles.observationImage}
              src={MIO_SCENES.density}
              alt="Мио ставит маленький тёмный образец на весы; большой светлый лежит рядом"
              fill
              sizes="(max-width: 640px) 100vw, 440px"
              priority
            />
          </div>
          <figcaption>
            <table className={styles.measurements}>
              <caption>Измерения Мио</caption>
              <thead>
                <tr><th scope="col">Образец</th><th scope="col">Масса</th><th scope="col">Объём</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">A <span>крупный, светлый</span></th>
                  <td>54 г</td><td>20 см³</td>
                </tr>
                <tr>
                  <th scope="row">B <span>маленький, тёмный</span></th>
                  <td>78 г</td><td>10 см³</td>
                </tr>
              </tbody>
            </table>
          </figcaption>
        </figure>

        <div className={styles.questionControls}>
          <div className={styles.predictions} role="group" aria-label="Прогноз о плотности образцов">
            {predictions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={prediction === option.id}
                onClick={() => choosePrediction(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className={styles.compare}
            type="button"
            disabled={!prediction}
            onClick={() => setCompared(true)}
          >
            Сравнить 1 см³
          </button>
        </div>
      </div>

      {compared ? (
        <section className={styles.result} aria-labelledby="density-result-title">
          <div className={styles.resultHeading}>
            <p>Плотность показывает массу единицы объёма</p>
            <MathText text={String.raw`$\rho=\frac{m}{V}$`} />
          </div>

          <div className={styles.comparison} aria-label="Расчёт плотности двух образцов">
            <article>
              <p>Образец A · крупнее</p>
              <div className={styles.unitMass}>
                <span>В 1 см³</span>
                <strong>2,7 г</strong>
              </div>
              <MathText text={String.raw`$\rho_A=\frac{54\ \text{г}}{20\ \text{см}^3}=2{,}7\ \text{г/см}^3$`} />
            </article>
            <article className={styles.denserSample}>
              <p>Образец B · меньше</p>
              <div className={styles.unitMass}>
                <span>В 1 см³</span>
                <strong>7,8 г</strong>
              </div>
              <MathText text={String.raw`$\rho_B=\frac{78\ \text{г}}{10\ \text{см}^3}=7{,}8\ \text{г/см}^3$`} />
            </article>
          </div>

          <div className={styles.conclusion} role="status">
            <strong id="density-result-title">
              {prediction === "b"
                ? "Верно: меньший образец B плотнее."
                : "Плотнее образец B, хотя он занимает меньше места."}
            </strong>
            <p>
              В одинаковом объёме масса B больше: 7,8 г против 2,7 г. Размер
              тела и плотность вещества отвечают на разные вопросы.
            </p>
          </div>
        </section>
      ) : null}

      <details className={styles.followUp}>
        <summary>Если разделить образец A пополам?</summary>
        <div className={styles.followUpBody}>
          <div>
            <p>Целый A</p>
            <strong>54 г ÷ 20 см³ = 2,7 г/см³</strong>
          </div>
          <div>
            <p>Каждая половина</p>
            <strong>27 г ÷ 10 см³ = 2,7 г/см³</strong>
          </div>
          <p>
            Масса и объём уменьшились вдвое, а их отношение сохранилось. Это верно
            для однородного образца без потери вещества при тех же условиях.
          </p>
        </div>
      </details>

      <details className={styles.followUp}>
        <summary>Почему 2,7 г/см³ = 2700 кг/м³?</summary>
        <p className={styles.conversion}>
          1 г = 0,001 кг, а 1 см³ = 0,000001 м³. Поэтому численное значение в кг/м³
          в 1000 раз больше: 2,7 г/см³ = 2700 кг/м³. Сам образец при смене единиц не
          меняется.
        </p>
      </details>
    </div>
  );
}
