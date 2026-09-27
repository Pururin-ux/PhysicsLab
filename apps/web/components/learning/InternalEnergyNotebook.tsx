import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./InternalEnergyNotebook.module.css";

export function InternalEnergyNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>§ 11 · 10 класс</p>
        <h2>Два пути. Одно изменение внутренней энергии?</h2>
        <span>Газ переходит между одними и теми же состояниями. Сравни два процесса и проверь, от чего зависит изменение его внутренней энергии.</span>
      </header>

      <section className={styles.routeSheet} aria-labelledby="internal-route-title">
        <div className={styles.mioAction}>
          <Image src="/images/mio/mio-thinking-v1.png" alt="Мио задумчиво держит блокнот" width={1254} height={1254} sizes="(max-width:760px) 104px, 170px" />
          <div><span>Вопрос Мио</span><h3 id="internal-route-title">Из состояния 1 в состояние 3 — двумя способами</h3><p>Какой путь сильнее изменит внутреннюю энергию?</p></div>
        </div>
        <figure>
          <svg viewBox="0 0 720 390" role="img" aria-labelledby="internal-path-title internal-path-desc">
            <title id="internal-path-title">Два процесса между одними состояниями газа</title>
            <desc id="internal-path-desc">На диаграмме давление объём путь 1 2 3 сначала идёт вверх при постоянном объёме, затем вправо при постоянном давлении. Путь 1 4 3 сначала идёт вправо при постоянном давлении, затем вверх при постоянном объёме. Оба пути соединяют состояния 1 и 3.</desc>
            <defs>
              <marker id="internal-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" /></marker>
              <marker id="internal-arrow-coral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" /></marker>
            </defs>
            <path className={styles.axis} d="M90 315V50M90 315H645" />
            <text className={styles.axisLabel} x="52" y="58">p</text><text className={styles.axisLabel} x="636" y="350">V</text>
            <path className={styles.guide} d="M170 265H540M170 110H540M170 110V265M540 110V265" />
            <path className={styles.pathA} markerEnd="url(#internal-arrow-cyan)" d="M170 265V110H540" />
            <path className={styles.pathB} markerEnd="url(#internal-arrow-coral)" d="M170 265H540V110" />
            <g className={styles.state}><circle cx="170" cy="265" r="19" /><text x="170" y="273">1</text></g>
            <g className={styles.state}><circle cx="170" cy="110" r="19" /><text x="170" y="118">2</text></g>
            <g className={styles.state}><circle cx="540" cy="110" r="19" /><text x="540" y="118">3</text></g>
            <g className={styles.state}><circle cx="540" cy="265" r="19" /><text x="540" y="273">4</text></g>
            <text className={styles.routeA} x="290" y="92">1 → 2 → 3</text>
            <text className={styles.routeB} x="290" y="297">1 → 4 → 3</text>
          </svg>
          <figcaption><strong>Для обоих путей:</strong> <span><MathText text="$\Delta U=U_3-U_1$" /></span></figcaption>
        </figure>
      </section>

      <section className={styles.measurementLens} aria-labelledby="temperature-lens-title">
        <header><span>Сравни температуры</span><h3 id="temperature-lens-title">Одна порция газа: важна разность температур</h3></header>
        <div className={styles.stateReadout}><small>Состояние 1</small><strong>T₁ = 300 К</strong><span><MathText text="$U_1=\frac{3}{2}\nu RT_1$" /></span></div>
        <div className={styles.delta}><b>ΔT = +150 К</b><span>температура выросла</span></div>
        <div className={styles.stateReadout}><small>Состояние 3</small><strong>T₃ = 450 К</strong><span><MathText text="$U_3=\frac{3}{2}\nu RT_3$" /></span></div>
        <p>Количество газа не меняется: <strong><MathText text="$\Delta U=\frac{3}{2}\nu R\Delta T$" /></strong>. Давление и объём помогают описать процесс, но не входят в эту формулу отдельно.</p>
      </section>

      <section className={styles.systemLedger} aria-labelledby="system-ledger-title">
        <header><span>Граница системы</span><h3 id="system-ledger-title">Что считаем внутренним</h3></header>
        <article><b>Термодинамическая система</b><p>Выбранные тела или их модель, состояние которых описывают макропараметрами.</p></article>
        <article><b>Внутренняя энергия</b><p>Кинетическая энергия теплового движения частиц плюс потенциальная энергия их взаимодействия.</p></article>
        <article><b>Изолированная система</b><p>Не обменивается с окружением ни веществом, ни энергией.</p></article>
      </section>

      <p className={styles.boundary}><strong>Граница модели.</strong> Для идеального одноатомного газа взаимодействием частиц пренебрегают, поэтому U зависит только от абсолютной температуры. Для реального газа, жидкости и твёрдого тела важна и потенциальная энергия взаимодействия.</p>
    </div>
  );
}
