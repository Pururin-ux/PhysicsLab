import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./InclinedPlaneNotebook.module.css";

export function InclinedPlaneNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Полевой расчёт · § 27</p>
        <h2>Сила меньше. Путь длиннее. Работа не исчезла</h2>
        <span>Поднимаем один груз на одну высоту двумя способами. Наклонная плоскость уменьшает силу, но увеличивает путь точки приложения этой силы.</span>
      </header>

      <figure className={styles.apparatus}>
        <svg viewBox="0 0 940 560" role="img" aria-labelledby="incline-title incline-desc">
          <title id="incline-title">Груз на наклонной плоскости с длиной l и высотой h</title>
          <desc id="incline-desc">Груз перемещают равномерно вверх вдоль наклонной плоскости. Сила F направлена вдоль плоскости, вес P вертикально вниз. Длина плоскости l больше высоты h.</desc>
          <defs>
            <marker id="incline-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path className={styles.cyanHead} d="M0 0 10 5 0 10Z" />
            </marker>
            <marker id="incline-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path className={styles.redHead} d="M0 0 10 5 0 10Z" />
            </marker>
            <marker id="incline-measure-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path className={styles.measureHead} d="M0 0 10 5 0 10Z" />
            </marker>
            <filter id="incline-shadow" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity=".2" /></filter>
          </defs>

          <path className={styles.ground} d="M52 466H884" />
          <path className={styles.rampBody} d="M98 450L726 128L801 450Z" filter="url(#incline-shadow)" />
          <path className={styles.rampEdge} d="M98 450L726 128" />
          <path className={styles.rampTicks} d="M161 418l-13-25m76-7-13-25m76-7-13-25m76-7-13-25m76-7-13-25m76-7-13-25m76-7-13-25m76-7-13-25" />

          <g className={styles.crate} transform="translate(442 286) rotate(-27)">
            <path d="M-58-52H58V52H-58Z" />
            <path d="M-58-52L58 52M58-52L-58 52" />
            <text x="0" y="9" textAnchor="middle">груз</text>
          </g>

          <path className={styles.pullForce} d="M470 244L632 161" markerEnd="url(#incline-cyan-arrow)" />
          <text className={styles.pullLabel} x="565" y="172">F</text>
          <path className={styles.weightForce} d="M442 286V422" markerEnd="url(#incline-red-arrow)" />
          <text className={styles.weightLabel} x="459" y="391">P</text>

          <path className={styles.lengthMeasure} d="M115 486L745 164" markerStart="url(#incline-measure-arrow)" markerEnd="url(#incline-measure-arrow)" />
          <text className={styles.measureLabel} x="420" y="499">путь l</text>
          <path className={styles.heightMeasure} d="M820 450V128" markerStart="url(#incline-measure-arrow)" markerEnd="url(#incline-measure-arrow)" />
          <path className={styles.guide} d="M726 128H836M801 450H836" />
          <text className={styles.measureLabel} x="845" y="296">высота h</text>

          <g className={styles.resultPlate}>
            <path d="M74 70H388V172H74Z" />
            <text x="96" y="104">без трения · равномерно</text>
            <text x="96" y="142">F / P = h / l</text>
          </g>
        </svg>
        <figcaption>На рисунке сила тяги направлена вдоль плоскости. Для реальной доски трение увеличивает требуемую силу по сравнению с идеальным значением <MathText text={String.raw`$F=P\dfrac{h}{l}$`} />.</figcaption>
      </figure>

      <section className={styles.measurementLens} aria-label="Измерительная линза для силы и пути">
        <div className={styles.mioAction}>
          <Image src="/images/mio/mio-thinking-v1.png" alt="Мио сравнивает силу и путь в двух способах подъёма" width={1254} height={1254} sizes="(max-width:760px) 112px, 154px" />
          <div><span>Измерительная линза</span><s>Сравнить только силы</s><strong>Мио записывает силу вместе с путём.</strong></div>
        </div>
        <div className={styles.workLedger}>
          <article><span>Поднять прямо</span><MathText text={String.raw`$P\cdot h$`} /><small>большая сила · короткий путь</small></article>
          <article><span>Поднять по плоскости</span><MathText text={String.raw`$F\cdot l$`} /><small>меньшая сила · длинный путь</small></article>
          <p><strong>Идеально</strong><MathText text={String.raw`$Fl=Ph$`} /><span>выигрыша в работе нет</span></p>
        </div>
      </section>

      <section className={styles.accounting} aria-labelledby="efficiency-ledger-title">
        <header><p>Баланс энергии</p><h3 id="efficiency-ledger-title">В реальном механизме часть работы уходит в потери</h3></header>
        <div className={styles.workBar} aria-label="Совершённая работа состоит из полезной работы и потерь">
          <span className={styles.useful}>полезная работа</span><span className={styles.loss}>трение и другие потери</span>
        </div>
        <div className={styles.efficiency}>
          <MathText text={String.raw`$\eta=\dfrac{A_{\text{пол}}}{A_{\text{сов}}}\cdot100\%$`} />
          <p><strong><MathText text={String.raw`$A_{\text{сов}}>A_{\text{пол}}$`} /></strong><span>поэтому для реального механизма <MathText text={String.raw`$\eta<100\%$`} /></span></p>
        </div>
      </section>

      <div className={styles.distinctions}>
        <section><span>Выигрыш в силе</span><h3>Оплачивается путём</h3><p>Во сколько раз идеальный механизм уменьшает силу, не менее чем во столько же раз возрастает путь.</p></section>
        <section><span>Полезная работа</span><h3>Только нужный результат</h3><p>Для подъёма груза это увеличение его потенциальной энергии: <MathText text={String.raw`$A_{\text{пол}}=Ph=mgh$`} />.</p></section>
        <section><span>Совершённая работа</span><h3>Всё, что мы затратили</h3><p>Если тянем вдоль доски постоянной силой, <MathText text={String.raw`$A_{\text{сов}}=Fl$`} />. Разность работ связана с потерями.</p></section>
      </div>
    </div>
  );
}
