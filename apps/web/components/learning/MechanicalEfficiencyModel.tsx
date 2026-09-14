"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./MechanicalEfficiencyModel.module.css";

const cases = {
  smooth: { label: "Гладкая дорожка", friction: 4 },
  regular: { label: "Обычная дорожка", friction: 12 },
  rough: { label: "Шероховатая дорожка", friction: 24 },
} as const;

type CaseId = keyof typeof cases;

const pull = 40;
const distance = 5;

export function MechanicalEfficiencyModel() {
  const [caseId, setCaseId] = useState<CaseId>("regular");
  const state = cases[caseId];
  const totalWork = pull * distance;
  const lostWork = state.friction * distance;
  const usefulWork = totalWork - lostWork;
  const efficiency = usefulWork / totalWork * 100;

  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Одна и та же затраченная работа</p><h2>Какая её часть разгоняет тележку?</h2></div>
      <p>Мио тянет тележку с постоянной силой на тот же путь. Меняется только сопротивление дорожки — и вместе с ним доля работы, которая даёт полезный результат.</p>
    </div>

    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.inertia} alt="Мио наблюдает лабораторную тележку на дорожке" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <svg className={styles.overlay} viewBox="0 0 1536 1024" role="img" aria-label={`Сила тяги ${pull} ньютонов направлена по движению, сила трения ${state.friction} ньютонов — против; путь ${distance} метров`}>
          <g className={styles.pull}>
            <path d="M810 670 H1110 m-44 -28 l44 28 -44 28" />
            <text x="850" y="625">F = {pull} Н</text>
          </g>
          <g className={styles.friction}>
            <path d={`M810 740 H${810 - state.friction * 8} m42 -26 l-42 26 42 26`} />
            <text x="555" y="820">Fтр = {state.friction} Н</text>
          </g>
          <g className={styles.motion}>
            <path d="M675 875 H1110 m-44 -26 l44 26 -44 26" />
            <text x="825" y="945">s = {distance} м</text>
          </g>
        </svg>
        <figcaption>Золотая стрелка — тяга, коралловая — сопротивление дорожки, бирюзовая — путь тележки.</figcaption>
      </figure>

      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Сопротивление дорожки">
          {(Object.keys(cases) as CaseId[]).map(id => <button key={id} type="button" aria-pressed={caseId === id} onClick={() => setCaseId(id)}>{cases[id].label}</button>)}
        </div>
        <section className={styles.accounting} aria-live="polite">
          <p className={styles.total}><span>Затрачено</span><strong>{totalWork} Дж</strong><small>{pull} Н · {distance} м</small></p>
          <p className={styles.loss}><span>На трение</span><strong>− {lostWork} Дж</strong><small>{state.friction} Н · {distance} м</small></p>
          <p className={styles.useful}><span>Полезная работа</span><strong>{usefulWork} Дж</strong><small>{totalWork} − {lostWork}</small></p>
        </section>
        <section className={styles.result}>
          <p>Коэффициент полезного действия</p>
          <strong>{efficiency}%</strong>
          <span>η = <span className={styles.fraction}><span>{usefulWork} Дж</span><span>{totalWork} Дж</span></span> · 100%</span>
          <p>Из каждых 100 Дж затраченной работы {efficiency} Дж дают нужный результат. Остальное уходит на преодоление трения.</p>
        </section>
      </div>
    </div>
  </div>;
}
