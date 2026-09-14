"use client";

import { useState } from "react";
import styles from "./HeatTransferExplorer.module.css";

const OBSERVATIONS = [
  {
    id: "conduction",
    label: "Ложка в чае",
    title: "Ручка металлической ложки постепенно нагрелась",
    observation: "Ручка не касается горячего чая, но через некоторое время становится тёплой.",
    mechanism: "Теплопроводность",
    matter: "Нет. Вещество остаётся на месте, а энергия передаётся внутри него.",
    medium: "Да. Нужны взаимодействующие частицы вещества.",
    reason: "Энергия переходит от горячего конца ложки к более холодному. Переноса самой ложки или металла вдоль ручки нет.",
  },
  {
    id: "convection",
    label: "Вода в чайнике",
    title: "Нагретые нижние слои воды поднимаются",
    observation: "Нагреватель находится внизу, но со временем прогревается весь объём воды.",
    mechanism: "Конвекция",
    matter: "Да. Вместе с энергией перемещаются слои жидкости или газа.",
    medium: "Да. Конвекция происходит в жидкостях и газах, но не в твёрдых телах.",
    reason: "Более тёплые слои воды поднимаются, а более холодные опускаются. Эти потоки переносят энергию по объёму.",
  },
  {
    id: "radiation",
    label: "Солнце и Земля",
    title: "Земля получает энергию через почти пустое пространство",
    observation: "Между Солнцем и Землёй нет сплошного слоя вещества, который мог бы течь или проводить теплоту.",
    mechanism: "Излучение",
    matter: "Нет. Для переноса энергии не требуется движение вещества от источника к приёмнику.",
    medium: "Нет. Излучение может передавать энергию через вакуум.",
    reason: "Это единственный из трёх способов теплообмена, которому не нужна материальная среда между телами.",
  },
] as const;

type ObservationId = (typeof OBSERVATIONS)[number]["id"];

export function HeatTransferExplorer() {
  const [observationId, setObservationId] = useState<ObservationId>("conduction");
  const observation = OBSERVATIONS.find((item) => item.id === observationId) ?? OBSERVATIONS[0];

  return (
    <section className={styles.explorer} aria-labelledby="heat-transfer-title">
      <header>
        <p>Три наблюдения · три механизма</p>
        <h2 id="heat-transfer-title">Как энергия добралась до холодного тела?</h2>
        <span>Выбери наблюдение и сравни признаки, а не только название.</span>
      </header>

      <div className={styles.choices} role="group" aria-label="Наблюдение для сравнения">
        {OBSERVATIONS.map((item) => (
          <button key={item.id} type="button" aria-pressed={item.id === observationId} onClick={() => setObservationId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <article className={styles.reading} aria-live="polite">
        <div className={styles.observation}>
          <p>Наблюдение</p>
          <h3>{observation.title}</h3>
          <span>{observation.observation}</span>
        </div>

        <div className={styles.verdict}>
          <span>Механизм</span>
          <strong>{observation.mechanism}</strong>
        </div>

        <dl>
          <div>
            <dt>Переносится ли вещество?</dt>
            <dd>{observation.matter}</dd>
          </div>
          <div>
            <dt>Нужна ли среда?</dt>
            <dd>{observation.medium}</dd>
          </div>
          <div>
            <dt>Куда идёт энергия?</dt>
            <dd>От более нагретого тела или участка к менее нагретому.</dd>
          </div>
        </dl>

        <p className={styles.reason}>{observation.reason}</p>
      </article>
    </section>
  );
}
