import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./SimpleMachinesNotebook.module.css";

export function SimpleMachinesNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная запись · § 26</p>
        <h2>Один блок поворачивает усилие. Другой делит груз между нитями</h2>
        <span>Сравниваем две установки с одним и тем же грузом. Считаем только те ветви натянутой нити, которые поднимают движущийся блок вместе с грузом.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.apparatus}>
          <svg viewBox="0 0 940 550" role="img" aria-labelledby="machines-title machines-desc">
            <title id="machines-title">Неподвижный и подвижный блоки с одинаковым грузом</title>
            <desc id="machines-desc">У неподвижного блока груз удерживает одна ветвь нити, поэтому сила тяги равна весу груза. Подвижный блок вместе с грузом удерживают две ветви, поэтому каждая несёт половину веса.</desc>
            <defs>
              <marker id="machines-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path className={styles.arrowHead} d="M0 0 10 5 0 10Z" />
              </marker>
              <filter id="machines-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".18" />
              </filter>
            </defs>

            <g className={styles.bench}>
              <path d="M65 78H420M520 78H875" />
              <path d="M92 78V112M393 78V112M547 78V112M848 78V112" />
              <path d="M55 484H430M510 484H885" />
            </g>

            <g aria-label="Неподвижный блок">
              <text className={styles.setupTitle} x="242" y="42" textAnchor="middle">Неподвижный блок</text>
              <path className={styles.hanger} d="M242 78V126" />
              <circle className={styles.pulleyOuter} cx="242" cy="164" r="38" filter="url(#machines-shadow)" />
              <circle className={styles.pulleyHub} cx="242" cy="164" r="10" />
              <path className={styles.rope} d="M204 342V164Q204 126 242 126Q280 126 280 164V276" />
              <path className={styles.loadStrap} d="M204 342V365" />
              <g className={styles.load} filter="url(#machines-shadow)">
                <path d="M160 365H248V438H160Z" />
                <path d="M177 365C177 343 231 343 231 365" />
                <text x="204" y="406" textAnchor="middle">P</text>
              </g>
              <g className={styles.dynamometer}>
                <path d="M261 276H299V382H261Z" />
                <path d="M280 276V258M280 382V409" />
                <path d="M269 299H291M269 320H284M269 341H291M269 362H284" />
                <text x="280" y="430" textAnchor="middle">тянем вниз</text>
              </g>
              <path className={styles.force} d="M280 414V462" markerEnd="url(#machines-arrow)" />
              <text className={styles.forceLabel} x="302" y="459">F</text>
              <path className={styles.supportTrace} d="M204 331V191" markerEnd="url(#machines-arrow)" />
              <text className={styles.traceLabel} x="182" y="260">T</text>
              <text className={styles.verdict} x="242" y="516" textAnchor="middle">1 ветвь держит груз · F ≈ P</text>
            </g>

            <path className={styles.divider} d="M470 44V510" />

            <g aria-label="Подвижный блок">
              <text className={styles.setupTitle} x="700" y="42" textAnchor="middle">Подвижный блок</text>
              <path className={styles.anchor} d="M662 78V112M646 112H678" />
              <path className={styles.rope} d="M662 112V294Q662 332 700 332Q738 332 738 294V170" />
              <circle className={styles.pulleyOuter} cx="700" cy="294" r="38" filter="url(#machines-shadow)" />
              <circle className={styles.pulleyHub} cx="700" cy="294" r="10" />
              <path className={styles.loadStrap} d="M700 304V365" />
              <g className={styles.load} filter="url(#machines-shadow)">
                <path d="M656 365H744V438H656Z" />
                <path d="M673 365C673 343 727 343 727 365" />
                <text x="700" y="406" textAnchor="middle">P</text>
              </g>
              <g className={styles.dynamometer}>
                <path d="M719 112H757V218H719Z" />
                <path d="M738 112V94M738 218V245" />
                <path d="M727 135H749M727 156H742M727 177H749M727 198H742" />
                <text x="738" y="266" textAnchor="middle">тянем вверх</text>
              </g>
              <path className={styles.force} d="M738 244V190" markerEnd="url(#machines-arrow)" />
              <text className={styles.forceLabel} x="760" y="211">F</text>
              <path className={styles.supportTrace} d="M662 280V149" markerEnd="url(#machines-arrow)" />
              <path className={styles.supportTrace} d="M738 280V149" markerEnd="url(#machines-arrow)" />
              <text className={styles.traceLabel} x="640" y="226">T</text>
              <text className={styles.traceLabel} x="754" y="226">T</text>
              <text className={styles.verdict} x="700" y="516" textAnchor="middle">2 ветви держат груз · F ≈ P/2</text>
            </g>
          </svg>
          <figcaption>Нить считаем лёгкой, блок — идеальным, трением пренебрегаем. Тогда натяжение одной непрерывной нити одинаково: <MathText text={String.raw`$T\approx F$`} />.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для числа несущих ветвей">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио прослеживает нить и отмечает ветви, которые поднимают груз" width={1254} height={1254} sizes="(max-width:760px) 112px, 152px" />
            <div>
              <span>Измерительная линза</span>
              <s>Считать все видимые куски нити</s>
              <strong>Мио отмечает ветви, которые тянут движущийся блок вверх.</strong>
            </div>
          </div>
          <div className={styles.lensRule}>
            <p><span>Несущих ветвей</span><strong>n</strong></p>
            <MathText text={String.raw`$P\approx nT$`} />
            <MathText text={String.raw`$F\approx T$`} />
            <div><MathText text={String.raw`$\dfrac{P}{F}\approx n$`} /><small>выигрыш в силе</small></div>
          </div>
        </aside>
      </div>

      <section className={styles.distinctions} aria-label="Что меняет каждый механизм">
        <article><span>Закреплённая ось</span><h3>Удобнее направление</h3><p>Неподвижный блок позволяет тянуть вниз, но груз по-прежнему удерживает одна ветвь. Выигрыша в силе нет.</p></article>
        <article><span>Ось движется с грузом</span><h3>Меньше сила</h3><p>Подвижный блок поддерживают две ветви. В идеальной модели каждая несёт половину веса груза.</p></article>
        <article><span>Рычаг</span><h3>Решает та же идея</h3><p>В рычаге выигрыш задаёт отношение плеч: <MathText text={String.raw`$\dfrac{P}{F}=\dfrac{l_1}{l_2}$`} />. Механизм меняется, сравнение сил остаётся.</p></article>
      </section>

      <section className={styles.boundary}>
        <p>Граница модели</p>
        <h3>«В два раза» — результат идеализации</h3>
        <span>Вес самого блока и трение требуют большей силы. Здесь ими пренебрегаем, как в базовой задаче учебника; знак ≈ напоминает о приближении.</span>
      </section>
    </div>
  );
}
