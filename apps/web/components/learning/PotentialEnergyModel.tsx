"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./PotentialEnergyModel.module.css";

const referenceLevels = [
  { id: "table", label: "Ноль ниже груза", h: 1, line: "82%" },
  { id: "body", label: "Ноль на уровне груза", h: 0, line: "65%" },
  { id: "above", label: "Ноль выше груза", h: -1, line: "45%" },
] as const;

type ReferenceLevel = typeof referenceLevels[number];

export function PotentialEnergyModel() {
  const [level, setLevel] = useState<ReferenceLevel>(referenceLevels[0]);
  const energy = 2 * 10 * level.h;

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Тело остаётся на месте</p><h2>Почему меняется потенциальная энергия?</h2></div>
      <p>Мио не двигает груз. Она выбирает, где считать потенциальную энергию равной нулю, и каждый раз заново определяет высоту.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene} style={{ "--zero-level": level.line } as CSSProperties}>
        <Image src={MIO_SCENES.force} alt="Мио записывает положение подвешенного груза относительно выбранного уровня" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <div className={styles.bodyTag}><span>тот же груз</span><strong>m = 2 кг</strong></div>
        <div className={styles.zeroLine}><span>Eₚ = 0</span></div>
        <figcaption>Положение груза не меняется. Перемещается только выбранный нулевой уровень.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Выбор нулевого уровня потенциальной энергии">
          {referenceLevels.map(option => <button key={option.id} type="button" aria-pressed={level.id === option.id} onClick={() => setLevel(option)}>{option.label}</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>Высота относительно выбранного нуля</p>
          <strong>h = {level.h} м</strong>
          <span>Eₚ = mgh = 2 · 10 · ({level.h}) = {energy} Дж</span>
          <p>{level.h > 0 ? "Груз находится выше нулевого уровня, поэтому значение положительно." : level.h < 0 ? "Груз находится ниже нулевого уровня, поэтому значение отрицательно." : "Нулевой уровень проходит через груз, поэтому его высота и энергия равны нулю."}</p>
        </section>
      </div>
    </div>
  </div>;
}
