"use client";

import { useState } from "react";
import {
  motionRecords,
  summarizeMotionRecord,
  type MotionRecordId,
} from "../../lib/physics/uniform-motion-record";
import styles from "./UniformMotionObservation.module.css";

const runLabels: Record<MotionRecordId, string> = {
  steady: "Пробег А",
  changing: "Пробег Б",
};

export function UniformMotionObservation() {
  const [selectedId, setSelectedId] = useState<MotionRecordId>("steady");
  const record = motionRecords.find((item) => item.id === selectedId) ?? motionRecords[0];
  const summary = summarizeMotionRecord(record);

  return (
    <article className={styles.notebook} aria-labelledby="uniform-observation-title">
      <header className={styles.heading}>
        <span>Запись опыта</span>
        <h2 id="uniform-observation-title">Один путь — разное движение?</h2>
        <p>В обоих модельных пробегах тележка едет прямо вперёд, не возвращаясь. Мио отмечает её положение каждую секунду.</p>
      </header>

      <div className={styles.choices} role="group" aria-label="Выбрать пробег тележки">
        {motionRecords.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selectedId}
            onClick={() => setSelectedId(item.id)}
          >
            {runLabels[item.id]}
          </button>
        ))}
      </div>

      <div className={styles.record} aria-label={`${runLabels[record.id]}: положения тележки от нуля до трёх секунд`}>
        <div className={styles.track} aria-hidden="true">
          <div className={styles.scale}>
            {record.positionsM.map((position, index) => (
              <div
                key={index}
                className={`${styles.mark} ${index === 0 ? styles.firstMark : ""} ${index === record.positionsM.length - 1 ? styles.lastMark : ""}`}
                style={{ left: `${(position / summary.totalPathM) * 100}%` }}
              >
                <span className={styles.time}>{index} с</span>
                <span className={styles.position}>{position} м</span>
              </div>
            ))}
          </div>
          <div className={styles.intervals}>
            {summary.intervalsM.map((distance, index) => (
              <div key={index} className={styles.interval} style={{ flexGrow: distance }}>
                <span>{distance} м</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.screenReaderTable}>
          <table>
            <caption>Отметки положения тележки — {runLabels[record.id]}, через каждую секунду</caption>
            <thead><tr><th scope="col">Время, с</th><th scope="col">Положение, м</th></tr></thead>
            <tbody>
              {record.positionsM.map((position, index) => (
                <tr key={index}><th scope="row">{index}</th><td>{position}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.readout}>
        <p><span>Весь путь и время</span><strong>{summary.totalPathM} м за {summary.totalTimeS} с</strong></p>
        <p><span>Средняя скорость</span><strong>{summary.meanSpeedMPerS} м/с</strong></p>
      </div>
      <details className={styles.verdict}>
        <summary>Сверить вывод</summary>
        <p className={styles.conclusion}>
          {summary.equalSampledIntervals
            ? "За каждую отмеченную секунду — по 3 м. В этой записи пути за равные времена совпадают."
            : "За равные секунды пройдено 2, 3 и 4 м. Средняя скорость та же, но пути за равные времена различаются."}
        </p>
      </details>
      <p className={styles.boundary}>Скорость внутри каждой секунды не измерена. Даже равные пути между отметками не доказывают, что она была постоянной в каждый момент.</p>
    </article>
  );
}
