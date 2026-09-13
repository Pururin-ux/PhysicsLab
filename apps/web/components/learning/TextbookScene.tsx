"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { roundTripInitial, roundTripReading, walkInitial } from "../../lib/learning/round-trip";
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
  "average-speed": { asset: "path", title: "Вернулась к двери. Средняя скорость — ноль?", caption: "От двери до скамейки 20 м. Мио прошла туда и обратно: путь 40 м, перемещение ноль. Теперь добавим время этой прогулки.", alt: "Мио вернулась в кабинет за блокнотом; в коридоре видна скамейка" },
  acceleration: { asset: "acceleration", title: "Троллейбус тронулся. Что изменилось?", caption: "Мио держится за поручень и наблюдает начало движения. Разберём модель разгона, а затем сравним её с торможением.", alt: "Мио в троллейбусе держится за поручень и смотрит на улицу" },
} as const;

function WalkModel() {
  const [state, setState] = useState(walkInitial);
  const draft = useLessonDraft("textbook-walk", state, setState, 3);
  const step = state.stage;
  const setStep = (stage: number) => setState(current => ({ ...current, stage }));
  const x = step === 1 ? 430 : 70;
  if (!draft.ready) return <p role="status">Открываю прогулку…</p>;
  return <div className={styles.experiment}>
    <p>В нашей модели от двери до скамейки 20 м. Выбери момент прогулки.</p>
    <div className={styles.controls}>{["У двери", "У скамейки", "Снова у двери"].map((label,index)=><button key={label} aria-pressed={step===index} onClick={()=>setStep(index)}>{label}</button>)}</div>
    <svg className={styles.diagram} viewBox="0 0 500 180" role="img" aria-label={`Мио ${step===1 ? "у скамейки" : "у двери"}; путь ${step * 20} метров; модуль перемещения ${step===1 ? 20 : 0} метров`}>
      <line x1="70" y1="125" x2="430" y2="125" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="115" x2="70" y2="135" stroke="currentColor" strokeWidth="2" /><line x1="430" y1="115" x2="430" y2="135" stroke="currentColor" strokeWidth="2" />
      <text x="70" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Дверь</text><text x="430" y="164" textAnchor="middle" fill="currentColor" fontSize="16">Скамейка</text>
      {step > 0 && <g className={styles.routeTrace}><path d="M70 64 H430 l-12 -7 m12 7 l-12 7" fill="none" stroke="var(--action-primary)" strokeWidth="3" /><text x="250" y="55" textAnchor="middle" fill="currentColor" fontSize="15">Туда · 20 м</text></g>}
      {step === 2 && <g className={styles.routeTrace}><path d="M430 99 H70 l12 -7 m-12 7 l12 7" fill="none" stroke="#dca638" strokeWidth="3" /><text x="250" y="91" textAnchor="middle" fill="currentColor" fontSize="15">Обратно · 20 м</text></g>}
      <g className={styles.walker} style={{transform:`translateX(${x}px)`}}><text y="25" textAnchor="middle" fill="currentColor" fontSize="15">Сейчас ↓</text></g>
    </svg>
    <div className={styles.readout} aria-live="polite"><p>Пройденный путь<strong>{step * 20} м</strong></p><p>Модуль перемещения<strong>{step === 1 ? 20 : 0} м</strong></p></div>
    <p className={styles.explanation}>{step === 2 ? "Вернулась в начальную точку: перемещение равно нулю. Но путь — 20 м туда и 20 м обратно, всего 40 м." : step === 1 ? "Пока Мио шла прямо к скамейке, путь и модуль перемещения совпали." : "Это начало отсчёта: Мио ещё не прошла ни одного участка."}</p>
    {step === 2 && <p className={styles.aside}>Мио: «Перемещение ноль. Шагомер с таким отчётом не согласен». Оба правы: они описывают разные величины.</p>}
    {step === 2 && <div className={styles.bridge}><p>Маршрут тот же, но пройти его можно за разное время. Как это изменит среднюю скорость?</p><Link href="/learn/average-speed">Добавить время к прогулке →</Link></div>}
    {draft.error && <p role="alert" className={styles.aside}>{draft.error}</p>}
  </div>;
}

function SpeedModel() {
  const [state, setState] = useState(roundTripInitial);
  const draft = useLessonDraft("textbook-round-trip-speed", state, setState, 1);
  const reading = roundTripReading(state.seconds, state.stop);
  const speed = reading.pathSpeed.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  const approximate = !Number.isInteger(reading.pathSpeed * 100);
  if (!draft.ready) return <p role="status">Открываю опыт…</p>;
  return <div className={styles.experiment}>
    <p>Дверь → скамейка → дверь: 20 м туда и 20 м обратно. Выбери время движения за всю прогулку.</p>
    <div className={styles.controls} aria-label="Время движения">{[10, 20, 40].map(seconds => <button key={seconds} aria-pressed={reading.movingTime === seconds} onClick={() => setState(current => ({ ...current, seconds }))}>{seconds} с</button>)}</div>
    <label className={styles.stopControl}><input type="checkbox" checked={state.stop} onChange={event => setState(current => ({ ...current, stop: event.target.checked }))} />Добавить 10 с остановки у скамейки</label>
    <div className={styles.readout} aria-live="polite">
      <p>Средняя скорость пути<strong>{approximate ? "≈ " : ""}{speed} м/с</strong><small>40 м ÷ {reading.elapsed} с</small></p>
      <p>Модуль средней скорости перемещения<strong>0 м/с</strong><small>0 м ÷ {reading.elapsed} с</small></p>
    </div>
    <p className={styles.explanation}>{state.stop ? `Весь промежуток: ${reading.movingTime} с движения + 10 с остановки = ${reading.elapsed} с. Остановка не добавила пути, но вошла во время прогулки.` : "Путь один и тот же: чем меньше времени заняла прогулка, тем больше средняя скорость пути."} Начало и конец совпадают при любом выбранном времени.</p>
    <p className={styles.aside}>Мио: «Ноль — правильный ответ. Только нужно уточнить, о какой скорости речь».</p>
    <div className={styles.bridge}><h3>А если известны две скорости?</h3><p>На новой поездке Мио записала 2 и 8 м/с. Она предлагает взять их полусумму — 5 м/с. Достаточно ли этих двух чисел?</p><Link href="/practice/average-speed-lesson">Проверить догадку Мио →</Link></div>
    {draft.error && <p role="alert" className={styles.aside}>{draft.error}</p>}
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

