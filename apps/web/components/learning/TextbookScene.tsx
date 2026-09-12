"use client";
import Image from "next/image";
import { useState } from "react";
import { MeasurementModel } from "./MeasurementModel";
import { DensityModel } from "./DensityModel";
import { InertiaModel } from "./InertiaModel";
import { PressureModel } from "./PressureModel";
import { ForceModel } from "./ForceModel";
import {RelativeMotionModel} from "./RelativeMotionModel";
import styles from "./TextbookScene.module.css";

const stories = {
  "relative-motion":{asset:"relative",title:"Лодка идёт. А берег приближается?",caption:"Мио наблюдает за лодкой с берега. Сменим точку отсчёта и сравним два описания одного движения.",alt:"Мио с блокнотом наблюдает за моторной лодкой с берега реки"},
  "force-and-dynamometer":{asset:"force",title:"Пружина говорит на языке ньютонов",caption:"Мио записывает показание динамометра. Груз неподвижен, но пружина растянута. Проверим, что показывает прибор и как изменится показание со второй нагрузкой.",alt:"Мио с карандашом наблюдает динамометр на штативе; груз свободно висит на нижнем крючке"},
  pressure:{asset:"pressure",title:"Тот же брусок. Другая вмятина",caption:"Мио поставила одинаковые бруски на разные грани. Сила не выросла, но площадь контакта изменилась. Отделим эти два условия друг от друга.",alt:"Мио сравнивает вмятины от одинаковых брусков на широком и узком основании"},
  inertia: {asset:"inertia",title:"Тележку остановили. А шайбу?",caption:"Мио придержала тележку и заметила, что незакреплённый предмет продолжает движение. Разберём, какое тело тормозят и относительно чего оно движется.",alt:"Мио останавливает лабораторную тележку и наблюдает за свободной шайбой на платформе"},
  density: { asset: "density", title: "Больше — значит тяжелее? Проверим", caption: "Мио сравнивает два образца. Одного взгляда на размер мало: нужно сопоставить массу и объём, а затем проверить своё объяснение.", alt: "Мио внимательно взвешивает небольшой металлический образец; рядом лежит более крупный образец" },
  "reading-scales": { asset: "measurement", title: "Шкала мельче. А воды больше?", caption: "Мио смотрит на уровень воды сбоку. Проверим один и тот же объём по двум шкалам: что изменится в записи измерения?", alt: "Мио наклонилась к мензурке и смотрит на мениск на уровне глаз" },
  "path-and-displacement": { asset: "path", title: "Забыла блокнот. Вернулась. Никуда не ходила?", caption: "Мио дошла от кабинета до скамейки и вернулась за блокнотом. Конечная точка та же — но прогулка всё-таки была.", alt: "Мио возвращается к двери лаборатории за забытым блокнотом" },
  "average-speed": { asset: "average", title: "Две скорости — ещё не весь ответ", caption: "Мио остановилась и проверяет секундомер. Две скорости записаны, но важно ещё время каждого участка — и границы всей поездки.", alt: "Мио стоит рядом с припаркованным велосипедом и проверяет секундомер" },
  acceleration: { asset: "acceleration", title: "Троллейбус тронулся. Что изменилось?", caption: "Мио держится за поручень и наблюдает начало движения. Разберём модель разгона, а затем сравним её с торможением.", alt: "Мио в троллейбусе держится за поручень и смотрит на улицу" },
} as const;

function WalkModel() {
  const [step, setStep] = useState(0);
  const x = step === 1 ? 430 : 70;
  return <div className={styles.experiment}>
    <p>В нашей модели от двери до скамейки 20 м. Выбери момент прогулки.</p>
    <div className={styles.controls}>{["У двери", "У скамейки", "Снова у двери"].map((label,index)=><button key={label} aria-pressed={step===index} onClick={()=>setStep(index)}>{label}</button>)}</div>
    <svg className={styles.diagram} viewBox="0 0 500 180" role="img" aria-label={`Мио ${step===1 ? "у скамейки" : "у двери"}; путь ${step * 20} метров; модуль перемещения ${step===1 ? 20 : 0} метров`}>
      <line x1="70" y1="125" x2="430" y2="125" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="115" x2="70" y2="135" stroke="currentColor" strokeWidth="2" /><line x1="430" y1="115" x2="430" y2="135" stroke="currentColor" strokeWidth="2" />
      <text x="70" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Дверь</text><text x="430" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Скамейка</text>
      {step > 0 && <g className={styles.routeTrace}><path d="M70 64 H430 l-12 -7 m12 7 l-12 7" fill="none" stroke="var(--action-primary)" strokeWidth="3" /><text x="250" y="55" textAnchor="middle" fill="currentColor" fontSize="15">Туда · 20 м</text></g>}
      {step === 2 && <g className={styles.routeTrace}><path d="M430 99 H70 l12 -7 m-12 7 l12 7" fill="none" stroke="#dca638" strokeWidth="3" /><text x="250" y="91" textAnchor="middle" fill="currentColor" fontSize="15">Обратно · 20 м</text></g>}
      <g className={styles.walker} style={{transform:`translateX(${x}px)`}}><circle cy="18" r="8" fill="var(--action-primary)" /><text y="39" textAnchor="middle" fill="currentColor" fontSize="14">Мио</text></g>
    </svg>
    <div className={styles.readout} aria-live="polite"><p>Пройденный путь<strong>{step * 20} м</strong></p><p>Модуль перемещения<strong>{step === 1 ? 20 : 0} м</strong></p></div>
    <p className={styles.explanation}>{step === 2 ? "Вернулась в начальную точку: перемещение равно нулю. Но путь — 20 м туда и 20 м обратно, всего 40 м." : step === 1 ? "Пока Мио шла прямо к скамейке, путь и модуль перемещения совпали." : "Это начало отсчёта: Мио ещё не прошла ни одного участка."}</p>
    {step === 2 && <p className={styles.aside}>Мио: «Перемещение ноль. Шагомер с таким отчётом не согласен». Оба правы: они описывают разные величины.</p>}
  </div>;
}

function SpeedModel() {
  const [equal,setEqual] = useState(true);
  const [stop,setStop] = useState(false);
  const firstTime=equal?5:8, secondTime=10-firstTime;
  const distance=2*firstTime+8*secondTime;
  const totalTime = 10 + (stop ? 10 : 0);
  return <div className={styles.experiment}>
    <p>Сначала 2 м/с, затем 8 м/с. Движение занимает 10 с. Сравни, какой путь добавляет каждый участок.</p>
    <div className={styles.controls}><button aria-pressed={equal} onClick={()=>setEqual(true)}>По 5 с на участок</button><button aria-pressed={!equal} onClick={()=>setEqual(false)}>8 с медленно, 2 с быстро</button></div>
    <div className={styles.distanceBars} aria-label="Пути участков в одном масштабе">
      <p>Медленный участок: 2 · {firstTime} = <strong>{2 * firstTime} м</strong></p>
      <div aria-hidden="true"><span style={{width:`${2 * firstTime / 40 * 100}%`}} /></div>
      <p>Быстрый участок: 8 · {secondTime} = <strong>{8 * secondTime} м</strong></p>
      <div aria-hidden="true"><span style={{width:`${8 * secondTime / 40 * 100}%`}} /></div>
      <small>Длина полосы показывает путь. Масштаб обеих полос одинаковый.</small>
    </div>
    <label className={styles.stopControl}><input type="checkbox" checked={stop} onChange={event=>setStop(event.target.checked)} />Включить ещё 10 с остановки в эту поездку</label>
    <div className={styles.readout} aria-live="polite"><p>Весь путь<strong>{distance} м</strong></p><p>Средняя скорость пути<strong>{(distance/totalTime).toLocaleString("ru-RU")} м/с</strong></p></div>
    <p className={styles.explanation}>Сумма путей: {2*firstTime} + {8*secondTime} = {distance} м. Всё время: {firstTime} + {secondTime}{stop ? " + 10" : ""} = {totalTime} с. Делим {distance} м на {totalTime} с.</p>
    <p className={styles.aside}>{stop ? "Мио: «Я стояла, а время — нет». Остановка не добавила пути, но вошла в выбранное время поездки." : equal ? "При равных временах полусумма скоростей сработала. А теперь поменяй время." : "Мио: «Скорости те же. А моя красивая полусумма уже не работает». Условия важнее удобного приёма."}</p>
  </div>;
}

function AccelerationModel() {
  const [braking,setBraking] = useState(false);
  const [left,setLeft] = useState(false);
  const sign = left ? -1 : 1;
  const initialSpeed = sign * (braking ? 8 : 2);
  const finalSpeed = sign * (braking ? 2 : 8);
  const acceleration = (finalSpeed-initialSpeed)/3;
  const accelerationLeft = acceleration < 0;
  return <div className={styles.experiment}>
    <p>Положительное направление оси — вправо. На каждом выбранном участке ускорение постоянно.</p>
    <div className={styles.controls}><button aria-pressed={!braking} onClick={()=>setBraking(false)}>Разгон: от 2 до 8 м/с за 3 с</button><button aria-pressed={braking} onClick={()=>setBraking(true)}>Торможение: от 8 до 2 м/с за 3 с</button></div>
    <label className={styles.stopControl}><input type="checkbox" checked={left} onChange={event=>setLeft(event.target.checked)}/>Троллейбус едет влево</label>
    <div className={styles.vectorRow}><strong>Скорость</strong><DirectionArrow left={left} label={`Скорость ${left ? "влево" : "вправо"}`} /></div>
    <div className={styles.vectorRow}><strong>Ускорение</strong><DirectionArrow left={accelerationLeft} label={`Ускорение ${accelerationLeft ? "влево" : "вправо"}`} gold /></div>
    <p className={styles.aside}>Стрелки показывают направления, их длины не сравнивают скорость с ускорением.</p>
    <p className={styles.explanation} aria-live="polite">v₀ₓ = {initialSpeed} м/с; vₓ = {finalSpeed} м/с. aₓ = ({finalSpeed} − ({initialSpeed})) / 3 = {acceleration} м/с². {braking ? "Скорость и ускорение противоположны: троллейбус замедляется." : "Скорость и ускорение сонаправлены: троллейбус разгоняется."}</p>
    <p className={styles.aside}>{left && !braking ? "Мио: «Минус есть. Торможения нет». При разгоне влево проекция ускорения отрицательна." : "Мио: «Сначала посмотрю, куда направлены оба вектора. Один знак ещё не вся история»."}</p>
  </div>;
}

function DirectionArrow({left,label,gold=false}:{left:boolean;label:string;gold?:boolean}) {
  return <svg viewBox="0 0 240 48" role="img" aria-label={label}><g stroke={gold ? "#dca638" : "var(--action-primary)"} strokeWidth="4" fill="none"><path d={left ? "M220 24 H20 L36 12 M20 24 L36 36" : "M20 24 H220 L204 12 M220 24 L204 36"} /></g></svg>;
}

export function TextbookScene({chapterId}:{chapterId:string}) {
  if (!(chapterId in stories)) return null;
  const story=stories[chapterId as keyof typeof stories];
  return <section className={styles.scene} aria-label="История и модель с Мио">
    <figure className={styles.illustration}><Image className={styles.art} src={`/images/mio/textbook-${story.asset}-v1.png`} alt={story.alt} width={1536} height={1024} sizes="(max-width:640px) 100vw, 450px" priority /><figcaption className={styles.caption}><h2>{story.title}</h2><p>{story.caption}</p></figcaption></figure>
    {chapterId==="relative-motion"?<RelativeMotionModel/>:chapterId==="force-and-dynamometer"?<ForceModel/>:chapterId==="pressure"?<PressureModel/>:chapterId==="inertia"?<InertiaModel/>:chapterId==="density"?<DensityModel/>:chapterId==="reading-scales"?<MeasurementModel/>:chapterId==="path-and-displacement"?<WalkModel/>:chapterId==="average-speed"?<SpeedModel/>:<AccelerationModel/>}
  </section>;
}

