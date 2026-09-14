"use client";

import Image from "next/image";
import { useState } from "react";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import styles from "./ParticleEvidenceModel.module.css";

const stages = [
  { id: "observe", label: "Что видно" },
  { id: "microscope", label: "Что измерили" },
  { id: "explain", label: "Как объясняем" },
] as const;

type Stage = (typeof stages)[number]["id"];

const observationOptions = [
  {
    id: "distribution",
    label: "Чернила распределены по воде неравномерно",
    feedback: "Да. Это можно описать по самому кадру, не называя невидимую причину.",
    correct: true,
  },
  {
    id: "molecules",
    label: "На кадре видны отдельные молекулы воды",
    feedback: "Нет. Чёрные завитки намного крупнее молекул. Фотография показывает смесь, а не её частицы.",
    correct: false,
  },
  {
    id: "temperature",
    label: "Кадр доказывает, что в тёплой воде диффузия быстрее",
    feedback: "Нет. Здесь нет второй температуры для сравнения, а видимые потоки могут переносить чернила вместе с водой.",
    correct: false,
  },
] as const;

export function ParticleEvidenceModel() {
  const [stage, setStage] = useState<Stage>("observe");
  const [answer, setAnswer] = useState<(typeof observationOptions)[number]["id"] | null>(null);
  const selected = observationOptions.find((option) => option.id === answer);

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <div>
          <p className={styles.kicker}>Наблюдение → доказательство → модель</p>
          <h2>Красивое движение — ещё не объяснение</h2>
          <p>
            Сначала опишем кадр. Затем посмотрим, что удалось измерить под микроскопом.
          </p>
        </div>
        <div className={styles.mioNote}>
          <Image
            src={MIO_PORTRAITS.skeptical.src}
            alt="Мио со скрещёнными руками проверяет слишком быстрое объяснение"
            width={220}
            height={220}
            sizes="(max-width: 680px) 128px, 180px"
            priority
          />
          <p>«Чернила расходятся красиво. Механизм от этого яснее не стал».</p>
        </div>
      </header>

      <div className={styles.stageTabs} role="group" aria-label="Этап разбора наблюдения">
        {stages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={stage === item.id}
            onClick={() => setStage(item.id)}
          >
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>

      {stage === "observe" && (
        <section className={styles.observationStage} aria-labelledby="particle-observation-title">
          <figure className={styles.inkFigure}>
            <Image
              src="/images/evidence/diffusion-ink-1280.jpg"
              alt="Чёрные чернила образуют ветвящиеся потоки в прозрачной воде"
              fill
              sizes="(max-width: 680px) 100vw, 470px"
              priority
            />
            <figcaption>
              Один момент смешивания чернил с водой. Кадр фиксирует рисунок,
              но не показывает отдельные молекулы и не отделяет диффузию от потоков воды.
            </figcaption>
          </figure>
          <div className={styles.observationQuestion}>
            <p className={styles.stepLabel}>Сначала — только факт</p>
            <h3 id="particle-observation-title">Что можно утверждать по этому кадру?</h3>
            <div className={styles.options}>
              {observationOptions.map((option) => (
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
            {selected && (
              <p className={selected.correct ? styles.correct : styles.correction} role="status">
                {selected.feedback}
              </p>
            )}
            <a
              href="https://commons.wikimedia.org/wiki/File:Diffusion_with_ink.jpg"
              target="_blank"
              rel="noreferrer"
              className={styles.credit}
            >
              Фото: Zvonimir Lončarić · CC BY-SA 4.0
            </a>
          </div>
        </section>
      )}

      {stage === "microscope" && (
        <section className={styles.microscopeStage} aria-labelledby="particle-microscope-title">
          <div className={styles.microscopeCopy}>
            <p className={styles.stepLabel}>Теперь — запись движения</p>
            <h3 id="particle-microscope-title">Под микроскопом движется не молекула</h3>
            <p>
              Светящаяся точка — коллоидная частица диаметром 2 мкм. Она намного
              крупнее молекул воды. Её беспорядочный путь возникает из-за множества
              неравных ударов молекул жидкости с разных сторон.
            </p>
            <p className={styles.boundary}>
              Наблюдение подтверждает тепловое движение молекул косвенно: сами
              молекулы в микроскопической записи не различимы.
            </p>
            <a
              className={styles.recordingLink}
              href="https://commons.wikimedia.org/wiki/File:Single-molecule-theory-and-experiments-an-introduction-1477-3155-11-S1-S1-S1.ogv"
              target="_blank"
              rel="noreferrer"
            >
              Открыть микроскопическую запись · Riveline, 2013
              <small>Коллоидная частица 2 мкм · CC BY 2.0</small>
            </a>
          </div>
          <figure className={styles.traceFigure}>
            <Image
              src="/images/evidence/perrin-brownian-traces.gif"
              alt="Три ломаные траектории броуновских частиц на квадратной сетке"
              width={324}
              height={256}
            />
            <figcaption>
              Жан Перрен отмечал положения трёх частиц через 30 с и соединял
              соседние точки. Размер клетки — 3,2 мкм. Ломаная показывает
              последовательность измерений, а не дорожку внутри жидкости.
              <a href="https://commons.wikimedia.org/wiki/File:PerrinPlot2.gif" target="_blank" rel="noreferrer">
                Perrin, 1909 · public domain
              </a>
            </figcaption>
          </figure>
        </section>
      )}

      {stage === "explain" && (
        <section className={styles.explanationStage} aria-labelledby="particle-explanation-title">
          <div className={styles.explanationLead}>
            <p className={styles.stepLabel}>Наконец — модель</p>
            <h3 id="particle-explanation-title">Что связывает сахар, запах и броуновский путь</h3>
            <p>
              Вещество имеет дискретное строение: состоит из частиц, между которыми
              есть промежутки. Частицы непрерывно и хаотично движутся.
            </p>
          </div>
          <ol className={styles.evidenceChain}>
            <li>
              <span>Наблюдаем</span>
              Сахар перестаёт быть виден в чае, но сладкий вкус сохраняется; вещества
              со временем проникают друг в друга.
            </li>
            <li>
              <span>Проверяем</span>
              Крупная коллоидная частица под микроскопом непрерывно меняет направление,
              хотя её никто видимо не толкает.
            </li>
            <li>
              <span>Объясняем</span>
              Невидимые молекулы жидкости хаотично ударяют частицу. При повышении
              температуры интенсивность теплового движения возрастает.
            </li>
          </ol>
          <aside className={styles.limitNote}>
            <strong>Граница вывода</strong>
            Быстрое окрашивание тёплой воды само по себе ещё не измеряет только
            диффузию: вместе с ней краситель могут переносить потоки жидкости.
          </aside>
        </section>
      )}
    </div>
  );
}
