"use client";

import { useId, useState } from "react";
import { calculateLcOscillator } from "../../lib/physics/lc-oscillator";
import { MathText } from "../ui/MathText";
import styles from "./LCOscillatorNotebook.module.css";

const INITIAL_VOLTAGE_VOLTS = 10;
const CAPACITANCES = [1, 4] as const;
const INDUCTANCES = [0.25, 1] as const;
const PHASES = [
  { fraction: 0, label: "0", note: "Начало" },
  { fraction: 0.25, label: "T/4", note: "Разряд" },
  { fraction: 0.5, label: "T/2", note: "Обратный заряд" },
  { fraction: 0.75, label: "3T/4", note: "Обратный ток" },
  { fraction: 1, label: "T", note: "Новый цикл" },
] as const;

type Capacitance = (typeof CAPACITANCES)[number];
type Inductance = (typeof INDUCTANCES)[number];
type Phase = (typeof PHASES)[number]["fraction"];

const GRAPH_LAYOUTS = {
  regular: { width: 580, height: 238, left: 48, plotWidth: 492, middle: 123, amplitude: 75, labelY: 228 },
  compact: { width: 340, height: 225, left: 36, plotWidth: 286, middle: 108, amplitude: 70, labelY: 213 },
} as const;

type GraphLayout = (typeof GRAPH_LAYOUTS)[keyof typeof GRAPH_LAYOUTS];

function curvePath(wave: (angle: number) => number, layout: GraphLayout) {
  return Array.from({ length: 81 }, (_, index) => {
    const fraction = index / 80;
    const x = layout.left + layout.plotWidth * fraction;
    const y = layout.middle - layout.amplitude * wave(2 * Math.PI * fraction);
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

const GRAPH_CURVES = {
  regular: { charge: curvePath(Math.cos, GRAPH_LAYOUTS.regular), current: curvePath(Math.sin, GRAPH_LAYOUTS.regular) },
  compact: { charge: curvePath(Math.cos, GRAPH_LAYOUTS.compact), current: curvePath(Math.sin, GRAPH_LAYOUTS.compact) },
};

function cleanZero(value: number, scale: number) {
  return Math.abs(value) < scale * 1e-10 ? 0 : value;
}

function format(value: number, digits = 3) {
  const magnitude = Math.abs(value).toLocaleString("ru-RU", {
    maximumFractionDigits: digits,
  });
  return value < 0 ? `−${magnitude}` : magnitude;
}

function CircuitSchematic({
  upperPlateSign,
  currentDirection,
  description,
}: {
  upperPlateSign: "positive" | "negative" | "zero";
  currentDirection: "positive" | "negative" | "zero";
  description: string;
}) {
  const markerId = useId().replaceAll(":", "");
  const chargeSymbols = upperPlateSign === "positive" ? ["+", "−"] : upperPlateSign === "negative" ? ["−", "+"] : ["0", "0"];

  return (
    <svg className={styles.circuit} viewBox="0 0 500 340" role="img" aria-label={description}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M1 1L9 5L1 9Z" className={styles.arrowHead} />
        </marker>
      </defs>

      <g className={styles.wire}>
        <path d="M100 95H183M217 95H400V126M400 246V276H100V208M100 168V95" />
        <path d="M400 126C430 126 430 146 400 146C430 146 430 166 400 166C430 166 430 186 400 186C430 186 430 206 400 206C430 206 430 226 400 226C430 226 430 246 400 246" />
        <path d="M68 168H132M68 208H132" className={styles.capacitorPlate} />
      </g>

      <g className={styles.switch}>
        <circle cx="183" cy="95" r="5" />
        <circle cx="217" cy="95" r="5" />
        <path d="M183 94L217 95" />
      </g>

      <text x="200" y="125" textAnchor="middle" className={styles.componentLabel}>K</text>
      <text x="39" y="193" textAnchor="middle" className={styles.componentLabel}>C</text>
      <text x="458" y="193" textAnchor="middle" className={styles.componentLabel}>L</text>
      <text x="56" y="160" textAnchor="middle" className={upperPlateSign === "zero" ? styles.neutralCharge : styles.chargeSign}>
        {chargeSymbols[0]}
      </text>
      <text x="56" y="222" textAnchor="middle" className={upperPlateSign === "zero" ? styles.neutralCharge : styles.chargeSign}>
        {chargeSymbols[1]}
      </text>

      {currentDirection !== "zero" ? (
        <path
          d={currentDirection === "positive" ? "M266 67H340" : "M340 67H266"}
          className={styles.currentArrow}
          markerEnd={`url(#${markerId})`}
        />
      ) : null}
      <text x="303" y="48" textAnchor="middle" className={styles.currentLabel}>
        {currentDirection === "zero" ? "I = 0" : currentDirection === "positive" ? "I > 0" : "I < 0"}
      </text>
      <text x="250" y="317" textAnchor="middle" className={styles.diagramCaption}>замкнутый идеальный контур</text>
    </svg>
  );
}

function OscillationGraph({ phase, description, size }: { phase: Phase; description: string; size: keyof typeof GRAPH_LAYOUTS }) {
  const layout = GRAPH_LAYOUTS[size];
  const top = layout.middle - layout.amplitude;
  const bottom = layout.middle + layout.amplitude;
  const x = layout.left + layout.plotWidth * phase;
  const angle = 2 * Math.PI * phase;
  const chargeY = layout.middle - layout.amplitude * Math.cos(angle);
  const currentY = layout.middle - layout.amplitude * Math.sin(angle);

  return (
    <svg
      className={`${styles.graph} ${size === "compact" ? styles.compactGraph : styles.regularGraph}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-label={description}
    >
      <g className={styles.graphGrid}>
        <path d={`M${layout.left} ${top}H${layout.left + layout.plotWidth}M${layout.left} ${layout.middle}H${layout.left + layout.plotWidth}M${layout.left} ${bottom}H${layout.left + layout.plotWidth}`} />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <path key={tick} d={`M${layout.left + layout.plotWidth * tick} ${top}V${bottom}`} />
        ))}
      </g>
      <path className={styles.zeroAxis} d={`M${layout.left} ${layout.middle}H${layout.left + layout.plotWidth}`} />
      <path className={styles.chargeCurve} d={GRAPH_CURVES[size].charge} />
      <path className={styles.currentCurve} d={GRAPH_CURVES[size].current} />
      <path className={styles.phaseLine} d={`M${x} ${top - 8}V${bottom + 6}`} />
      <circle className={styles.chargePoint} cx={x} cy={chargeY} r="5.5" />
      <circle className={styles.currentPoint} cx={x} cy={currentY} r="5.5" />
      <g className={styles.graphLabels}>
        <text x={layout.left - 9} y={top + 5} textAnchor="end">+1</text>
        <text x={layout.left - 9} y={layout.middle + 5} textAnchor="end">0</text>
        <text x={layout.left - 9} y={bottom + 5} textAnchor="end">−1</text>
        {["0", "T/4", "T/2", "3T/4", "T"].map((label, index) => (
          <text key={label} x={layout.left + layout.plotWidth * index / 4} y={layout.labelY} textAnchor="middle">{label}</text>
        ))}
      </g>
    </svg>
  );
}

export function LCOscillatorNotebook() {
  const headingId = useId();
  const [capacitance, setCapacitance] = useState<Capacitance>(1);
  const [inductance, setInductance] = useState<Inductance>(0.25);
  const [phase, setPhase] = useState<Phase>(0);
  const reading = calculateLcOscillator({
    capacitanceMicrofarads: capacitance,
    inductanceHenrys: inductance,
    initialVoltageVolts: INITIAL_VOLTAGE_VOLTS,
    phaseFraction: phase,
  });

  const initialChargeMicrocoulombs = capacitance * INITIAL_VOLTAGE_VOLTS;
  const chargeMicrocoulombs = cleanZero(reading.chargeCoulombs * 1e6, initialChargeMicrocoulombs);
  const maximumCurrentMilliamperes = INITIAL_VOLTAGE_VOLTS * Math.sqrt((capacitance * 1e-6) / inductance) * 1e3;
  const currentMilliamperes = cleanZero(reading.currentAmperes * 1e3, maximumCurrentMilliamperes);
  const initialEnergyMillijoules = reading.initialEnergyJoules * 1e3;
  const electricEnergyMillijoules = cleanZero(reading.electricEnergyJoules * 1e3, initialEnergyMillijoules);
  const magneticEnergyMillijoules = cleanZero(reading.magneticEnergyJoules * 1e3, initialEnergyMillijoules);
  const electricShare = (electricEnergyMillijoules / initialEnergyMillijoules) * 100;
  const magneticShare = 100 - electricShare;
  const phaseNote = PHASES.find((item) => item.fraction === phase)!;
  // The worked example and linked practice use pi ≈ 3.14.
  const displayedPeriodMilliseconds = 2 * 3.14 * Math.sqrt(inductance * capacitance * 1e-6) * 1e3;
  const elapsedMilliseconds = phase * displayedPeriodMilliseconds;
  const upperPlateSign = chargeMicrocoulombs > 0 ? "positive" : chargeMicrocoulombs < 0 ? "negative" : "zero";
  const currentDirection = currentMilliamperes > 0 ? "positive" : currentMilliamperes < 0 ? "negative" : "zero";

  const phaseObservation: Record<Phase, string> = {
    0: "Верхняя обкладка положительна. Тока ещё нет: вся энергия находится в электрическом поле конденсатора.",
    0.25: "Обкладки разряжены. Ток по часовой стрелке максимален: энергия перешла в магнитное поле катушки.",
    0.5: "Конденсатор заряжен с обратным знаком. Ток мгновенно равен нулю, энергия снова электрическая.",
    0.75: "Обкладки снова разряжены. Ток максимален в обратном направлении, энергия магнитная.",
    1: "Контур вернулся в начальное состояние. В идеальной модели энергия сохранилась и цикл повторится.",
  };

  return (
    <section className={styles.notebook} aria-labelledby={headingId}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Опыт Мио · идеальный контур</p>
        <h2 id={headingId}>Где энергия сейчас?</h2>
      </header>

      <div className={styles.controls}>
        <fieldset className={styles.choiceGroup}>
          <legend>Ёмкость C</legend>
          {CAPACITANCES.map((value) => (
            <button key={value} type="button" aria-pressed={capacitance === value} onClick={() => setCapacitance(value)}>{value} мкФ</button>
          ))}
        </fieldset>
        <fieldset className={styles.choiceGroup}>
          <legend>Индуктивность L</legend>
          {INDUCTANCES.map((value) => (
            <button key={value} type="button" aria-pressed={inductance === value} onClick={() => setInductance(value)}>{format(value, 2)} Гн</button>
          ))}
        </fieldset>
        <fieldset className={`${styles.choiceGroup} ${styles.phaseGroup}`}>
          <legend>Момент в пределах одного периода</legend>
          {PHASES.map((item) => (
            <button key={item.fraction} type="button" aria-pressed={phase === item.fraction} onClick={() => setPhase(item.fraction)}>
              <strong>{item.label}</strong><small>{item.note}</small>
            </button>
          ))}
        </fieldset>
      </div>

      <div className={styles.experiment}>
        <figure className={styles.apparatus}>
          <div className={styles.panelHeading}><span>Контур после замыкания</span><strong>{phaseNote.label} · {phaseNote.note}</strong></div>
          <CircuitSchematic
            upperPlateSign={upperPlateSign}
            currentDirection={currentDirection}
            description={`Конденсатор и катушка образуют замкнутый контур. Заряд верхней обкладки ${format(chargeMicrocoulombs)} микрокулона. Ток ${format(currentMilliamperes)} миллиампера.`}
          />
          <figcaption>Положительное <i>I</i> течёт от верхней обкладки через катушку по часовой стрелке. Знак <i>q</i> относится к верхней обкладке.</figcaption>
        </figure>

        <section className={styles.readings} aria-label="Показания контура">
          <div className={styles.panelHeading}><span>Показания в этот момент</span><strong>t = {format(elapsedMilliseconds)} мс</strong></div>
          <dl className={styles.readingList}>
            <div><dt>Заряд верхней обкладки <i>q</i></dt><dd>{format(chargeMicrocoulombs)} <small>мкКл</small></dd></div>
            <div><dt>Ток <i>I</i></dt><dd>{format(currentMilliamperes)} <small>мА</small></dd></div>
            <div><dt>Электрическая энергия <i>W</i><sub>C</sub></dt><dd>{format(electricEnergyMillijoules)} <small>мДж</small></dd></div>
            <div><dt>Магнитная энергия <i>W</i><sub>L</sub></dt><dd>{format(magneticEnergyMillijoules)} <small>мДж</small></dd></div>
          </dl>
          <div className={styles.energyBalance}>
            <div className={styles.energyLabels}><span><i>W</i><sub>C</sub> · конденсатор</span><span><i>W</i><sub>L</sub> · катушка</span></div>
            <div className={styles.energyTrack} role="img" aria-label={`Электрическая энергия ${format(electricEnergyMillijoules)} миллиджоуля; магнитная энергия ${format(magneticEnergyMillijoules)} миллиджоуля.`}>
              <span className={styles.electricFill} style={{ width: `${electricShare}%` }} />
              <span className={styles.magneticFill} style={{ width: `${magneticShare}%` }} />
            </div>
            <p><i>W</i><sub>C</sub> + <i>W</i><sub>L</sub> = {format(initialEnergyMillijoules)} мДж постоянно</p>
          </div>
          <p className={styles.observation} aria-live="polite">{phaseObservation[phase]}</p>
        </section>
      </div>

      <figure className={styles.graphFigure}>
        <div className={styles.graphHeader}>
          <div className={styles.panelHeading}><span>Один полный цикл</span><strong>Заряд и ток сдвинуты на четверть периода</strong></div>
          <div className={styles.legend} aria-label="Обозначения графика"><span><i>q</i>/<i>q</i><sub>0</sub></span><span><i>I</i>/<i>I</i><sub>max</sub></span></div>
        </div>
        <OscillationGraph
          phase={phase}
          description={`График заряда q делённого на q ноль и тока I делённого на I максимум от нуля до одного периода. Выбран момент ${phaseNote.label}.`}
          size="regular"
        />
        <OscillationGraph
          phase={phase}
          description={`График заряда q делённого на q ноль и тока I делённого на I максимум от нуля до одного периода. Выбран момент ${phaseNote.label}.`}
          size="compact"
        />
        <figcaption>Вертикальная черта показывает выбранный момент. Значения на графике нормированы, численные значения указаны в показаниях выше.</figcaption>
      </figure>

      <div className={styles.periodNote}>
        <div><span className={styles.sectionLabel}>Период этого контура</span><output><i>T</i> ≈ {format(displayedPeriodMilliseconds, 2)} мс</output></div>
        <div className={styles.periodFormula}>
          <MathText text={String.raw`$T=2\pi\sqrt{LC}$`} />
          <p>Здесь π ≈ 3,14. Если увеличить только C или только L в 4 раза, период станет в 2 раза больше. Проверь обе пары значений выше.</p>
        </div>
      </div>
      <p className={styles.modelLimit}>Идеальная модель: источник во время колебаний отключён, сопротивление и потери энергии не учитываются.</p>
    </section>
  );
}
