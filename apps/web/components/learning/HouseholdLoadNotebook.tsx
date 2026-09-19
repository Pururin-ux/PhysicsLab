"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./HouseholdLoadNotebook.module.css";

const VOLTAGE = 220;
const LIMIT = 10;
const GAUGE_MAX = 25;
const appliances = [
  { id: "fridge", label: "Холодильник", power: 200 },
  { id: "tv", label: "Телевизор", power: 300 },
  { id: "iron", label: "Утюг", power: 800 },
  { id: "kettle", label: "Электрочайник", power: 1200 },
  { id: "washer", label: "Стиральная машина", power: 2000 },
] as const;

export function HouseholdLoadNotebook() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["fridge", "kettle"]));
  const totalPower = appliances.reduce((sum, item) => selected.has(item.id) ? sum + item.power : sum, 0);
  const current = totalPower / VOLTAGE;
  const currentLabel = current.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
  const currentFormula = currentLabel.replace(",", "{,}");
  const overloaded = current > LIMIT;
  const gaugePercent = Math.min((current / GAUGE_MAX) * 100, 100);

  function toggle(id: string) {
    setSelected(currentSelection => {
      const next = new Set(currentSelection);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Линза нагрузки</p>
        <h2>Розеток несколько. Ток в общем проводе — один.</h2>
        <span>Приборы подключены параллельно. Выбери работающие одновременно и проследи, как их мощности складываются в нагрузку проводки.</span>
      </header>

      <div className={styles.workspace}>
        <fieldset className={styles.appliances}>
          <legend>Что включено сейчас</legend>
          {appliances.map(item => (
            <button type="button" key={item.id} aria-pressed={selected.has(item.id)} onClick={() => toggle(item.id)}>
              <span>{item.label}</span><strong>{item.power >= 1000 ? `${(item.power / 1000).toLocaleString("ru-RU")} кВт` : `${item.power} Вт`}</strong>
            </button>
          ))}
        </fieldset>

        <section className={styles.lens} aria-live="polite" aria-label={`Суммарная мощность ${totalPower} ватт, ток ${currentLabel} ампера, предел модели ${LIMIT} ампер. ${overloaded ? "Перегрузка." : "Предел не превышен."}`}>
          <div className={styles.reading}>
            <span>Общий ток</span>
            <output className={overloaded ? styles.danger : undefined}>{currentLabel} А</output>
            <small>предел модели: {LIMIT} А</small>
          </div>
          <div className={styles.gauge} data-overloaded={overloaded}>
            <div className={styles.track}><span style={{ width: `${gaugePercent}%` }} /></div>
            <div className={styles.limitMark}><i /><b>10 А</b></div>
            <div className={styles.ticks}><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25 А</span></div>
          </div>
          <div className={styles.calculation}>
            <MathText text={`$P_{\\Sigma}=${totalPower}\\,\\text{Вт}$`} />
            <MathText text={`$I=\\dfrac{P_{\\Sigma}}{U}=\\dfrac{${totalPower}}{220}=${currentFormula}\\,\\text{А}$`} />
          </div>
          <p className={overloaded ? styles.warning : styles.status}>{overloaded
            ? "Нагрузка выше выбранного предела. Защита должна отключить цепь; сначала устраняют причину перегрузки."
            : totalPower === 0
              ? "Все приборы выключены: ток нагрузки равен нулю."
              : "В этой учебной модели суммарный ток ниже выбранного предела."}</p>
        </section>
      </div>

      <div className={styles.safety}>
        <div><span>Что делает защита</span><p>Автомат разрывает цепь при опасном токе. Он не запрещает включить лишнюю нагрузку заранее и не устраняет неисправность.</p></div>
        <div><span>Что делает человек</span><p>Не касается повреждённых проводов и мокрых электроприборов. Ремонт и замену выполняют только после отключения напряжения; работу с сетью оставляют взрослому специалисту.</p></div>
      </div>
      <p className={styles.boundary}>Предел 10 А выбран для учебного примера из параграфа. Реальную защиту и проводку рассчитывает специалист; эту модель нельзя использовать для подбора домашнего автомата.</p>
    </div>
  );
}
