"use client";

import { useId, useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./AcceleratedMotionNotebook.module.css";

type MotionMode = "speed-up" | "brake";

const SCENARIOS: Record<MotionMode, { label: string; v0: number; a: number }> = {
  "speed-up": { label: "Разгон", v0: 2, a: 2 },
  brake: { label: "Торможение", v0: 8, a: -2 },
};

const TIMES = [0, 1, 2, 3, 4] as const;

function format(value: number) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

export function AcceleratedMotionNotebook() {
  const [mode, setMode] = useState<MotionMode>("speed-up");
  const [time, setTime] = useState<(typeof TIMES)[number]>(3);
  const titleId = useId();
  const scenario = SCENARIOS[mode];
  const velocity = scenario.v0 + scenario.a * time;
  const displacement = scenario.v0 * time + scenario.a * time * time / 2;
  const chartLeft = 76;
  const chartBottom = 282;
  const chartWidth = 500;
  const chartHeight = 222;
  const x = (value: number) => chartLeft + value / 4 * chartWidth;
  const y = (value: number) => chartBottom - value / 10 * chartHeight;
  const selectedX = x(time);
  const selectedY = y(velocity);
  const areaPoints = `${chartLeft},${chartBottom} ${chartLeft},${y(scenario.v0)} ${selectedX},${selectedY} ${selectedX},${chartBottom}`;

  function chooseMode(nextMode: MotionMode) {
    setMode(nextMode);
    setTime(nextMode === "brake" ? 3 : 3);
  }

  const graphLabel = `${scenario.label}: начальная скорость ${scenario.v0} метров в секунду, ускорение ${scenario.a} метров в секунду в квадрате. Через ${time} секунд скорость ${velocity} метров в секунду, перемещение ${format(displacement)} метра.`;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Графический блокнот Мио</p>
        <h2 id={titleId}>Как один график показывает и ускорение, и перемещение?</h2>
        <span>Выбери движение и момент времени. Наклон линии показывает изменение скорости, а площадь под ней — перемещение.</span>
      </header>

      <div className={styles.controls}>
        <div className={styles.modeControls} aria-label="Характер движения">
          {(Object.keys(SCENARIOS) as MotionMode[]).map(id => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => chooseMode(id)}>{SCENARIOS[id].label}</button>
          ))}
        </div>
        <div className={styles.timeControls} aria-label="Выбранный момент времени">
          {TIMES.map(value => (
            <button key={value} type="button" aria-pressed={time === value} onClick={() => setTime(value)}>{value} с</button>
          ))}
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.chartPanel} aria-labelledby={titleId}>
          <div className={styles.chartHeading}>
            <span>Скорость во времени</span>
            <strong>{scenario.label.toLowerCase()} · a<sub>x</sub> = {format(scenario.a)} м/с²</strong>
          </div>
          <div className={styles.chart} role="img" aria-label={graphLabel}>
            <svg viewBox="0 0 640 350" aria-hidden="true">
              <g className={styles.grid}>
                {[0, 2, 4, 6, 8, 10].map(value => <line key={`h-${value}`} x1={chartLeft} y1={y(value)} x2="596" y2={y(value)} />)}
                {TIMES.map(value => <line key={`v-${value}`} x1={x(value)} y1="42" x2={x(value)} y2={chartBottom} />)}
              </g>
              <g className={styles.axes}>
                <path d={`M${chartLeft} 34V${chartBottom}H604`} />
                {TIMES.map(value => <text key={`tx-${value}`} x={x(value)} y="316" textAnchor="middle">{value}</text>)}
                {[0, 2, 4, 6, 8, 10].map(value => <text key={`vy-${value}`} x="60" y={y(value) + 6} textAnchor="end">{value}</text>)}
                <text x="606" y="316">t, с</text>
                <text x="22" y="30">v<tspan baselineShift="sub">x</tspan>, м/с</text>
              </g>
              {time > 0 ? <polygon className={styles.area} points={areaPoints} /> : null}
              <line className={styles.velocityLine} x1={chartLeft} y1={y(scenario.v0)} x2={x(4)} y2={y(scenario.v0 + scenario.a * 4)} />
              <line className={styles.guide} x1={selectedX} y1={selectedY} x2={selectedX} y2={chartBottom} />
              <circle className={styles.point} cx={selectedX} cy={selectedY} r="8" />
              {time > 0 ? <text className={styles.areaLabel} x={(chartLeft + selectedX) / 2} y={chartBottom - 18} textAnchor="middle">Δx = {format(displacement)} м</text> : null}
            </svg>
          </div>
          <p className={styles.chartCaption}>Закрашенная область берётся только до выбранного момента. После остановки модель торможения здесь не продолжается.</p>
        </section>

        <aside className={styles.notes} aria-label="Расчёты по графику">
          <div className={styles.primaryReading}>
            <span>В момент {time} с</span>
            <output aria-live="polite">{format(velocity)} м/с</output>
            <MathText text={`$v_x=v_{0x}+a_xt=${scenario.v0}${scenario.a < 0 ? "-" : "+"}${Math.abs(scenario.a)}\\cdot${time}=${format(velocity)}\\,\\text{м/с}$`} />
          </div>
          <div>
            <span>Наклон линии</span>
            <MathText text={`$a_x=\\dfrac{\\Delta v_x}{\\Delta t}=${format(scenario.a)}\\,\\text{м/с}^2$`} />
          </div>
          <div>
            <span>Площадь под линией</span>
            <MathText text={`$\\Delta x=\\dfrac{v_{0x}+v_x}{2}t=${format(displacement)}\\,\\text{м}$`} />
          </div>
          <div className={styles.mioNote}>
            <span>Действие Мио</span>
            <p>Мио отмечает один момент, проводит вертикаль к оси времени и читает две разные вещи: высоту линии и площадь под ней.</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>Скорость — высота графика, ускорение — его наклон, перемещение — площадь. Это три разные величины, поэтому их нельзя читать одним и тем же действием.</p>
    </div>
  );
}
