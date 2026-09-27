"use client";

import { useState } from "react";
import {
  calculateFullCircuit,
  estimatePowerBalanceFromReadings,
  estimateInternalResistanceFromReadings,
  type InternalResistanceEstimate,
} from "../../lib/physics/full-circuit-model.ts";
import { CircuitDiagram } from "../diagrams/CircuitDiagram";
import styles from "./FullCircuitNotebook.module.css";

const EMF_V = 12;
const INTERNAL_RESISTANCE_OHM = 2;
const DISPLAY_STEP = 0.1;

function format(value: number, maximumFractionDigits = 2) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(maximumFractionDigits).replace(/0+$/, "").replace(/\.$/, "").replace(".", ",");
}

function roundReading(value: number) {
  return Number(value.toFixed(1));
}

function formatReading(value: number) {
  return value.toFixed(1).replace(".", ",");
}

function formatInterval(estimate: InternalResistanceEstimate) {
  const minimum = Math.floor(estimate.minimumOhm * 10 + 1e-9) / 10;
  const maximum = Math.ceil(estimate.maximumOhm * 10 - 1e-9) / 10;
  return formatReading(minimum) + "–" + formatReading(maximum) + " Ом";
}

type LoadedMeasurement = {
  loadResistanceOhm: number;
  currentA: number;
  terminalVoltageV: number;
  resistance: InternalResistanceEstimate;
};

export function FullCircuitNotebook() {
  const [loadResistanceOhm, setLoadResistanceOhm] = useState(4);
  const [closed, setClosed] = useState(false);
  const [referenceEmfV, setReferenceEmfV] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<LoadedMeasurement[]>([]);
  const [measurementFeedback, setMeasurementFeedback] = useState("Начни с разомкнутой цепи: запиши U₀ и оцени ЭДС источника.");
  const reading = calculateFullCircuit({
    emfV: EMF_V,
    internalResistanceOhm: INTERNAL_RESISTANCE_OHM,
    loadResistanceOhm,
    closed,
  });
  const stateSummary = closed
    ? "После замыкания часть ЭДС падает внутри источника. Сравни напряжение на клеммах с отсчётом U₀."
    : "При разомкнутой цепи ток практически не течёт: напряжение на клеммах помогает оценить ЭДС.";
  const hasCurrentLoadRecord = measurements.some(
    measurement => measurement.loadResistanceOhm === loadResistanceOhm,
  );
  const canRecord = referenceEmfV === null ? !closed : closed;
  const recordLabel = referenceEmfV === null
    ? closed ? "Сначала разомкни цепь" : "Записать U₀"
    : closed
      ? hasCurrentLoadRecord ? "Обновить показания" : "Записать U и I"
      : "Замкни ключ для измерений";
  const lowerOverlap = measurements.length > 0
    ? Math.max(...measurements.map(measurement => measurement.resistance.minimumOhm))
    : null;
  const upperOverlap = measurements.length > 0
    ? Math.min(...measurements.map(measurement => measurement.resistance.maximumOhm))
    : null;
  const estimatesAgree = measurements.length >= 2 &&
    lowerOverlap !== null &&
    upperOverlap !== null &&
    lowerOverlap <= upperOverlap;

  function recordMeasurement() {
    if (!closed) {
      const openCircuitVoltage = roundReading(reading.terminalVoltageV);
      setReferenceEmfV(openCircuitVoltage);
      setMeasurements([]);
      setMeasurementFeedback("Записано U₀ = " + formatReading(openCircuitVoltage) + " В. Теперь замкни цепь, выбери нагрузку и запиши U и I.");
      return;
    }

    if (referenceEmfV === null) {
      setMeasurementFeedback("Сначала разомкни цепь и запиши U₀.");
      return;
    }

    const currentA = roundReading(reading.currentA);
    const terminalVoltageV = roundReading(reading.terminalVoltageV);
    const resistance = estimateInternalResistanceFromReadings({
      emfV: referenceEmfV,
      terminalVoltageV,
      currentA,
      displayStep: DISPLAY_STEP,
    });

    if (!resistance) {
      setMeasurementFeedback("Эти отсчёты не дают положительной оценки r. Проверь, что ключ замкнут и показания сняты верно.");
      return;
    }

    const newMeasurement = { loadResistanceOhm, currentA, terminalVoltageV, resistance };
    setMeasurements(previous => [
      ...previous.filter(measurement => measurement.loadResistanceOhm !== loadResistanceOhm),
      newMeasurement,
    ].sort((left, right) => left.loadResistanceOhm - right.loadResistanceOhm));
    setMeasurementFeedback("Записано. Измени R и повтори измерение: оценки r должны быть близкими.");
  }

  function resetMeasurements() {
    setReferenceEmfV(null);
    setMeasurements([]);
    setMeasurementFeedback("Начни с разомкнутой цепи: запиши U₀ и оцени ЭДС источника.");
  }

  return (
    <section className={styles.notebook} aria-labelledby="full-circuit-notebook-title">
      <header className={styles.heading}>
        <p>Опыт с источником</p>
        <h2 id="full-circuit-notebook-title">Что покажут приборы до и после замыкания?</h2>
        <span>Сначала запиши напряжение U₀ при разомкнутой цепи. Затем меняй нагрузку и снимай показания амперметра и вольтметра.</span>
      </header>

      <div className={styles.workbench}>
        <div className={styles.diagramPanel}>
          <CircuitDiagram
            spec={{
              id: "full-circuit-measurement-notebook",
              topology: "source-internal",
              sourceLabel: "ε",
              internalResistanceLabel: "r",
              resistorLabels: ["R"],
              switch: { state: closed ? "closed" : "open", label: "K" },
              meters: [
                { kind: "ammeter", label: "A" },
                { kind: "voltmeter", label: "V", across: "source" },
              ],
              tone: "cyan",
            }}
            ariaLabel={`Схема полной цепи с источником ЭДС ε, внутренним сопротивлением и внешним резистором ${format(loadResistanceOhm)} ом. Ключ ${closed ? "замкнут" : "разомкнут"}; амперметр подключён последовательно, вольтметр — к клеммам источника.`}
          />
          <p>Амперметр включён последовательно, вольтметр подключён к клеммам источника. При замкнутом ключе он показывает напряжение на нагрузке.</p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            aria-pressed={closed}
            onClick={() => setClosed(value => !value)}
          >
            {closed ? "Разомкнуть ключ" : "Замкнуть ключ"}
          </button>
          <div className={styles.resistanceControl}>
            <label htmlFor="full-circuit-load-resistance">
              <span>Сопротивление нагрузки R</span>
              <output htmlFor="full-circuit-load-resistance">{format(loadResistanceOhm)} Ом</output>
            </label>
            <input
              id="full-circuit-load-resistance"
              type="range"
              min="2"
              max="12"
              step="1"
              value={loadResistanceOhm}
              onChange={event => setLoadResistanceOhm(Number(event.currentTarget.value))}
            />
            <div className={styles.rangeEnds} aria-hidden="true"><span>2 Ом</span><span>12 Ом</span></div>
          </div>
          <button
            className={styles.recordButton}
            type="button"
            disabled={!canRecord}
            onClick={recordMeasurement}
          >
            {recordLabel}
          </button>
        </div>
      </div>

      <dl className={styles.readings}>
        <div>
          <dt>Напряжение на клеммах U</dt>
          <dd><output>{formatReading(roundReading(reading.terminalVoltageV))} В</output></dd>
        </div>
        <div>
          <dt>Ток в цепи I</dt>
          <dd><output>{formatReading(roundReading(reading.currentA))} А</output></dd>
        </div>
      </dl>

      <p className={styles.observation} aria-live="polite">{stateSummary}</p>
      <p className={styles.measurementFeedback} aria-live="polite">{measurementFeedback}</p>

      {referenceEmfV !== null ? (
        <section className={styles.measurementJournal} aria-labelledby="full-circuit-journal-title">
          <div className={styles.journalHeading}>
            <h3 id="full-circuit-journal-title">Запись измерений</h3>
            <button className={styles.resetButton} type="button" onClick={resetMeasurements}>
              Начать заново
            </button>
          </div>

          <dl className={styles.referenceReading}>
            <div>
              <dt>Разомкнутая цепь · ε ≈ U₀</dt>
              <dd><output>{formatReading(referenceEmfV)} ± 0,05 В</output></dd>
            </div>
          </dl>

          {measurements.length > 0 ? (
            <>
              <ol className={styles.measurements}>
                {measurements.map(measurement => {
                  const power = referenceEmfV === null ? null : estimatePowerBalanceFromReadings({
                    emfV: referenceEmfV,
                    terminalVoltageV: measurement.terminalVoltageV,
                    currentA: measurement.currentA,
                  });

                  return (
                    <li key={measurement.loadResistanceOhm}>
                      <div>
                        <span>Нагрузка R</span>
                        <strong>{format(measurement.loadResistanceOhm)} Ом</strong>
                      </div>
                      <div>
                        <span>Ток I</span>
                        <strong>{formatReading(measurement.currentA)} А</strong>
                      </div>
                      <div>
                        <span>Напряжение U</span>
                        <strong>{formatReading(measurement.terminalVoltageV)} В</strong>
                      </div>
                      <div>
                        <span>Оценка r ≈ (U₀ − U) / I</span>
                        <strong>{formatReading(measurement.resistance.valueOhm)} Ом</strong>
                        <small>{formatInterval(measurement.resistance)}</small>
                      </div>
                      {power ? (
                        <dl className={styles.powerReadings}>
                          <div>
                            <dt>Нагрузка · P<sub>внеш</sub> = UI</dt>
                            <dd><output>{format(power.loadPowerW)} Вт</output></dd>
                          </div>
                          <div>
                            <dt>Источник · P<sub>ист</sub> ≈ U₀·I</dt>
                            <dd><output>{format(power.sourcePowerW)} Вт</output></dd>
                          </div>
                          <div>
                            <dt>КПД · η ≈ P<sub>внеш</sub> / P<sub>ист</sub></dt>
                            <dd><output>≈ {Math.round(power.efficiency * 100)}%</output></dd>
                          </div>
                        </dl>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <p className={styles.journalConclusion}>
                {measurements.length < 2
                  ? "Повтори измерение с другим R, чтобы проверить, сохраняется ли оценка r."
                  : estimatesAgree
                    ? "Интервалы оценок перекрываются: измерения согласуются с одной моделью источника."
                    : "Интервалы не перекрываются. Проверь соединения и точность отсчётов."}
              </p>
            </>
          ) : (
            <p className={styles.journalPrompt}>Теперь замкни ключ, выбери сопротивление нагрузки и запиши U и I.</p>
          )}

          <p className={styles.precisionNote}>
            Интервал учитывает только округление до 0,1 В и 0,1 А (±0,05); это не паспортная погрешность реального прибора.
          </p>
        </section>
      ) : null}

      <p className={styles.modelLimit}>Это идеализированная модель с округлёнными показаниями, а не запись реального лабораторного опыта.</p>
    </section>
  );
}
