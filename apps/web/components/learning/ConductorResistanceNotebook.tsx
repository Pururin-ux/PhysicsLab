"use client";

import { useId, useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./ConductorResistanceNotebook.module.css";

type MaterialId = "copper" | "nichrome";

const MATERIALS: Record<MaterialId, { label: string; rho: number; color: string }> = {
  copper: { label: "Медь", rho: 0.017, color: "#d87948" },
  nichrome: { label: "Нихром", rho: 1.1, color: "#8fa1ad" },
};

const LENGTHS = [1, 2, 3] as const;
const AREAS = [0.5, 1, 2] as const;

function format(value: number, digits = 3) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: digits });
}

function WireSpecimen({ material, length, area }: { material: MaterialId; length: number; area: number }) {
  const markerId = useId().replaceAll(":", "");
  const wire = MATERIALS[material];
  const startX = 108;
  const endX = startX + 170 + length * 80;
  const wireWidth = 7 + Math.sqrt(area) * 6;
  const lensRadius = 42 + Math.sqrt(area) * 12;

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 780 360"
      role="img"
      aria-label={`${wire.label}: длина ${length} метра, площадь поперечного сечения ${format(area, 1)} квадратного миллиметра.`}
    >
      <defs>
        <marker id={`${markerId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" className={styles.arrowHead} />
        </marker>
      </defs>

      <g className={styles.terminals}>
        <circle cx={startX} cy="168" r="23" />
        <circle cx={endX} cy="168" r="23" />
        <line x1={startX} y1="168" x2={endX} y2="168" style={{ stroke: wire.color, strokeWidth: wireWidth }} />
        <circle cx={startX} cy="168" r={wireWidth / 2} style={{ fill: wire.color }} />
        <circle cx={endX} cy="168" r={wireWidth / 2} style={{ fill: wire.color }} />
      </g>

      <g className={styles.dimension}>
        <line x1={startX} y1="230" x2={endX} y2="230" markerStart={`url(#${markerId}-arrow)`} markerEnd={`url(#${markerId}-arrow)`} />
        <text x={(startX + endX) / 2} y="258" textAnchor="middle">l = {length} м</text>
      </g>

      <path d={`M${endX - 6} 153C${endX + 32} 105 564 93 606 99`} className={styles.lensLeader} />
      <g className={styles.measurementLens}>
        <circle cx="650" cy="112" r="83" />
        <circle cx="650" cy="112" r={lensRadius} style={{ fill: wire.color }} />
        <line x1="710" y1="171" x2="748" y2="211" />
        <text className={styles.desktopDiagramLabel} x="650" y="218" textAnchor="middle">поперечное сечение</text>
        <text className={styles.mobileDiagramLabel} x="650" y="218" textAnchor="middle">сечение S</text>
        <text x="650" y="242" textAnchor="middle">S = {format(area, 1)} мм²</text>
      </g>

      <g className={styles.materialTag}>
        <text x={startX} y="104">{wire.label}</text>
        <text x={startX} y="126">ρ = {format(wire.rho)} Ом·мм²/м</text>
      </g>
    </svg>
  );
}

export function ConductorResistanceNotebook() {
  const [material, setMaterial] = useState<MaterialId>("nichrome");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>(1);
  const [area, setArea] = useState<(typeof AREAS)[number]>(1);
  const rho = MATERIALS[material].rho;
  const resistance = rho * length / area;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Образец провода · измерительная линза</p>
        <h2>Почему длинный тонкий провод сопротивляется сильнее?</h2>
        <span>Меняй один параметр и смотри, как длина, поперечное сечение и вещество входят в сопротивление одного проводника.</span>
      </header>

      <div className={styles.controlDeck}>
        <div className={styles.choiceRow} aria-label="Материал проводника">
          {(Object.keys(MATERIALS) as MaterialId[]).map(id => <button key={id} type="button" aria-pressed={material === id} onClick={() => setMaterial(id)}>{MATERIALS[id].label}</button>)}
        </div>
        <div className={styles.choiceRow} aria-label="Длина проводника">
          {LENGTHS.map(value => <button key={value} type="button" aria-pressed={length === value} onClick={() => setLength(value)}>{value} м</button>)}
        </div>
        <div className={styles.choiceRow} aria-label="Площадь поперечного сечения">
          {AREAS.map(value => <button key={value} type="button" aria-pressed={area === value} onClick={() => setArea(value)}>{format(value, 1)} мм²</button>)}
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Проводник между клеммами</span>
            <strong>{MATERIALS[material].label} · {length} м · {format(area, 1)} мм²</strong>
          </div>
          <WireSpecimen material={material} length={length} area={area} />
        </section>

        <aside className={styles.notes} aria-label="Расчёт сопротивления">
          <div className={styles.resultNote}>
            <span>Сопротивление образца</span>
            <output>{format(resistance)} Ом</output>
            <MathText className={styles.formula} text={`$R=\\rho\\dfrac{l}{S}=${format(rho)}\\cdot\\dfrac{${length}}{${format(area, 1)}}=${format(resistance)}\\,\\text{Ом}$`} />
          </div>
          <div>
            <span>Что видно сразу</span>
            <p>Удвоение длины удваивает сопротивление. Удвоение площади сечения уменьшает его вдвое.</p>
          </div>
          <div className={styles.mioNote}>
            <span>Действие Мио</span>
            <p>Мио сначала фиксирует материал, затем сравнивает образцы, меняя только один геометрический параметр.</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>Удельное сопротивление ρ относится к веществу, а R — к конкретному проводнику с его длиной и площадью поперечного сечения.</p>
    </div>
  );
}
