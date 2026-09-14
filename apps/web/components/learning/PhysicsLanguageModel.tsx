"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./PhysicsLanguageModel.module.css";

const observations = {
  body: {
    label: "Тележка",
    kind: "Физическое тело",
    note: "Это отдельный предмет. Он имеет форму, объём и состоит из вещества.",
  },
  phenomenon: {
    label: "Тележка движется",
    kind: "Физическое явление",
    note: "Положение тележки меняется относительно стола. Изменение, происходящее с телом, — физическое явление.",
  },
  quantity: {
    label: "Скорость 3 м/с",
    kind: "Физическая величина",
    note: "Скорость описывает движение числом и единицей. Её можно измерить или вычислить.",
  },
} as const;

type ObservationId = keyof typeof observations;

export function PhysicsLanguageModel() {
  const [selected, setSelected] = useState<ObservationId>("body");
  const current = observations[selected];

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Одна сцена · три разных вопроса</p><h2>Что именно замечает Мио?</h2></div>
      <p>Не каждое слово в описании опыта обозначает одно и то же. Выбери фрагмент наблюдения и посмотри, какую роль он играет в языке физики.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.inertia} alt="Мио наблюдает лабораторную тележку на столе" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <div className={styles.notebook} aria-label="Запись наблюдения: скорость тележки 3 метра в секунду">
          <span>Наблюдение</span>
          <strong>v = 3 м/с</strong>
        </div>
        <figcaption>Мио сначала отделяет предмет от происходящего с ним изменения, а затем выбирает величину для описания.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.choices} role="group" aria-label="Части физического описания">
          {(Object.keys(observations) as ObservationId[]).map(id => <button key={id} type="button" aria-pressed={selected === id} onClick={() => setSelected(id)}>{observations[id].label}</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>{current.label}</p>
          <strong>{current.kind}</strong>
          <span>{current.note}</span>
        </section>
        <p className={styles.sentence}><span>Тележка</span> <b>движется</b> со <em>скоростью 3 м/с</em>.</p>
      </div>
    </div>
  </div>;
}
