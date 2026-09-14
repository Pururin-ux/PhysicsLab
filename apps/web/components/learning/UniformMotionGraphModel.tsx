"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./TextbookScene.module.css";

type GraphView = "path" | "speed";

function graphSpec(view: GraphView, speed: number): PhysicsGraphSpec {
  const duration = 4;
  const distance = speed * duration;

  if (view === "speed") {
    return {
      id: `uniform-speed-${speed}`,
      kind: "cartesian-line",
      axes: {
        x: { label: "t", unit: "с", range: [0, duration], ticks: [0, 1, 2, 3, 4].map((value) => ({ value })), arrow: true },
        y: { label: "v", unit: "м/с", range: [0, 8], ticks: [0, 2, 4, 6, 8].map((value) => ({ value })), arrow: true },
      },
      series: [{ id: "v(t)", type: "line", points: [{ x: 0, y: speed }, { x: duration, y: speed, label: `v = ${speed} м/с` }] }],
      annotations: [{ type: "shaded-area-under", fromX: 0, toX: duration, seriesId: "v(t)", label: `s = ${distance} м` }],
      style: { variant: "app", accent: "cyan" },
    };
  }

  return {
    id: `uniform-path-${speed}`,
    kind: "cartesian-line",
    axes: {
      x: { label: "t", unit: "с", range: [0, duration], ticks: [0, 1, 2, 3, 4].map((value) => ({ value })), arrow: true },
      y: { label: "s", unit: "м", range: [0, 24], ticks: [0, 6, 12, 18, 24].map((value) => ({ value })), arrow: true },
    },
    series: [{ id: "s(t)", type: "line", points: [{ x: 0, y: 0 }, { x: duration, y: distance, label: `s = ${distance} м` }] }],
    style: { variant: "app", accent: "cyan" },
  };
}

export function UniformMotionGraphModel() {
  const [view, setView] = useState<GraphView>("path");
  const [speed, setSpeed] = useState(3);
  const distance = speed * 4;

  return (
    <div className={styles.experiment}>
      <p>Одно движение длится 4 с. Измени скорость и сравни два способа его записи.</p>
      <div className={styles.graphControls}>
        <div className={styles.controls} aria-label="Скорость тележки">
          {[3, 6].map((value) => (
            <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value} м/с</button>
          ))}
        </div>
        <div className={styles.controls} aria-label="Вид графика">
          <button type="button" aria-pressed={view === "path"} onClick={() => setView("path")}>Путь s(t)</button>
          <button type="button" aria-pressed={view === "speed"} onClick={() => setView("speed")}>Скорость v(t)</button>
        </div>
      </div>
      <div className={styles.graphPanel}>
        <PhysicsGraph
          spec={graphSpec(view, speed)}
          ariaLabel={view === "path" ? `Путь растёт от 0 до ${distance} метров за 4 секунды` : `Скорость постоянна и равна ${speed} метрам в секунду в течение 4 секунд`}
        />
      </div>
      <div className={styles.readout} aria-live="polite">
        <p>За 1 секунду<strong>{speed} м</strong></p>
        <p>За 4 секунды<strong>{distance} м</strong></p>
      </div>
      <p className={styles.explanation}>
        {view === "path"
          ? `Линия s(t) поднимается до ${distance} м. При 6 м/с она вдвое круче, чем при 3 м/с.`
          : `Линия v(t) горизонтальна. Прямоугольник под ней имеет стороны ${speed} м/с и 4 с, поэтому путь равен ${distance} м.`}
      </p>
    </div>
  );
}
