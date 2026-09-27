"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./BohrTransitionNotebook.module.css";

export function LaserNotebook() {
  const [answer, setAnswer] = useState<"stimulated" | "mirror" | "pump-frequency" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const groupId = useId();
  const correct = answer === "stimulated";

  return (
    <section className={styles.notebook}>
      <figure className={styles.scene}>
        <Image
          src="/images/mio/textbook-laser-v2.webp"
          alt="Мио записывает наблюдение у закрытой лазерной установки и следит за выходным лучом через защитные очки."
          width={1440}
          height={960}
          sizes="(max-width: 760px) 100vw, 23rem"
          loading="eager"
        />
        <figcaption>
          Сцена задаёт контекст; объяснение и проверка описывают физический процесс.
        </figcaption>
      </figure>

      <div className={styles.workspace}>
        <div className={styles.note}>
          <p className={styles.eyebrow}>Запись наблюдения</p>
          <p>Мио спрашивает: «Зеркала возвращают свет, а что добавляет ему энергию?»</p>
        </div>

        <div className={styles.interaction}>
          <h2>Проверь механизм усиления</h2>
          {!revealed ? (
            <>
              <fieldset className={styles.prediction}>
                <legend>Возбуждённый атом встречает фотон подходящей энергии. Что может произойти?</legend>
                {([
                  ["stimulated", "Атом испустит второй фотон, согласованный с первым."],
                  ["mirror", "Энергию фотону передаст зеркало резонатора."],
                  ["pump-frequency", "Накачка изменит частоту уже летящего фотона."],
                ] as const).map(([value, label]) => {
                  const id = `${groupId}-${value}`;
                  return (
                    <label key={value} htmlFor={id}>
                      <input
                        id={id}
                        type="radio"
                        name={groupId}
                        value={value}
                        checked={answer === value}
                        onChange={() => setAnswer(value)}
                      />
                      {label}
                    </label>
                  );
                })}
              </fieldset>
              <button
                className={styles.primaryAction}
                type="button"
                disabled={!answer}
                onClick={() => setRevealed(true)}
              >
                Сверить с моделью
              </button>
            </>
          ) : (
            <div className={styles.result} aria-live="polite">
              <p className={styles.direction}>
                {correct ? "Энергию фотону отдаёт активная среда." : "Мио поправила запись: зеркало не источник энергии."}
              </p>
              <p>
                При вынужденном переходе возбуждённая частица испускает второй фотон,
                согласованный с первым по частоте, фазе и направлению. Накачка создаёт
                инверсную населённость, а резонатор возвращает свет через среду и выводит
                часть усиленного излучения.
              </p>
              <button
                className={styles.secondaryAction}
                type="button"
                onClick={() => {
                  setAnswer(null);
                  setRevealed(false);
                }}
              >
                Проверить ещё раз
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
