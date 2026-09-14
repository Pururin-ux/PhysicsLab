"use client";

import Image from "next/image";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./GasPressurePascalModel.module.css";

const stages = [
  { id: "gas", label: "Сжать воздух" },
  { id: "pascal", label: "Передать давление" },
] as const;

const initial = {
  stage: 0,
  gasAnswer: "",
  pascalAnswer: "",
  summaryText: "",
  summarySaved: false,
};

const gasOptions = [
  {
    id: "pressure-up",
    label: "Объём уменьшается, давление растёт",
    feedback:
      "Верно. При той же температуре частицы оказываются в меньшем объёме и чаще сталкиваются со стенками.",
    correct: true,
  },
  {
    id: "pressure-down",
    label: "Объём уменьшается, давление падает",
    feedback:
      "Проверь ощущение руки: чем дальше вдвигается поршень при закрытом выходе, тем сильнее воздух мешает движению.",
    correct: false,
  },
  {
    id: "unchanged",
    label: "Меняется только форма насоса",
    feedback:
      "Воздух заперт внутри. Поршень уменьшает доступный ему объём, поэтому состояние газа меняется.",
    correct: false,
  },
] as const;

const pascalOptions = [
  {
    id: "same",
    label: "40 кПа",
    feedback:
      "Верно. Добавочное давление передаётся жидкостью без изменения. Сила на большом поршне может быть больше из-за большей площади.",
    correct: true,
  },
  {
    id: "less",
    label: "Меньше 40 кПа",
    feedback:
      "В идеальной школьной модели теряется не часть давления: во всех точках передаётся одно и то же добавочное давление.",
    correct: false,
  },
  {
    id: "more",
    label: "Больше 40 кПа",
    feedback:
      "Домкрат увеличивает силу благодаря площади большого поршня. Само добавочное давление не увеличивается.",
    correct: false,
  },
] as const;

export function GasPressurePascalModel() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(
    "textbook-gas-pressure-pascal",
    state,
    setState,
    stages.length,
    "lesson",
    { saveInitial: false },
  );
  const stage = stages[state.stage]?.id ?? "gas";
  const gasAnswer = gasOptions.find((option) => option.id === state.gasAnswer);
  const pascalAnswer = pascalOptions.find((option) => option.id === state.pascalAnswer);

  if (!draft.ready) {
    return <div className={styles.model}><p className={styles.loading}>Открываю опыт…</p></div>;
  }

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Два прибора · одна идея давления</p>
        <h2>Что передаёт толчок поршня?</h2>
        <p>
          Сначала запри воздух в насосе. Затем проследи, что именно передаёт
          жидкость внутри гидравлического домкрата.
        </p>
      </header>

      <div className={styles.stageTabs} role="group" aria-label="Этап опыта с давлением">
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

      {stage === "gas" ? (
        <section className={styles.stage} aria-labelledby="gas-pressure-question">
          <figure className={styles.figure}>
            <Image
              src="/images/evidence/gas-pressure-bicycle-pump.jpg"
              alt="Ручной велосипедный насос с выдвинутым поршнем"
              fill
              sizes="(max-width: 720px) 100vw, 48vw"
              priority
            />
            <figcaption>
              Ручной поршневой насос.
              <a href="https://commons.wikimedia.org/wiki/File:Bicycle_pump_Luftpumpe.jpg" target="_blank" rel="noreferrer">
                Hedwig von Ebbel · public domain
              </a>
            </figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Выход закрыт пальцем</p>
            <h3 id="gas-pressure-question">Что меняется, когда поршень медленно вдвигают?</h3>
            <p className={styles.condition}>
              Воздух не выходит. Для сравнения считаем, что его температура успевает остаться прежней.
            </p>
            <div className={styles.options}>
              {gasOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={state.gasAnswer === option.id}
                  onClick={() => setState((current) => ({ ...current, gasAnswer: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {gasAnswer ? (
              <>
                <p className={gasAnswer.correct ? styles.correct : styles.correction} role="status">
                  {gasAnswer.feedback}
                </p>
                <div className={styles.reading} aria-label="Связь объёма и давления при сжатии газа">
                  <p><span>Объём газа</span><strong>уменьшается</strong></p>
                  <p><span>Удары о стенки</span><strong>становятся чаще</strong></p>
                  <p><span>Давление</span><strong>увеличивается</strong></p>
                </div>
              </>
            ) : null}
          </div>
        </section>
      ) : (
        <section className={styles.stage} aria-labelledby="pascal-pressure-question">
          <figure className={`${styles.figure} ${styles.jackFigure}`}>
            <Image
              src="/images/evidence/pascal-hydraulic-jack.jpg"
              alt="Красный гидравлический домкрат с рычагом малого поршня"
              fill
              sizes="(max-width: 720px) 100vw, 48vw"
              priority
            />
            <figcaption>
              Гидравлический бутылочный домкрат.
              <a href="https://commons.wikimedia.org/wiki/File:Cric_005.jpg" target="_blank" rel="noreferrer">
                Tiesse · public domain
              </a>
            </figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Закон Паскаля</p>
            <h3 id="pascal-pressure-question">К жидкости у малого поршня добавили 40 кПа. Сколько дойдёт до большого?</h3>
            <div className={styles.options}>
              {pascalOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={state.pascalAnswer === option.id}
                  onClick={() => setState((current) => ({ ...current, pascalAnswer: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {pascalAnswer ? (
              <>
                <p className={pascalAnswer.correct ? styles.correct : styles.correction} role="status">
                  {pascalAnswer.feedback}
                </p>
                <div className={styles.transfer} aria-label="Передача добавочного давления жидкостью">
                  <p><span>Малый поршень</span><strong>+40 кПа</strong></p>
                  <b aria-hidden="true">→</b>
                  <p><span>Жидкость</span><strong>во все точки</strong></p>
                  <b aria-hidden="true">→</b>
                  <p><span>Большой поршень</span><strong>+40 кПа</strong></p>
                </div>
                <p className={styles.boundary}>
                  Закон говорит о передаче давления. В гидравлическом устройстве
                  большая площадь даёт большую силу: <span>F = pS</span>.
                </p>
              </>
            ) : null}
          </div>
        </section>
      )}

      {draft.error ? <p className={styles.storageError} role="alert">{draft.error}</p> : null}
    </div>
  );
}
