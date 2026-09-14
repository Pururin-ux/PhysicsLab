"use client";

import Image from "next/image";
import { useState } from "react";
import { MathText } from "../ui/MathText";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./PressureModel.module.css";

const predictions = [
  { id: "narrow", label: "У узкой грани — площадь меньше" },
  { id: "same", label: "Одинаковое — бруски одинаковые" },
  { id: "wide", label: "У широкой грани — площадь больше" },
] as const;

type PredictionId = (typeof predictions)[number]["id"];
type Force = 40 | 80;

const areas = {
  narrow: 20,
  wide: 40,
} as const;

function pressureKPa(force: Force, areaCm2: number) {
  return force / (areaCm2 / 10_000) / 1_000;
}

export function PressureModel() {
  const [prediction, setPrediction] = useState<PredictionId | null>(null);
  const [compared, setCompared] = useState(false);
  const [wideForce, setWideForce] = useState<Force>(40);

  const choosePrediction = (value: PredictionId) => {
    setPrediction(value);
    setCompared(false);
  };

  const narrowPressure = pressureKPa(40, areas.narrow);
  const widePressure = pressureKPa(40, areas.wide);
  const changedForcePressure = pressureKPa(wideForce, areas.wide);

  return (
    <div className={shared.experiment}>
      <div className={styles.study}>
        <figure className={styles.observation}>
          <Image
            className={styles.observationImage}
            src={MIO_SCENES.pressure}
            alt="Мио сравнивает следы двух одинаковых брусков: один стоит на широкой грани, другой — на узкой"
            fill
            sizes="(max-width: 640px) 100vw, 430px"
            priority
          />
          <figcaption>
            Мио поставила одинаковые бруски на разные грани. Узкая грань продавила
            опору сильнее.
          </figcaption>
        </figure>

        <div className={styles.question}>
          <p className={styles.kicker}>Одна сила · разная площадь</p>
          <h2>Где давление больше?</h2>
          <p>
            В модели сила давления каждого бруска равна 40 Н. Площадь узкой грани —
            20 см², широкой — 40 см². Сначала сделай прогноз.
          </p>
          <div className={styles.predictions} role="group" aria-label="Прогноз о давлении">
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
            Сравнить давление
          </button>
        </div>
      </div>

      {compared ? (
        <section className={styles.result} aria-labelledby="pressure-result-title">
          <div className={styles.resultHeading}>
            <p>Сила в обоих случаях</p>
            <strong>40 Н</strong>
          </div>

          <div className={styles.comparison} aria-label="Сравнение давления на узкой и широкой грани">
            <article className={styles.narrowCase}>
              <p>Узкая грань</p>
              <dl>
                <div><dt>Площадь</dt><dd>20 см²</dd></div>
                <div><dt>Давление</dt><dd>{narrowPressure} кПа</dd></div>
              </dl>
              <MathText text={String.raw`$p=\frac{40\ \text{Н}}{0{,}002\ \text{м}^2}=20\ \text{кПа}$`} />
            </article>
            <article className={styles.wideCase}>
              <p>Широкая грань</p>
              <dl>
                <div><dt>Площадь</dt><dd>40 см²</dd></div>
                <div><dt>Давление</dt><dd>{widePressure} кПа</dd></div>
              </dl>
              <MathText text={String.raw`$p=\frac{40\ \text{Н}}{0{,}004\ \text{м}^2}=10\ \text{кПа}$`} />
            </article>
          </div>

          <div className={styles.conclusion} role="status">
            <strong id="pressure-result-title">
              {prediction === "narrow"
                ? "Верно: меньшая площадь дала большее давление."
                : "Давление больше у узкой грани."}
            </strong>
            <p>
              Площадь увеличилась вдвое, а сила осталась прежней — поэтому давление
              уменьшилось с 20 до 10 кПа, тоже вдвое.
            </p>
          </div>
        </section>
      ) : null}

      <details className={styles.forceCheck}>
        <summary>А если увеличить силу?</summary>
        <div className={styles.forceCheckBody}>
          <p>Оставим площадь широкой грани равной 40 см² и изменим только силу.</p>
          <div className={styles.forceOptions} role="group" aria-label="Сила давления на широкую грань">
            {([40, 80] as const).map((force) => (
              <button
                key={force}
                type="button"
                aria-pressed={wideForce === force}
                onClick={() => setWideForce(force)}
              >
                {force} Н
              </button>
            ))}
          </div>
          <div className={styles.forceReading} aria-live="polite">
            <MathText
              text={String.raw`$p=\frac{${wideForce}\ \text{Н}}{0{,}004\ \text{м}^2}=${changedForcePressure}\ \text{кПа}$`}
            />
            <p>
              {wideForce === 80
                ? "При той же площади сила выросла вдвое — давление тоже выросло вдвое."
                : "Это исходное давление на широкую грань."}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
