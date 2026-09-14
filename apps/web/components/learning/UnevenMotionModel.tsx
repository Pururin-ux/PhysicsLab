"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./TextbookScene.module.css";

function tripGraph(stop: number): PhysicsGraphSpec {
  const secondStart = 30 + stop;
  const totalTime = 50 + stop;

  return {
    id: `uneven-trip-${stop}`,
    kind: "piecewise-line",
    axes: {
      x: { label: "t", unit: "с", range: [0, totalTime], ticks: [0, 10, 20, 30, 40, 50, 60, 70].filter((value) => value <= totalTime).map((value) => ({ value })), arrow: true },
      y: { label: "v", unit: "м/с", range: [0, 8], ticks: [0, 2, 4, 6, 8].map((value) => ({ value })), arrow: true },
    },
    series: [{
      id: "поездка",
      type: "polyline",
      points: [
        { x: 0, y: 6 },
        { x: 30, y: 6, label: "180 м" },
        { x: 30, y: 0 },
        { x: secondStart, y: 0, label: stop ? `остановка ${stop} с` : undefined },
        { x: secondStart, y: 3 },
        { x: totalTime, y: 3, label: "+60 м" },
      ],
    }],
    annotations: [{
      type: "shaded-polygon",
      points: [
        { x: 0, y: 0 }, { x: 0, y: 6 }, { x: 30, y: 6 }, { x: 30, y: 0 },
        { x: secondStart, y: 0 }, { x: secondStart, y: 3 }, { x: totalTime, y: 3 }, { x: totalTime, y: 0 },
      ],
      label: "весь путь 240 м",
    }],
    style: { variant: "app", accent: "cyan" },
  };
}

export function UnevenMotionModel() {
  const [stop, setStop] = useState(10);
  const totalTime = 50 + stop;
  const average = 240 / totalTime;

  return (
    <div className={styles.experiment}>
      <p>Автобус проехал 180 м, сделал остановку и проехал ещё 60 м. Измени только время остановки.</p>
      <div className={styles.controls} aria-label="Время остановки">
        {[0, 10, 20].map((seconds) => (
          <button key={seconds} type="button" aria-pressed={stop === seconds} onClick={() => setStop(seconds)}>
            {seconds === 0 ? "Без остановки" : `Остановка ${seconds} с`}
          </button>
        ))}
      </div>
      <div className={styles.graphPanel}>
        <PhysicsGraph
          spec={tripGraph(stop)}
          ariaLabel={`Автобус движется 30 секунд со скоростью 6 метров в секунду, ${stop ? `стоит ${stop} секунд, ` : "без остановки "}затем движется 20 секунд со скоростью 3 метра в секунду`}
        />
      </div>
      <div className={`${styles.readout} ${styles.journeyReadout}`} aria-live="polite">
        <p>Весь путь<strong>240 м</strong><small>180 м + 60 м</small></p>
        <p>Всё время<strong>{totalTime} с</strong><small>30 с + {stop} с + 20 с</small></p>
        <p>Средняя скорость<strong>{average.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} м/с</strong><small>240 м ÷ {totalTime} с</small></p>
      </div>
      <p className={styles.explanation}>
        Остановка не меняет пройденный путь, но часы продолжают идти. Поэтому при большем времени остановки средняя скорость за всю поездку уменьшается.
      </p>
    </div>
  );
}
