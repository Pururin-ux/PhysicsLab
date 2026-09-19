"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./ReferenceFrameNotebook.module.css";

type VectorId = "north-east" | "north-west" | "north";

const VECTORS: Record<VectorId, { label: string; dx: number; dy: number; angle: number }> = {
  "north-east": { label: "4 вправо, 3 вверх", dx: 4, dy: 3, angle: -37 },
  "north-west": { label: "4 влево, 3 вверх", dx: -4, dy: 3, angle: -143 },
  north: { label: "5 вверх", dx: 0, dy: 5, angle: -90 },
};

export function ReferenceFrameNotebook() {
  const [vectorId, setVectorId] = useState<VectorId>("north-east");
  const markerId = useId().replaceAll(":", "");
  const vector = VECTORS[vectorId];
  const origin = { x: 360, y: 320 };
  const scale = 45;
  const end = { x: origin.x + vector.dx * scale, y: origin.y - vector.dy * scale };
  const module = Math.hypot(vector.dx, vector.dy);
  const boatLeft = `${end.x / 720 * 100}%`;
  const boatTop = `${end.y / 400 * 100}%`;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Полевой лист Мио</p>
        <h2>Что нужно указать, чтобы движение стало однозначным?</h2>
        <span>Мио выбирает швартовую тумбу телом отсчёта, связывает с берегом оси и включает часы. Теперь положение и направление можно записать числами.</span>
      </header>

      <div className={styles.controls} aria-label="Перемещение лодки">
        {(Object.keys(VECTORS) as VectorId[]).map(id => (
          <button key={id} type="button" aria-pressed={vectorId === id} onClick={() => setVectorId(id)}>{VECTORS[id].label}</button>
        ))}
      </div>

      <div className={styles.workspace}>
        <section className={styles.fieldPanel}>
          <div className={styles.fieldHeading}>
            <span>Система отсчёта</span>
            <strong>берег · оси xOy · часы</strong>
          </div>
          <div className={styles.field} role="img" aria-label={`Лодка переместилась относительно берега: проекция по оси x ${vector.dx} метра, по оси y ${vector.dy} метра, модуль перемещения ${module} метра.`}>
            <Image className={styles.river} src="/images/experiments/river-stage-v1.png" alt="" fill sizes="(max-width:760px) 100vw, 650px" />
            <div className={styles.veil} aria-hidden="true" />
            <svg viewBox="0 0 720 400" aria-hidden="true">
              <defs>
                <marker id={`${markerId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10Z" className={styles.arrowHead} />
                </marker>
              </defs>
              <g className={styles.axes}>
                <line x1="76" y1={origin.y} x2="654" y2={origin.y} markerEnd={`url(#${markerId}-arrow)`} />
                <line x1={origin.x} y1="356" x2={origin.x} y2="48" markerEnd={`url(#${markerId}-arrow)`} />
                <text x="660" y="345">x</text><text x="378" y="55">y</text><text x="342" y="346">O</text>
              </g>
              <g className={styles.projections}>
                <line x1={end.x} y1={end.y} x2={end.x} y2={origin.y} />
                <line x1={origin.x} y1={end.y} x2={end.x} y2={end.y} />
                <text x={(origin.x + end.x) / 2} y={origin.y - 12} textAnchor="middle">Δx = {vector.dx} м</text>
                <text x={end.x + (vector.dx < 0 ? -12 : 12)} y={(origin.y + end.y) / 2} textAnchor={vector.dx < 0 ? "end" : "start"}>Δy = {vector.dy} м</text>
              </g>
              <line className={styles.vector} x1={origin.x} y1={origin.y} x2={end.x} y2={end.y} markerEnd={`url(#${markerId}-arrow)`} />
              <circle className={styles.originPoint} cx={origin.x} cy={origin.y} r="8" />
            </svg>
            <div className={styles.boat} style={{ left: boatLeft, top: boatTop, rotate: `${vector.angle}deg` }} aria-hidden="true">
              <Image src="/images/experiments/motorboat-top-v1.png" alt="" width={180} height={120} sizes="90px" />
            </div>
            <div className={styles.clock} aria-hidden="true"><span>t₀</span><strong>0 с</strong><span>t₁</span><strong>4 с</strong></div>
          </div>
        </section>

        <aside className={styles.notes} aria-label="Запись положения и перемещения">
          <div>
            <span>Тело отсчёта</span>
            <strong>Швартовая тумба на берегу</strong>
            <p>Она принята неподвижной; с берегом связаны оси координат.</p>
          </div>
          <div className={styles.primaryReading}>
            <span>Проекции перемещения</span>
            <output aria-live="polite">({vector.dx}; {vector.dy}) м</output>
            <p>Знак показывает направление относительно выбранных осей.</p>
          </div>
          <div>
            <span>Модуль вектора</span>
            <MathText text={`$|\\Delta\\vec r|=\\sqrt{(${vector.dx})^2+${vector.dy}^2}=${module}\\,\\text{м}$`} />
          </div>
          <div className={styles.mioNote}>
            <span>Действие Мио</span>
            <p>Мио сначала фиксирует систему отсчёта, затем подписывает проекции. Только после этого сравнивает направления.</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>Скаляр определяется числом и единицей. Для вектора нужны ещё направление или проекции. Координаты и знаки имеют смысл только после выбора системы отсчёта.</p>
    </div>
  );
}
