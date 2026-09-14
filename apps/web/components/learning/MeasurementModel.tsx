"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./MeasurementModel.module.css";

const predictions = [
  { id: "volume", label: "Изменится объём воды" },
  { id: "precision", label: "Изменится точность отсчёта" },
] as const;

type PredictionId = (typeof predictions)[number]["id"];

export function MeasurementModel() {
  const [prediction, setPrediction] = useState<PredictionId | null>(null);
  const [compared, setCompared] = useState(false);

  const choose = (value: PredictionId) => {
    setPrediction(value);
    setCompared(false);
  };

  return (
    <div className={shared.experiment}>
      <div className={styles.study}>
        <figure className={styles.observation}>
          <Image
            className={styles.observationImage}
            src={MIO_SCENES.measurement}
            alt="Мио смотрит на поверхность воды в мензурке сбоку, расположив глаза на уровне мениска"
            fill
            sizes="(max-width: 640px) 100vw, 420px"
            priority
          />
          <figcaption>
            Мио смотрит сбоку: нижняя точка мениска должна быть на уровне глаз.
          </figcaption>
        </figure>

        <div className={styles.question}>
          <p className={styles.kicker}>Один уровень · две шкалы</p>
          <h2>Что изменится в записи?</h2>
          <p>
            В двух одинаковых мензурках находится по 32 мл воды. На первой шкале
            деления через 10 мл, на второй — через 2 мл.
          </p>
          <div className={styles.predictions} role="group" aria-label="Прогноз о двух шкалах">
            {predictions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={prediction === option.id}
                onClick={() => choose(option.id)}
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
            Сравнить записи
          </button>
        </div>
      </div>

      {compared ? (
        <div className={styles.result} role="status">
          <div className={styles.records} aria-label="Два результата измерения одного объёма">
            <section>
              <p>Крупная шкала</p>
              <strong>30 ± 5 мл</strong>
              <span>Цена деления: (40 − 20) ÷ 2 = 10 мл</span>
            </section>
            <section>
              <p>Мелкая шкала</p>
              <strong>32 ± 1 мл</strong>
              <span>Цена деления: (40 − 20) ÷ 10 = 2 мл</span>
            </section>
          </div>
          <div className={styles.conclusion}>
            <strong>
              {prediction === "precision"
                ? "Верно: воды столько же, отсчёт точнее."
                : "Объём воды не изменился."}
            </strong>
            <p>
              Запись 30 ± 5 мл означает диапазон от 25 до 35 мл — значение 32 мл
              в него входит. Более мелкая шкала сужает неопределённость до 1 мл.
            </p>
          </div>
        </div>
      ) : null}

      <details className={styles.uncertainty}>
        <summary>Почему в результате есть ±?</summary>
        <p>
          В этой школьной модели погрешность отсчёта принимаем равной половине
          цены деления. У реального прибора добавятся и другие источники
          погрешности, поэтому это правило не универсально для любых измерений.
        </p>
      </details>
    </div>
  );
}
