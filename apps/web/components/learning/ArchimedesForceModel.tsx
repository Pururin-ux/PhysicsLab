"use client";

import Image from "next/image";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./ArchimedesForceModel.module.css";

const stages = [
  { id: "observe", label: "Сравнить жидкости" },
  { id: "measure", label: "Измерить силу" },
] as const;

const liquids = [
  { id: "water", label: "Вода", density: 1000 },
  { id: "salt", label: "Солёная вода", density: 1200 },
] as const;

const volumes = [200, 400] as const;

const initial = {
  stage: 0,
  observationAnswer: "",
  liquid: "water",
  volume: 400,
  forceAnswer: "",
  summaryText: "",
  summarySaved: false,
};

function formatForce(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",");
}

export function ArchimedesForceModel() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(
    "textbook-archimedes-force",
    state,
    setState,
    stages.length,
    "lesson",
    { saveInitial: false },
  );
  const stage = stages[state.stage]?.id ?? "observe";
  const liquid = liquids.find((item) => item.id === state.liquid) ?? liquids[0];
  const immersedVolumeM3 = state.volume * 0.000001;
  const force = liquid.density * 10 * immersedVolumeM3;
  const forceOptions = [
    { id: "correct", value: force },
    { id: "half", value: force / 2 },
    { id: "more", value: force * 1.5 },
  ];

  if (!draft.ready) {
    return <div className={styles.model}><p className={styles.loading}>Готовлю опыт…</p></div>;
  }

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Сила, которой не видно</p>
        <h2>Почему вода уменьшает показание?</h2>
        <p>
          Сначала сравни поведение тела в жидкостях. Затем вычисли, насколько
          изменится показание динамометра при полном погружении.
        </p>
      </header>

      <div className={styles.stageTabs} role="group" aria-label="Этап опыта с выталкивающей силой">
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

      {stage === "observe" ? (
        <section className={styles.stage} aria-labelledby="archimedes-observation-question">
          <figure className={styles.figure}>
            <Image
              src="/images/evidence/archimedes-floating-bodies.jpg"
              alt="Три яйца в прозрачных сосудах: одно у дна, одно внутри жидкости и одно у поверхности"
              fill
              sizes="(max-width: 720px) 100vw, 48vw"
              priority
            />
            <figcaption>
              Тела в жидкостях разной плотности. Фото задаёт наблюдение, но не сообщает концентрации растворов.
              <a href="https://commons.wikimedia.org/wiki/File:Principio_di_Archimede.jpg" target="_blank" rel="noreferrer">
                ProfValeria · CC0
              </a>
            </figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Одинаковое тело · разные растворы</p>
            <h3 id="archimedes-observation-question">Что нужно изменить, чтобы тело поднялось выше?</h3>
            <div className={styles.options}>
              <button type="button" aria-pressed={state.observationAnswer === "density"} onClick={() => setState((current) => ({ ...current, observationAnswer: "density" }))}>Увеличить плотность жидкости</button>
              <button type="button" aria-pressed={state.observationAnswer === "mass"} onClick={() => setState((current) => ({ ...current, observationAnswer: "mass" }))}>Увеличить массу того же тела</button>
              <button type="button" aria-pressed={state.observationAnswer === "gravity"} onClick={() => setState((current) => ({ ...current, observationAnswer: "gravity" }))}>Усилить действие силы тяжести</button>
            </div>
            {state.observationAnswer ? (
              <>
                <p className={state.observationAnswer === "density" ? styles.correct : styles.correction} role="status">
                  {state.observationAnswer === "density"
                    ? "Верно. При том же погружённом объёме более плотная жидкость создаёт большую выталкивающую силу."
                    : "Тело в сравнении не меняем. Добавление соли увеличивает плотность жидкости и выталкивающую силу."}
                </p>
                <div className={styles.reading} aria-label="Условия положения тела в жидкости">
                  <p><span>Плотность тела больше</span><strong>тело тонет</strong></p>
                  <p><span>Плотности равны</span><strong>равновесие внутри</strong></p>
                  <p><span>Плотность тела меньше</span><strong>тело всплывает</strong></p>
                </div>
              </>
            ) : null}
          </div>
        </section>
      ) : (
        <section className={styles.stage} aria-labelledby="archimedes-force-question">
          <figure className={`${styles.figure} ${styles.scaleFigure}`}>
            <Image
              src="/images/evidence/archimedes-spring-scale.jpg"
              alt="Пружинный измеритель силы с верхним и нижним крючками"
              fill
              sizes="(max-width: 720px) 100vw, 48vw"
              priority
            />
            <figcaption>
              Пружинный прибор измеряет силу. Его фотография не является шкалой расчётного опыта.
              <a href="https://commons.wikimedia.org/wiki/File:Spring_weighing_scale.jpg" target="_blank" rel="noreferrer">
                NASA · public domain
              </a>
            </figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Тело полностью погружено и не касается дна</p>
            <div className={styles.controls}>
              <div role="group" aria-label="Жидкость">
                {liquids.map((item) => (
                  <button key={item.id} type="button" aria-pressed={state.liquid === item.id} onClick={() => setState((current) => ({ ...current, liquid: item.id, forceAnswer: "" }))}>{item.label}</button>
                ))}
              </div>
              <div role="group" aria-label="Погружённый объём">
                {volumes.map((volume) => (
                  <button key={volume} type="button" aria-pressed={state.volume === volume} onClick={() => setState((current) => ({ ...current, volume, forceAnswer: "" }))}>{volume} см³</button>
                ))}
              </div>
            </div>
            <h3 id="archimedes-force-question">На сколько ньютонов уменьшится показание динамометра?</h3>
            <div className={styles.options}>
              {forceOptions.map((option) => (
                <button key={option.id} type="button" aria-pressed={state.forceAnswer === option.id} onClick={() => setState((current) => ({ ...current, forceAnswer: option.id }))}>{formatForce(option.value)} Н</button>
              ))}
            </div>
            {state.forceAnswer ? (
              <>
                <p className={state.forceAnswer === "correct" ? styles.correct : styles.correction} role="status">
                  {state.forceAnswer === "correct"
                    ? "Верно. Показание уменьшается на величину силы Архимеда."
                    : "Проверь перевод объёма в кубические метры и умножь плотность жидкости на g и погружённый объём."}
                </p>
                <div className={styles.calculation} aria-label="Расчёт силы Архимеда">
                  <p><span>Плотность</span><strong>{liquid.density} кг/м³</strong></p>
                  <p><span>Погружённый объём</span><strong>{state.volume} см³ = {immersedVolumeM3.toFixed(4).replace(".", ",")} м³</strong></p>
                  <p><span>Сила Архимеда</span><strong>{liquid.density} · 10 · {immersedVolumeM3.toFixed(4).replace(".", ",")} = {formatForce(force)} Н</strong></p>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}

      {draft.error ? <p className={styles.storageError} role="alert">{draft.error}</p> : null}
    </div>
  );
}
