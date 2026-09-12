"use client";
import {useId,useState} from "react";
import styles from "./TextbookScene.module.css";
export function MeasurementModel(){
  const [fine,setFine]=useState(false),[prediction,setPrediction]=useState(""),[read,setRead]=useState(false);
  const clip=useId();const division=fine?2:10;
  const ticks=Array.from({length:60/division+1},(_,i)=>i*division);
  return <div className={styles.experiment}>
    <fieldset className={styles.prediction}><legend>Что изменится, если деления станут мельче?</legend>{["Объём воды","Точность отсчёта"].map(value=><label key={value}><input type="radio" name="scale-prediction" checked={prediction===value} onChange={()=>setPrediction(value)}/>{value}</label>)}</fieldset>
    <div className={styles.controls}><button aria-pressed={!fine} onClick={()=>{setFine(false);setRead(false);}}>Крупная шкала</button><button aria-pressed={fine} onClick={()=>{setFine(true);setRead(false);}}>Мелкая шкала</button></div>
    <p>Смотри на нижнюю точку поверхности воды.</p>
    <svg className={styles.menzurka} viewBox="0 0 380 300" role="img" aria-label={`Мензурка: уровень воды неизменен, цена деления ${division} мл. Справа увеличен участок шкалы у поверхности воды.`}>
      <defs><clipPath id={clip}><circle cx="290" cy="165" r="64"/></clipPath></defs>
      <path d="M45 38 V262 Q45 272 55 272 H165 Q175 272 175 262 V38" fill="var(--surface-primary)" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M49 152 Q110 176 171 152 V260 Q171 267 165 267 H55 Q49 267 49 260 Z" fill="var(--action-primary)" fillOpacity=".38"/>
      {ticks.map(value=><g key={value}><path d={`M${value%10===0?143:154} ${260-value*3} H171`} stroke="currentColor" strokeWidth={value%10===0?2:1}/>{value%10===0&&<text x="184" y={265-value*3} fill="currentColor" fontSize="16">{value}</text>}</g>)}
      <text x="184" y="48" fill="currentColor" fontSize="16">мл</text>
      <path d="M49 152 Q110 176 171 152" fill="none" stroke="var(--action-primary)" strokeWidth="3.5"/>
      <circle cx="110" cy="164" r="4" fill="var(--text-primary)"/>
      <path d="M114 164 H222" stroke="var(--text-secondary)" strokeDasharray="3 4" fill="none"/>
      <text x="290" y="87" textAnchor="middle" fill="currentColor" fontSize="15">Крупнее</text>
      <g clipPath={`url(#${clip})`}><circle cx="290" cy="165" r="64" fill="var(--surface-primary)"/>
        <path d="M226 153 Q290 183 354 153 V235 H226 Z" fill="var(--action-primary)" fillOpacity=".38"/>
        {[20,22,24,26,28,30,32,34,36,38,40,42].filter(value=>fine||value%10===0).map(value=><g key={value}><path d={`M${value%10===0?291:300} ${360-value*6} H313`} stroke="currentColor" strokeWidth={value%10===0?2:1}/>{value%10===0&&<text x="317" y={365-value*6} fontSize="13" fill="currentColor">{value}</text>}</g>)}
        <path d="M226 153 Q290 183 354 153" fill="none" stroke="var(--action-primary)" strokeWidth="3.5"/>
        <path d="M290 168 H313" stroke="var(--text-primary)" strokeDasharray="3 3"/>
        <circle cx="290" cy="168" r="4" fill="var(--text-primary)"/>
      </g><circle cx="290" cy="165" r="64" fill="none" stroke="var(--border-strong)" strokeWidth="2"/>
      <path d="M80 273 V284 H55 V290 H165 V284 H140 V273" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
    <div className={styles.controls}><button onClick={()=>setRead(true)}>Считать показание</button></div>
    {read&&<div className={styles.explanation} role="status"><p><strong>{fine?"32 ± 1 мл":"30 ± 5 мл"}</strong></p><p>От 20 до 40 мл — {fine?10:2} промежутка. Одно деление: (40 − 20) / {fine?10:2} = {division} мл. Записываем ближайшую отметку, а погрешность оцениваем половиной деления.</p>{prediction&&<p>{prediction==="Точность отсчёта"?"Верно: деления мельче — отсчёт точнее. Количество воды не изменилось.":"Количество воды не изменилось. Мелкая шкала помогает точнее прочитать тот же уровень."}</p>}</div>}
    <details className={styles.aside}><summary>Почему в ответе есть ±?</summary><p>Так записывают оценку погрешности. Здесь берём половину цены деления: {division} / 2 = {division/2} мл. У реального прибора могут быть и другие источники погрешности.</p></details>
  </div>;
}

