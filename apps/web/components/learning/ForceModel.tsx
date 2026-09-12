"use client";
import {useState} from "react";
import shared from "./TextbookScene.module.css";
import styles from "./ForceModel.module.css";

export function ForceModel(){
  const [loads,setLoads]=useState(1);
  const [revealed,setRevealed]=useState(false);
  const force=loads*1.5;
  const springPoints=Array.from({length:17},(_,i)=>`${i===0||i===16?135:i%2?121:149},${50+30*i/16}`).join(" ");
  return <div className={shared.experiment}>
    <p>Прочитай силу по положению указателя. Между подписанными отметками 1 Н и 2 Н — два одинаковых промежутка.</p>
    <div className={shared.controls} aria-label="Нагрузка динамометра">{["Снять нагрузку","Один груз","Два одинаковых груза"].map((label,i)=><button key={label} aria-pressed={loads===i} onClick={()=>{setLoads(i);setRevealed(false);}}>{label}</button>)}</div>

    <svg className={styles.instrument} viewBox="0 0 320 530" role="img" aria-label={`Динамометр от 0 до 5 Н с ценой деления 0,5 Н. Указатель ${loads===0?"на нулевой отметке":loads===1?"посередине между 1 и 2 Н":"на отметке 3 Н"}.`}>
      <path d="M100 15 H170 M135 15 V50" stroke="currentColor" strokeWidth="4" fill="none"/>
      <rect x="95" y="25" width="130" height="280" rx="14" fill="var(--surface-secondary)" stroke="currentColor" strokeWidth="2"/>
      <path d="M135 25 V50" stroke="currentColor" strokeWidth="3"/>
      <g className={styles.spring} style={{transform:`scaleY(${1+force*40/30})`}}><polyline points={springPoints} fill="none" stroke="var(--action-primary)" strokeWidth="3" vectorEffect="non-scaling-stroke"/></g>
      {Array.from({length:11},(_,i)=><g key={i}><path d={`M165 ${80+i*20} h${i%2?12:20}`} stroke="currentColor" strokeWidth="2"/>{i%2===0&&<text x="194" y={86+i*20} fill="currentColor" fontSize="19">{i/2}</text>}</g>)}
      <text x="194" y="55" fill="currentColor" fontSize="19">Н</text>
      <g className={styles.moving} style={{transform:`translateY(${force*40}px)`}}>
        <path d="M135 80 V320 q0 13 10 13 q10 0 10 -10" fill="none" stroke="currentColor" strokeWidth="3"/>
        <path d="M135 80 H160 l-9 -5 m9 5 l-9 5" fill="none" stroke="#dca638" strokeWidth="4"/>
        {loads>0&&<g><path d="M145 333 V342" stroke="currentColor" strokeWidth="3"/><rect x="113" y="342" width="64" height="25" rx="4" fill="var(--action-primary)"/>{loads===2&&<><path d="M145 367 V373" stroke="currentColor" strokeWidth="3"/><rect x="113" y="373" width="64" height="25" rx="4" fill="var(--action-primary)"/></>}</g>}
      </g>
    </svg>

    <div className={shared.controls}><button onClick={()=>setRevealed(true)} aria-expanded={revealed}>Показать разбор шкалы</button></div>
    {revealed&&<div role="status" className={shared.explanation}><p>Цена деления: (2 − 1) / 2 = 0,5 Н. Показание: <strong>{force.toLocaleString("ru-RU")} Н</strong>.</p><p>{loads===0?"Без нагрузки указатель вернулся к нулю: пружина восстановила исходную длину.":loads===1?"Указатель прошёл три деления от нуля: 3 · 0,5 = 1,5 Н. Это сила, с которой груз растягивает пружину, а не масса в килограммах.":"Два одинаковых неподвижных груза действуют на пружину вдвое большей силой: 3 Н. В этой модели удлинение тоже увеличилось вдвое."}</p></div>}
    <details className={shared.aside}><summary>Как работает этот прибор?</summary><p>Груз свободно висит на упругой пружине. Чем сильнее он её растягивает, тем больше показание. Здесь сравниваем положения, когда груз уже остановился; движение между ними показано условно.</p></details>
  </div>;
}

