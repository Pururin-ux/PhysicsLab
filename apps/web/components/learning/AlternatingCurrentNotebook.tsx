"use client";

import { useId, useState } from "react";
import { AC_GENERATOR_SETUP, calculateAcGenerator } from "../../lib/physics/ac-generator";
import styles from "./AlternatingCurrentNotebook.module.css";

const FREQUENCIES = [1, 2] as const;
const MOMENTS = [
  { fraction: 0, label: "0", description: "Начало" },
  { fraction: 0.25, label: "T/4", description: "Первый максимум" },
  { fraction: 0.5, label: "T/2", description: "Смена знака" },
  { fraction: 0.75, label: "3T/4", description: "Обратный ток" },
  { fraction: 1, label: "T", description: "Оборот" },
] as const;

type Frequency = (typeof FREQUENCIES)[number];
type Phase = (typeof MOMENTS)[number]["fraction"];
type TraceSize = "regular" | "compact";

const TRACE_SECONDS = 2;
const TRACE_LAYOUTS = {
  regular: { width: 560, height: 270, left: 68, plotWidth: 464, middle: 146, amplitude: 76, labelY: 255 },
  compact: { width: 300, height: 250, left: 58, plotWidth: 229, middle: 136, amplitude: 71, labelY: 235 },
} as const;

const MAX_CURRENT = calculateAcGenerator({
  ...AC_GENERATOR_SETUP,
  frequencyHz: 2,
  phaseFraction: 0,
}).peakCurrentAmperes;

function cleanZero(value: number) {
  return Math.abs(value) < 1e-10 ? 0 : value;
}

function format(value: number, digits = 3) {
  const cleaned = cleanZero(value);
  const number = Math.abs(cleaned).toLocaleString("ru-RU", { maximumFractionDigits: digits });
  return cleaned < 0 ? "−" + number : number;
}

function sampleAtTime(frequencyHz: Frequency, timeSeconds: number) {
  const cycles = frequencyHz * timeSeconds;
  const phaseFraction = cycles - Math.floor(cycles);
  return calculateAcGenerator({ ...AC_GENERATOR_SETUP, frequencyHz, phaseFraction }).currentAmperes;
}

function tracePath(size: TraceSize, frequencyHz: Frequency) {
  const layout = TRACE_LAYOUTS[size];
  return Array.from({ length: 201 }, (_, index) => {
    const timeSeconds = TRACE_SECONDS * index / 200;
    const current = sampleAtTime(frequencyHz, timeSeconds);
    const x = layout.left + layout.plotWidth * index / 200;
    const y = layout.middle - layout.amplitude * current / MAX_CURRENT;
    return (index === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }).join(" ");
}

const TRACES = {
  regular: { 1: tracePath("regular", 1), 2: tracePath("regular", 2) },
  compact: { 1: tracePath("compact", 1), 2: tracePath("compact", 2) },
} as const;

function momentObservation(phase: Phase) {
  switch (phase) {
    case 0:
      return "Поток через рамку наибольший. Пока он не меняется, ЭДС и ток равны нулю.";
    case 0.25:
      return "Поток проходит через нуль и меняется быстрее всего. Ток достиг положительного максимума.";
    case 0.5:
      return "Поток снова наибольший по модулю, но направлен обратно. Ток на миг равен нулю и меняет знак.";
    case 0.75:
      return "Поток снова проходит через нуль. Ток теперь отрицателен относительно выбранного направления.";
    case 1:
      return "Рамка сделала полный оборот: поток, ЭДС и ток вернулись к начальным значениям.";
  }
}

function RotatingFrame({
  angleRadians,
  phase,
  description,
}: {
  angleRadians: number;
  phase: Phase;
  description: string;
}) {
  const markerId = useId().replaceAll(":", "");
  const halfWidth = 78 * Math.sin(angleRadians) + 38 * Math.cos(angleRadians);
  const skew = 20 * Math.cos(angleRadians);
  const vertices = [
    [235 - halfWidth, 97 - skew],
    [235 + halfWidth, 97 + skew],
    [235 + halfWidth, 220 + skew],
    [235 - halfWidth, 220 - skew],
  ];
  const framePath = "M" + vertices.map((point) => point[0].toFixed(1) + " " + point[1].toFixed(1)).join("L") + "Z";
  const angleDegrees = Math.round(angleRadians * 180 / Math.PI);

  return (
    <svg className={styles.frameDiagram} viewBox="0 0 470 315" role="img" aria-label={description}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1L9 5L1 9Z" className={styles.fieldArrowhead} />
        </marker>
      </defs>

      <g className={styles.pole}>
        <path d="M24 90H94L110 107V215L94 232H24Z" />
        <path d="M446 90H376L360 107V215L376 232H446Z" />
        <path className={styles.poleFace} d="M94 90L110 107V215L94 232M376 90L360 107V215L376 232" />
        <text x="62" y="171" textAnchor="middle">N</text>
        <text x="408" y="171" textAnchor="middle">S</text>
      </g>
      <g className={styles.fieldVectors} markerEnd={"url(#" + markerId + ")"}>
        <path d="M119 116H350" />
        <path d="M119 157H350" />
        <path d="M119 198H350" />
      </g>
      <text x="126" y="79" className={styles.fieldLabel}>B →</text>

      <path className={styles.shaft} d="M235 51V263" />
      <path className={styles.frameShadow} d={framePath} />
      <path className={styles.frameWire} d={framePath} />
      <circle className={styles.frameMark} cx={vertices[0][0]} cy={vertices[0][1]} r="8" />
      <circle className={styles.axle} cx="235" cy="51" r="5" />
      <circle className={styles.axle} cx="235" cy="263" r="5" />
      <path className={styles.dimensionLine} d="M170 284H300" />
      <text x="235" y="302" textAnchor="middle" className={styles.diagramNote}>
        {phase === 1 ? "полный оборот" : "поворот " + angleDegrees + "°"}
      </text>
      <text x="345" y="280" className={styles.turnCount}>1 из {AC_GENERATOR_SETUP.turnCount} витков</text>
    </svg>
  );
}

function CurrentTrace({
  frequencyHz,
  phase,
  currentAmperes,
  size,
}: {
  frequencyHz: Frequency;
  phase: Phase;
  currentAmperes: number;
  size: TraceSize;
}) {
  const layout = TRACE_LAYOUTS[size];
  const top = layout.middle - layout.amplitude;
  const bottom = layout.middle + layout.amplitude;
  const selectedTime = phase / frequencyHz;
  const selectedX = layout.left + layout.plotWidth * selectedTime / TRACE_SECONDS;
  const selectedY = layout.middle - layout.amplitude * cleanZero(currentAmperes) / MAX_CURRENT;
  const peakOneX = layout.left + layout.plotWidth * (0.25 / frequencyHz) / TRACE_SECONDS;
  const peakTwoX = layout.left + layout.plotWidth * (1.25 / frequencyHz) / TRACE_SECONDS;
  const tickTimes = size === "regular" ? [0, 0.5, 1, 1.5, 2] : [0, 1, 2];

  return (
    <svg
      className={size === "regular" ? styles.regularTrace : styles.compactTrace}
      viewBox={"0 0 " + layout.width + " " + layout.height}
      role="img"
      aria-label={
        "Осциллограмма силы тока от 0 до 2 секунд. При частоте " + frequencyHz +
        " герц выбран момент " + format(selectedTime, 3) + " секунды, ток " +
        format(currentAmperes) + " ампера. Между двумя соседними положительными максимумами один период."
      }
    >
      <g className={styles.graphGrid}>
        {[0, 0.5, 1, 1.5, 2].map((time) => {
          const x = layout.left + layout.plotWidth * time / TRACE_SECONDS;
          return <path key={time} d={"M" + x + " " + top + "V" + bottom} />;
        })}
        <path d={"M" + layout.left + " " + top + "H" + (layout.left + layout.plotWidth) +
          "M" + layout.left + " " + bottom + "H" + (layout.left + layout.plotWidth)} />
      </g>
      <path className={styles.zeroAxis} d={"M" + layout.left + " " + layout.middle + "H" + (layout.left + layout.plotWidth)} />
      <path className={styles.periodBracket} d={"M" + peakOneX + " 34V43M" + peakOneX + " 38H" + peakTwoX + "M" + peakTwoX + " 34V43"} />
      <text x={(peakOneX + peakTwoX) / 2} y="27" textAnchor="middle" className={styles.bracketLabel}>T</text>
      <path className={styles.currentCurve} d={TRACES[size][frequencyHz]} />
      <path className={styles.cursor} d={"M" + selectedX + " " + (top - 5) + "V" + (bottom + 5)} />
      <circle className={styles.currentPoint} cx={selectedX} cy={selectedY} r="5.7" />
      <g className={styles.graphLabels}>
        <text x={layout.left - 9} y={top + 5} textAnchor="end">+{format(MAX_CURRENT)} А</text>
        <text x={layout.left - 9} y={layout.middle + 5} textAnchor="end">0</text>
        <text x={layout.left - 9} y={bottom + 5} textAnchor="end">−{format(MAX_CURRENT)} А</text>
        {tickTimes.map((time) => {
          const x = layout.left + layout.plotWidth * time / TRACE_SECONDS;
          return <text key={time} x={x} y={layout.labelY} textAnchor="middle">{format(time, 1)}</text>;
        })}
        <text x={layout.left + layout.plotWidth} y={layout.labelY - 18} textAnchor="end">t, с</text>
      </g>
    </svg>
  );
}

export function AlternatingCurrentNotebook() {
  const headingId = useId();
  const [frequencyHz, setFrequencyHz] = useState<Frequency>(1);
  const [phase, setPhase] = useState<Phase>(0);
  const reading = calculateAcGenerator({ ...AC_GENERATOR_SETUP, frequencyHz, phaseFraction: phase });
  const currentAmperes = cleanZero(reading.currentAmperes);
  const emfVolts = cleanZero(reading.emfVolts);
  const fluxMilliwebers = cleanZero(reading.fluxWebers * 1000);
  const timeSeconds = phase * reading.periodSeconds;
  const currentState = currentAmperes > 0 ? "по условному направлению +I" :
    currentAmperes < 0 ? "против условного направления +I" : "на миг отсутствует";

  return (
    <section className={styles.notebook} aria-labelledby={headingId}>
      <header className={styles.heading}>
        <span className={styles.eyebrow}>Рамка в магнитном поле</span>
        <h2 id={headingId}>Рамка и ток</h2>
        <p>Внешнее усилие вращает рамку; в отличие от отключённого LC-контура её колебания поддерживаются извне.</p>
      </header>

      <div className={styles.controls}>
        <fieldset className={styles.frequencyGroup}>
          <legend>Скорость вращения</legend>
          {FREQUENCIES.map((frequency) => (
            <button key={frequency} type="button" aria-pressed={frequencyHz === frequency} onClick={() => setFrequencyHz(frequency)}>
              {frequency} {frequency === 1 ? "оборот" : "оборота"} в секунду
            </button>
          ))}
        </fieldset>
        <fieldset className={styles.phaseGroup}>
          <legend>Положение в одном обороте</legend>
          {MOMENTS.map((moment) => (
            <button key={moment.fraction} type="button" aria-pressed={phase === moment.fraction} onClick={() => setPhase(moment.fraction)}>
              <strong>{moment.label}</strong><small>{moment.description}</small>
            </button>
          ))}
        </fieldset>
      </div>

      <div className={styles.observation}>
        <figure className={styles.apparatus}>
          <div className={styles.panelHeading}><span>Положение рамки</span><strong>t = {format(timeSeconds, 3)} с</strong></div>
          <RotatingFrame
            angleRadians={reading.angleRadians}
            phase={phase}
            description={
              "Рамка с " + AC_GENERATOR_SETUP.turnCount + " витками вращается между полюсами N и S. " +
              "Поле направлено от N к S. Поворот " + Math.round(reading.angleRadians * 180 / Math.PI) + " градусов."
            }
          />
          <figcaption>Показан один из 20 витков; медная метка остаётся на том же его углу при повороте. Поле B направлено от N к S.</figcaption>
        </figure>
        <section className={styles.readings} aria-label="Показания генератора">
          <div className={styles.panelHeading}><span>В этот момент</span><strong>Ток {currentState}</strong></div>
          <dl className={styles.readingList}>
            <div><dt>Поток через виток Φ</dt><dd>{format(fluxMilliwebers)} <small>мВб</small></dd></div>
            <div><dt>ЭДС индукции ε</dt><dd>{format(emfVolts)} <small>В</small></dd></div>
            <div><dt>Ток через R, I</dt><dd>{format(currentAmperes)} <small>А</small></dd></div>
          </dl>
          <div className={styles.directionScale}>
            <span>Условное направление <i>+I</i> →</span>
            <strong aria-label={"Сейчас ток " + currentState}>
              {currentAmperes > 0 ? "→" : currentAmperes < 0 ? "←" : "0"}
            </strong>
          </div>
          <p className={styles.momentNote} aria-live="polite">{momentObservation(phase)}</p>
        </section>
      </div>

      <figure className={styles.traceFigure}>
        <div className={styles.traceHeading}>
          <div className={styles.panelHeading}><span>Осциллограмма</span><strong>Одна шкала времени: от 0 до 2 с</strong></div>
          <span className={styles.traceLegend}>I(t) · ток через R</span>
        </div>
        <CurrentTrace frequencyHz={frequencyHz} phase={phase} currentAmperes={currentAmperes} size="regular" />
        <CurrentTrace frequencyHz={frequencyHz} phase={phase} currentAmperes={currentAmperes} size="compact" />
        <figcaption>Черта — выбранный момент. Скобка T соединяет соседние положительные максимумы. Оси не меняются при переключении частоты: видно и более короткий период, и большую амплитуду тока.</figcaption>
      </figure>

      <div className={styles.conclusion}>
        <div><span className={styles.eyebrow}>Период вращения и тока</span><output>T = {format(reading.periodSeconds, 2)} с</output></div>
        <p>При неизменных B, S, N и R: <span className={styles.formula}>ε<sub>max</sub> = NBS·2πν</span>, <span className={styles.formula}>I = ε/R</span>. Если удвоить частоту вращения, период сократится вдвое, а амплитуда ЭДС и тока вырастет вдвое.</p>
      </div>
      <p className={styles.modelLimit}>Это нарочно замедленная учебная установка, не параметры бытовой сети. Модель предполагает равномерное вращение и только активную нагрузку R = {AC_GENERATOR_SETUP.resistanceOhms} Ом; потери и сдвиг фаз не показаны.</p>
    </section>
  );
}
