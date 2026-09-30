"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { roundTripInitial, roundTripReading, walkInitial } from "../../lib/learning/round-trip";
import styles from "./TextbookScene.module.css";
import accelerationStyles from "./AccelerationNotebook.module.css";

export function WalkModel() {
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

export function SpeedModel() {
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

export function AccelerationModel() {
  const [braking,setBraking] = useState(false);
  const [left,setLeft] = useState(false);
  const sign = left ? -1 : 1;
  const initialSpeed = sign * (braking ? 8 : 2);
  const finalSpeed = sign * (braking ? 2 : 8);
  const acceleration = (finalSpeed-initialSpeed)/3;
  const accelerationLeft = acceleration < 0;
  const speedDirection = left ? "влево" : "вправо";
  const accelerationDirection = accelerationLeft ? "влево" : "вправо";
  const signed = (value: number) => value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0";
  const relation = braking
    ? "Скорость и ускорение направлены противоположно: модуль скорости уменьшается."
    : "Скорость и ускорение направлены одинаково: модуль скорости растёт.";
  return <div className={styles.experiment}>
    <div className={accelerationStyles.sheet}>
      <figure className={accelerationStyles.observation}>
        <div className={accelerationStyles.imageFrame}>
          <Image
            className={accelerationStyles.image}
            src={MIO_SCENES.acceleration}
            alt="Мио держится за поручень троллейбуса и наблюдает за началом движения"
            fill
            sizes="(max-width: 760px) 42vw, 34vw"
            priority
          />
        </div>
        <figcaption className={accelerationStyles.caption}>
          <span className={accelerationStyles.eyebrow}>ЗАПИСЬ МИО</span>
          <h2>Троллейбус тронулся. Что изменилось?</h2>
          <p>Мио наблюдает разгон и сверяет изменение скорости с направлением движения.</p>
        </figcaption>
      </figure>

      <div className={accelerationStyles.workingArea}>
        <div className={accelerationStyles.controls}>
          <fieldset className={accelerationStyles.controlSet}>
            <legend>Как меняется модуль скорости?</legend>
            <div className={accelerationStyles.choiceGrid}>
              <button type="button" className={accelerationStyles.choice} aria-pressed={!braking} onClick={() => setBraking(false)}>
                <span>Разгон</span><small>2 → 8 м/с</small>
              </button>
              <button type="button" className={accelerationStyles.choice} aria-pressed={braking} onClick={() => setBraking(true)}>
                <span>Торможение</span><small>8 → 2 м/с</small>
              </button>
            </div>
          </fieldset>
          <fieldset className={accelerationStyles.controlSet}>
            <legend>Куда движется?</legend>
            <div className={accelerationStyles.choiceGrid}>
              <button type="button" className={accelerationStyles.choice} aria-pressed={!left} onClick={() => setLeft(false)}>→ Вправо</button>
              <button type="button" className={accelerationStyles.choice} aria-pressed={left} onClick={() => setLeft(true)}>← Влево</button>
            </div>
          </fieldset>
        </div>

        <div className={accelerationStyles.notebook}>
          <dl className={accelerationStyles.measurements} aria-label="Записанные значения">
            <div className={accelerationStyles.measurement}><dt>Δt</dt><dd>3 с</dd></div>
            <div className={accelerationStyles.measurement}><dt>v₀ₓ</dt><dd>{signed(initialSpeed)} м/с</dd></div>
            <div className={accelerationStyles.measurement}><dt>vₓ</dt><dd>{signed(finalSpeed)} м/с</dd></div>
          </dl>

          <figure className={accelerationStyles.model}>
            <svg
              className={accelerationStyles.vectorDiagram}
              viewBox="0 0 560 168"
              role="img"
              aria-label={`Положительное направление оси x направлено вправо. Скорость направлена ${speedDirection}, ускорение направлено ${accelerationDirection}. Стрелки показывают только направление.`}
            >
              <defs>
                <marker id="acceleration-axis-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <path className={accelerationStyles.axisHead} d="M0 0 10 5 0 10Z" />
                </marker>
                <marker id="acceleration-velocity-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <path className={accelerationStyles.velocityHead} d="M0 0 10 5 0 10Z" />
                </marker>
                <marker id="acceleration-vector-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <path className={accelerationStyles.accelerationHead} d="M0 0 10 5 0 10Z" />
                </marker>
              </defs>
              <line className={accelerationStyles.axis} x1="92" y1="35" x2="472" y2="35" markerEnd="url(#acceleration-axis-head)" />
              <text className={accelerationStyles.axisLabel} x="92" y="24" textAnchor="start">−x</text>
              <text className={accelerationStyles.axisLabel} x="482" y="24" textAnchor="end">+x</text>
              <text className={accelerationStyles.vectorLabel} x="28" y="91">vₓ</text>
              <line className={accelerationStyles.velocity} x1="280" y1="84" x2={left ? "142" : "418"} y2="84" markerEnd="url(#acceleration-velocity-head)" />
              <text className={accelerationStyles.vectorLabel} x="28" y="146">aₓ</text>
              <line className={accelerationStyles.acceleration} x1="280" y1="139" x2={accelerationLeft ? "142" : "418"} y2="139" markerEnd="url(#acceleration-vector-head)" />
            </svg>
            <figcaption className={accelerationStyles.vectorNote}>Ось x направлена вправо. Длины стрелок не сравнивают скорость и ускорение.</figcaption>
          </figure>

          <div className={accelerationStyles.calculation}>
            <p className={accelerationStyles.sectionHeading}>Проекция ускорения</p>
            <p className={accelerationStyles.formula}>aₓ = (vₓ − v₀ₓ) / Δt</p>
            <p className={accelerationStyles.worked} aria-live="polite">
              ({signed(finalSpeed)} − ({signed(initialSpeed)})) м/с ÷ 3 с = <strong>{signed(acceleration)} м/с²</strong>
            </p>
            <p className={accelerationStyles.interpretation} aria-live="polite">{relation}</p>
            {left && !braking && <p className={accelerationStyles.mioNote}>Мио: «Минус — это направление, а не торможение».</p>}
          </div>
        </div>
      </div>
    </div>
  </div>;
}
