import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./TorqueEquilibriumNotebook.module.css";

export function TorqueEquilibriumNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная запись · § 25</p>
        <h2>Силы могут уравновесить перенос — и всё равно повернуть тело</h2>
        <span>Выбираем ось, продолжаем линию действия каждой силы и опускаем к ней перпендикуляр. Только этот отрезок является плечом.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.apparatus}>
          <svg viewBox="0 0 860 500" role="img" aria-labelledby="torque-title torque-desc">
            <title id="torque-title">Рычаг с двумя силами и их плечами относительно оси</title>
            <desc id="torque-desc">Сила F1 действует вниз слева от оси на плече l1 и поворачивает рычаг против часовой стрелки. Сила F2 действует вниз справа на плече l2 и поворачивает по часовой стрелке. Для равновесия моменты равны по модулю.</desc>
            <defs>
              <marker id="torque-force-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path className={styles.forceArrow} d="M0 0 10 5 0 10Z" />
              </marker>
              <marker id="torque-measure-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path className={styles.measureArrow} d="M0 0 10 5 0 10Z" />
              </marker>
            </defs>

            <g className={styles.stand}>
              <path d="M430 292V406M350 406H510" />
              <circle cx="430" cy="276" r="20" />
            </g>
            <path className={styles.beam} d="M94 276H766" />
            <circle className={styles.axis} cx="430" cy="276" r="8" />
            <text className={styles.axisLabel} x="430" y="252" textAnchor="middle">ось O</text>

            <g className={styles.forceOne}>
              <path d="M184 102V250" markerEnd="url(#torque-force-arrow)" />
              <path className={styles.actionLine} d="M184 72V360" />
              <text x="154" y="94">F₁</text>
            </g>
            <g className={styles.forceTwo}>
              <path d="M694 142V250" markerEnd="url(#torque-force-arrow)" />
              <path className={styles.actionLine} d="M694 92V360" />
              <text x="708" y="134">F₂</text>
            </g>

            <g className={styles.arms}>
              <path d="M184 350H430" markerStart="url(#torque-measure-arrow)" markerEnd="url(#torque-measure-arrow)" />
              <path d="M430 350H694" markerStart="url(#torque-measure-arrow)" markerEnd="url(#torque-measure-arrow)" />
              <path d="M184 338V362M430 338V362M694 338V362" />
              <text x="307" y="382" textAnchor="middle">l₁</text>
              <text x="562" y="382" textAnchor="middle">l₂</text>
            </g>

            <g className={styles.rotationSigns}>
              <path d="M294 214C273 183 281 151 313 135" />
              <text x="263" y="132">+</text>
              <path d="M566 214C587 183 579 151 547 135" />
              <text x="590" y="132">−</text>
            </g>
            <text className={styles.balance} x="430" y="456" textAnchor="middle">+F₁l₁ − F₂l₂ = 0</text>
          </svg>
          <figcaption>Обе силы направлены вниз, но относительно оси O вращают рычаг в разные стороны. Реакция оси имеет нулевое плечо относительно самой оси.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для плеча силы">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио проводит перпендикуляр от оси к линии действия силы" width={1254} height={1254} sizes="(max-width:760px) 110px, 150px" />
            <div><span>Измерительная линза</span><s>Плечо — любой отрезок до силы</s><strong>Мио ищет кратчайший перпендикуляр.</strong></div>
          </div>
          <div className={styles.lensDiagram}>
            <svg viewBox="0 0 320 220" role="img" aria-label="Плечо силы как перпендикуляр до линии её действия">
              <circle cx="58" cy="140" r="7" />
              <text x="38" y="135">O</text>
              <path className={styles.obliqueForce} d="M267 38 194 162" markerEnd="url(#torque-force-arrow)" />
              <path className={styles.lensActionLine} d="M290 0 166 210" />
              <path className={styles.wrongDistance} d="M58 140 194 162" />
              <path className={styles.correctArm} d="M58 140 169 205" />
              <path className={styles.rightAngle} d="M158 199l6-10 10 6" />
              <text className={styles.wrongLabel} x="116" y="134">не плечо</text>
              <text className={styles.correctLabel} x="101" y="188">ℓ</text>
            </svg>
            <p><MathText text={String.raw`$M=\pm Fl$`} /><small>Знак показывает направление предполагаемого вращения.</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.conditions} aria-labelledby="equilibrium-conditions-title">
        <div><p>Два вопроса</p><h3 id="equilibrium-conditions-title">Что именно должно оставаться в покое?</h3></div>
        <article><span>Не переносится</span><MathText text={String.raw`$\sum\vec F=0$`} /><p>Равнодействующая сил равна нулю.</p></article>
        <article><span>Не вращается</span><MathText text={String.raw`$\sum M_O=0$`} /><p>Алгебраическая сумма моментов относительно выбранной оси равна нулю.</p></article>
      </section>

      <div className={styles.distinctions}>
        <section><span>Плечо</span><h3>До линии действия</h3><p>Измеряем кратчайшее расстояние от оси до бесконечной прямой, вдоль которой направлена сила.</p></section>
        <section><span>Единица</span><h3>Ньютон-метр</h3><p><MathText text={String.raw`$1\ \text{Н}\cdot\text{м}$`} /> — момент силы 1 Н с плечом 1 м. Это не джоуль, хотя размерности совпадают.</p></section>
        <section><span>Выбор знака</span><h3>Сначала договорённость</h3><p>В этой записи поворот против часовой стрелки положительный, по часовой — отрицательный.</p></section>
      </div>

      <p className={styles.conclusion}>Равные и противоположные силы ещё не гарантируют покой: если их линии действия не совпадают, возникает вращение. Для полного равновесия проверяем и сумму сил, и сумму моментов.</p>
    </div>
  );
}
