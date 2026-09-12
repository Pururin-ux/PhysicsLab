"use client";
import {useState} from "react";
import Image from "next/image";
import modelStyles from "./RelativeMotionModel.module.css";
import styles from "./TextbookScene.module.css";
export function RelativeMotionModel(){
  const [current,setCurrent]=useState(2);
  const [direction,setDirection]=useState("across");
  const [frame,setFrame]=useState("shore");
  const [time,setTime]=useState(0);
  const boatX=direction==="across"?0:direction==="up"?-3:3;
  const boatY=direction==="across"?3:0;
  const vx=boatX+(frame==="shore"?current:0),vy=boatY;
  const x=150+vx*time*9,y=210-vy*time*9;
  const speed=Math.hypot(vx,vy).toLocaleString("ru-RU",{maximumFractionDigits:1});
  return <div className={styles.experiment}>
    <p>Лодка идёт со скоростью 3 м/с относительно воды. Течение направлено вправо.</p>
    <div className={styles.controls}><label>Скорость течения <select className={modelStyles.select} value={current} onChange={e=>setCurrent(Number(e.target.value))}>{[0,2,3,4].map(v=><option key={v} value={v}>{v} м/с</option>)}</select></label></div>
    <div className={styles.controls} aria-label="Направление лодки">{[["down","По течению"],["up","Против течения"],["across","Поперёк течения"]].map(([value,label])=><button key={value} aria-pressed={direction===value} onClick={()=>setDirection(value)}>{label}</button>)}</div>
    <div className={styles.controls} aria-label="Система отсчёта">{[["shore","Относительно берега"],["water","Относительно воды"]].map(([value,label])=><button key={value} aria-pressed={frame===value} onClick={()=>setFrame(value)}>{label}</button>)}</div>
    <p>{frame==="shore"?"Берег неподвижен":"Вода неподвижна"}</p>
    <div className={modelStyles.river} role="img" aria-label={`Через ${time} с: смещение лодки по горизонтали ${vx*time} м, поперёк реки ${vy*time} м ${frame==="shore"?"относительно берега":"относительно воды"}.`}>
      <div className={modelStyles.scenery} style={{transform:`translateX(${frame==="water"?-current*time*9/8:0}%)`}}>
        <Image src="/images/experiments/river-stage-v1.png" alt="" fill sizes="(max-width:640px) 160vw, 1120px" />
      </div>
      {time>0 && (vx!==0 || vy!==0) ? <span className={modelStyles.start}>Старт</span> : null}
      <div className={modelStyles.boat} style={{left:`${x/5}%`,top:`${y/2.9}%`,transform:`translate(-50%,-50%) rotate(${direction==="across"?-90:direction==="up"?180:0}deg)`}}>
        <Image src="/images/experiments/motorboat-top-v1.png" alt="" width={1536} height={1024} sizes="100px" />
      </div>
    </div>
    <div className={styles.controls}><button aria-pressed={time===0} onClick={()=>setTime(0)}>В начале</button><button aria-pressed={time===4} onClick={()=>setTime(4)}>Через 4 с</button></div>
    <p className={styles.explanation} role="status">Скорость {frame==="shore"?"относительно берега":"относительно воды"}: <strong>{speed} м/с</strong>. {frame==="water"?"Течение не меняет заданные 3 м/с относительно воды.":vx===0&&vy===0?"Лодка остаётся напротив той же точки берега, хотя движется относительно воды.":direction==="across"?"Течение добавляет движение вправо. Скорости складываем как векторы.":vx<0?"Лодка продвигается против течения.":"Лодка смещается вниз по течению."}</p>
  </div>;
}

