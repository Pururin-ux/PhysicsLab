"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./MechanicalEnergyModel.module.css";

const states = [
  { id: "start", label: "У точки бросания", h: 0, v: 10, kinetic: 10, potential: 0, top: "72%" },
  { id: "middle", label: "На половине высоты", h: 2.5, v: 7.1, kinetic: 5, potential: 5, top: "44%" },
  { id: "top", label: "В верхней точке", h: 5, v: 0, kinetic: 0, potential: 10, top: "15%" },
] as const;

type EnergyState = typeof states[number];

export function MechanicalEnergyModel() {
  const [state, setState] = useState<EnergyState>(states[0]);

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Сопротивлением воздуха пренебрегаем</p><h2>Куда исчезает энергия движения?</h2></div>
      <p>Мио отмечает положения одной шайбы. По мере подъёма скорость уменьшается, высота растёт, а сумма двух энергий остаётся равной 10 Дж.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene} style={{ "--body-top": state.top } as CSSProperties}>
        <Image className={styles.room} src="/images/experiments/inertia-floor-v1.png" alt="Светлая лабораторная стена и пол для опыта" fill sizes="(max-width:700px) 100vw, 700px" priority />
        <Image className={styles.mio} src={MIO_PORTRAITS.attentive.src} alt="Мио внимательно записывает положения подброшенной шайбы" width={1536} height={1536} />
        <Image className={styles.body} src="/images/experiments/inertia-puck-v1.png" alt="Металлическая шайба в выбранной точке траектории" width={1536} height={1024} />
        <div className={styles.readout}><strong>h = {state.h} м</strong><span>v = {state.v} м/с</span></div>
        <figcaption>Масса шайбы 0,2 кг. Нулевой уровень проходит через точку бросания.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Положение шайбы во время подъёма">
          {states.map(option => <button key={option.id} type="button" aria-pressed={state.id === option.id} onClick={() => setState(option)}>{option.label}</button>)}
        </div>
        <section className={styles.energyLedger} aria-live="polite">
          <p>Полная механическая энергия</p>
          <strong>{state.kinetic} Дж + {state.potential} Дж = 10 Дж</strong>
          <div className={styles.energyRow}><span>Движение, Eₖ</span><i><b style={{ width: `${state.kinetic * 10}%` }} /></i><em>{state.kinetic} Дж</em></div>
          <div className={styles.energyRow}><span>Высота, Eₚ</span><i><b style={{ width: `${state.potential * 10}%` }} /></i><em>{state.potential} Дж</em></div>
          <p>{state.id === "top" ? "В верхней точке скорость равна нулю: весь запас стал потенциальной энергией." : "Энергия не исчезает: уменьшается один вид и на столько же увеличивается другой."}</p>
        </section>
      </div>
    </div>
  </div>;
}
