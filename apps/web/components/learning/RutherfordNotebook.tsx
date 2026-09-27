"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import styles from "./RutherfordNotebook.module.css";

const predictions = {
  gentle: "Отклонится лишь немного",
  sharp: "Резко развернётся",
  straight: "Пройдёт совсем прямо",
} as const;

type Prediction = keyof typeof predictions;

export function RutherfordNotebook() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [revealed, setRevealed] = useState(false);
  const groupId = useId();
  const mioMessage = revealed
    ? "Я недооценила редкое сильное отклонение. Именно оно изменило модель."
    : "Если положительный заряд распределён по всему атому, я жду лишь небольшого отклонения.";

  return (
    <div className={styles.notebook}>
      <div className={styles.workspace}>
        <figure className={styles.figure}>
          <div className={styles.art}>
            <Image
              src="/images/experiments/rutherford-scattering-v1.webp"
              alt="Реконструкция установки: источник с узкой щелью направляет альфа-частицы к тонкой золотой фольге; кольцевой экран и микроскоп помогают наблюдать вспышки."
              width={1440}
              height={960}
              sizes="(max-width: 760px) 100vw, 28rem"
              loading="eager"
            />
          </div>
          <figcaption>
            Источник, золотая фольга, экран и микроскоп. Изображение передаёт
            устройство опыта, а не траектории частиц; размеры не в масштабе.
          </figcaption>
        </figure>

        <section className={styles.record} aria-label="Гипотеза и наблюдение">
          <div className={styles.mioNote}>
            <Image
              src={MIO_PORTRAITS.skeptical.src}
              alt=""
              width={1254}
              height={1254}
              sizes="56px"
              className={styles.mio}
            />
            <p>
              <strong>{revealed ? "Мио пересмотрела догадку" : "Прогноз Мио"}</strong>
              <br />
              {mioMessage}
            </p>
          </div>

          {!revealed ? (
            <>
              <fieldset className={styles.prediction}>
                <legend>
                  Что предсказывает модель Томсона для положительной α-частицы?
                </legend>
                {(Object.entries(predictions) as [Prediction, string][]).map(
                  ([value, label]) => {
                    const id = groupId + "-" + value;
                    return (
                      <label className={styles.option} htmlFor={id} key={value}>
                        <input
                          id={id}
                          type="radio"
                          name={groupId}
                          value={value}
                          checked={prediction === value}
                          onChange={() => setPrediction(value)}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  },
                )}
              </fieldset>
              <button
                className={styles.action}
                type="button"
                disabled={!prediction}
                onClick={() => setRevealed(true)}
              >
                Сверить с опытом
              </button>
            </>
          ) : (
            <div className={styles.result} aria-live="polite">
              <p className={styles.feedback}>
                {prediction === "gentle"
                  ? "Твоё ожидание совпало с моделью Томсона. Но опыт показал больше."
                  : "Сверь выбор с предсказанием модели Томсона и тем, что увидели в опыте."}
              </p>
              <div>
                <h3>Наблюдение</h3>
                <p>
                  Большинство α-частиц прошло почти прямо. Очень немногие
                  отклонились на большой угол; некоторые развернулись почти назад.
                </p>
              </div>
              <div className={styles.inference}>
                <h3>Что это означает</h3>
                <p>
                  Сильное отталкивание указывает на маленькую область с
                  положительным зарядом — ядро атома.
                </p>
              </div>
              <button
                className={styles.reset}
                type="button"
                onClick={() => {
                  setPrediction(null);
                  setRevealed(false);
                }}
              >
                Изменить прогноз
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
