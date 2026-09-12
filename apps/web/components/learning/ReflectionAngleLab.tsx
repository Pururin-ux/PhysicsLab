"use client";

import { useId, useState } from "react";
import styles from "./ReflectionAngleLab.module.css";

const MIN_ANGLE = 10;
const MAX_ANGLE = 70;
const INITIAL_ANGLE = 25;

function pointOnRay(angle: number, length: number, side: -1 | 1) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: 260 + side * Math.sin(radians) * length,
    y: 220 - Math.cos(radians) * length,
  };
}

export function ReflectionAngleLab() {
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const incident = pointOnRay(angle, 162, -1);
  const reflected = pointOnRay(angle, 162, 1);
  const incidentArc = pointOnRay(angle, 42, -1);
  const reflectedArc = pointOnRay(angle, 42, 1);

  return (
    <figure className={styles.lab} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Управляй углом падения</p>
          <h4 id={`${id}-title`}>Что сделает отражённый луч?</h4>
        </div>
        <output className={styles.output} htmlFor={`${id}-angle`}>
          <span>α</span>
          <b>{angle}°</b>
          <i aria-hidden="true">=</i>
          <span>β</span>
          <b>{angle}°</b>
        </output>
      </div>

      <svg
        viewBox="0 0 520 292"
        className={styles.diagram}
        role="img"
        aria-label={`Луч падает под углом ${angle} градусов к нормали и отражается под углом ${angle} градусов к нормали`}
      >
        <defs>
          <marker
            id={`${id}-incident-arrow`}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.incidentFill} />
          </marker>
          <marker
            id={`${id}-reflected-arrow`}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.reflectedFill} />
          </marker>
        </defs>

        <path d="M 52 220 H 468" className={styles.mirror} />
        {Array.from({ length: 20 }, (_, index) => {
          const x = 66 + index * 20;
          return <path key={x} d={`M ${x} 220 l -10 14`} className={styles.hatch} />;
        })}
        <path d="M 260 34 V 252" className={styles.normal} />
        <text x="270" y="51" className={styles.axisLabel}>нормаль</text>
        <text x="64" y="259" className={styles.axisLabel}>зеркало</text>

        <line
          x1={incident.x}
          y1={incident.y}
          x2="257"
          y2="217"
          className={styles.incidentRay}
          markerEnd={`url(#${id}-incident-arrow)`}
        />
        <line
          x1="263"
          y1="217"
          x2={reflected.x}
          y2={reflected.y}
          className={styles.reflectedRay}
          markerEnd={`url(#${id}-reflected-arrow)`}
        />
        <circle cx="260" cy="220" r="5" className={styles.hitPoint} />

        <path
          d={`M 260 178 A 42 42 0 0 0 ${incidentArc.x} ${incidentArc.y}`}
          className={styles.incidentArc}
        />
        <path
          d={`M 260 178 A 42 42 0 0 1 ${reflectedArc.x} ${reflectedArc.y}`}
          className={styles.reflectedArc}
        />
        <text x={incidentArc.x - 17} y={incidentArc.y - 8} className={styles.incidentLabel}>
          α
        </text>
        <text x={reflectedArc.x + 8} y={reflectedArc.y - 8} className={styles.reflectedLabel}>
          β
        </text>
      </svg>

      <div className={styles.control}>
        <label htmlFor={`${id}-angle`}>
          Угол падения от нормали
          <strong>{angle}°</strong>
        </label>
        <input
          id={`${id}-angle`}
          type="range"
          min={MIN_ANGLE}
          max={MAX_ANGLE}
          step={5}
          value={angle}
          onChange={(event) => setAngle(Number(event.target.value))}
          aria-describedby={`${id}-reading`}
        />
        <div className={styles.rangeEnds} aria-hidden="true">
          <span>{MIN_ANGLE}°</span>
          <span>{MAX_ANGLE}°</span>
        </div>
      </div>

      <figcaption id={`${id}-reading`} className={styles.reading} aria-live="polite">
        Угол падения α = {angle}°. Угол отражения β = {angle}°. Оба угла отсчитаны от пунктирной нормали.
      </figcaption>
    </figure>
  );
}
