"use client";
import { useState } from "react";
import styles from "./TextbookScene.module.css";

export function DensityModel() {
  const [split, setSplit] = useState(false);
  const [si, setSi] = useState(false);
  const [prediction, setPrediction] = useState("");
  return <div className={styles.experiment}>
    <fieldset className={styles.prediction}><legend>Разделим однородный образец A пополам. Что станет с плотностью каждой части?</legend>
      {["Уменьшится вдвое", "Останется прежней", "Увеличится вдвое"].map(value=><label key={value}><input type="radio" name="density-prediction" checked={prediction===value} onChange={()=>setPrediction(value)}/>{value}</label>)}
    </fieldset>
    <p className={styles.explanation}>Два сплошных однородных образца без пустот, при неизменной температуре. Числа заданы моделью; состав по ним не определяем.</p>
    <div className={styles.controls}><button aria-pressed={split} onClick={()=>setSplit(!split)}>{split ? "Собрать A обратно" : "Разделить A пополам"}</button><button aria-pressed={si} onClick={()=>setSi(!si)}>{si ? "Показать г и см³" : "Показать единицы СИ"}</button></div>
    <svg className={styles.densityBlocks} viewBox="0 0 360 150" role="img" aria-label={split ? "Образец A разделён на две равные части. Образец B не изменился." : "Объём образца A вдвое больше объёма B. Показаны бруски с одинаковым поперечным сечением."}>
      <g fill="var(--action-primary)" stroke="currentColor" strokeWidth="2">
        <rect x="30" y="25" width="60" height="55" rx="2"/>
        <rect className={styles.sampleHalf} x="90" y="25" width="60" height="55" rx="2" style={{transform:`translateX(${split?18:0}px)`}}/>
      </g>
      <rect x="255" y="25" width="60" height="55" rx="2" fill="#dca638" stroke="currentColor" strokeWidth="2"/>
      <text x="95" y="119" textAnchor="middle" fill="currentColor" fontSize="19">{split ? "A: две половины" : "A: целый"}</text>
      <text x="285" y="119" textAnchor="middle" fill="currentColor" fontSize="19">B</text>
    </svg>
    <div className={styles.readout} aria-live="polite">
      <p><b>{split ? "Каждая половина A" : "Образец A"}</b><br/>Масса: {si ? (split?"0,027":"0,054")+" кг" : (split?27:54)+" г"}<br/>Объём: {si ? (split?"0,00001":"0,00002")+" м³" : (split?10:20)+" см³"}<strong>{si ? "2700 кг/м³" : "2,7 г/см³"}</strong></p>
      <p><b>Образец B</b><br/>Масса: {si?"0,078 кг":"78 г"}<br/>Объём: {si?"0,00001 м³":"10 см³"}<strong>{si?"7800 кг/м³":"7,8 г/см³"}</strong></p>
    </div>
    <p className={styles.explanation}>{split ? "У каждой половины A масса и объём уменьшились вдвое: 27 / 10 = 2,7 г/см³. Вместе части по-прежнему имеют массу 54 г и объём 20 см³." : "У A объём больше, но масса меньше. Сравним массу единицы объёма: 54 / 20 = 2,7; 78 / 10 = 7,8 г/см³. Плотность B больше."}</p>
    {split && prediction && <p role="status" className={styles.aside}>{prediction==="Останется прежней" ? "Верно: изменился размер части, а отношение массы к объёму сохранилось." : "Посмотри на обе величины: уменьшилась не только масса, но и объём. Их отношение осталось прежним."} Мио: «Кусок стал меньше. А вот отношение — нет».</p>}
    {si && <p className={styles.aside}>1 г = 0,001 кг; 1 см³ = 0,000001 м³. Поэтому 1 г/см³ = 1000 кг/м³. Число изменилось из-за единиц, сам образец не изменился.</p>}
  </div>;
}
