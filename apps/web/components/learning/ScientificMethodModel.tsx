"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import {
  GRADUATED_SCALE_ACTUAL_VOLUME_ML,
  GRADUATED_SCALE_UNIT,
  getGraduatedScale,
} from "../../lib/physics/graduated-scale-model";
import {
  PARALLAX_EYE_X,
  PARALLAX_MENISCUS_X,
  PARALLAX_MENISCUS_Y,
  PARALLAX_SCALE_X,
  PARALLAX_TOP_EYE_Y,
  PARALLAX_TOP_READING_ML,
  sightLineAtScale,
} from "../../lib/physics/scientific-method-parallax";
import shared from "./TextbookScene.module.css";
import styles from "./ScientificMethodModel.module.css";

type Prediction = "lower" | "same" | "higher";
type View = "above" | "level";
type Conclusion = "water" | "view" | "law";

const scale = getGraduatedScale("fine");

function ParallaxInstrument({ view }: { view: View }) {
  const eyeY = view === "above" ? PARALLAX_TOP_EYE_Y : PARALLAX_MENISCUS_Y;
  const apparentY = sightLineAtScale(eyeY);

  return <svg className={styles.diagram} viewBox="0 0 300 245" role="img" aria-label={view === "above"
    ? "Схема: Мио смотрит на мениск сверху. Линия зрения пересекает шкалу у сомнительного отсчёта 35 миллилитров. Вода остаётся на прежнем уровне."
    : "Та же вода и та же шкала. Взгляд теперь на уровне нижней точки мениска. Между 30 и 40 миллилитрами пять равных промежутков; линия зрения совпадает с первым штрихом после 30."}>
    <defs>
      <linearGradient id="scientific-water" x1="0" x2="1">
        <stop offset="0" stopColor="var(--action-primary)" stopOpacity=".15" />
        <stop offset=".55" stopColor="var(--action-primary)" stopOpacity=".38" />
        <stop offset="1" stopColor="var(--action-primary)" stopOpacity=".18" />
      </linearGradient>
    </defs>
    <path className={styles.water} d="M55 92 Q110 108 165 92 L165 225 H55 Z" />
    <path className={styles.vessel} d="M50 12 V225 Q50 232 57 232 H163 Q170 232 170 225 V12" />
    <path className={styles.meniscus} d="M55 92 Q110 108 165 92" />
    <circle className={styles.meniscusPoint} cx={PARALLAX_MENISCUS_X} cy={PARALLAX_MENISCUS_Y} r="3" />
    {scale.ticks.map(tick => <g key={tick.value}>
      <path className={styles.tick} d={`M${tick.label ? 170 : 178} ${tick.y} H190`} />
      {tick.label && <text className={styles.tickLabel} x="198" y={tick.y + 4}>{tick.value}</text>}
    </g>)}
    <text className={styles.unit} x="198" y="13">мл</text>
    <path className={styles.sightLine} d={`M${PARALLAX_EYE_X} ${eyeY} L${PARALLAX_MENISCUS_X} ${PARALLAX_MENISCUS_Y}`} />
    <circle className={styles.apparentPoint} cx={PARALLAX_SCALE_X} cy={apparentY} r="5" />
    <path className={styles.eyeOutline} d={`M232 ${eyeY} Q250 ${eyeY - 13} 268 ${eyeY} Q250 ${eyeY + 13} 232 ${eyeY} Z`} />
    <circle className={styles.pupil} cx={PARALLAX_EYE_X} cy={eyeY} r="4" />
  </svg>;
}

export function ScientificMethodModel() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [view, setView] = useState<View>("above");
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState<string | null>(null);
  const [showReading, setShowReading] = useState(false);
  const [conclusion, setConclusion] = useState<Conclusion | null>(null);
  const validNumber = checked !== null && /^\d+(?:[,.]\d+)?$/.test(checked);
  const correct = validNumber && Number(checked.replace(",", ".")) === GRADUATED_SCALE_ACTUAL_VOLUME_ML;
  const observed = correct || showReading;

  function checkReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(draft.trim());
    setShowReading(false);
  }

  return <div className={shared.experiment}>
    <header className={styles.heading}>
      <p className={styles.kicker}>Проверяем догадку</p>
      <h2>Мио записала {PARALLAX_TOP_READING_ML} мл?</h2>
      <p>Она смотрела на мензурку сверху. Предскажи, что покажет та же шкала, если опустить глаза до уровня воды.</p>
    </header>

    <div className={styles.workspace}>
      <section className={[styles.stage, styles.predictionStage].join(" ")} aria-label="Прогноз">
          <span className={styles.stageNumber}>01 / Прогноз</span>
          <fieldset disabled={view === "level"}>
            <legend>Если опустить взгляд, видимый отсчёт…</legend>
            <label><input type="radio" name="scientific-prediction" checked={prediction === "lower"} onChange={() => setPrediction("lower")} /> уменьшится</label>
            <label><input type="radio" name="scientific-prediction" checked={prediction === "same"} onChange={() => setPrediction("same")} /> останется прежним</label>
            <label><input type="radio" name="scientific-prediction" checked={prediction === "higher"} onChange={() => setPrediction("higher")} /> увеличится</label>
          </fieldset>
          {view === "level" && <p className={styles.stageNote}>Меняем только высоту взгляда. Воду и мензурку не трогаем.</p>}
          <button className={view === "above" ? styles.primaryAction : styles.repeatAction} type="button" disabled={view === "above" && !prediction} onClick={() => {
            if (view === "above") {
              setView("level");
            } else {
              setView("above");
              setDraft("");
              setChecked(null);
              setShowReading(false);
              setConclusion(null);
            }
          }}>{view === "above" ? "Опустить взгляд и проверить →" : "Посмотреть сверху ещё раз"}</button>
      </section>

      <div className={styles.instrumentArea}>
        <div className={styles.instrumentHeading}>
          <span>Одна мензурка · одна вода</span>
          <strong>{view === "above" ? "Взгляд сверху" : "Взгляд на уровне воды"}</strong>
        </div>
        <figure className={styles.instrument}>
          <ParallaxInstrument view={view} />
          <figcaption>Разрез мензурки: шкала на ближней стенке. Точка на поверхности воды остаётся на месте; линия зрения меняется.</figcaption>
        </figure>
        <div className={styles.record} aria-live="polite">
          <p><span>Сверху · запись Мио</span><strong>{PARALLAX_TOP_READING_ML} мл?</strong></p>
          <p><span>На уровне воды</span><strong>{observed ? `${GRADUATED_SCALE_ACTUAL_VOLUME_ML} ${GRADUATED_SCALE_UNIT}` : "Пока не проверено"}</strong></p>
        </div>
      </div>

      {view === "level" && <section className={[styles.stage, styles.observationStage].join(" ")} aria-label="Наблюдение">
          <span className={styles.stageNumber}>02 / Наблюдение</span>
          <form onSubmit={checkReading}>
            <label htmlFor="scientific-reading">Что показывает шкала по нижней точке мениска?</label>
            <div className={styles.answerRow}>
              <input id="scientific-reading" type="text" inputMode="decimal" autoComplete="off" required value={draft} onChange={event => {
                setDraft(event.target.value);
                setChecked(null);
                setShowReading(false);
                setConclusion(null);
              }} />
              <span>{GRADUATED_SCALE_UNIT}</span>
              <button type="submit">Сверить</button>
            </div>
          </form>
          <details className={styles.scaleHelp}>
            <summary>Как читать эти штрихи?</summary>
            <p>Между 30 и 40 мл пять равных промежутков. Значит, один промежуток — (40 − 30) ÷ 5 = 2 мл. Мениск совпадает с первым штрихом после 30.</p>
          </details>
          {checked !== null && <div className={styles.feedback} role="status" aria-live="polite">
            {correct ? "Верно: на уровне мениска отсчёт 32 мл." : showReading ? "Каждый из пяти промежутков между 30 и 40 мл — это 2 мл. Первый штрих после 30 показывает 32 мл." : validNumber
              ? "Проверь промежутки между 30 и 40. Если нужна помощь, открой подсказку под ответом."
              : "Введи число без единицы измерения."}
            {!observed && <button type="button" onClick={() => setShowReading(true)}>Показать отсчёт</button>}
          </div>}
          {observed && <p className={styles.comparison}>{prediction === "lower"
            ? "Прогноз совпал с наблюдением: отсчёт стал меньше, хотя вода осталась прежней."
            : "Наблюдение не совпало с прогнозом: отсчёт стал меньше, хотя вода осталась прежней."}</p>}
      </section>}

      {observed && <section className={[styles.stage, styles.conclusionStage].join(" ")} aria-label="Вывод">
          <span className={styles.stageNumber}>03 / Вывод</span>
          <fieldset>
            <legend>Что поддерживает этот опыт?</legend>
            <label><input type="radio" name="scientific-conclusion" checked={conclusion === "water"} onChange={() => setConclusion("water")} /> Воды стало меньше</label>
            <label><input type="radio" name="scientific-conclusion" checked={conclusion === "view"} onChange={() => setConclusion("view")} /> Высота взгляда влияет на отсчёт</label>
            <label><input type="radio" name="scientific-conclusion" checked={conclusion === "law"} onChange={() => setConclusion("law")} /> Один опыт доказывает общий закон</label>
          </fieldset>
          {conclusion && <p className={styles.conclusionFeedback} role="status">{conclusion === "view"
            ? "Да. Вода не менялась, а видимый отсчёт изменился. Опыт поддерживает гипотезу о высоте взгляда — в границах этой проверки."
            : conclusion === "water"
              ? "Воду не доливали и не выливали. Изменилось только положение глаз."
              : "Один опыт поддерживает проверяемую гипотезу, но не доказывает универсальный закон."}</p>}
          {conclusion === "view" && <div className={styles.nextStep}>
            <figure className={styles.mioMoment}>
              <Image src={MIO_SCENES.measurement} alt="Мио опустила глаза до уровня воды и сверяет отсчёт" width={340} height={220} sizes="(max-width: 700px) 110px, 140px" />
              <figcaption>Мио сверяет запись.</figcaption>
            </figure>
            <Link href="/learn/reading-scales">Разобраться, как читать шкалу →</Link>
          </div>}
      </section>}
    </div>
  </div>;
}
