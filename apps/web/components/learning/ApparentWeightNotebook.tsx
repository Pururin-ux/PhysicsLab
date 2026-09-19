import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./ApparentWeightNotebook.module.css";

const cases = [
  { label: "ускорение вверх", relation: "P > mg", formula: String.raw`$P=m(g+a)$`, state: "up" },
  { label: "ускорения нет", relation: "P = mg", formula: String.raw`$P=mg$`, state: "steady" },
  { label: "ускорение вниз", relation: "P < mg", formula: String.raw`$P=m(g-a)$`, state: "down" },
] as const;

export function ApparentWeightNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Запись с весов · § 24</p>
        <h2>Весы чувствуют опору и ускорение — не направление движения</h2>
        <span>На человека действуют сила тяжести и реакция пола. Вес — другая сила: действие человека на пол. Сначала разделим тела, затем прочитаем показание.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.liftSheet}>
          <svg viewBox="0 0 900 500" role="img" aria-labelledby="lift-weight-title lift-weight-desc">
            <title id="lift-weight-title">Три состояния человека на весах в ускоряющемся лифте</title>
            <desc id="lift-weight-desc">При ускорении вверх реакция опоры больше силы тяжести, без ускорения силы равны, при ускорении вниз реакция опоры меньше. Направление скорости лифта не определяет показание весов.</desc>
            <defs>
              <marker id="weight-force-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path className={styles.forceArrow} d="M0 0 10 5 0 10Z" />
              </marker>
              <marker id="weight-acceleration-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path className={styles.accelerationArrow} d="M0 0 10 5 0 10Z" />
              </marker>
              <g id="lift-person">
                <circle cx="0" cy="-76" r="22" />
                <path d="M-27-51Q0-66 27-51L22 28H-22ZM-18 28-29 91M18 28 29 91" />
              </g>
            </defs>

            {cases.map((item, index) => {
              const x = 150 + index * 300;
              const normalTop = item.state === "up" ? 170 : item.state === "steady" ? 194 : 220;
              const accelerationPath = item.state === "up" ? `M${x + 96} 178V112` : item.state === "down" ? `M${x + 96} 112V178` : null;
              return (
                <g key={item.state} className={styles.case}>
                  <rect x={x - 116} y="94" width="232" height="318" rx="8" />
                  <path className={styles.cable} d={`M${x} 36V94`} />
                  <path className={styles.floor} d={`M${x - 100} 348H${x + 100}`} />
                  <g className={styles.person} transform={`translate(${x} 254)`}><use href="#lift-person" /></g>
                  <rect className={styles.scale} x={x - 48} y="326" width="96" height="22" rx="4" />
                  <path className={styles.gravity} d={`M${x - 48} 218V302`} markerEnd="url(#weight-force-arrow)" />
                  <text className={styles.gravityText} x={x - 64} y="264" textAnchor="end">mg</text>
                  <path className={styles.normal} d={`M${x + 48} 318V${normalTop}`} markerEnd="url(#weight-force-arrow)" />
                  <text className={styles.normalText} x={x + 62} y={(318 + normalTop) / 2}>N</text>
                  {accelerationPath ? <path className={styles.acceleration} d={accelerationPath} markerEnd="url(#weight-acceleration-arrow)" /> : <text className={styles.zeroAcceleration} x={x + 96} y="149" textAnchor="middle">a = 0</text>}
                  <text className={styles.caseLabel} x={x} y="448" textAnchor="middle">{item.label}</text>
                  <text className={styles.caseResult} x={x} y="478" textAnchor="middle">{item.relation}</text>
                </g>
              );
            })}
          </svg>
          <figcaption>На схемах сил показаны только силы, действующие на человека: <MathText text="$N$" /> и <MathText text="$mg$" />. Вес <MathText text="$P$" /> приложен к полу, поэтому в эту диаграмму не добавлен.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для различия веса и реакции опоры">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио разделяет силы человека и пола на схеме контакта" width={1254} height={1254} sizes="(max-width:760px) 110px, 150px" />
            <div><span>Измерительная линза</span><s>Вес действует на человека</s><strong>Мио разделяет два тела.</strong></div>
          </div>
          <div className={styles.contactPair}>
            <span>Один контакт</span>
            <div><b>На человека</b><MathText text={String.raw`$\vec N$`} /><small>пол толкает вверх</small></div>
            <div><b>На пол</b><MathText text={String.raw`$\vec P$`} /><small>человек давит вниз</small></div>
            <p><MathText text={String.raw`$\vec P=-\vec N$`} /><small>По третьему закону модули равны, точки приложения разные.</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.caseLedger} aria-labelledby="weight-cases-title">
        <div className={styles.ledgerIntro}><p>Чтение весов</p><h3 id="weight-cases-title">Сначала ускорение</h3><span>Лифт может ехать вверх или вниз. Для знака важен вектор ускорения.</span></div>
        {cases.map(item => <article key={item.state}><span>{item.label}</span><strong>{item.relation}</strong><MathText text={item.formula} /></article>)}
      </section>

      <div className={styles.distinctions}>
        <section><span>Невесомость</span><h3>Тяжесть остаётся, опора перестаёт давить</h3><MathText text={String.raw`$a=g\ \downarrow\quad\Rightarrow\quad P=0$`} /><p>Свободно падают и человек, и кабина. Исчезает давление на опору, но притяжение Земли не исчезает.</p></section>
        <section><span>Перегрузка</span><h3>Сравниваем вес с обычным весом</h3><MathText text={String.raw`$Q=\frac{P}{mg}$`} /><p><MathText text="$Q>1$" /> означает перегрузку, <MathText text="$Q=0$" /> — невесомость. Это отношение, поэтому у него нет единицы.</p></section>
        <section><span>Главная ловушка</span><h3>Скорость не выбирает знак</h3><p>Лифт может двигаться вниз и тормозить. Тогда ускорение направлено вверх, поэтому показание весов больше <MathText text="$mg$" />.</p></section>
      </div>

      <p className={styles.conclusion}>Вес показывает, как тело действует на опору. Чтобы найти его, выбираем тело, отмечаем действующие на него силы и связываем их с ускорением относительно инерциальной системы отсчёта.</p>
    </div>
  );
}
