"use client";

import { useId, useState } from "react";
import { calculateInductionChange } from "../../lib/physics/induction-model";
import styles from "./InductionNotebook.module.css";

const INITIAL_FIELD_TESLAS = 0.2;
const LOOP_AREA_SQUARE_METRES = 0.02;
const TURN_COUNT = 50;
const FINAL_FIELDS = [0, 0.2, 0.4] as const;
const DURATIONS = [0.5, 1, 2] as const;

type FinalField = (typeof FINAL_FIELDS)[number];
type Duration = (typeof DURATIONS)[number];

function number(value: number, digits = 2) {
  return (Math.abs(value) < 1e-10 ? 0 : value).toLocaleString("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Apparatus({ finalField, closed, fluxChange, emfVolts, compact = false }: {
  finalField: FinalField;
  closed: boolean;
  fluxChange: number;
  emfVolts: number;
  compact?: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const currentSense = closed && Math.abs(emfVolts) > 1e-10 ? Math.sign(emfVolts) : 0;
  const needleX = 614 + currentSense * 34;
  const needleY = currentSense === 0 ? 265 : 278;
  const fieldStrength = finalField === 0 ? "нет поля" : finalField === 0.2 ? "0,20 Тл" : "0,40 Тл";
  const fieldDescription = finalField === 0
    ? "После изменения внешнего поля в зазоре нет."
    : `После изменения внешнее поле направлено вправо и равно ${fieldStrength}.`;

  return <svg className={`${styles.apparatus} ${compact ? styles.compactApparatus : styles.wideApparatus}`} viewBox={compact ? "174 48 412 192" : "0 0 760 350"} role="img" aria-label={
    `Схема опыта: неподвижная катушка из ${TURN_COUNT} витков между наконечниками электромагнита. ` +
    `Нормаль к витку направлена вправо. ${fieldDescription} ` +
    (fluxChange === 0 ? "Поток не изменился, прибор не отклоняется." :
      closed ? "При изменении потока замкнутая цепь отклоняет стрелку гальванометра." :
        "При изменении потока цепь разомкнута, стрелка не отклоняется.")
  }>
    <defs>
      <linearGradient id={`${id}-steel`} x2="0" y2="1"><stop stopColor="#aeb5bb" /><stop offset=".45" stopColor="#edf0ee" /><stop offset="1" stopColor="#65727d" /></linearGradient>
      <linearGradient id={`${id}-copper`} x2="1" y2="0"><stop stopColor="#744629" /><stop offset=".32" stopColor="#c78048" /><stop offset=".56" stopColor="#f0b16e" /><stop offset="1" stopColor="#86512f" /></linearGradient>
      <marker id={`${id}-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M1 1L11 6L1 11Z" className={styles.arrowhead} /></marker>
    </defs>

    <path d="M23 231H738" className={styles.benchEdge} />
    <path d="M35 232H728L710 246H53Z" className={styles.benchTop} />
    <path d="M105 246V261M655 246V261" className={styles.benchLegs} />

    <g className={styles.magnetCase}>
      <path d="M39 91L153 79L180 91V203L153 217L39 203Z" fill={`url(#${id}-steel)`} />
      <path d="M39 91L153 79L180 91L66 105Z" className={styles.magnetTop} />
      <path d="M39 203L153 217V79L39 91Z" className={styles.magnetSide} />
      <path d="M180 103L211 109V192L180 202Z" className={styles.poleFace} />
      <path d="M721 91L607 79L580 91V203L607 217L721 203Z" fill={`url(#${id}-steel)`} />
      <path d="M721 91L607 79L580 91L694 105Z" className={styles.magnetTop} />
      <path d="M721 203L607 217V79L721 91Z" className={styles.magnetSide} />
      <path d="M580 103L549 109V192L580 202Z" className={styles.poleFace} />
      {finalField > 0 && <><text x="120" y="165" textAnchor="middle">N</text><text x="640" y="165" textAnchor="middle">S</text></>}
      {compact && finalField > 0 && <><text x="195" y="157" textAnchor="middle" className={styles.compactPoleLabel}>N</text><text x="565" y="157" textAnchor="middle" className={styles.compactPoleLabel}>S</text></>}
    </g>

    {finalField > 0 && <g className={styles.field} opacity={finalField === 0.2 ? .62 : .94} markerEnd={`url(#${id}-arrow)`}>
      <path d="M216 115H535" /><path d="M216 148H535" /><path d="M216 181H535" />
    </g>}

    <g className={styles.coilAssembly}>
      <path d="M316 100L431 107V193L316 201Z" className={styles.coilBody} />
      <path d="M306 100C284 110 283 188 306 201L318 199C297 184 297 115 318 102Z" className={styles.flange} />
      <path d="M432 105C457 114 458 184 432 195L421 192C440 177 440 122 421 109Z" className={styles.flange} />
      {Array.from({ length: 10 }, (_, index) => {
        const x = 318 + index * 11.1;
        return <path key={index} d={`M${x} 103C${x + 34} 108 ${x + 34} 194 ${x} 199C${x - 24} 193 ${x - 24} 109 ${x} 103Z`} className={styles.winding} stroke={`url(#${id}-copper)`} />;
      })}
      <path d="M311 202C334 217 414 216 438 196" className={styles.coilLowerRim} />
      <path d="M370 205V229M400 204V229" className={styles.coilStand} />
      <path d="M347 229H423" className={styles.coilFoot} />
      <text x="373" y="70" textAnchor="middle" className={styles.coilLabel}>катушка · {TURN_COUNT} витков</text>
      <path d="M454 80H514" className={styles.normalArrow} markerEnd={`url(#${id}-arrow)`} />
      <text x="480" y="66" textAnchor="middle" className={styles.normalLabel}>+n</text>
    </g>

    <g className={styles.circuit}>
      <path d="M309 202C265 216 255 282 338 300H546" />
      <path d="M438 198C479 212 482 242 498 261" />
      <path d="M551 261L560 276" />
      <circle cx="498" cy="261" r="4" className={styles.contact} />
      <circle cx="551" cy="261" r="4" className={styles.contact} />
      {closed && <path d="M498 261H551" className={styles.switchBridge} />}
      <text x="524" y="247" textAnchor="middle" className={styles.switchLabel}>{closed ? "замкнуто" : "разомкнуто"}</text>
    </g>

    <g className={styles.galvanometer}>
      <path d="M546 276L559 240H669L683 276V319H546Z" className={styles.meterCase} />
      <path d="M560 275L570 250H657L669 275V309H560Z" className={styles.meterFace} />
      <path d="M582 278Q614 247 646 278" className={styles.meterScale} />
      <path d="M613 260V268M584 273L589 276M641 273L636 276" className={styles.meterTicks} />
      <path d={`M614 304L${needleX} ${needleY}`} className={styles.needle} />
      <circle cx="614" cy="304" r="5" className={styles.needlePivot} />
      <text x="614" y="340" textAnchor="middle" className={styles.meterLabel}>гальванометр</text>
    </g>
    <text x="40" y="38" className={styles.diagramHeading}>Поле электромагнита · вид сбоку</text>
  </svg>;
}

export function InductionNotebook() {
  const headingId = useId();
  const [finalField, setFinalField] = useState<FinalField>(0.4);
  const [duration, setDuration] = useState<Duration>(1);
  const [closed, setClosed] = useState(true);
  const reading = calculateInductionChange({
    initial: { magneticFieldTeslas: INITIAL_FIELD_TESLAS, normalAngleRadians: 0 },
    final: { magneticFieldTeslas: finalField, normalAngleRadians: 0 },
    loopAreaSquareMetres: LOOP_AREA_SQUARE_METRES,
    turnCount: TURN_COUNT,
    durationSeconds: duration,
  });
  const initialFluxMilliwebers = reading.initialFluxWebers * 1000;
  const finalFluxMilliwebers = reading.finalFluxWebers * 1000;
  const changeMilliwebers = reading.fluxChangeWebers * 1000;
  const hasInduction = reading.averageEmfMagnitudeVolts > 1e-10;
  const fieldChange = changeMilliwebers > 0 ? "поток вырос" : changeMilliwebers < 0 ? "поток уменьшился" : "поток не изменился";
  const result = !hasInduction ? "ЭДС нет: поток постоянен." : closed
    ? `Пока поток меняется, в замкнутой цепи есть ток. Катушка создаёт поле ${reading.inducedFieldDirection === "along-normal" ? "вправо" : "влево"} — против изменения потока.`
    : "ЭДС есть, но цепь разомкнута: индукционного тока через прибор нет.";

  return <section className={styles.notebook} aria-labelledby={headingId}>
    <header className={styles.heading}>
      <span className={styles.eyebrow}>Опыт · электромагнитная индукция</span>
      <h2 id={headingId}>Когда стрелка оживает?</h2>
      <p>Катушка неподвижна. Измени поле электромагнита и сравни поток через её витки.</p>
    </header>

    <div className={styles.controls} aria-label="Условия опыта">
      <fieldset>
        <legend>Поле после изменения</legend>
        <div className={styles.choices}>{FINAL_FIELDS.map(value => <button type="button" key={value} aria-pressed={finalField === value} onClick={() => setFinalField(value)}>{number(value)} Тл</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>Время изменения</legend>
        <div className={styles.choices}>{DURATIONS.map(value => <button type="button" key={value} aria-pressed={duration === value} onClick={() => setDuration(value)}>{number(value, value === 0.5 ? 1 : 0)} с</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>Концы катушки</legend>
        <div className={styles.choices}><button type="button" aria-pressed={closed} onClick={() => setClosed(true)}>Соединены</button><button type="button" aria-pressed={!closed} onClick={() => setClosed(false)}>Разомкнуты</button></div>
      </fieldset>
    </div>

    <div className={styles.experiment}>
      <figure className={styles.figure}>
        <Apparatus finalField={finalField} closed={closed} fluxChange={reading.fluxChangeWebers} emfVolts={reading.averageEmfVolts} />
        <Apparatus finalField={finalField} closed={closed} fluxChange={reading.fluxChangeWebers} emfVolts={reading.averageEmfVolts} compact />
        <figcaption>Показано поле после изменения; расчёт относится к самому промежутку изменения. N и S обозначают направление включённого поля. Отклонение стрелки и витки нарисованы условно.</figcaption>
      </figure>
      <div className={styles.evidence}>
        <div className={styles.beforeAfter}>
          <div><span>До</span><strong>{number(INITIAL_FIELD_TESLAS)} Тл</strong><small>Φ = {number(initialFluxMilliwebers, 0)} мВб</small></div>
          <div className={styles.interval}><span>→</span><small>за {number(duration, duration === 0.5 ? 1 : 0)} с</small></div>
          <div><span>После</span><strong>{number(finalField)} Тл</strong><small>Φ = {number(finalFluxMilliwebers, 0)} мВб</small></div>
        </div>
        <div className={styles.result}>
          <span>{fieldChange} · ΔΦ = {changeMilliwebers < 0 ? "−" : changeMilliwebers > 0 ? "+" : ""}{number(Math.abs(changeMilliwebers), 0)} мВб на виток</span>
          <output aria-label={`Модуль средней ЭДС за время изменения ${number(reading.averageEmfMagnitudeVolts)} вольта`}>
            {number(reading.averageEmfMagnitudeVolts)} <small>В</small>
          </output>
          <p>Средняя ЭДС за время изменения · 50 витков</p>
        </div>
        <p className={styles.verdict} aria-live="polite">{result}</p>
      </div>
    </div>
    <p className={styles.boundary}>Нормаль +n направлена вправо, площадь витка 0,020 м². Поле внутри витка считаем однородным; изменение — равномерным. После него стрелка возвращается к нулю в установившемся состоянии. Короткий переходный процесс и величину тока без сопротивления здесь не рассчитываем.</p>
  </section>;
}
