"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  getPhotoelectricMetal,
  getPhotoelectricResult,
  PHOTOELECTRIC_METALS,
  PHOTON_ENERGY_EV_PER_1E14_HZ,
  type PhotoelectricMetalId,
  type RelativeIntensity,
} from "../../lib/physics/photoelectric-model";
import styles from "./PhotoelectricNotebook.module.css";

const X_MIN = 3;
const X_MAX = 12;
const ENERGY_MAX = 4.5;
const ENERGY_PLOT = { left: 76, right: 586, top: 36, bottom: 256 } as const;

function format(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits }).format(value);
}

function scaleX(value: number) {
  return ENERGY_PLOT.left + ((value - X_MIN) / (X_MAX - X_MIN)) * (ENERGY_PLOT.right - ENERGY_PLOT.left);
}

function scaleEnergyY(value: number) {
  return ENERGY_PLOT.bottom - (value / ENERGY_MAX) * (ENERGY_PLOT.bottom - ENERGY_PLOT.top);
}

function energyCurve(thresholdFrequency14: number) {
  const endEnergy = PHOTON_ENERGY_EV_PER_1E14_HZ * (X_MAX - thresholdFrequency14);
  return "M" + scaleX(thresholdFrequency14).toFixed(1) + " " + scaleEnergyY(0).toFixed(1) +
    " L" + scaleX(X_MAX).toFixed(1) + " " + scaleEnergyY(endEnergy).toFixed(1);
}

function EnergyGraph({
  metalId,
  frequency14,
  maximumKineticEnergyEv,
  emissionPossible,
}: {
  metalId: PhotoelectricMetalId;
  frequency14: number;
  maximumKineticEnergyEv: number;
  emissionPossible: boolean;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const metal = getPhotoelectricMetal(metalId);
  const thresholdX = scaleX(metal.thresholdFrequency14);
  const currentX = scaleX(frequency14);
  const currentY = scaleEnergyY(maximumKineticEnergyEv);

  return (
    <figure className={styles.graph}>
      <svg viewBox="0 0 620 330" role="img" aria-labelledby={titleId + " " + descriptionId}>
        <title id={titleId}>Максимальная кинетическая энергия электрона в зависимости от частоты света</title>
        <desc id={descriptionId}>
          Для {metal.name} красная граница равна {format(metal.thresholdFrequency14, 1)} на десять в четырнадцатой герц.
          {emissionPossible
            ? " При выбранной частоте " + format(frequency14, 1) + " максимальная кинетическая энергия равна " + format(maximumKineticEnergyEv) + " электронвольт."
            : " При выбранной частоте " + format(frequency14, 1) + " на десять в четырнадцатой герц фотоэлектроны не вылетают."}
        </desc>
        <rect
          x={ENERGY_PLOT.left}
          y={ENERGY_PLOT.top}
          width={Math.max(0, thresholdX - ENERGY_PLOT.left)}
          height={ENERGY_PLOT.bottom - ENERGY_PLOT.top}
          className={styles.noEmissionRegion}
        />
        {[0, 1, 2, 3, 4].map((value) => (
          <g key={"energy-y-" + value}>
            <line x1={ENERGY_PLOT.left} x2={ENERGY_PLOT.right} y1={scaleEnergyY(value)} y2={scaleEnergyY(value)} className={styles.gridLine} />
            <text x={ENERGY_PLOT.left - 12} y={scaleEnergyY(value) + 6} textAnchor="end" className={styles.tick}>{value}</text>
          </g>
        ))}
        {[3, 5, 7, 9, 12].map((value) => (
          <g key={"energy-x-" + value}>
            <line x1={scaleX(value)} x2={scaleX(value)} y1={ENERGY_PLOT.top} y2={ENERGY_PLOT.bottom} className={styles.gridLine} />
            <text x={scaleX(value)} y={ENERGY_PLOT.bottom + 24} textAnchor={value === X_MAX ? "end" : "middle"} className={styles.tick}>{value}</text>
          </g>
        ))}
        <line x1={ENERGY_PLOT.left} x2={ENERGY_PLOT.right} y1={ENERGY_PLOT.bottom} y2={ENERGY_PLOT.bottom} className={styles.axis} />
        <line x1={ENERGY_PLOT.left} x2={ENERGY_PLOT.left} y1={ENERGY_PLOT.top} y2={ENERGY_PLOT.bottom} className={styles.axis} />
        <line x1={thresholdX} x2={thresholdX} y1={ENERGY_PLOT.top} y2={ENERGY_PLOT.bottom} className={styles.threshold} />
        <path d={energyCurve(metal.thresholdFrequency14)} className={styles.energyLine} />
        <line x1={currentX} x2={currentX} y1={currentY} y2={ENERGY_PLOT.bottom} className={styles.currentGuide} />
        <circle cx={currentX} cy={currentY} r="7" className={emissionPossible ? styles.currentPoint : styles.inactivePoint} />
        <text x={thresholdX + 7} y={ENERGY_PLOT.top + 17} className={styles.thresholdLabel}>νкр = {format(metal.thresholdFrequency14, 1)}</text>
        <text x={ENERGY_PLOT.left} y="20" className={styles.axisLabel}>Kₘₐₓ, эВ</text>
        <text x={ENERGY_PLOT.right} y={ENERGY_PLOT.bottom + 54} textAnchor="end" className={styles.axisLabel}>ν, 10¹⁴ Гц</text>
      </svg>
      <figcaption>
        Красная граница зависит от вещества. Слева от неё электрон не вылетает; справа энергия растёт по прямой.
      </figcaption>
    </figure>
  );
}

function IntensityGraph({
  intensity,
  emissionPossible,
}: {
  intensity: RelativeIntensity;
  emissionPossible: boolean;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const left = 54;
  const right = 392;
  const top = 28;
  const bottom = 145;
  const x = (value: number) => left + (value / 3) * (right - left);
  const y = (value: number) => bottom - (value / 3) * (bottom - top);
  const current = emissionPossible ? intensity : 0;

  return (
    <figure className={styles.graph}>
      <svg viewBox="0 0 420 204" role="img" aria-labelledby={titleId + " " + descriptionId}>
        <title id={titleId}>Относительный фототок насыщения при разной интенсивности света</title>
        <desc id={descriptionId}>
          {emissionPossible
            ? "При частоте выше красной границы фототок насыщения пропорционален интенсивности. Сейчас обе относительные величины равны " + intensity + "."
            : "При частоте ниже красной границы фототока нет даже при увеличении интенсивности света."}
        </desc>
        {[0, 1, 2, 3].map((value) => (
          <g key={"current-y-" + value}>
            <line x1={left} x2={right} y1={y(value)} y2={y(value)} className={styles.gridLine} />
            <text x={left - 9} y={y(value) + 5} textAnchor="end" className={styles.tick}>{value}</text>
          </g>
        ))}
        {[1, 2, 3].map((value) => (
          <g key={"current-x-" + value}>
            <line x1={x(value)} x2={x(value)} y1={top} y2={bottom} className={styles.gridLine} />
            <text x={x(value)} y={bottom + 22} textAnchor="middle" className={styles.tick}>{value}</text>
          </g>
        ))}
        <line x1={left} x2={right} y1={bottom} y2={bottom} className={styles.axis} />
        <line x1={left} x2={left} y1={top} y2={bottom} className={styles.axis} />
        {emissionPossible && <path d={"M" + x(0) + " " + y(0) + " L" + x(3) + " " + y(3)} className={styles.currentLine} />}
        {!emissionPossible && <line x1={x(0)} x2={x(3)} y1={y(0)} y2={y(0)} className={styles.currentLine} />}
        <circle cx={x(intensity)} cy={y(current)} r="7" className={emissionPossible ? styles.currentPoint : styles.inactivePoint} />
        <text x={left} y="17" className={styles.axisLabel}>Iₙ, относительные единицы</text>
        <text x={right} y={bottom + 49} textAnchor="end" className={styles.axisLabel}>Интенсивность, отн. ед.</text>
      </svg>
      <figcaption>
        При одном и том же веществе и частоте больший поток фотонов повышает фототок, но не энергию каждого электрона.
      </figcaption>
    </figure>
  );
}

export function PhotoelectricNotebook() {
  const [metalId, setMetalId] = useState<PhotoelectricMetalId>("sodium");
  const [frequency14, setFrequency14] = useState(8);
  const [intensity, setIntensity] = useState<RelativeIntensity>(1);
  const metal = getPhotoelectricMetal(metalId);
  const result = getPhotoelectricResult(metalId, frequency14, intensity);

  const mioNote = !result.emissionPossible
    ? "Яркость не отменяет красную границу: сначала энергии фотона должно хватить на выход электрона."
    : intensity === 1
      ? "Оставь частоту прежней и сделай свет ярче. Я проверяю, что изменится: фототок или энергия электрона."
      : "Я ошиблась: фототок вырос, а максимальная энергия электрона при той же частоте не изменилась.";

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>11 класс · фотоэффект</p>
        <h2>Свет ярче — электроны быстрее?</h2>
        <p>Проверь догадку Мио: меняй поток света, не меняя его частоту. Затем измени частоту и сравни энергию электронов.</p>
      </header>

      <div className={styles.hypothesis}>
        <Image
          src="/images/mio/mio-skeptical-v2.png"
          alt=""
          width={1254}
          height={1254}
          sizes="72px"
          className={styles.mio}
        />
        <p><strong>Гипотеза Мио</strong><br />«Если свет ярче, каждый выбитый электрон получит больше энергии».</p>
      </div>

      <div className={styles.controls}>
        <fieldset>
          <legend>Материал катода</legend>
          <label className={styles.visuallyHidden} htmlFor="photoelectric-metal">Материал катода</label>
          <select id="photoelectric-metal" value={metalId} onChange={(event) => setMetalId(event.target.value as PhotoelectricMetalId)}>
            {PHOTOELECTRIC_METALS.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.symbol})</option>)}
          </select>
          <small>Работа выхода A ≈ {format(metal.roundedWorkFunctionEv, 1)} эВ</small>
        </fieldset>

        <fieldset>
          <legend>Частота света</legend>
          <label className={styles.visuallyHidden} htmlFor="photoelectric-frequency">Частота света</label>
          <div className={styles.rangeValue} aria-hidden="true">
            <output>{format(frequency14, 1)}</output> × 10¹⁴ Гц
          </div>
          <input
            id="photoelectric-frequency"
            type="range"
            min={X_MIN}
            max={X_MAX}
            step="0.1"
            value={frequency14}
            onChange={(event) => setFrequency14(Number(event.target.value))}
            aria-valuetext={`${format(frequency14, 1)} × 10¹⁴ Гц`}
            aria-describedby="photoelectric-frequency-boundary"
          />
          <small id="photoelectric-frequency-boundary">
            Красная граница для {metal.symbol}: {format(metal.thresholdFrequency14, 1)} × 10¹⁴ Гц
          </small>
        </fieldset>

        <fieldset>
          <legend>Интенсивность</legend>
          <div className={styles.choices} role="group" aria-label="Относительная интенсивность света">
            {([1, 2, 3] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={intensity === value}
                onClick={() => setIntensity(value)}
              >
                {value}×
              </button>
            ))}
          </div>
          <small>Меняется поток фотонов; частота пока та же.</small>
        </fieldset>
      </div>

      <div className={styles.observations} aria-live="polite">
        <p><span>Энергия фотона hν</span><strong>{format(result.photonEnergyEv)} эВ</strong></p>
        <p><span>Максимальная энергия электрона</span><strong>{result.emissionPossible ? format(result.maximumKineticEnergyEv) + " эВ" : "электронов нет"}</strong></p>
        <p><span>Задерживающее напряжение |Uз|</span><strong>{result.emissionPossible ? format(result.stoppingPotentialV) + " В" : "нет фотоэффекта"}</strong></p>
        <p className={styles.currentReadout}>
          <span>Фототок насыщения</span>
          <strong>{result.emissionPossible ? result.relativeSaturationCurrent + "× от исходного" : "0 · ниже порога"}</strong>
        </p>
      </div>

      <div className={styles.graphs}>
        <EnergyGraph
          metalId={metalId}
          frequency14={frequency14}
          maximumKineticEnergyEv={result.maximumKineticEnergyEv}
          emissionPossible={result.emissionPossible}
        />
        <IntensityGraph intensity={intensity} emissionPossible={result.emissionPossible} />
      </div>

      <p className={styles.mioConclusion} aria-live="polite">{mioNote}</p>
      <p className={styles.formulas}>
        Энергетический баланс: <strong>hν = A<sub>вых</sub> + K<sub>max</sub></strong>
        <span>·</span>
        <strong>e|U<sub>з</sub>| = K<sub>max</sub></strong>
      </p>
      <p className={styles.boundary}>
        График фототока дан в относительных единицах, а не в амперах. Табличные порог и работа выхода округлены; модель согласует их через νкр = A/h. Она не рассчитывает реальные свойства катода и электрической цепи.
      </p>
    </div>
  );
}
