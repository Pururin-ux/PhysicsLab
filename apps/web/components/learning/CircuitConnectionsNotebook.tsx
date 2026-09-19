"use client";

import { useState } from "react";
import { MathText } from "../ui/MathText";
import styles from "./CircuitConnectionsNotebook.module.css";

type Topology = "series" | "parallel";

const SOURCE_VOLTAGE = 12;
const RESISTANCE = 6;

function CircuitSketch({ topology, secondConnected }: { topology: Topology; secondConnected: boolean }) {
  const isSeries = topology === "series";
  const active = secondConnected || !isSeries;
  const description = isSeries
    ? secondConnected
      ? "Последовательная цепь замкнута. Через оба резистора проходит ток 1 ампер."
      : "Последовательная цепь разомкнута между резисторами. Ток через оба резистора равен нулю."
    : secondConnected
      ? "Обе параллельные ветви замкнуты. Через каждую проходит ток 2 ампера."
      : "Нижняя параллельная ветвь разомкнута. Верхняя ветвь продолжает проводить ток 2 ампера.";

  if (isSeries) {
    return (
      <svg className={styles.diagram} viewBox="0 0 680 270" role="img" aria-label={description}>
        <path className={active ? styles.liveWire : styles.wire} d="M112 76H270M410 76H568V212H112V156M112 126V76" />
        <g className={secondConnected ? styles.liveWire : styles.wire}>
          <path d="M270 76H294M386 76H410" />
          <circle cx="294" cy="76" r="5" />
          <circle cx="386" cy="76" r="5" />
          <path d={secondConnected ? "M294 76H386" : "M294 76L368 45"} />
        </g>
        <Resistor x={154} y={194} label="R₁ = 6 Ом" active={active} />
        <Resistor x={406} y={194} label="R₂ = 6 Ом" active={active} />
        <Battery />
        <text className={styles.pathLabel} x="340" y="135" textAnchor="middle">один путь для тока</text>
        <CurrentLabel x={340} y={241} value={active ? "I = 1 А" : "I = 0 А"} active={active} />
      </svg>
    );
  }

  return (
    <svg className={styles.diagram} viewBox="0 0 680 270" role="img" aria-label={description}>
      <path className={styles.liveWire} d="M112 76H568V212H112V156M112 126V76" />
      <path className={styles.liveWire} d="M228 76V126H452V76" />
      <path className={secondConnected ? styles.liveWire : styles.wire} d="M228 212V162H292" />
      <path className={secondConnected ? styles.liveWire : styles.wire} d="M388 162H452V212" />
      <circle className={styles.junction} cx="228" cy="76" r="6" />
      <circle className={styles.junction} cx="452" cy="76" r="6" />
      <circle className={styles.junction} cx="228" cy="212" r="6" />
      <circle className={styles.junction} cx="452" cy="212" r="6" />
      <Resistor x={292} y={108} label="R₁ = 6 Ом" active />
      <Resistor x={292} y={144} label="R₂ = 6 Ом" active={secondConnected} />
      <g className={secondConnected ? styles.liveWire : styles.wire}>
        <circle cx="292" cy="162" r="5" />
        <circle cx="388" cy="162" r="5" />
        <path d={secondConnected ? "M292 162H388" : "M292 162L370 132"} />
      </g>
      <Battery />
      <CurrentLabel x={340} y={103} value="I₁ = 2 А" active />
      <CurrentLabel x={340} y={199} value={secondConnected ? "I₂ = 2 А" : "I₂ = 0 А"} active={secondConnected} />
      <text className={styles.totalCurrent} x="492" y="145">I = {secondConnected ? "4" : "2"} А</text>
    </svg>
  );
}

function Resistor({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return (
    <g className={active ? styles.resistorActive : styles.resistor}>
      <rect x={x} y={y} width="120" height="36" rx="5" />
      <text x={x + 60} y={y + 23} textAnchor="middle">{label}</text>
    </g>
  );
}

function Battery() {
  return (
    <g className={styles.battery}>
      <line x1="96" y1="126" x2="128" y2="126" />
      <line x1="104" y1="156" x2="120" y2="156" />
      <text x="142" y="146">12 В</text>
    </g>
  );
}

function CurrentLabel({ x, y, value, active }: { x: number; y: number; value: string; active: boolean }) {
  return <text className={active ? styles.current : styles.currentOff} x={x} y={y} textAnchor="middle">{value}</text>;
}

export function CircuitConnectionsNotebook() {
  const [topology, setTopology] = useState<Topology>("series");
  const [secondConnected, setSecondConnected] = useState(true);
  const isSeries = topology === "series";
  const equivalent = isSeries ? (secondConnected ? 12 : null) : (secondConnected ? 3 : 6);
  const totalCurrent = equivalent ? SOURCE_VOLTAGE / equivalent : 0;

  function chooseTopology(next: Topology) {
    setTopology(next);
    setSecondConnected(true);
  }

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Схема как карта пути</p>
        <h2>Что произойдёт, если один путь разорвать?</h2>
        <span>Источник и оба резистора одинаковы. Меняется только способ соединения.</span>
      </header>

      <div className={styles.tabs} aria-label="Способ соединения">
        <button type="button" aria-pressed={isSeries} onClick={() => chooseTopology("series")}>Один за другим</button>
        <button type="button" aria-pressed={!isSeries} onClick={() => chooseTopology("parallel")}>В отдельных ветвях</button>
      </div>

      <div className={styles.sheet}>
        <section className={styles.sketch} aria-live="polite">
          <div className={styles.sketchTitle}>
            <span>{isSeries ? "Последовательно" : "Параллельно"}</span>
            <strong>{isSeries ? "Ток идёт по одному пути" : "Ток делится между ветвями"}</strong>
          </div>
          <CircuitSketch topology={topology} secondConnected={secondConnected} />
          <button className={styles.switchButton} type="button" aria-pressed={!secondConnected} onClick={() => setSecondConnected(value => !value)}>
            {secondConnected ? "Разомкнуть участок у R₂" : "Снова замкнуть участок"}
          </button>
        </section>

        <aside className={styles.notes} aria-label="Расчёт и наблюдение">
          <div>
            <span>Наблюдение</span>
            <p>{isSeries
              ? secondConnected
                ? "Через оба резистора проходит один и тот же ток."
                : "Единственный путь разорван: ток исчез во всей цепи."
              : secondConnected
                ? "На обеих ветвях одинаковое напряжение 12 В."
                : "Одна ветвь разомкнута, но у второй остался полный путь к источнику."}</p>
          </div>
          <div>
            <span>Эквивалентное сопротивление</span>
            {equivalent ? (
              <MathText className={styles.formula} text={isSeries
                ? "$R=R_1+R_2=12\\,\\text{Ом}$"
                : secondConnected
                  ? "$R=\\frac{R_1R_2}{R_1+R_2}=3\\,\\text{Ом}$"
                  : "$R=R_1=6\\,\\text{Ом}$"} />
            ) : <strong className={styles.openCircuit}>Цепь разомкнута</strong>}
          </div>
          <div className={styles.result}>
            <span>Ток источника</span>
            <output>{totalCurrent.toLocaleString("ru-RU")} А</output>
            <small><MathText text={equivalent ? `$I=\\dfrac{12\\,\\text{В}}{${equivalent}\\,\\text{Ом}}$` : "$I=0$"} /></small>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>{isSeries
        ? "Последовательное соединение добавляет сопротивления и оставляет один путь. Поэтому отключение одного элемента останавливает всю цепь."
        : "Параллельное соединение добавляет путь для тока и уменьшает общее сопротивление. Поэтому бытовые приборы можно включать независимо."}</p>
    </div>
  );
}
