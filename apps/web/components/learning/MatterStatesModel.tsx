"use client";

import Image from "next/image";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./MatterStatesModel.module.css";

const stages = [
  { id: "states", label: "Три состояния" },
  { id: "expansion", label: "Нагревание" },
  { id: "temperature", label: "Измерение" },
] as const;

type ExpansionState = "cold" | "hot" | "cooled";

const initial = {
  stage: 0,
  vaporAnswer: "",
  expansionState: "cold",
  thermometerAnswer: "",
  summaryText: "",
  summarySaved: false,
};

const vaporOptions = [
  {
    id: "cloud",
    label: "Белое облако и есть газообразная вода",
    feedback:
      "Нет. Видимое облако образуют очень мелкие капли воды или кристаллики льда. Водяной пар невидим.",
    correct: false,
  },
  {
    id: "invisible",
    label: "Сам водяной пар невидим, а на фото видны капли или кристаллики",
    feedback:
      "Верно. Газ нельзя распознать по белому цвету облака: белым свет рассеивают капли и кристаллики.",
    correct: true,
  },
  {
    id: "empty",
    label: "Раз газа не видно, над облаками нет вещества",
    feedback:
      "Нет. Невидимость не означает отсутствие вещества. Воздух и водяной пар занимают объём, хотя их обычно не видно.",
    correct: false,
  },
] as const;

const expansionReadings: Record<ExpansionState, { label: string; result: string; explanation: string }> = {
  cold: {
    label: "До нагревания",
    result: "Шар проходит через кольцо",
    explanation: "Диаметр холодного шара немного меньше внутреннего диаметра кольца.",
  },
  hot: {
    label: "Шар нагрели",
    result: "Шар больше не проходит",
    explanation: "Металл расширился: диаметр шара увеличился. Кольцо при этом не нагревали.",
  },
  cooled: {
    label: "Шар остыл",
    result: "Шар снова проходит",
    explanation: "При охлаждении размеры шара уменьшились до исходных.",
  },
};

const thermometerOptions = [
  { id: "five", label: "5 °C", correct: false },
  { id: "fifteen", label: "15 °C", correct: true },
  { id: "twenty-five", label: "25 °C", correct: false },
] as const;

export function MatterStatesModel() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(
    "textbook-matter-states",
    state,
    setState,
    stages.length,
    "lesson",
    { saveInitial: false },
  );
  const stage = stages[state.stage]?.id ?? "states";

  const selectedVapor = vaporOptions.find((option) => option.id === state.vaporAnswer);
  const selectedThermometer = thermometerOptions.find((option) => option.id === state.thermometerAnswer);
  const expansionState = state.expansionState as ExpansionState;
  const expansion = expansionReadings[expansionState] ?? expansionReadings.cold;

  if (!draft.ready) {
    return <div className={styles.model}><p className={styles.loading}>Открываю исследование…</p></div>;
  }

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Свойство → изменение → измерение</p>
        <h2>Одно вещество. Разное поведение</h2>
        <p>
          Сравни состояние воды, проверь нагретый металл и только потом свяжи
          расширение с показанием термометра.
        </p>
      </header>

      <div className={styles.stageTabs} role="group" aria-label="Этап исследования состояния вещества">
        {stages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={stage === item.id}
            onClick={() => setState((current) => ({ ...current, stage: index }))}
          >
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>

      {stage === "states" && (
        <section className={styles.statesStage} aria-labelledby="matter-states-title">
          <div className={styles.photoStrip} aria-label="Лёд, капля воды и облака">
            <figure className={styles.statePhoto}>
              <Image
                src="/images/evidence/matter-ice.jpg"
                alt="Ледяная скульптура"
                fill
                sizes="(max-width: 700px) 100vw, 240px"
                priority
              />
              <figcaption><strong>Твёрдое</strong><span>сохраняет форму и объём</span></figcaption>
            </figure>
            <figure className={styles.statePhoto}>
              <Image
                src="/images/evidence/matter-liquid-water.jpg"
                alt="Капля жидкой воды над поверхностью"
                fill
                sizes="(max-width: 700px) 100vw, 240px"
                priority
              />
              <figcaption><strong>Жидкое</strong><span>сохраняет объём, принимает форму сосуда</span></figcaption>
            </figure>
            <figure className={styles.statePhoto}>
              <Image
                src="/images/evidence/matter-clouds.jpg"
                alt="Облака, состоящие из капель воды и кристалликов льда"
                fill
                sizes="(max-width: 700px) 100vw, 240px"
                priority
              />
              <figcaption><strong>Ловушка</strong><span>облако не является видимым водяным паром</span></figcaption>
            </figure>
          </div>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Проверь фотографию</p>
            <h3 id="matter-states-title">Что верно о третьем кадре?</h3>
            <div className={styles.options}>
              {vaporOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={state.vaporAnswer === option.id}
                  onClick={() => setState((current) => ({ ...current, vaporAnswer: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {selectedVapor && (
              <p className={selectedVapor.correct ? styles.correct : styles.correction} role="status">
                {selectedVapor.feedback}
              </p>
            )}
            <a
              href="https://commons.wikimedia.org/wiki/File:Ice_water_vapor.jpg"
              target="_blank"
              rel="noreferrer"
              className={styles.credit}
            >
              Фотоколлаж: StarLight и авторы исходных снимков · CC BY-SA 3.0
            </a>
          </div>
        </section>
      )}

      {stage === "expansion" && (
        <section className={styles.expansionStage} aria-labelledby="matter-expansion-title">
          <figure className={styles.apparatusFigure}>
            <div className={styles.engraving}>
              <Image
                src="/images/evidence/gravesande-ring-ball.png"
                alt="Исторический лабораторный прибор: металлический шар на цепочке и кольцо"
                width={262}
                height={387}
                priority
              />
            </div>
            <figcaption>
              Прибор «шар и кольцо» из каталога 1912 года.
              <a href="https://commons.wikimedia.org/wiki/File:Gravesande%27s_ring_and_ball.png" target="_blank" rel="noreferrer">
                Baird &amp; Tatlock · public domain
              </a>
            </figcaption>
          </figure>

          <div className={styles.expansionPanel}>
            <p className={styles.stepLabel}>Один шар, три момента</p>
            <h3 id="matter-expansion-title">Что изменилось при нагревании?</h3>
            <p className={styles.expansionPrompt}>
              Кольцо остаётся при комнатной температуре. Меняй только состояние шара.
            </p>
            <div className={styles.sequenceControls} role="group" aria-label="Состояние металлического шара">
              {(Object.keys(expansionReadings) as ExpansionState[]).map((state, index) => (
                <button
                  key={state}
                  type="button"
                  aria-pressed={expansionState === state}
                  onClick={() => setState((current) => ({ ...current, expansionState: state }))}
                >
                  <span>{index + 1}</span>{expansionReadings[state].label}
                </button>
              ))}
            </div>
            <div className={styles.expansionResult} data-state={expansionState} aria-live="polite">
              <span>{expansion.label}</span>
              <strong>{expansion.result}</strong>
              <p>{expansion.explanation}</p>
            </div>
            <p className={styles.boundary}>
              Нагревание не «добавляет металла». Увеличиваются размеры тела. Если
              нагреть само кольцо, его внутреннее отверстие тоже расширится.
            </p>
          </div>
        </section>
      )}

      {stage === "temperature" && (
        <section className={styles.temperatureStage} aria-labelledby="matter-temperature-title">
          <figure className={styles.thermometerFigure}>
            <Image
              src="/images/evidence/celsius-kelvin-thermometer.jpg"
              alt="Жидкостный термометр с красным столбиком и шкалами Цельсия и Кельвина"
              fill
              sizes="(max-width: 700px) 100vw, 430px"
              priority
            />
            <figcaption>
              Левая шкала — градусы Цельсия. Правая шкала Кельвина понадобится позже.
              <a href="https://commons.wikimedia.org/wiki/File:CelsiusKelvinThermometer.jpg" target="_blank" rel="noreferrer">
                Martinvl · CC BY-SA 3.0
              </a>
            </figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Сначала прочитай шкалу</p>
            <h3 id="matter-temperature-title">Какое показание на шкале Цельсия?</h3>
            <p className={styles.thermometerHint}>
              Между 10 °C и 20 °C — десять равных промежутков. Верх столбика находится посередине.
            </p>
            <div className={styles.answerRow}>
              {thermometerOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={state.thermometerAnswer === option.id}
                  onClick={() => setState((current) => ({ ...current, thermometerAnswer: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {selectedThermometer && (
              <div className={selectedThermometer.correct ? styles.correct : styles.correction} role="status">
                {selectedThermometer.correct
                  ? "Верно: цена деления 1 °C, показание — 15 °C. Температуру получили по прибору, а не по ощущению руки."
                  : "Сначала найди цену деления: (20 − 10) °C разделены на десять промежутков. Затем отсчитай уровень столбика."}
              </div>
            )}
            <div className={styles.causeChain}>
              <span>Температура меняется</span>
              <span>Жидкость расширяется</span>
              <span>Столбик движется по шкале</span>
            </div>
          </div>
        </section>
      )}
      {draft.error && <p className={styles.storageError} role="alert">{draft.error}</p>}
    </div>
  );
}
