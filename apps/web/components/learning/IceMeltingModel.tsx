"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./IceMeltingModel.module.css";

const ICE_HEAT_CAPACITY = 2.1;
const ICE_FUSION_HEAT = 333;
const INITIAL_TEMPERATURE = -20;
const MASSES = [0.5, 1, 1.5] as const;

function format(value: number) {
  return new Intl.NumberFormat("ru-BY", { maximumFractionDigits: 1 }).format(value);
}

function meltingGraph(mass: number): PhysicsGraphSpec {
  const heating = mass * ICE_HEAT_CAPACITY * Math.abs(INITIAL_TEMPERATURE);
  const melted = mass * ICE_FUSION_HEAT;
  return {
    id: `ice-melting-${mass}`,
    kind: "cartesian-line",
    axes: {
      x: { label: "Q", unit: "кДж", range: [0, 600], ticks: [0, 150, 300, 450, 600].map((value) => ({ value })), arrow: true },
      y: { label: "t", unit: "°C", range: [-20, 5], ticks: [-20, -10, 0].map((value) => ({ value })), arrow: true },
    },
    series: [{
      id: `${format(mass)} кг льда`,
      type: "line",
      points: [
        { x: 0, y: INITIAL_TEMPERATURE, label: "Лёд −20 °C" },
        { x: heating, y: 0, label: "Начало плавления" },
        { x: heating + melted, y: 0, label: "Лёд расплавился" },
      ],
    }],
    style: { variant: "app", accent: "cyan" },
  };
}

export function IceMeltingModel() {
  const [mass, setMass] = useState<(typeof MASSES)[number]>(1);
  const spokenMass = mass === 0.5
    ? "половины килограмма льда"
    : mass === 1
      ? "одного килограмма льда"
      : "полутора килограммов льда";
  const heating = mass * ICE_HEAT_CAPACITY * Math.abs(INITIAL_TEMPERATURE);
  const melting = mass * ICE_FUSION_HEAT;
  const total = heating + melting;

  return (
    <section className={styles.model} aria-labelledby="ice-melting-title">
      <header>
        <p>Две стадии одного опыта</p>
        <h2 id="ice-melting-title">Энергия поступает. Почему температура остановилась?</h2>
        <span>Лёд начинает при −20 °C. Меняй массу и следи отдельно за нагреванием и плавлением.</span>
      </header>

      <div className={styles.controls} role="group" aria-label="Масса льда">
        {MASSES.map((value) => <button key={value} type="button" aria-pressed={mass === value} onClick={() => setMass(value)}>{format(value)} кг льда</button>)}
      </div>

      <div className={styles.graph}>
        <PhysicsGraph
          spec={meltingGraph(mass)}
          ariaLabel={`Нагревание и плавление ${spokenMass}: температура растёт от минус двадцати до нуля градусов, затем остаётся равной нулю до полного плавления`}
        />
      </div>

      <div className={styles.stages} aria-live="polite">
        <section>
          <p>1 · Нагреть лёд до 0 °C</p>
          <strong>{format(heating)} кДж</strong>
          <span>Q₁ = cmΔt</span>
        </section>
        <section>
          <p>2 · Расплавить при 0 °C</p>
          <strong>{format(melting)} кДж</strong>
          <span>Q₂ = λm</span>
        </section>
        <section>
          <p>Всего</p>
          <strong>{format(total)} кДж</strong>
          <span>Q = Q₁ + Q₂</span>
        </section>
      </div>

      <p className={styles.explanation}>Горизонтальный участок не означает остановку передачи энергии. При 0 °C полученная теплота разрушает упорядоченную структуру льда, пока он полностью не превратится в воду.</p>
    </section>
  );
}
