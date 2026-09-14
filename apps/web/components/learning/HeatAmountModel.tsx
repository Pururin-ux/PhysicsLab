"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./HeatAmountModel.module.css";

const CASES = [
  { id: "water-1", label: "1 кг воды", spokenSubject: "одного килограмма воды", spokenMass: "один килограмм", mass: 1, heatCapacity: 4.2 },
  { id: "water-2", label: "2 кг воды", spokenSubject: "двух килограммов воды", spokenMass: "два килограмма", mass: 2, heatCapacity: 4.2 },
  { id: "aluminium-1", label: "1 кг алюминия", spokenSubject: "одного килограмма алюминия", spokenMass: "один килограмм", mass: 1, heatCapacity: 0.92 },
] as const;

type CaseId = (typeof CASES)[number]["id"];

function format(value: number) {
  return new Intl.NumberFormat("ru-BY", { maximumFractionDigits: 2 }).format(value);
}

function graphSpec(id: CaseId): PhysicsGraphSpec {
  const sample = CASES.find((item) => item.id === id) ?? CASES[0];
  const points = [0, 5, 10, 15, 20].map((temperatureChange) => ({
    x: temperatureChange,
    y: sample.heatCapacity * sample.mass * temperatureChange,
    label: temperatureChange === 20 ? sample.label : undefined,
  }));

  return {
    id: `heat-amount-${sample.id}`,
    kind: "cartesian-line",
    axes: {
      x: { label: "Δt", unit: "°C", range: [0, 20], ticks: [0, 5, 10, 15, 20].map((value) => ({ value })), arrow: true },
      y: { label: "Q", unit: "кДж", range: [0, 170], ticks: [0, 42, 84, 126, 168].map((value) => ({ value })), arrow: true },
    },
    series: [{ id: sample.label, type: "line", points }],
    style: { variant: "app", accent: id === "aluminium-1" ? "gold" : "cyan" },
  };
}

export function HeatAmountModel() {
  const [caseId, setCaseId] = useState<CaseId>("water-1");
  const sample = CASES.find((item) => item.id === caseId) ?? CASES[0];
  const temperatureChange = 20;
  const heat = sample.heatCapacity * sample.mass * temperatureChange;

  return (
    <section className={styles.model} aria-label="Сравнение количества теплоты для разных тел">
      <div className={styles.heading}>
        <div>
          <p>Одинаковое изменение температуры</p>
          <h2>Что делает линию круче?</h2>
        </div>
        <strong>Δt = 20 °C</strong>
      </div>

      <div className={styles.cases} aria-label="Условие опыта">
        {CASES.map((item) => (
          <button key={item.id} type="button" aria-pressed={caseId === item.id} onClick={() => setCaseId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.graph}>
        <PhysicsGraph
          spec={graphSpec(caseId)}
          ariaLabel={`Количество теплоты для ${sample.spokenSubject} при нагревании от нуля до двадцати градусов`}
        />
      </div>

      <div className={styles.reading} aria-live="polite">
        <p><span>Удельная теплоёмкость</span><strong>{format(sample.heatCapacity)} кДж/(кг·°C)</strong></p>
        <p><span>Масса</span><strong>{sample.mass} кг</strong></p>
        <p><span>Полученная теплота</span><strong>{format(heat)} кДж</strong></p>
      </div>

      <p className={styles.formula} aria-label={`Удельная теплоёмкость ${format(sample.heatCapacity)} килоджоуля на килограмм-градус умножается на массу ${sample.spokenMass} и изменение температуры двадцать градусов. Результат в килоджоулях: ${format(heat)}`}>
        <span>Q = cmΔt</span>
        <strong>{format(sample.heatCapacity)} · {sample.mass} · 20 = {format(heat)} кДж</strong>
      </p>
      <p className={styles.explanation}>
        {caseId === "water-2"
          ? "Масса воды удвоилась — при каждом изменении температуры требуется вдвое больше теплоты."
          : caseId === "aluminium-1"
            ? "Масса та же, но удельная теплоёмкость алюминия меньше: одинаковая теплота изменила бы его температуру сильнее."
            : "Это исходный опыт. Сравни его с двойной массой воды и с такой же массой другого вещества."}
      </p>
    </section>
  );
}
