"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import shared from "./TextbookScene.module.css";
import styles from "./GravityWeightModel.module.css";

const views = {
  gravity: {
    button: "Земля → груз",
    name: "Сила тяжести",
    symbol: "Fт",
    target: "к грузу",
    direction: "вертикально вниз",
    explanation: "Земля притягивает сам груз. Эта сила не приложена к пружине.",
    arrow: "M1124 650 V820 M1124 820 L1098 780 M1124 820 L1150 780",
    labelY: 760,
  },
  elastic: {
    button: "Пружина → груз",
    name: "Сила упругости",
    symbol: "Fупр",
    target: "к грузу",
    direction: "вертикально вверх",
    explanation: "Растянутая пружина стремится восстановить форму и тянет груз вверх.",
    arrow: "M1124 650 V500 M1124 500 L1098 540 M1124 500 L1150 540",
    labelY: 550,
  },
  weight: {
    button: "Груз → подвес",
    name: "Вес груза",
    symbol: "P",
    target: "к нижнему крючку пружины",
    direction: "вертикально вниз",
    explanation: "Вес — действие груза на подвес. Поэтому его стрелка начинается на подвесе, а не на грузе.",
    arrow: "M1088 574 V720 M1088 720 L1062 680 M1088 720 L1114 680",
    labelY: 670,
  },
} as const;

type ViewId = keyof typeof views;

export function GravityWeightModel() {
  const [viewId, setViewId] = useState<ViewId>("gravity");
  const view = views[viewId];

  return (
    <div className={shared.experiment}>
      <div className={styles.intro}>
        <div>
          <p className={styles.kicker}>Один груз · три разных действия</p>
          <h2>К какому телу приложена сила?</h2>
        </div>
        <p>
          Мио оставила установку неподвижной и меняет только вопрос. Выбери,
          кто на кого действует: стрелка покажет точку приложения и направление.
        </p>
      </div>

      <div className={styles.workspace}>
        <figure className={styles.scene}>
          <Image
            className={styles.art}
            src={MIO_SCENES.force}
            alt="Мио наблюдает за грузом, подвешенным к пружинному динамометру"
            fill
            sizes="(max-width: 700px) 100vw, 720px"
            priority
          />
          <svg
            className={styles.overlay}
            viewBox="0 0 1536 1024"
            role="img"
            aria-label={`${view.name} ${view.direction}; приложена ${view.target}`}
          >
            <path d={view.arrow} />
            <text x={viewId === "weight" ? 1018 : 1162} y={view.labelY}>{view.symbol}</text>
          </svg>
          <figcaption>
            Стрелка отвечает на один вопрос: какое тело сейчас испытывает действие?
          </figcaption>
        </figure>

        <div className={styles.panel}>
          <div className={styles.switcher} role="group" aria-label="Выбор взаимодействия">
            {(Object.keys(views) as ViewId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={viewId === id}
                onClick={() => setViewId(id)}
              >
                {views[id].button}
              </button>
            ))}
          </div>

          <section className={styles.reading} aria-live="polite">
            <p>{view.symbol}</p>
            <h3>{view.name}</h3>
            <dl>
              <div><dt>Приложена</dt><dd>{view.target}</dd></div>
              <div><dt>Направлена</dt><dd>{view.direction}</dd></div>
            </dl>
            <p>{view.explanation}</p>
          </section>
        </div>
      </div>

      <p className={styles.balance}>
        Груз покоится: сила тяжести вниз и сила упругости вверх равны по модулю.
        Вес тоже равен им по модулю, но приложен уже к подвесу.
      </p>
    </div>
  );
}
