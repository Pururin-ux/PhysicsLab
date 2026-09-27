"use client";

import { useId, useState } from "react";
import { calculateSelfInduction } from "../../lib/physics/self-induction-model";
import styles from "./SelfInductionNotebook.module.css";

type Change = "rise" | "fall" | "steady";
type Duration = 0.5 | 1 | 2;
type Inductance = 0.2 | 0.4;

const changes: { id: Change; label: string; initial: number; final: number }[] = [
  { id: "rise", label: "Растёт", initial: 1, final: 3 },
  { id: "fall", label: "Убывает", initial: 3, final: 1 },
  { id: "steady", label: "Постоянен", initial: 3, final: 3 },
];
const durations: Duration[] = [0.5, 1, 2];
const inductances: Inductance[] = [0.2, 0.4];
const format = (value: number, digits = 1) => value.toLocaleString("ru-RU", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});
const signed = (value: number) => value < 0 ? `−${format(Math.abs(value))}` : value > 0 ? `+${format(value)}` : "0";

export function SelfInductionNotebook() {
  const headingId = useId();
  const [change, setChange] = useState<Change>("rise");
  const [duration, setDuration] = useState<Duration>(0.5);
  const [inductance, setInductance] = useState<Inductance>(0.4);
  const current = changes.find(item => item.id === change)!;
  const reading = calculateSelfInduction({
    inductanceHenries: inductance,
    initialCurrentAmperes: current.initial,
    finalCurrentAmperes: current.final,
    durationSeconds: duration,
  });

  // The shared time axis extends beyond every available interval. A shorter
  // interval therefore visibly steepens the same prescribed current change.
  const xStart = 30;
  const xEnd = 600;
  const xChange = xStart + (xEnd - xStart) * duration / 2.4;
  const currentY = (amperes: number) => 108 - amperes * 24;
  const emfY = 40 - reading.averageSelfEmfVolts / 1.6 * 27;
  const direction = change === "rise"
    ? "При росте тока ЭДС направлена против его выбранного положительного направления."
    : change === "fall"
      ? "При убывании тока ЭДС направлена вдоль его выбранного положительного направления."
      : "Ток и собственное поле постоянны: ЭДС самоиндукции нет.";

  return <section className={styles.notebook} aria-labelledby={headingId}>
    <header className={styles.heading}>
      <span className={styles.eyebrow}>Исследование · самоиндукция</span>
      <h2 id={headingId}>Ток меняется. Катушка отвечает.</h2>
      <p>Сначала измени только время при той же индуктивности. Потом сравни две катушки.</p>
    </header>

    <div className={styles.controls} aria-label="Условия исследования">
      <fieldset>
        <legend>Что происходит с током</legend>
        <div className={styles.choices}>{changes.map(item => <button key={item.id} type="button" aria-pressed={change === item.id} onClick={() => setChange(item.id)}>{item.label}</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>За какое время</legend>
        <div className={styles.choices}>{durations.map(value => <button key={value} type="button" aria-pressed={duration === value} onClick={() => setDuration(value)}>{format(value)} с</button>)}</div>
      </fieldset>
      <fieldset>
        <legend>Индуктивность катушки</legend>
        <div className={styles.choices}>{inductances.map(value => <button key={value} type="button" aria-pressed={inductance === value} onClick={() => setInductance(value)}>{format(value)} Гн</button>)}</div>
      </fieldset>
    </div>

    <div className={styles.record}>
      <figure className={styles.figure}>
        <div className={styles.plotHeading}><span>Заданный ток</span><strong>{current.initial} → {current.final} А</strong></div>
        <div className={styles.currentPlot}>
          <div className={styles.currentScale} aria-hidden="true"><span>3 А</span><span>1 А</span><span>0</span></div>
          <svg viewBox="0 0 620 124" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M30 36H600M30 84H600M30 108H600" className={styles.grid} />
            <path d="M30 18V108H600" className={styles.axis} />
            <path d={`M${xChange} 18V108`} className={styles.timeMark} />
            <path d={`M${xStart} ${currentY(current.initial)}L${xChange} ${currentY(current.final)}H${xEnd}`} className={styles.currentLine} />
            <circle cx={xChange} cy={currentY(current.final)} r="5" className={styles.currentPoint} />
          </svg>
        </div>
        <div className={styles.timeLabels}><span>0 с</span><span style={{ left: `${xChange / 620 * 100}%` }}>Δt = {format(duration)} с</span></div>
        <div className={styles.plotHeading}><span>ЭДС катушки</span><strong>{signed(reading.averageSelfEmfVolts)} В</strong></div>
        <div className={styles.emfPlot}>
          <span className={styles.zeroLabel} aria-hidden="true">0</span>
          <svg viewBox="0 0 620 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M30 40H600" className={styles.emfZero} />
            <path d={`M${xChange} 6V74`} className={styles.timeMark} />
            <path d={`M${xStart} 40V${emfY}H${xChange}V40H${xEnd}`} className={styles.emfLine} />
          </svg>
        </div>
        <figcaption>Линии показывают равномерное изменение от {current.initial} до {current.final} А за {format(duration)} с. После этого ток снова постоянен и ЭДС самоиндукции равна нулю.</figcaption>
      </figure>

      <div className={styles.finding}>
        <p className={styles.announcement} role="status">Ток {current.initial} → {current.final} А за {format(duration)} с. Средняя ЭДС {signed(reading.averageSelfEmfVolts)} В. Энергия поля после изменения {format(reading.finalMagneticEnergyJoules)} Дж.</p>
        <div className={styles.emfResult}><span>Средняя ЭДС во время изменения</span><output>{signed(reading.averageSelfEmfVolts)} <small>В</small></output></div>
        <p className={styles.direction}>{direction}</p>
        <div className={styles.energyResult}>
          <span>Энергия поля до и после</span>
          <strong>{format(reading.initialMagneticEnergyJoules)} <small>Дж</small> <b aria-hidden="true">→</b> {format(reading.finalMagneticEnergyJoules)} <small>Дж</small></strong>
          <p>Конечный запас зависит от L и конечного I, а не от выбранного времени.</p>
        </div>
      </div>
    </div>

    <p className={styles.boundary}>Это расчёт для заданного равномерного изменения тока при постоянной L. График не изображает реальный переходный процесс цепи с источником и сопротивлением; ток и яркость лампы здесь не вычисляются.</p>
  </section>;
}
