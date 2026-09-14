"use client";

import { useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import styles from "./EvaporationBoilingLab.module.css";

const WATER_HEAT_CAPACITY = 4.2;
const WATER_VAPORIZATION_HEAT = 2260;
const INITIAL_TEMPERATURE = 20;
const BOILING_TEMPERATURE = 100;
const MASSES = [0.1, 0.2, 0.25] as const;

const EVAPORATION_COMPARISONS = [
  { id: "temperature", label: "Тёплая поверхность", changed: "Температура одной из двух одинаковых капель выше.", result: "Тёплая капля испаряется быстрее.", reason: "В ней больше молекул с энергией, достаточной для выхода из жидкости." },
  { id: "surface", label: "Широкое пятно", changed: "Одну из одинаковых порций жидкости распределили по большей площади.", result: "Широкое пятно исчезает быстрее.", reason: "Со свободной поверхностью одновременно связано больше молекул жидкости." },
  { id: "airflow", label: "Поток воздуха", changed: "Над одной из одинаковых капель движется воздух.", result: "При потоке воздуха капля испаряется быстрее.", reason: "Воздух уносит пар от поверхности, поэтому меньше молекул возвращается в жидкость." },
  { id: "substance", label: "Другая жидкость", changed: "Сравнивают одинаковые капли ацетона и воды при одинаковых условиях.", result: "Ацетон исчезает раньше воды.", reason: "У разных жидкостей различаются силы взаимодействия между молекулами." },
] as const;

type Mode = "evaporation" | "boiling";
type ComparisonId = (typeof EVAPORATION_COMPARISONS)[number]["id"];

function format(value: number) {
  return new Intl.NumberFormat("ru-BY", { maximumFractionDigits: 2 }).format(value);
}

function boilingGraph(mass: number): PhysicsGraphSpec {
  const heating = mass * WATER_HEAT_CAPACITY * (BOILING_TEMPERATURE - INITIAL_TEMPERATURE);
  const vaporization = mass * WATER_VAPORIZATION_HEAT;
  return {
    id: "water-boiling-" + mass,
    kind: "cartesian-line",
    axes: {
      x: { label: "Q", unit: "кДж", range: [0, 700], ticks: [0, 175, 350, 525, 700].map((value) => ({ value })), arrow: true },
      y: { label: "t", unit: "°C", range: [20, 110], ticks: [20, 40, 60, 80, 100].map((value) => ({ value })), arrow: true },
    },
    series: [{
      id: format(mass) + " кг воды",
      type: "line",
      points: [
        { x: 0, y: INITIAL_TEMPERATURE, label: "Вода 20 °C" },
        { x: heating, y: BOILING_TEMPERATURE, label: "Начало кипения" },
        { x: heating + vaporization, y: BOILING_TEMPERATURE, label: "Вода превратилась в пар" },
      ],
    }],
    style: { variant: "app", accent: "cyan" },
  };
}

export function EvaporationBoilingLab() {
  const [mode, setMode] = useState<Mode>("evaporation");
  const [comparisonId, setComparisonId] = useState<ComparisonId>("temperature");
  const [mass, setMass] = useState<(typeof MASSES)[number]>(0.2);
  const comparison = EVAPORATION_COMPARISONS.find((item) => item.id === comparisonId) ?? EVAPORATION_COMPARISONS[0];
  const heating = mass * WATER_HEAT_CAPACITY * (BOILING_TEMPERATURE - INITIAL_TEMPERATURE);
  const vaporization = mass * WATER_VAPORIZATION_HEAT;
  const total = heating + vaporization;

  return (
    <section className={styles.lab} aria-labelledby="vaporization-lab-title">
      <header>
        <p>Два вида парообразования</p>
        <h2 id="vaporization-lab-title">Когда вода уходит в воздух?</h2>
        <span>Испарение идёт с поверхности при любой температуре. Кипение охватывает весь объём при температуре, зависящей от давления.</span>
      </header>

      <div className={styles.modeSwitch} role="group" aria-label="Режим наблюдения">
        <button type="button" aria-pressed={mode === "evaporation"} onClick={() => setMode("evaporation")}>Испарение</button>
        <button type="button" aria-pressed={mode === "boiling"} onClick={() => setMode("boiling")}>Кипение</button>
      </div>

      {mode === "evaporation" ? (
        <div className={styles.evaporation}>
          <p className={styles.boundary}>В каждом сравнении меняется только один фактор. Это качественное наблюдение, а не расчёт точного времени высыхания.</p>
          <div className={styles.factorChoices} role="group" aria-label="Фактор скорости испарения">
            {EVAPORATION_COMPARISONS.map((item) => (
              <button key={item.id} type="button" aria-pressed={comparisonId === item.id} onClick={() => setComparisonId(item.id)}>{item.label}</button>
            ))}
          </div>
          <article className={styles.comparison} aria-live="polite">
            <div><span>Что изменили</span><p>{comparison.changed}</p></div>
            <div><span>Что наблюдаем</span><strong>{comparison.result}</strong></div>
            <div><span>Почему</span><p>{comparison.reason}</p></div>
          </article>
        </div>
      ) : (
        <div className={styles.boiling}>
          <p className={styles.boundary}>Вода начинает при 20 °C и кипит при 100 °C при нормальном атмосферном давлении. Потерями и нагреванием сосуда пренебрегаем.</p>
          <div className={styles.massChoices} role="group" aria-label="Масса воды">
            {MASSES.map((value) => (
              <button key={value} type="button" aria-pressed={mass === value} onClick={() => setMass(value)}>{format(value)} кг воды</button>
            ))}
          </div>
          <div className={styles.graph}>
            <PhysicsGraph spec={boilingGraph(mass)} ariaLabel={"Нагревание " + format(mass) + " килограмма воды от двадцати до ста градусов и кипение при постоянной температуре"} />
          </div>
          <div className={styles.stages} aria-live="polite">
            <section><p>1 · Нагреть до 100 °C</p><strong>{format(heating)} кДж</strong><span>Q₁ = cmΔt</span></section>
            <section><p>2 · Превратить в пар</p><strong>{format(vaporization)} кДж</strong><span>Q₂ = Lm</span></section>
            <section><p>Всего</p><strong>{format(total)} кДж</strong><span>Q = Q₁ + Q₂</span></section>
          </div>
          <p className={styles.conclusion}>Горизонтальный участок показывает кипение: энергия продолжает поступать, но до завершения перехода температура воды не растёт.</p>
        </div>
      )}
    </section>
  );
}
