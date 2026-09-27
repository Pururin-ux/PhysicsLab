"use client";

import { useState } from "react";
import styles from "./ElectrostaticWorkNotebook.module.css";

type Displacement = "along" | "across" | "against";

const cases: Record<Displacement, { label: string; x: number; y: number; dx: number; detour: string; reading: string }> = {
  along: {
    label: "По полю", x: 500, y: 190, dx: 0.2,
    detour: "M320 190 C365 80 455 80 500 190",
    reading: "Заряд сместился вправо, по направлению поля.",
  },
  across: {
    label: "Поперёк", x: 320, y: 85, dx: 0,
    detour: "M320 190 C470 185 470 100 320 85",
    reading: "Маршрут уходит в сторону и возвращается по горизонтали: итоговая проекция перемещения равна нулю.",
  },
  against: {
    label: "Против поля", x: 140, y: 190, dx: -0.2,
    detour: "M320 190 C275 80 185 80 140 190",
    reading: "Заряд сместился влево, против направления поля.",
  },
};

export function ElectrostaticWorkNotebook() {
  const [displacement, setDisplacement] = useState<Displacement>("along");
  const selected = cases[displacement];
  // q = +1 µC and E = 200 N/C. Expressing the result in µJ keeps the
  // calculation numeric without hiding a conversion in the drawing.
  const workMicrojoules = 200 * selected.dx;
  const energyChangeMicrojoules = -workMicrojoules;
  const format = (value: number) => value > 0 ? `+${value}` : String(value);
  const projection = selected.dx === 0 ? "0" : `${selected.dx > 0 ? "+" : ""}${selected.dx.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return <div className={styles.notebook}>
    <header className={styles.heading}>
      <span>Работа поля · наблюдение</span>
      <h2>Два пути между A и B</h2>
      <p>Поставь точку B по полю, поперёк или против него. Сравни прямой путь и обход.</p>
    </header>

    <div className={styles.controls} role="group" aria-label="Положение конечной точки B">
      {(Object.keys(cases) as Displacement[]).map(key => <button
        key={key} type="button" aria-pressed={displacement === key}
        onClick={() => setDisplacement(key)}>{cases[key].label}</button>)}
    </div>

    <figure className={styles.figure}>
      <svg viewBox="0 0 640 330" role="img" aria-label={`Однородное поле направлено вправо. Заряд идёт из A в B ${selected.label.toLowerCase()}. Показаны прямой маршрут и маршрут в обход с одинаковыми начальной и конечной точками.`}>
        <defs>
          <marker id="work-field-arrow" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="16" markerHeight="16" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L12 5 L0 10 Z" className={styles.fieldHead} />
          </marker>
        </defs>
        <path className={styles.plate} d="M55 25 V305 M585 25 V305" />
        <text className={styles.plateSign} x="55" y="20" textAnchor="middle">+</text>
        <text className={styles.plateSign} x="585" y="20" textAnchor="middle">−</text>
        {[45, 265].map(y => <path key={y} className={styles.fieldLine} d={`M110 ${y} H535`} markerEnd="url(#work-field-arrow)" />)}
        <text className={styles.fieldLabel} x="320" y="290" textAnchor="middle">E →</text>
        <path className={styles.detour} d={selected.detour} />
        <path className={styles.direct} d={`M320 190 L${selected.x} ${selected.y}`} />
        <circle className={styles.point} cx="320" cy="190" r="9" />
        <circle className={styles.point} cx={selected.x} cy={selected.y} r="9" />
        <text className={styles.pointLabel} x="320" y="224" textAnchor="middle">A</text>
        <text className={styles.pointLabel} x={selected.x} y={selected.y === 85 ? 74 : 224} textAnchor="middle">B</text>
      </svg>
      <figcaption><span className={styles.solidKey}>Прямо</span><span className={styles.dashedKey}>В обход</span>Обе линии обозначают возможные пути, а не линии напряжённости.</figcaption>
    </figure>

    <div className={styles.result} aria-live="polite">
      <div><span>Проекция A → B на направление поля</span><strong>{projection} м</strong></div>
      <div><span>Работа силы поля · A = qEΔx</span><strong>{format(workMicrojoules)} мкДж</strong></div>
      <div><span>Изменение потенциальной энергии</span><strong>{format(energyChangeMicrojoules)} мкДж</strong></div>
    </div>
    <p className={styles.explanation}>{selected.reading} При q = +1 мкКл и E = 200 Н/Кл оба маршрута дают одну и ту же работу: важны начальная и конечная точки, а не длина обхода.</p>
    <p className={styles.boundary}>Обход направляют внешние силы: здесь сравнивается только работа поля. Модель верна вдали от краёв пластин. Для отрицательного заряда знак работы меняется.</p>
  </div>;
}
