"use client";

import Image from "next/image";
import { useState } from "react";
import { MathText } from "../ui/MathText";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./InertiaModel.module.css";

const predictions = [
  { id: "same", label: "Останется 4 м/с относительно пола" },
  { id: "slower", label: "Уменьшится вместе со скоростью тележки" },
  { id: "faster", label: "Увеличится: шайбу толкнёт вперёд" },
] as const;

const moments = [
  { value: 0, label: "До торможения" },
  { value: 1, label: "Через 1 с" },
  { value: 2, label: "Через 2 с" },
] as const;

type PredictionId = (typeof predictions)[number]["id"];
type Moment = (typeof moments)[number]["value"];

export function InertiaModel() {
  const [prediction, setPrediction] = useState<PredictionId | null>(null);
  const [observed, setObserved] = useState(false);
  const [moment, setMoment] = useState<Moment>(0);

  const choosePrediction = (value: PredictionId) => {
    setPrediction(value);
    setObserved(false);
    setMoment(0);
  };

  const observe = () => {
    setObserved(true);
    setMoment(1);
  };

  const puckSpeed = 4;
  const cartSpeed = 4 - 2 * moment;
  const relativeSpeed = puckSpeed - cartSpeed;
  const puckPath = 4 * moment;
  const cartPath = 4 * moment - moment * moment;
  const lead = puckPath - cartPath;
  const elapsedLabel = moment === 1 ? "1 секунду" : moment === 2 ? "2 секунды" : "0 секунд";

  return (
    <div className={shared.experiment}>
      <div className={styles.study}>
        <figure className={styles.observation}>
          <Image
            className={styles.observationImage}
            src={MIO_SCENES.inertia}
            alt="Мио придерживает лабораторную тележку; незакреплённая шайба лежит на её платформе"
            fill
            sizes="(max-width: 640px) 100vw, 430px"
            priority
          />
          <figcaption>
            Мио тормозит тележку рукой. Шайба не закреплена, и тормозящая сила к ней
            не приложена.
          </figcaption>
        </figure>

        <div className={styles.question}>
          <p className={styles.kicker}>Тормозим тележку · наблюдаем шайбу</p>
          <h2>Что станет со скоростью шайбы?</h2>
          <p>
            До торможения тележка и шайба движутся вправо со скоростью 4 м/с.
            Сопротивлением воздуха и трением шайбы о платформу в модели пренебрегаем.
          </p>
          <div className={styles.predictions} role="group" aria-label="Прогноз о скорости шайбы">
            {predictions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={prediction === option.id}
                onClick={() => choosePrediction(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className={styles.observe}
            type="button"
            disabled={!prediction}
            onClick={observe}
          >
            Проследить движение
          </button>
        </div>
      </div>

      {observed ? (
        <section className={styles.result} aria-labelledby="inertia-result-title">
          <div className={styles.momentPicker} role="group" aria-label="Момент наблюдения">
            {moments.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={moment === item.value}
                onClick={() => setMoment(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.resultHeading}>
            <p>Прошло после начала торможения</p>
            <strong>{moment} с</strong>
          </div>

          <div className={styles.readings} aria-label={`Скорости и пути через ${elapsedLabel}`}>
            <article>
              <p>Смотрим относительно пола</p>
              <dl>
                <div><dt>Скорость шайбы</dt><dd>{puckSpeed} м/с →</dd></div>
                <div><dt>Скорость тележки</dt><dd>{cartSpeed} м/с{cartSpeed > 0 ? " →" : ""}</dd></div>
              </dl>
              <span>Шайба прошла {puckPath} м, тележка — {cartPath} м.</span>
            </article>

            <article>
              <p>Смотрим с тележки</p>
              <dl>
                <div><dt>Скорость шайбы вперёд</dt><dd>{relativeSpeed} м/с</dd></div>
                <div><dt>Шайба впереди</dt><dd>{lead} м</dd></div>
              </dl>
              <MathText
                text={String.raw`$4-${cartSpeed}=${relativeSpeed}\ \text{м/с вперёд}$`}
              />
            </article>
          </div>

          <div className={styles.conclusion} role="status">
            <strong id="inertia-result-title">
              {prediction === "same"
                ? "Верно: относительно пола скорость шайбы осталась прежней."
                : "Тележка замедляется, а свободная шайба сохраняет 4 м/с относительно пола."}
            </strong>
            <p>
              {moment === 0
                ? "Пока тележка и шайба движутся вместе, их относительная скорость равна нулю."
                : `Через ${moment} с тележка движется медленнее. Поэтому шайба уходит вперёд относительно тележки на ${lead} м, хотя относительно пола не разгоняется.`}
            </p>
          </div>
        </section>
      ) : null}

      <details className={styles.boundary}>
        <summary>Почему шайбу не толкает «сила инерции»?</summary>
        <p>
          В выбранной здесь системе отсчёта, связанной с полом, горизонтальная сила
          на шайбу не действует. Инерция — свойство сохранять скорость, а не отдельная
          сила. В реальном опыте трение существует, поэтому шайба постепенно изменит
          движение; модель показывает короткий промежуток, когда им можно пренебречь.
        </p>
      </details>
    </div>
  );
}
