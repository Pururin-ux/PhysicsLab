"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./ResultantFrictionModel.module.css";

const cases = {
  accelerate: { label: "Тяга сильнее", pull: 60, resistance: 20, result: 40, motion: "скорость увеличивается" },
  steady: { label: "Силы равны", pull: 40, resistance: 40, result: 0, motion: "скорость остаётся постоянной" },
  slow: { label: "Тягу убрали", pull: 0, resistance: 20, result: -20, motion: "скорость уменьшается" },
} as const;

type CaseId = keyof typeof cases;

export function ResultantFrictionModel() {
  const [caseId, setCaseId] = useState<CaseId>("accelerate");
  const state = cases[caseId];
  const resultDirection = state.result > 0 ? "вправо" : state.result < 0 ? "влево" : "не имеет направления";
  const equation = state.result < 0
    ? `${state.resistance} Н − ${state.pull} Н = ${Math.abs(state.result)} Н влево`
    : `${state.pull} Н − ${state.resistance} Н = ${state.result} Н`;

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Тележка движется вправо</p><h2>Какая сила остаётся после сравнения?</h2></div>
      <p>Мио меняет тягу. Сопротивление движению направлено влево; сравни модули сил, приложенных к одной тележке.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.inertia} alt="Мио наблюдает движение лабораторной тележки" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <svg viewBox="0 0 1536 1024" className={styles.overlay} role="img" aria-label={`Тяга ${state.pull} ньютонов вправо, сопротивление ${state.resistance} ньютонов влево`}>
          {state.pull > 0 ? <g className={styles.pull}><path d={`M900 650 H${900 + state.pull * 5} M${900 + state.pull * 5} 650 l-45 -28 m45 28 l-45 28`} /><text x="920" y="605">Fтяги = {state.pull} Н</text></g> : null}
          <g className={styles.resistance}><path d={`M520 735 H${520 - state.resistance * 5} M${520 - state.resistance * 5} 735 l45 -28 m-45 28 l45 28`} /><text x="330" y="690">Fсопр = {state.resistance} Н</text></g>
        </svg>
        <figcaption>Все показанные силы приложены к тележке. Их можно складывать с учётом направления.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Соотношение тяги и сопротивления">
          {(Object.keys(cases) as CaseId[]).map(id => <button key={id} type="button" aria-pressed={caseId === id} onClick={() => setCaseId(id)}>{cases[id].label}</button>)}
        </div>
        <section className={styles.result} aria-live="polite">
          <p>Равнодействующая</p>
          <strong>{Math.abs(state.result)} Н {state.result ? resultDirection : ""}</strong>
          <span>{equation}</span>
          <p>{state.result === 0 ? "Силы компенсируют друг друга: тележка может покоиться или двигаться равномерно." : `Равнодействующая направлена ${resultDirection}, поэтому ${state.motion}.`}</p>
        </section>
      </div>
    </div>
  </div>;
}
