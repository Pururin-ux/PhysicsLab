"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import styles from "./ElectroResistanceExperiment.module.css";

const SOURCE_VOLTAGE = 12;
const observations = [
  { resistance: 3, current: 4 },
  { resistance: 6, current: 2 },
  { resistance: 12, current: 1 },
] as const;

export function ElectroPredictionScene({
  caption = "Мио оставила источник прежним. Показание амперметра пока закрыто — сначала нужен прогноз.",
}: {
  caption?: string;
} = {}) {
  return (
    <figure className={styles.prediction} aria-labelledby="electro-prediction-caption">
      <div className={styles.portrait}>
        <Image
          src={MIO_PORTRAITS.skeptical.src}
          alt="Мио настороженно сравнивает две записи в блокноте."
          fill
          priority
          sizes="(max-width: 760px) 58vw, 24vw"
        />
      </div>
      <div className={styles.condition}>
        <p>Оставляем</p>
        <strong><i>U</i> = 12 В</strong>
        <span>напряжение источника</span>
        <div className={styles.change} aria-label="Сопротивление меняется с трёх до шести ом">
          <b>3 Ом</b>
          <span aria-hidden="true">→</span>
          <b>6 Ом</b>
        </div>
        <p>Меняем только сопротивление</p>
      </div>
      <figcaption id="electro-prediction-caption">
        {caption}
      </figcaption>
    </figure>
  );
}

export function ElectroResistanceExperiment() {
  const [resistance, setResistance] = useState<number>(3);
  const current = observations.find((item) => item.resistance === resistance) ?? observations[0];

  return (
    <section className={styles.experiment} aria-label="Опыт с сопротивлением при постоянном напряжении">
      <div className={styles.experimentHeader}>
        <span>Не меняем</span>
        <strong><i>U</i> = {SOURCE_VOLTAGE} В</strong>
      </div>
      <fieldset className={styles.selector}>
        <legend>Выбери сопротивление участка</legend>
        <div>
          {observations.map((item) => (
            <button
              type="button"
              key={item.resistance}
              aria-pressed={resistance === item.resistance}
              onClick={() => setResistance(item.resistance)}
            >
              {item.resistance} Ом
            </button>
          ))}
        </div>
      </fieldset>
      <div className={styles.reading}>
        <p>Показание амперметра</p>
        <output key={current.resistance} aria-live="polite">
          <i>I</i> = <strong>{current.current}</strong> А
        </output>
      </div>
      <p className={styles.check} aria-label={`${current.resistance} ом умножить на ${current.current} ампер равно ${SOURCE_VOLTAGE} вольт`}>
        <span>{current.resistance} Ом</span>
        <span aria-hidden="true">×</span>
        <span>{current.current} А</span>
        <span aria-hidden="true">=</span>
        <strong>{SOURCE_VOLTAGE} В</strong>
      </p>
    </section>
  );
}
