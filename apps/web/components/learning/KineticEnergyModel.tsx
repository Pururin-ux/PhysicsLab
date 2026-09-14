"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./KineticEnergyModel.module.css";

const speeds = [5, 10, 20] as const;
type Speed = typeof speeds[number];

export function KineticEnergyModel() {
  const [speed, setSpeed] = useState<Speed>(5);
  const ratio = (speed / 5) ** 2;

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Масса не меняется</p><h2>Во сколько раз выросла энергия движения?</h2></div>
      <p>Мио сравнивает один и тот же транспорт при разных скоростях. Масса одинакова, поэтому изменение кинетической энергии задаёт квадрат скорости.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.acceleration} alt="Мио едет в городском транспорте и наблюдает движение" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <div className={styles.speedReadout} aria-label={`Скорость ${speed} метров в секунду`}><span>Скорость</span><strong>{speed} м/с</strong></div>
        <figcaption>Сравниваем одно и то же тело: его масса во всех состояниях одинакова.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Скорость одного и того же тела">
          {speeds.map(value => <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value} м/с</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>Относительно состояния 5 м/с</p>
          <strong>{ratio}× исходной энергии</strong>
          <span>({speed} ÷ 5)² = {ratio}</span>
          <div className={styles.energyScale} style={{"--energy-ratio": ratio} as CSSProperties}><i /></div>
          <p>{speed === 5 ? "Это исходное состояние для сравнения." : `Скорость выросла в ${speed / 5} раза, поэтому кинетическая энергия выросла в ${ratio} ${ratio === 4 ? "раза" : "раз"}.`}</p>
        </section>
      </div>
    </div>
  </div>;
}
