"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ElectrostaticsEvidenceLab.module.css";

const SCENARIOS = [
  {
    id: "attraction",
    label: "Притяжение",
    setup: "Заряженную пластмассовую линейку поднесли к незаряженной гильзе из фольги, не касаясь её.",
    observation: "Гильза притянулась к линейке.",
    choices: [
      "Гильза обязательно имела заряд противоположного знака",
      "В гильзе перераспределились заряды, и ближняя сторона притянулась сильнее",
      "Линейка передала гильзе заряд через сухой воздух",
    ],
    correct: 1,
    explanation: "Притяжение нейтрального проводника объясняется электризацией через влияние. По одному притяжению нельзя утверждать, что тело заранее имело противоположный заряд.",
  },
  {
    id: "repulsion",
    label: "Отталкивание",
    setup: "Две лёгкие подвешенные гильзы оттолкнулись друг от друга после электризации.",
    observation: "Расстояние между гильзами увеличилось.",
    choices: [
      "Обе гильзы заряжены одноимённо",
      "Одна гильза нейтральна",
      "Знаки зарядов обязательно разные",
    ],
    correct: 0,
    explanation: "Отталкивание показывает наличие одноимённых зарядов. Нейтральное тело может притягиваться к заряженному, но устойчивое электростатическое отталкивание так не объясняется.",
  },
  {
    id: "bridge",
    label: "Перемычка",
    setup: "Заряженный и незаряженный электроскопы по очереди соединили медной и стеклянной перемычками.",
    observation: "С медью второй электроскоп отклонился, со стеклом заметного переноса не произошло.",
    choices: [
      "Медь проводит заряд, а стекло в этих условиях ведёт себя как диэлектрик",
      "Любое твёрдое вещество одинаково проводит заряд",
      "Заряд появился на втором электроскопе без перемещения",
    ],
    correct: 0,
    explanation: "Проводник допускает направленное перемещение заряда. В диэлектрике оно затруднено; идеальных изоляторов нет, поэтому вывод относится к условиям опыта.",
  },
  {
    id: "influence",
    label: "Без касания",
    setup: "Заряженную палочку поднесли к нейтральному электроскопу, не касаясь шарика, а затем убрали.",
    observation: "Листочки разошлись рядом с палочкой и снова опустились после её удаления.",
    choices: [
      "Заряд палочки навсегда перешёл на электроскоп",
      "Заряды внутри электроскопа временно перераспределились",
      "В электроскопе появились новые электроны",
    ],
    correct: 1,
    explanation: "Контакта не было, а после удаления палочки эффект исчез. Наблюдение подтверждает временное перераспределение зарядов внутри проводника.",
  },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]["id"];

export function ElectrostaticsEvidenceLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("attraction");
  const [answer, setAnswer] = useState<number | null>(null);
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];

  function chooseScenario(id: ScenarioId) {
    setScenarioId(id);
    setAnswer(null);
  }

  return (
    <section className={styles.lab} aria-labelledby="electrostatics-lab-title">
      <header>
        <div>
          <p>Доказательство по наблюдению</p>
          <h2 id="electrostatics-lab-title">Что опыт действительно показывает?</h2>
          <span>Меняй опыт и выбирай только тот вывод, который следует из наблюдения.</span>
        </div>
        <div className={styles.mio}>
          <Image src="/images/mio/mio-skeptical-v2.png" alt="Мио сверяет вывод с наблюдением" width={300} height={300} sizes="(max-width: 640px) 120px, 170px" loading="eager" />
          <p>{answer === null ? "Притяжение — ещё не доказательство противоположного знака." : answer === scenario.correct ? "Теперь вывод опирается на наблюдение." : "Этот вывод говорит больше, чем показал опыт."}</p>
        </div>
      </header>

      <div className={styles.scenarios} role="group" aria-label="Опыт">
        {SCENARIOS.map((item) => (
          <button key={item.id} type="button" aria-pressed={scenarioId === item.id} onClick={() => chooseScenario(item.id)}>{item.label}</button>
        ))}
      </div>

      <div className={styles.evidence}>
        <section><span>Условие</span><p>{scenario.setup}</p></section>
        <section><span>Наблюдение</span><strong>{scenario.observation}</strong></section>
      </div>

      <fieldset className={styles.conclusions}>
        <legend>Какой вывод обоснован?</legend>
        {scenario.choices.map((choice, index) => (
          <button key={choice} type="button" aria-pressed={answer === index} data-verdict={answer === index ? (index === scenario.correct ? "correct" : "wrong") : undefined} onClick={() => setAnswer(index)}>{choice}</button>
        ))}
      </fieldset>

      {answer !== null ? <p className={styles.feedback} aria-live="polite"><strong>{answer === scenario.correct ? "Да." : "Пока нет."}</strong> {scenario.explanation}</p> : null}
    </section>
  );
}
