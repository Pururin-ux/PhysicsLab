"use client";
import {useState} from "react";
import styles from "./TextbookScene.module.css";

export function InertiaModel(){
  const [moment,setMoment]=useState(0);
  const [onCart,setOnCart]=useState(false);
  const [prediction,setPrediction]=useState("");
  const cartDistance=4*moment-moment*moment;
  const puckDistance=4*moment;
  const camera=onCart?cartDistance*50:0;
  return <div className={styles.experiment}>
    <fieldset className={styles.prediction}><legend>Тележку тормозят. Что станет со скоростью свободной шайбы относительно пола?</legend>
      {["Уменьшится вместе со скоростью тележки","Останется прежней","Шайбу разгонит сила вперёд"].map(value=><label key={value}><input type="radio" name="inertia-prediction" checked={prediction===value} onChange={()=>setPrediction(value)}/>{value}</label>)}
    </fieldset>
    <p className={styles.explanation}>Модель: горизонтальная платформа, трением и сопротивлением воздуха пренебрегаем. Сила тяжести и опора уравновешивают друг друга. Шайба не закреплена; тормоз действует только на тележку.</p>
    <div className={styles.controls}>{["До торможения","Через 1 с","Через 2 с"].map((label,i)=><button key={label} aria-pressed={moment===i} onClick={()=>setMoment(i)}>{label}</button>)}</div>
    <div className={styles.controls}><button aria-pressed={!onCart} onClick={()=>setOnCart(false)}>Смотрим с пола</button><button aria-pressed={onCart} onClick={()=>setOnCart(true)}>Смотрим с тележки</button></div>
    <svg className={styles.inertiaDiagram} viewBox="0 0 640 185" role="img" aria-label={`${moment} с; наблюдатель ${onCart?"на тележке":"на полу"}. Шайба относительно пола движется вправо со скоростью 4 м/с. Скорость тележки ${4-2*moment} м/с.`}>
      <defs><pattern id="inertia-floor" width="50" height="15" patternUnits="userSpaceOnUse"><path d="M0 0 L-12 15 M50 0 L38 15" stroke="currentColor" opacity=".4"/></pattern></defs>
      <g className={styles.inertiaObject} style={{transform:`translateX(${-camera}px)`}}><rect x="-400" y="149" width="1500" height="16" fill="url(#inertia-floor)"/><line x1="-400" x2="1100" y1="149" y2="149" stroke="currentColor"/></g>
      <g className={styles.inertiaObject} style={{transform:`translateX(${cartDistance*50-camera}px)`}}>
        <rect x="60" y="113" width="320" height="12" rx="3" fill="var(--action-primary)"/>
        <circle cx="98" cy="137" r="11" fill="var(--surface-secondary)" stroke="currentColor" strokeWidth="2"/><circle cx="342" cy="137" r="11" fill="var(--surface-secondary)" stroke="currentColor" strokeWidth="2"/>
        <text x="210" y="100" textAnchor="middle" fontSize="22" fill="currentColor">Тележка</text>
      </g>
      <g className={styles.inertiaObject} style={{transform:`translateX(${puckDistance*50-camera}px)`}}><ellipse cx="140" cy="105" rx="20" ry="8" fill="#dca638" stroke="currentColor"/><text x="140" y="48" textAnchor="middle" fontSize="28" fill="currentColor">Шайба</text></g>
    </svg>
    <p className={styles.aside}>Три момента одного торможения. Переключение камеры меняет точку наблюдения. Длина платформы в модели достаточна: шайба за эти 2 с не падает с края.</p>
    <div className={styles.readout} aria-live="polite"><p>Шайба относительно пола<strong>4 м/с →</strong></p><p>Тележка относительно пола<strong>{4-2*moment} м/с{moment<2?" →":""}</strong></p></div>
    <p className={styles.explanation}>За {moment} с шайба прошла по полу {puckDistance} м, тележка — {cartDistance} м. {onCart?`Относительно тележки шайба сместилась вперёд на ${puckDistance-cartDistance} м. Изменение точки наблюдения не добавило ей взаимодействий.`:"Относительно пола шайба сохраняет скорость: горизонтальная сила на неё не действует. Тележка отстаёт, потому что её тормозят."}</p>
    {moment>0 && prediction && <p role="status" className={styles.aside}>{prediction==="Останется прежней"?"Верно. Шайба продолжила прежнее движение относительно пола.":"Проверь, на какое тело действует тормоз. Он замедляет тележку; на свободную шайбу горизонтальная сила не действует."} Мио: «Вперёд относительно тележки — ещё не значит разгоняется относительно пола».</p>}
  </div>;
}
