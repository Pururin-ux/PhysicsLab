"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./FuelCombustionLab.module.css";

const FUELS = [
  { id: "wood", label: "Сухие дрова", q: 8.3 },
  { id: "peat", label: "Торф", q: 15 },
  { id: "coal", label: "Каменный уголь А-I", q: 20.5 },
  { id: "gasoline", label: "Бензин", q: 46 },
] as const;

const MASSES = [1, 2, 3] as const;
const TRANSFER_SHARES = [20, 50, 100] as const;

type FuelId = (typeof FUELS)[number]["id"];

function format(value: number) {
  return new Intl.NumberFormat("ru-BY", { maximumFractionDigits: 2 }).format(value);
}

function combustionGraph(fuelId: FuelId): PhysicsGraphSpec {
  const fuel = FUELS.find((item) => item.id === fuelId) ?? FUELS[0];

  return {
    id: `fuel-combustion-${fuel.id}`,
    kind: "cartesian-line",
    axes: {
      x: { label: "m", unit: "кг", range: [0, 3], ticks: [0, 1, 2, 3].map((value) => ({ value })), arrow: true },
      y: { label: "Q", unit: "МДж", range: [0, 150], ticks: [0, 30, 60, 90, 120, 150].map((value) => ({ value })), arrow: true },
    },
    series: [{
      id: fuel.label,
      type: "line",
      points: [0, 1, 2, 3].map((mass) => ({
        x: mass,
        y: fuel.q * mass,
        label: mass === 3 ? fuel.label : undefined,
      })),
    }],
    style: { variant: "app", accent: "gold" },
  };
}

export function FuelCombustionLab() {
  const [fuelId, setFuelId] = useState<FuelId>("wood");
  const [mass, setMass] = useState<(typeof MASSES)[number]>(2);
  const [transferShare, setTransferShare] = useState<(typeof TRANSFER_SHARES)[number]>(20);
  const fuel = FUELS.find((item) => item.id === fuelId) ?? FUELS[0];
  const released = fuel.q * mass;
  const received = released * transferShare / 100;

  return (
    <section className={styles.lab} aria-labelledby="fuel-lab-title">
      <header>
        <p>Энергия топлива</p>
        <h2 id="fuel-lab-title">Сколько теплоты выделится?</h2>
        <span>Сравнивай одинаковую массу разных топлив или меняй массу одного топлива. Расчёт относится к полному сгоранию.</span>
      </header>

      <div className={styles.fuelChoices} role="group" aria-label="Вид топлива">
        {FUELS.map((item) => (
          <button key={item.id} type="button" aria-pressed={fuelId === item.id} onClick={() => setFuelId(item.id)}>
            <span>{item.label}</span><strong>{format(item.q)} МДж/кг</strong>
          </button>
        ))}
      </div>

      <div className={styles.massChoices} role="group" aria-label="Масса топлива">
        {MASSES.map((value) => (
          <button key={value} type="button" aria-pressed={mass === value} onClick={() => setMass(value)}>{value} кг</button>
        ))}
      </div>

      <div className={styles.graph}>
        <PhysicsGraph spec={combustionGraph(fuelId)} ariaLabel={`Зависимость теплоты полного сгорания ${fuel.label.toLowerCase()} от массы топлива`} />
      </div>

      <div className={styles.energyFlow} aria-live="polite">
        <section>
          <p>Выделилось при сгорании</p>
          <strong>{format(released)} МДж</strong>
          <span>Q<sub>топл</sub> = qm = {format(fuel.q)} · {mass}</span>
        </section>
        <section>
          <p>Дошло до нагреваемого тела</p>
          <strong>{format(received)} МДж</strong>
          <span>{transferShare}% от выделившейся теплоты</span>
        </section>
      </div>

      <div className={styles.transfer}>
        <p>Какая доля теплоты передалась телу?</p>
        <div role="group" aria-label="Доля переданной теплоты">
          {TRANSFER_SHARES.map((value) => (
            <button key={value} type="button" aria-pressed={transferShare === value} onClick={() => setTransferShare(value)}>{value}%</button>
          ))}
        </div>
      </div>

      <p className={styles.conclusion}>Удельная теплота сгорания <em>q</em> задаёт наклон линии и не меняется с массой. Доля передачи меняет энергию, полученную телом, но не энергию полного сгорания топлива.</p>
    </section>
  );
}
