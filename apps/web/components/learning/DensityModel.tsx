"use client";

import Image from "next/image";
import { useState } from "react";
import { MathText } from "../ui/MathText";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./DensityModel.module.css";

const predictions = [
  { id: "a", label: "A — он занимает больше места" },
  { id: "same", label: "Плотность одинаковая" },
  { id: "b", label: "B — в каждом см³ больше массы" },
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
        <figure className={styles.observation}>
          <Image
            className={styles.observationImage}
            src={MIO_SCENES.density}
            alt="Мио взвешивает небольшой тёмный образец; рядом лежит более крупный светлый образец и стоит мензурка"
            fill
            sizes="(max-width: 640px) 100vw, 440px"
            priority
          />
          <figcaption>
            Мио записывает массу и объём каждого образца. Размер на глаз не отвечает,
            сколько массы приходится на 1 см³.
          </figcaption>
        </figure>

        <div className={styles.question}>
          <p className={styles.kicker}>Два образца · одно сравнение</p>
          <h2>Какой образец плотнее?</h2>
          <p>
            Образец A: 54 г и 20 см³. Образец B: 78 г и 10 см³. Оба сплошные,
            однородные и находятся при одной температуре.
          </p>
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
              <dl>
                <div><dt>Масса</dt><dd>54 г</dd></div>
                <div><dt>Объём</dt><dd>20 см³</dd></div>
                <div><dt>Плотность</dt><dd>2,7 г/см³</dd></div>
              </dl>
              <MathText text={String.raw`$\rho_A=\frac{54\ \text{г}}{20\ \text{см}^3}=2{,}7\ \text{г/см}^3$`} />
            </article>
            <article className={styles.denserSample}>
              <p>Образец B · меньше</p>
              <dl>
                <div><dt>Масса</dt><dd>78 г</dd></div>
                <div><dt>Объём</dt><dd>10 см³</dd></div>
                <div><dt>Плотность</dt><dd>7,8 г/см³</dd></div>
              </dl>
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
              Каждый кубический сантиметр B имеет массу 7,8 г, а каждый кубический
              сантиметр A — 2,7 г. Размер тела и плотность вещества отвечают на разные
              вопросы.
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
