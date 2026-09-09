"use client";
import {useState} from "react";
import styles from "./TextbookScene.module.css";

export function PressureModel(){
  const [area,setArea]=useState(20);
  const [force,setForce]=useState(40);
  const [prediction,setPrediction]=useState("");
  const perCell=force/area;
  const pressure=force/(area/10000);
  return <div className={styles.experiment}>
    <fieldset className={styles.prediction}><legend>При той же силе увеличим площадь вдвое. Как изменится давление?</legend>{["Уменьшится вдвое","Не изменится","Увеличится вдвое"].map(value=><label key={value}><input type="radio" name="pressure-prediction" checked={prediction===value} onChange={()=>setPrediction(value)}/>{value}</label>)}</fieldset>
    <p className={styles.explanation}>Вид на поверхность контакта сверху. Сила направлена перпендикулярно этой поверхности и равномерно распределена. Каждая клетка — 1 см².</p>
    <div className={styles.controls}>{[20,40].map(value=><button key={value} aria-pressed={area===value} onClick={()=>setArea(value)}>Площадь {value} см²</button>)}</div>
    <div className={styles.controls}>{[40,80].map(value=><button key={value} aria-pressed={force===value} onClick={()=>setForce(value)}>Сила {value} Н</button>)}</div>
    <div className={styles.pressureGrid} style={{gridTemplateColumns:`repeat(${area/5}, 1fr)`}} role="img" aria-label={`${area} клеток по 1 см². На каждую приходится ${perCell} Н. Давление ${pressure/1000} кПа.`}>{Array.from({length:area},(_,i)=><span key={i} aria-hidden="true" style={{backgroundColor:`rgba(44, 177, 203, ${.15+perCell*.18})`}}/>)}</div>
    <div className={styles.readout} aria-live="polite"><p>Сила на клетку 1 см²<strong>{perCell} Н</strong></p><p>Давление<strong>{pressure/1000} кПа</strong></p></div>
    <p className={styles.explanation}>{area} см² = {(area/10000).toString().replace(".",",")} м². p = {force} / {(area/10000).toString().replace(".",",")} = {pressure.toLocaleString("ru-RU")} Па.</p>
    <p className={styles.aside}>Размер каждой клетки на экране одинаковый; темнее — больше сила на неё. По этой схеме нельзя вычислить глубину вмятины: она зависит ещё от свойств опоры.</p>
    {area===40&&prediction&&<p role="status" className={styles.explanation}>{prediction==="Уменьшится вдвое"?"Верно при неизменной силе: увеличение площади с 20 до 40 см² уменьшает давление вдвое.":"Сравни две площади при одной и той же выбранной силе: на каждую клетку большой площади приходится вдвое меньше силы."} {force===80?"Ты также увеличил силу: относительно исходных 40 Н и 20 см² давление теперь прежнее — 20 кПа.":"Мио: «Сила та же. Делить её теперь нужно на большее число клеток»."}</p>}
  </div>;
}
