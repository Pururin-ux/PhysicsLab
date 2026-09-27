"use client";

import { useId, useState } from "react";
import styles from "./ElectricFieldNotebook.module.css";

type Probe = "none" | "positive-one" | "positive-two" | "negative-one";
type Mode = "presence" | "strength";

const probeCharge: Record<Probe, number> = {
  none: 0,
  "positive-one": 1,
  "positive-two": 2,
  "negative-one": -1,
};

function formatValue(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

export function ElectricFieldNotebook({ mode }: { mode: Mode }) {
  const [probe, setProbe] = useState<Probe>("positive-one");
  const [distance, setDistance] = useState(20);
  const distanceId = useId();
  const q0 = probeCharge[probe];
  // Q = +40 нКл; E = k|Q|/r² in Н/Кл, r in cm.
  const fieldStrength = 3_600_000 / (distance * distance);
  const forceMicroNewtons = Math.abs(q0) * fieldStrength / 1000;
  const probePresent = q0 !== 0;

  return (
    <div className={styles.notebook}>
      <header className={styles.intro}>
        <span>{mode === "presence" ? "Источник и пробный заряд" : "Измерение в точке A"}</span>
        <h2>{mode === "presence" ? "Кто создаёт поле?" : "Что принадлежит полю, а что — пробному заряду?"}</h2>
        <p>{mode === "presence"
          ? "Убери пробный заряд из точки A. Проверь, что при этом меняется."
          : "Оставь источник на месте. Меняй пробный заряд и сравнивай его силу с напряжённостью в той же точке."}</p>
      </header>

      <div className={styles.study} aria-label="Источник поля и исследуемая точка">
        <div className={styles.source}>
          <span>Источник поля</span>
          <strong>Q = +40 нКл</strong>
          <small>Неподвижный точечный заряд · вакуум</small>
        </div>
        <div className={styles.separation} aria-label={"Расстояние до точки A: " + distance + " см"}>
          <span>{distance} см</span>
        </div>
        <div className={styles.point}>
          <span>Точка A</span>
          <strong>{probePresent ? "q₀ = " + (q0 > 0 ? "+" : "−") + Math.abs(q0) + " нКл" : "Пробного заряда нет"}</strong>
          <small>{probePresent ? "Можно наблюдать действие поля" : "Источник Q остался на месте"}</small>
        </div>
      </div>

      <div className={styles.controls}>
        {mode === "strength" && (
          <div className={styles.distanceControl}>
            <label htmlFor={distanceId}>Расстояние от Q до точки A</label>
            <output htmlFor={distanceId}>{distance} см</output>
            <input id={distanceId} type="range" min="10" max="30" step="5" value={distance}
              onChange={event => setDistance(Number(event.currentTarget.value))} />
          </div>
        )}
        <div className={styles.probeControl} role="group" aria-label="Пробный заряд в точке A">
          <span>{mode === "presence" ? "Что в точке A?" : "Пробный заряд в точке A"}</span>
          <div>
            {(mode === "presence"
              ? [["positive-one", "+1 нКл"], ["none", "Убрать заряд"]]
              : [["positive-one", "+1 нКл"], ["positive-two", "+2 нКл"], ["negative-one", "−1 нКл"], ["none", "Убрать"]]
            ).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={probe === value} onClick={() => setProbe(value as Probe)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {mode === "presence" ? (
        <div className={styles.presenceResult} aria-live="polite">
          <div>
            <span>Что осталось без изменений</span>
            <strong>Заряд Q и создаваемое им поле в точке A</strong>
          </div>
          <div>
            <span>Что можно наблюдать сейчас</span>
            <strong>{probePresent ? "На положительный пробный заряд действует сила от источника." : "Силу на пробный заряд сейчас не наблюдаем: его убрали."}</strong>
          </div>
          <p>Пробный заряд помогает обнаружить поле. Он не создаёт поле источника Q и не нужен для его существования.</p>
        </div>
      ) : (
        <div className={styles.strengthResult} aria-live="polite">
          <div className={styles.fieldReading}>
            <span>Поле источника Q в точке A</span>
            <strong>E = {formatValue(fieldStrength)} Н/Кл <b aria-label="направлено вправо">→</b></strong>
            <small>Зависит от Q и расстояния до A, но не от выбранного q₀.</small>
          </div>
          <div className={styles.forceReading}>
            <span>Действие на пробный заряд</span>
            <strong>{probePresent
              ? <>F = {formatValue(forceMicroNewtons)} мкН <b aria-label={q0 > 0 ? "направлена вправо" : "направлена влево"}>{q0 > 0 ? "→" : "←"}</b></>
              : "Нет пробного заряда — нет силы на него"}</strong>
            <small>{probePresent
              ? q0 > 0 ? "Положительный заряд: сила направлена по полю." : "Отрицательный заряд: сила направлена против поля."
              : "Значение E в этой точке остаётся тем же."}</small>
          </div>
          <p>При неизменных Q и r удвоение |q₀| удваивает силу F, но не напряжённость E. Для положительного пробного заряда направление E совпадает с направлением силы.</p>
        </div>
      )}
    </div>
  );
}
