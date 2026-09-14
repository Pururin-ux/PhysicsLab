"use client";
import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./HydrostaticPressureModel.module.css";

const depths = [0.1, 0.3, 0.5] as const;
type Depth = typeof depths[number];

export function HydrostaticPressureModel(){
  const [depth,setDepth]=useState<Depth>(0.1);
  const pressure=1000*10*depth/1000;
  const y=350+depth*560;
  const arrow=70+depth*260;
  return <div className={shared.experiment}>
    <div className={styles.heading}><div><p>Вода покоится</p><h2>Что меняется ниже поверхности?</h2></div><p>Мио переносит датчик глубже в ту же воду. Площадь и форма мензурки не входят в расчёт давления в выбранной точке.</p></div>
    <div className={styles.workspace}>
      <figure className={styles.scene}>
        <Image src={MIO_SCENES.measurement} alt="Мио наблюдает воду в высокой прозрачной мензурке" fill sizes="(max-width:700px) 100vw, 690px" priority/>
        <svg className={styles.overlay} viewBox="0 0 1536 1024" role="img" aria-label={`Точка на глубине ${depth} метра, давление воды ${pressure} кПа`}>
          <path className={styles.depth} d={`M1060 350 V${y} m-18 -18 l18 18 18 -18`} />
          <circle className={styles.pressurePoint} cx="1080" cy={y} r="16" />
          <path className={styles.pressure} d={`M1080 ${y} h${arrow}`} />
          <text x="1120" y={y-35}>p = {pressure} кПа</text>
        </svg>
        <figcaption>Показано давление только столба воды: атмосферное давление в эту модель не добавлено.</figcaption>
      </figure>
      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Глубина точки под поверхностью воды">{depths.map(value=><button key={value} type="button" aria-pressed={depth===value} onClick={()=>setDepth(value)}>{value*100} см</button>)}</div>
        <section className={styles.result} aria-live="polite"><p>Глубина под поверхностью</p><strong>{depth.toLocaleString("ru-RU")} м</strong><span>1000 кг/м³ · 10 Н/кг · {depth.toLocaleString("ru-RU")} м</span><p><b>{pressure} кПа</b> — гидростатическое давление воды. Вдвое большая глубина дала бы вдвое большее давление.</p></section>
      </div>
    </div>
  </div>;
}
