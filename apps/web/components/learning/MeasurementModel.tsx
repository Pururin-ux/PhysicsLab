"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import {
  GRADUATED_SCALE_ACTUAL_VOLUME_ML,
  GRADUATED_SCALE_BOTTOM_Y,
  GRADUATED_SCALE_TOP_Y,
  GRADUATED_SCALE_UNIT,
  GRADUATED_SCALE_VIEWBOX_HEIGHT,
  GRADUATED_SCALE_VIEWBOX_WIDTH,
  getGraduatedScale,
  type ScaleMode,
} from "../../lib/physics/graduated-scale-model";
import styles from "./MeasurementModel.module.css";

const coarseScale = getGraduatedScale("coarse");
const fineScale = getGraduatedScale("fine");
const fineIntervalsBelowLevel = (GRADUATED_SCALE_ACTUAL_VOLUME_ML - fineScale.ticks[0].value) / fineScale.step;

type ReadingAttempt = { draft: string; checked: string | null; showSolution: boolean };

function CalibratedScale({ mode }: { mode: ScaleMode }) {
  const scale = mode === "coarse" ? coarseScale : fineScale;
  const meniscusEdgeY = scale.meniscusY - 6;
  const accessibleReading = mode === "fine"
    ? "На мелкой шкале от 20 до 40 миллилитров " + fineScale.intervals + " промежутков. Нижняя точка мениска совпадает с " + fineIntervalsBelowLevel + "-м штрихом после 20."
    : "На крупной шкале от 20 до 40 миллилитров " + coarseScale.intervals + " промежутка. Нижняя точка мениска немного выше отметки 30.";

  return <svg
    className={styles.scaleSvg}
    viewBox={"0 0 " + GRADUATED_SCALE_VIEWBOX_WIDTH + " " + GRADUATED_SCALE_VIEWBOX_HEIGHT}
    role="img"
    aria-label={accessibleReading}
  >
    <defs>
      <linearGradient id="graduated-water" x1="0" x2="1">
        <stop offset="0" stopColor="var(--action-primary)" stopOpacity=".24" />
        <stop offset=".55" stopColor="var(--action-primary)" stopOpacity=".44" />
        <stop offset="1" stopColor="var(--action-primary)" stopOpacity=".18" />
      </linearGradient>
    </defs>
    <path
      className={styles.water}
      d={"M25 " + meniscusEdgeY + " Q58 " + (scale.meniscusY + 6) + " 91 " + meniscusEdgeY + " L91 242 H25 Z"}
    />
    <path className={styles.vessel} d="M20 -2 V242 M96 -2 V242" />
    <path
      className={styles.meniscus}
      d={"M25 " + meniscusEdgeY + " Q58 " + (scale.meniscusY + 6) + " 91 " + meniscusEdgeY}
    />
    <path className={styles.reference} d={"M58 " + scale.meniscusY + " H108"} />
    <circle className={styles.referencePoint} cx="58" cy={scale.meniscusY} r="2.4" />
    <path className={styles.scaleRail} d={"M111 " + GRADUATED_SCALE_TOP_Y + " V" + GRADUATED_SCALE_BOTTOM_Y} />
    {scale.ticks.map(tick => <g key={tick.value}>
      <path className={styles.tick} d={"M" + (tick.label ? 98 : 104) + " " + tick.y + " H111"} />
      {tick.label && <text className={styles.tickLabel} x="123" y={tick.y + 3.5}>{tick.value}</text>}
    </g>)}
    <text className={styles.unitLabel} x="123" y="10">{GRADUATED_SCALE_UNIT}</text>
  </svg>;
}

export function MeasurementModel() {
  const fineScaleButtonRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<ScaleMode>("coarse");
  const [coarseCompleted, setCoarseCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<ScaleMode, ReadingAttempt>>({
    coarse: { draft: "", checked: null, showSolution: false },
    fine: { draft: "", checked: null, showSolution: false },
  });
  const attempt = attempts[mode];
  const scale = mode === "coarse" ? coarseScale : fineScale;
  const checkedValue = attempt.checked ?? "";
  const isNumber = /^\d+(?:[,.]\d+)?$/.test(checkedValue);
  const isCorrect = isNumber && Number(checkedValue.replace(",", ".")) === scale.reading;
  const showExplanation = isCorrect || attempt.showSolution;

  function updateAttempt(update: Partial<ReadingAttempt>) {
    setAttempts(current => ({ ...current, [mode]: { ...current[mode], ...update } }));
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checked = attempt.draft.trim();
    updateAttempt({ checked, showSolution: false });
    if (mode === "coarse" && /^\d+(?:[,.]\d+)?$/.test(checked) && Number(checked.replace(",", ".")) === coarseScale.reading) {
      setCoarseCompleted(true);
    }
  }

  function revealSolution() {
    updateAttempt({ showSolution: true });
    if (mode === "coarse") setCoarseCompleted(true);
  }

  return <div className={styles.study}>
    <div className={styles.notebook}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Измерительная линза</p>
        <h2>Один уровень воды. Две шкалы.</h2>
        <p id="scale-reading-order">Сначала запиши приблизительный отсчёт по крупной шкале, затем уточни его по мелкой. Уровень воды не изменится.</p>
      </header>

      <div className={styles.scaleSwitch} role="group" aria-label="Разметка мензурки">
        <button type="button" aria-pressed={mode === "coarse"} onClick={() => setMode("coarse")}>Крупная шкала</button>
        <button ref={fineScaleButtonRef} type="button" aria-pressed={mode === "fine"} aria-describedby={!coarseCompleted ? "scale-reading-order" : undefined} disabled={!coarseCompleted} onClick={() => setMode("fine")}>Мелкая шкала</button>
      </div>
      <figure className={styles.instrument}>
        <CalibratedScale mode={mode} />
        <figcaption>Фрагмент шкалы мензурки. Отсчёт веди по нижней точке поверхности воды.</figcaption>
      </figure>

      <form className={styles.answerForm} onSubmit={checkAnswer}>
        <label htmlFor="scale-reading">{mode === "coarse"
          ? "Округли до ближайшего подписанного штриха. Сколько миллилитров запишешь?"
          : "Какой объём показывает мелкая шкала?"}</label>
        <div className={styles.answerRow}>
          <input
            id="scale-reading"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            required
            value={attempt.draft}
            onChange={event => updateAttempt({ draft: event.target.value, checked: null, showSolution: false })}
            aria-describedby="scale-reading-hint"
          />
          <span>{GRADUATED_SCALE_UNIT}</span>
          <button type="submit">Проверить</button>
        </div>
        <p id="scale-reading-hint" className={styles.hint}>{mode === "coarse"
          ? "Сравни расстояние от мениска до соседних подписанных отметок."
          : "Между подписями считай промежутки."}</p>
      </form>

      {attempt.checked !== null && <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
        <p className={styles.verdict}>
          {isCorrect
            ? mode === "coarse"
              ? "Верно: ближайшая подписанная отметка — 30 мл."
              : "Верно: по мелкой шкале получается 32 мл."
            : isNumber
              ? mode === "coarse"
                ? "Пока не сходится. Здесь округляем до ближайшего подписанного штриха: сравни расстояния до 30 и 40 мл."
                : "Пока не сходится. От 20 до 40 мл здесь десять промежутков; проверь отметку мениска."
              : "Введи число без единицы измерения."}
        </p>
        {showExplanation ? mode === "coarse" ? (<>
          <p>По принятому здесь правилу округляем до ближайшего штриха: <strong>{coarseScale.reading} ± {coarseScale.uncertainty} мл</strong>. Половина деления в 10 мл — это 5 мл.</p>
          <button className={styles.solutionButton} type="button" onClick={() => {
            setMode("fine");
            fineScaleButtonRef.current?.focus();
          }}>Уточнить по мелкой шкале →</button>
        </>
        ) : <>
          <p>Цена деления мелкой шкалы: (40 − 20) ÷ {fineScale.intervals} = {fineScale.step} мл. Нижняя точка мениска на шестом промежутке выше 20 мл: 20 + 6 · 2 = {GRADUATED_SCALE_ACTUAL_VOLUME_ML} мл.</p>
          <div className={styles.records} aria-label="Два отсчёта одного объёма">
            <p><span>Крупная шкала</span><strong>{coarseScale.reading} ± {coarseScale.uncertainty} мл</strong></p>
            <p><span>Мелкая шкала</span><strong>{fineScale.reading} ± {fineScale.uncertainty} мл</strong></p>
          </div>
          <p>Воды столько же. Округление до ближайшего штриха на крупной шкале дало 30 мл; диапазон от 25 до 35 мл включает 32 мл. Мелкие деления позволяют уточнить запись.</p>
        </> : isNumber ? <button className={styles.solutionButton} type="button" onClick={revealSolution}>Показать разбор</button> : null}
      </div>}

      {attempt.checked !== null && showExplanation && <details className={styles.uncertainty}>
        <summary>Почему в записи есть ±?</summary>
        <p>В этой школьной модели погрешность отсчёта принимаем равной половине цены деления. У реального прибора есть и другие источники погрешности; это правило не универсально для любых измерений.</p>
      </details>}
    </div>

    <figure className={styles.observation}>
      <Image
        className={styles.observationImage}
        src={MIO_SCENES.measurement}
        alt="Мио смотрит на поверхность воды в мензурке сбоку, расположив глаза на уровне мениска"
        width={1536}
        height={1024}
        sizes="(max-width: 700px) 100vw, 260px"
      />
      <figcaption>Мио проверяет уровень глаз. Подписанную шкалу исследуй в измерительной линзе.</figcaption>
    </figure>
  </div>;
}
