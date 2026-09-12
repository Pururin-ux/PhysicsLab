"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./PrimerObservationPlots.module.css";

const chartTheme = {
  grid: "rgba(229, 223, 217, 0.12)",
  tick: "rgba(229, 223, 217, 0.62)",
  warm: "#e0ad68",
  cyan: "#06bad5",
};

const tooltipStyle = {
  border: "1px solid rgba(229, 223, 217, 0.16)",
  borderRadius: 6,
  background: "#15191d",
  color: "#e5dfd9",
  fontSize: 12,
};

export function OhmObservationPlot() {
  const data = [
    { resistance: 3, current: 4 },
    { resistance: 6, current: 2 },
    { resistance: 12, current: 1 },
  ];

  return (
    <figure className={styles.figure} aria-labelledby="ohm-plot-title">
      <figcaption id="ohm-plot-title">
        <b>Три опыта при напряжении 12 В</b>
        <span>Меняется только сопротивление участка.</span>
      </figcaption>
      <div className={styles.chart} role="img" aria-label="При 3 омах ток 4 ампера, при 6 омах 2 ампера, при 12 омах 1 ампер">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 14, bottom: 8, left: -10 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="resistance" stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} unit=" Ом" />
            <YAxis stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} unit=" А" width={48} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartTheme.grid }} formatter={(value) => [`${value} А`, "Ток"]} labelFormatter={(value) => `R = ${value} Ом`} />
            <Line type="monotone" dataKey="current" stroke={chartTheme.cyan} strokeWidth={3} dot={{ r: 5, fill: chartTheme.warm, stroke: "#15191d", strokeWidth: 2 }} activeDot={{ r: 7 }} isAnimationActive animationDuration={650} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.readout} aria-hidden="true"><span>3 Ом → 4 А</span><span>6 Ом → 2 А</span><span>12 Ом → 1 А</span></div>
    </figure>
  );
}

export function DensityObservationPlot() {
  const data = [
    { volume: 10, mass: 27 },
    { volume: 20, mass: 54 },
    { volume: 30, mass: 81 },
  ];

  return (
    <figure className={styles.figure} aria-labelledby="density-plot-title">
      <figcaption id="density-plot-title">
        <b>Три образца одного алюминия</b>
        <span>Сравним объём и массу каждого образца.</span>
      </figcaption>
      <div className={styles.chart} role="img" aria-label="Для алюминия объёму 10 кубических сантиметров соответствует масса 27 граммов, 20 — 54, 30 — 81">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 14, bottom: 8, left: -2 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="volume" stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} unit=" см³" />
            <YAxis stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} unit=" г" width={54} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartTheme.grid }} formatter={(value) => [`${value} г`, "Масса"]} labelFormatter={(value) => `V = ${value} см³`} />
            <Line type="linear" dataKey="mass" stroke={chartTheme.warm} strokeWidth={3} dot={{ r: 5, fill: chartTheme.cyan, stroke: "#15191d", strokeWidth: 2 }} activeDot={{ r: 7 }} isAnimationActive animationDuration={650} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.readout} aria-hidden="true"><span>10 см³ → 27 г</span><span>20 см³ → 54 г</span><span>30 см³ → 81 г</span></div>
    </figure>
  );
}

export function DensityPredictionPlot() {
  const data = [
    { sample: "Образец 1", volume: 10 },
    { sample: "Образец 2", volume: 20 },
  ];

  return (
    <figure className={styles.figure} aria-labelledby="density-prediction-title">
      <figcaption id="density-prediction-title">
        <b>Два образца одного алюминия</b>
        <span>Объём известен, массу пока не показываем.</span>
      </figcaption>
      <div className={styles.chart} role="img" aria-label="Объём первого образца 10 кубических сантиметров, второго 20. Массы скрыты до наблюдения.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 14, bottom: 8, left: -2 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="sample" stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} />
            <YAxis domain={[0, 20]} stroke={chartTheme.tick} tick={{ fill: chartTheme.tick, fontSize: 11 }} unit=" см³" width={62} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(229, 223, 217, 0.03)" }} formatter={(value) => [`${value} см³`, "Объём"]} />
            <Bar dataKey="volume" fill={chartTheme.cyan} radius={[5, 5, 0, 0]} isAnimationActive animationDuration={520} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.readout} aria-hidden="true"><span>10 см³ → масса ?</span><span>20 см³ → масса ?</span></div>
    </figure>
  );
}
