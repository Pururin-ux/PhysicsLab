"use client";

import Image from "next/image";
import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./HookeLawNotebook.module.css";

type Load = 1 | 2 | 3;
const loads: Load[] = [1, 2, 3];

export function HookeLawNotebook() {
  const [load, setLoad] = useState<Load>(2);
  const extension = load * 5;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная запись · § 19</p>
        <h2>В упругой области сила растёт вместе с деформацией</h2>
        <span>Мио оставляет ту же пружину и меняет только нагрузку. Измерительная линза помогает читать удлинение, а график проверяет, остаётся ли отношение силы к удлинению постоянным.</span>
      </header>

      <div className={styles.controls} role="group" aria-label="Нагрузка на пружину">
        {loads.map(value => <button key={value} type="button" aria-pressed={load === value} onClick={() => setLoad(value)}>{value} Н</button>)}
      </div>

      <div className={styles.workspace}>
        <figure className={styles.scene}>
          <Image src="/images/mio/textbook-force-v1.png" alt="Мио записывает показания установки с подвешенным к пружине грузом" fill sizes="(max-width:760px) 100vw, 58vw" priority />
          <div className={styles.lens} aria-label={`Измерительная линза: удлинение пружины ${extension} сантиметров`}>
            <span>Δl</span>
            <div className={styles.scale} aria-hidden="true">
              {[0, 5, 10, 15, 20].map(value => <i key={value} style={{ top: `${value / 20 * 100}%` }}><b>{value}</b></i>)}
              <em style={{ top: `${extension / 20 * 100}%` }} />
            </div>
            <strong>{extension} см</strong>
          </div>
          <figcaption>Измеряется изменение длины: <MathText text="$\Delta l=l-l_0$" />, а не полная длина пружины.</figcaption>
        </figure>

        <aside className={styles.reading} aria-live="polite">
          <div><span>Нагрузка</span><strong>{load} Н</strong></div>
          <div><span>Удлинение</span><strong>{extension} см</strong></div>
          <div className={styles.primary}><span>Жёсткость</span><MathText text={`$k=\\dfrac{F}{\\Delta l}=\\dfrac{${load}}{${extension / 100}}=20\\,\\text{Н/м}$`} /></div>
          <p>При каждом измерении отношение одинаково. В пределах упругой деформации выполняется <MathText text="$F_{\text{упр}}=k|\Delta l|$" />.</p>
        </aside>
      </div>

      <section className={styles.graphBlock} aria-labelledby="hooke-graph-title">
        <div>
          <p>Проверка серии измерений</p>
          <h3 id="hooke-graph-title">Прямая проходит через начало координат</h3>
          <span>Удвоение нагрузки удваивает удлинение. Если после снятия нагрузки длина не восстановилась, эта линейная модель уже неприменима.</span>
        </div>
        <svg viewBox="0 0 360 240" role="img" aria-label={`График силы упругости от удлинения. Выбрана точка ${extension} сантиметров, ${load} ньютонов.`}>
          <g className={styles.grid}><path d="M52 24V202H332" /><path d="M52 158H332M52 113H332M52 69H332" /><path d="M122 24V202M192 24V202M262 24V202" /></g>
          <g className={styles.labels}><text x="38" y="28">F, Н</text><text x="286" y="228">Δl, см</text><text x="42" y="207">0</text><text x="116" y="220">5</text><text x="182" y="220">10</text><text x="252" y="220">15</text><text x="318" y="220">20</text></g>
          <path className={styles.line} d="M52 202L332 24" />
          {loads.map(value => {
            const x = 52 + value * 70;
            const y = 202 - value * 44.5;
            return <circle key={value} className={value === load ? styles.selectedPoint : styles.point} cx={x} cy={y} r={value === load ? 8 : 5} />;
          })}
        </svg>
      </section>

      <p className={styles.boundary}><strong>Граница закона.</strong> Формула Гука описывает упругое растяжение и сжатие. Она не обещает линейность после пластической деформации и не переносится автоматически на изгиб или кручение.</p>
    </div>
  );
}
