"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import styles from "./PressureModel.module.css";

type ExplanationId = "area" | "force";

const initialDraft = { explanation: "" as ExplanationId | "" };

const answerOptions: { id: ExplanationId; label: string }[] = [
  { id: "force", label: "Брусок справа давит с большей силой" },
  { id: "area", label: "Та же сила приходится на меньшую площадь" },
];

const answerFeedback: Record<ExplanationId, string> = {
  force: "Оба бруска давят с силой 40 Н. Сила не изменилась. Сравни грани, которые касаются губок.",
  area: "Да. Та же сила приходится на меньшую площадь, поэтому давление больше.",
};

/** Наблюдение параграфа о давлении: сцена и объяснение разного смятия губок.
 *  Расчёт и остальная теория — разделы параграфа ниже, а не часть этого блока. */
export function PressureModel() {
  const [state, setState] = useState(initialDraft);
  const [helpOpen, setHelpOpen] = useState(false);
  const draft = useLessonDraft(
    "textbook-pressure",
    state,
    setState,
    1,
    "lesson",
    { saveInitial: false },
  );

  if (!draft.ready) {
    return <p role="status">Открываю урок…</p>;
  }

  // В старых черновиках мог остаться ответ «время» — такого варианта больше нет.
  // Считаем это «ответа нет», не сбрасывая остальные сохранённые данные.
  const explanation =
    state.explanation === "area" || state.explanation === "force" ? state.explanation : null;
  const solved = explanation === "area";

  const chooseAnswer = (value: ExplanationId) => {
    setHelpOpen(false);
    setState({ explanation: value });
  };

  const optionState = (id: ExplanationId) => {
    if (id !== explanation) return "idle";
    return explanation === "area" ? "correct" : "wrong";
  };

  return (
    <div className={styles.model}>
      <section className={styles.spread} aria-label="Наблюдение с Мио и опытом о давлении">
        <figure className={styles.scene}>
          <div className={styles.sceneFrame}>
            <Image
              className={styles.sceneImage}
              src={MIO_SCENES.pressure}
              alt="Мио поставила два одинаковых бруска на одинаковые губки: слева брусок лежит на широкой грани, справа стоит на узкой"
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              priority
            />
          </div>
          <div className={styles.sceneLabels}>
            <span className={styles.sceneLabelWide}>Широкая грань · 40 см²</span>
            <span className={styles.sceneLabelNarrow}>Узкая грань · 20 см²</span>
          </div>
          <figcaption className={styles.sceneCaption}>
            Это площади граней, которыми бруски касаются губок. Каждый брусок давит с силой 40 Н.
          </figcaption>
        </figure>

        <header className={styles.head}>
          <h2 className={styles.title}>
            Почему один брусок <span className={styles.titleAccent}>сильнее сминает губку?</span>
          </h2>
          <p className={styles.lead}>Бруски одинаковые и давят с одной силой. Губки тоже одинаковые.</p>
        </header>

        <div className={styles.body}>
          <section className={`lesson-card ${styles.questionCard}`} aria-label="Твой ответ">
            <div className={styles.choices} role="group" aria-label="Выбери объяснение">
              {answerOptions.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  data-state={optionState(option.id)}
                  aria-pressed={explanation === option.id}
                  onClick={() => chooseAnswer(option.id)}
                >
                  <span className={styles.choiceLetter} aria-hidden="true">
                    {index === 0 ? "А" : "Б"}
                  </span>
                  <span className={styles.choiceText}>{option.label}</span>
                </button>
              ))}
            </div>
            {!solved ? (
              <button
                type="button"
                className={`lesson-button-secondary ${styles.helpButton}`}
                aria-expanded={helpOpen}
                onClick={() => setHelpOpen((open) => !open)}
              >
                Пока не понимаю
              </button>
            ) : null}
            {helpOpen && !solved ? (
              <p className={`lesson-note ${styles.helpNote}`} role="note">
                Посмотри, какой частью брусок касается губки. Справа эта площадка меньше, хотя сила та же.
              </p>
            ) : null}
            {explanation ? (
              <p
                className={explanation === "area" ? styles.feedbackCorrect : styles.feedbackRetry}
                role="status"
                data-testid="pressure-explanation-feedback"
              >
                {answerFeedback[explanation]}
              </p>
            ) : null}
            {solved ? (
              <p className={styles.nextStep}>
                Дальше — разделы параграфа: как давление связано с силой и площадью.
              </p>
            ) : null}
          </section>

          <aside className={styles.lenses} aria-label="Крупные планы контакта брусков с губками">
            <figure className={styles.lens}>
              <Image
                src={MIO_SCENES.pressureLensWide}
                alt="Крупный план: брусок на широкой грани, губка сминается слабо"
                width={496}
                height={444}
                sizes="(max-width: 560px) 44vw, 220px"
              />
              <figcaption>
                <b>Широкая грань · 40 см²</b>
                <span>Губка сминается слабо</span>
              </figcaption>
            </figure>
            <figure className={styles.lens}>
              <Image
                src={MIO_SCENES.pressureLensNarrow}
                alt="Крупный план: брусок на узкой грани, губка сминается сильнее"
                width={496}
                height={444}
                sizes="(max-width: 560px) 44vw, 220px"
              />
              <figcaption>
                <b>Узкая грань · 20 см²</b>
                <span>Губка сминается сильнее</span>
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>

      {draft.error ? (
        <p role="alert" className={styles.storageError}>
          {draft.error}
        </p>
      ) : null}
    </div>
  );
}
