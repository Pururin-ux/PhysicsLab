"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./MechanicalWorkModel.module.css";

const cases = {
  forward: { label: "Сила разгоняет", force: 40, distance: 3, work: 120, direction: "right" },
  braking: { label: "Сила тормозит", force: 40, distance: 3, work: -120, direction: "left" },
  still: { label: "Тележка стоит", force: 40, distance: 0, work: 0, direction: "right" },
} as const;

type CaseId = keyof typeof cases;

export function MechanicalWorkModel() {
  const [caseId, setCaseId] = useState<CaseId>("forward");
  const state = cases[caseId];
  const isBraking = caseId === "braking";

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Следим за одной силой</p><h2>Сила действует. Совершает ли она работу?</h2></div>
      <p>Мио сравнивает направление выбранной силы с перемещением тележки. Для работы важны сила, путь и то, помогает сила движению или мешает ему.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.inertia} alt="Мио наблюдает лабораторную тележку на столе" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <svg className={styles.overlay} viewBox="0 0 1536 1024" role="img" aria-label={state.distance === 0 ? `Сила ${state.force} ньютонов действует на неподвижную тележку; перемещение и работа равны нулю` : `Сила ${state.force} ньютонов ${isBraking ? "против" : "вдоль"} движения; перемещение ${state.distance} метра; работа ${state.work} джоулей`}>
          <g className={styles.motion}>
            {state.distance > 0 ? <><path d="M650 785 H1080 m-42 -26 l42 26 -42 26" /><text x="760" y="750">s = {state.distance} м</text></> : <><path d="M835 760 v70" /><text x="870" y="805">s = 0</text></>}
          </g>
          <g className={isBraking ? styles.forceBack : styles.forceForward}>
            <path d={isBraking ? "M820 675 H560 m42 -26 l-42 26 42 26" : "M820 675 H1080 m-42 -26 l42 26 -42 26"} />
            <text x={isBraking ? 555 : 850} y="630">F = {state.force} Н</text>
          </g>
        </svg>
        <figcaption>Бирюзовая стрелка — перемещение тележки. Золотая — выбранная сила; работа относится именно к этой силе.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Действие силы и движение тележки">
          {(Object.keys(cases) as CaseId[]).map(id => <button key={id} type="button" aria-pressed={caseId === id} onClick={() => setCaseId(id)}>{cases[id].label}</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>Работа выбранной силы</p>
          <strong>{state.work} Дж</strong>
          <span>{state.distance === 0 ? "Перемещения нет: A = 0" : `40 Н · 3 м = 120 Дж${isBraking ? ", знак минус" : ""}`}</span>
          <p>{state.distance === 0 ? "Сила действует, но точка её приложения не переместилась — механическая работа равна нулю." : isBraking ? "Сила направлена против перемещения и уменьшает скорость: её работа отрицательна." : "Сила направлена вдоль перемещения и помогает разгону: её работа положительна."}</p>
        </section>
      </div>
    </div>
  </div>;
}
