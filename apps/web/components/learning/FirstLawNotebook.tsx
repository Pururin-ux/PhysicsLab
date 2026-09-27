"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./FirstLawNotebook.module.css";

const processes = [
  {
    label: "Объём постоянен",
    condition: "V = const",
    heat: 560,
    work: 0,
    observation: "Жёсткий сосуд: газ не меняет объём и не совершает работу.",
    conclusion: "Вся полученная энергия увеличила внутреннюю энергию.",
  },
  {
    label: "Температура постоянна",
    condition: "T = const",
    heat: 360,
    work: 360,
    observation: "Газ расширяется, оставаясь при прежней температуре.",
    conclusion: "Для идеального газа ΔU = 0: полученная энергия ушла на работу.",
  },
  {
    label: "Давление постоянно",
    condition: "p = const",
    heat: 800,
    work: 320,
    observation: "Подвижный поршень: газ нагревается и расширяется.",
    conclusion: "Часть энергии увеличила внутреннюю энергию, часть передана через работу.",
  },
] as const;

export function FirstLawNotebook() {
  const [selected, setSelected] = useState(2);
  const process = processes[selected];
  const change = process.heat - process.work;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>§ 14 · 10 класс</p>
        <h2>Куда идёт энергия, полученная газом?</h2>
        <span>Выбери условие опыта. Во всех трёх примерах газ получает энергию при теплообмене; сравни, какая доля меняет внутреннюю энергию, а какая становится работой газа.</span>
      </header>

      <div className={styles.processPicker} role="group" aria-label="Условие процесса">
        {processes.map((option, index) => (
          <button
            type="button"
            key={option.condition}
            className={index === selected ? styles.selected : undefined}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            <span>{option.label}</span><strong>{option.condition}</strong>
          </button>
        ))}
      </div>

      <div className={styles.workspace}>
        <div className={styles.balance}>
          <div className={styles.input}><span>Газ получил</span><strong>Q = {process.heat} Дж</strong></div>
          <div
            className={styles.energyTrack}
            role="img"
            aria-label={"Из " + process.heat + " джоулей полученной энергии " + change +
              " джоулей увеличили внутреннюю энергию, " + process.work + " джоулей — работа газа"}
          >
            {change > 0 && <span className={styles.internalFill} style={{ width: String(change / process.heat * 100) + "%" }} />}
            {process.work > 0 && <span className={styles.workFill} style={{ width: String(process.work / process.heat * 100) + "%" }} />}
          </div>
          <div className={styles.ledger} aria-live="polite">
            <p><span>Изменение внутренней энергии</span><strong>ΔU = {change} Дж</strong></p>
            <p><span>Работа газа</span><strong>A = {process.work} Дж</strong></p>
          </div>
        </div>

        <aside className={styles.reading}>
          <span>Выбранный процесс</span>
          <h3>{process.label}</h3>
          <p>{process.observation}</p>
          <strong className={styles.equation}><MathText text="$Q=\Delta U+A_{\text{газа}}$" /></strong>
          <p>{process.conclusion}</p>
        </aside>
      </div>

      <div className={styles.signRecord}>
        <strong>Чью работу записываем?</strong>
        <p>При расширении работа газа положительна. Работа внешних сил над ним имеет противоположный знак: <MathText text="$\Delta U=Q+A_{\text{внеш}}=Q-A_{\text{газа}}$" />.</p>
        <p>Во всех трёх примерах сверху Q положительно. При отдаче теплоты Q отрицательно; при сжатии работа газа отрицательна. Закон сохраняет те же знаки.</p>
      </div>
      <p className={styles.boundary}>Это три отдельных опыта с идеальным одноатомным газом, а не три пути между одними и теми же состояниями. В изобарном примере 320 Дж работы соответствуют увеличению внутренней энергии на 480 Дж: <MathText text="$\Delta U=\frac32p\Delta V$" />.</p>
    </div>
  );
}
