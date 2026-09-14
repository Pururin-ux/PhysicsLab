"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./MechanicalPowerModel.module.css";

const times = [2, 4, 8] as const;
type Time = typeof times[number];
const WORK = 240;

export function MechanicalPowerModel() {
  const [time, setTime] = useState<Time>(4);
  const power = WORK / time;

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Работа одинакова</p><h2>Кто совершил её быстрее?</h2></div>
      <p>Для каждого заезда измерена одна и та же работа привода — 240 Дж. Мио меняет только время и сравнивает работу, совершённую за одну секунду.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.average} alt="Мио с секундомером стоит рядом с велосипедом" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <div className={styles.measurement} aria-label={`Работа 240 джоулей, время ${time} с`}><span>Один заезд</span><strong>A = {WORK} Дж</strong><b>t = {time} с</b></div>
        <figcaption>Работа во всех трёх состояниях одинакова. Меняется время её выполнения.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Время выполнения одинаковой работы">
          {times.map(value => <button key={value} type="button" aria-pressed={time === value} onClick={() => setTime(value)}>{value} с</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>Мощность</p>
          <strong>{power} Вт</strong>
          <span>P = 240 Дж ÷ {time} с = {power} Дж/с</span>
          <p>За одну секунду совершается {power} Дж работы. {time === 2 ? "Самый короткий заезд требует наибольшей мощности." : time === 8 ? "Та же работа растянута на большее время, поэтому мощность меньше." : "Это средний из трёх темпов выполнения той же работы."}</p>
        </section>
      </div>
    </div>
  </div>;
}
