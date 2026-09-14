"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./ForceModel.module.css";

const answers = [
  { id: "mass", label: "Массу груза в килограммах" },
  { id: "force", label: "Силу действия груза на пружину в ньютонах" },
  { id: "length", label: "Длину растянутой пружины в сантиметрах" },
] as const;

type AnswerId = (typeof answers)[number]["id"];

export function ForceModel() {
  const [answer, setAnswer] = useState<AnswerId | null>(null);
  const correct = answer === "force";

  return (
    <div className={shared.experiment}>
      <div className={styles.study}>
        <figure className={styles.closeup}>
          <Image
            className={styles.closeupImage}
            src={MIO_SCENES.force}
            alt="Пружинный динамометр на штативе: груз растянул пружину, указатель сместился вдоль шкалы"
            fill
            sizes="(max-width: 640px) 100vw, 310px"
          />
          <figcaption>Мио сверяет указатель: груз остановился, а пружина остаётся растянутой.</figcaption>
        </figure>

        <div className={styles.question}>
          <p className={styles.kicker}>Сначала наблюдение</p>
          <h2>Что показывает этот прибор?</h2>
          <p>
            Выбери величину вместе с её единицей. Неподвижность груза не означает,
            что он перестал действовать на пружину.
          </p>
          <div className={styles.answers} role="group" aria-label="Что измеряет динамометр">
            {answers.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={answer === option.id}
                onClick={() => setAnswer(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {answer ? (
        <div className={styles.feedback} role="status">
          <strong>{correct ? "Да: динамометр измеряет силу." : "Посмотри на единицу шкалы."}</strong>
          <p>
            {correct
              ? "Груз действует на пружину и деформирует её. Положение указателя сравнивают с заранее проградуированной шкалой в ньютонах."
              : "Килограмм — единица массы, сантиметр — единица длины. Шкала динамометра подписана в ньютонах: она показывает силу."}
          </p>
        </div>
      ) : null}

      <details className={styles.calibration}>
        <summary>Как пружина получила шкалу в ньютонах?</summary>
        <div className={styles.calibrationBody}>
          <p>
            На Земле тело массой 102 г притягивается с силой примерно 1 Н. Если
            подвешивать такие гири по одной и отмечать положения указателя,
            получится шкала силы.
          </p>
          <dl aria-label="Пример градуировки школьного динамометра">
            <div>
              <dt>Нагрузка снята</dt>
              <dd>0 Н</dd>
            </div>
            <div>
              <dt>Одна гиря · 102 г</dt>
              <dd>≈ 1 Н</dd>
            </div>
            <div>
              <dt>Две гири · 204 г</dt>
              <dd>≈ 2 Н</dd>
            </div>
          </dl>
          <p className={styles.boundary}>
            Это градуировка для условий у поверхности Земли. Масса гирь остаётся
            в граммах, а показание прибора записывают в ньютонах.
          </p>
        </div>
      </details>
    </div>
  );
}
