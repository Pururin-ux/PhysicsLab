"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./ScientificMethodModel.module.css";

const steps = [
  { id:"observe", label:"1. Наблюдение", title:"Показания не совпали", note:"Сверху уровень кажется выше, чем при взгляде сбоку. Мио записывает расхождение, пока не объясняя его." },
  { id:"hypothesis", label:"2. Гипотеза", title:"Возможно, дело в положении глаз", note:"Предположение должно объяснить факт и подсказать проверку: если менять только высоту взгляда, видимое показание будет меняться." },
  { id:"experiment", label:"3. Опыт", title:"Вода та же. Меняем только взгляд", note:"Мио не доливает воду и не двигает мензурку. Она сравнивает отсчёт сверху с отсчётом на уровне мениска." },
  { id:"result", label:"4. Результат", title:"Гипотеза выдержала эту проверку", note:"На уровне мениска линия взгляда не смещает его относительно шкалы. Один опыт поддерживает гипотезу, но не превращает любое предположение в закон." },
] as const;

type StepId = (typeof steps)[number]["id"];

export function ScientificMethodModel() {
  const [stepId,setStepId]=useState<StepId>("observe");
  const step=steps.find(item=>item.id===stepId)!;
  return <div className={shared.experiment}>
    <div className={styles.heading}>
      <div><p>Расхождение — начало исследования</p><h2>Почему одна вода даёт два отсчёта?</h2></div>
      <p>Мио не выбирает удобное число. Она фиксирует факт, предлагает объяснение и ставит опыт, где меняется только проверяемое условие.</p>
    </div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.measurement} alt="Мио проверяет уровень воды в мензурке, расположив глаза на уровне мениска" fill sizes="(max-width:700px) 100vw, 690px" priority />
        <div className={styles.readings}><span>Взгляд сверху</span><strong>35 мл?</strong><span>На уровне мениска</span><strong>32 мл</strong></div>
        <figcaption>Количество воды и положение мензурки остаются неизменными. Мио меняет только высоту взгляда.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.steps} role="group" aria-label="Этапы проверки гипотезы">
          {steps.map(item=><button key={item.id} type="button" aria-pressed={stepId===item.id} onClick={()=>setStepId(item.id)}>{item.label}</button>)}
        </div>
        <section className={styles.result} aria-live="polite"><p>{step.label}</p><strong>{step.title}</strong><span>{step.note}</span></section>
        <p className={styles.rule}><b>Честная проверка:</b> меняем высоту взгляда; сохраняем воду, сосуд, шкалу и освещение.</p>
      </div>
    </div>
  </div>;
}
