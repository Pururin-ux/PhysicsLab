import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./CircularMotionNotebook.module.css";

export function CircularMotionNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Один оборот как система мер · § 13</p>
        <h2>Точка вернулась на место. Что всё это время менялось?</h2>
        <span>Положение задаёт радиус-вектор, путь идёт по дуге, а мгновенная скорость касается окружности. Один рисунок связывает угол, период, частоту и две разные скорости.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 560" role="img" aria-labelledby="circle-title circle-desc">
            <title id="circle-title">Линейное и угловое описание движения по окружности</title>
            <desc id="circle-desc">Слева радиус-вектор поворачивается на угол, точка проходит дугу, а скорость направлена по касательной. Справа две точки одного диска имеют одинаковую угловую скорость, но разные линейные скорости.</desc>
            <defs>
              <marker id="circle-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="circle-gold-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.goldHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Радиус-вектор, дуга и касательная скорость">
              <text className={styles.panelTitle} x="248" y="49" textAnchor="middle">Положение и движение точки</text>
              <circle className={styles.orbit} cx="248" cy="292" r="153" />
              <circle className={styles.center} cx="248" cy="292" r="7" />
              <path className={styles.radiusMuted} d="M248 292L130 194" />
              <path className={styles.radius} d="M248 292L375 206" markerEnd="url(#circle-cyan-arrow)" />
              <path className={styles.arc} d="M130 194A153 153 0 0 1 375 206" markerEnd="url(#circle-gold-arrow)" />
              <path className={styles.angle} d="M206 258A54 54 0 0 1 293 262" />
              <circle className={styles.pointStart} cx="130" cy="194" r="13" />
              <circle className={styles.pointEnd} cx="375" cy="206" r="15" />
              <path className={styles.tangent} d="M375 206L430 287" markerEnd="url(#circle-cyan-arrow)" />
              <text className={styles.goldLabel} x="246" y="117">s = RΔφ</text>
              <text className={styles.cyanLabel} x="397" y="244">v — по касательной</text>
              <text className={styles.mutedLabel} x="170" y="233">R₁</text>
              <text className={styles.cyanLabel} x="319" y="261">R₂</text>
              <text className={styles.goldLabel} x="241" y="246">Δφ</text>
              <text className={styles.verdictStrong} x="248" y="501" textAnchor="middle">ω = Δφ / Δt · v = ωR</text>
            </g>

            <path className={styles.divider} d="M500 35V520" />

            <g aria-label="Две точки твёрдого тела на разных расстояниях от оси">
              <text className={styles.panelTitle} x="744" y="49" textAnchor="middle">Один диск — разные линейные скорости</text>
              <circle className={styles.disk} cx="744" cy="292" r="164" />
              <circle className={styles.diskRing} cx="744" cy="292" r="91" />
              <circle className={styles.center} cx="744" cy="292" r="8" />
              <path className={styles.spoke} d="M744 292L892 221" />
              <circle className={styles.innerPoint} cx="826" cy="253" r="13" />
              <circle className={styles.outerPoint} cx="892" cy="221" r="15" />
              <path className={styles.velocityInner} d="M826 253L854 312" markerEnd="url(#circle-cyan-arrow)" />
              <path className={styles.velocityOuter} d="M892 221L946 334" markerEnd="url(#circle-cyan-arrow)" />
              <path className={styles.rotationArrow} d="M618 197A164 164 0 0 1 741 128" markerEnd="url(#circle-gold-arrow)" />
              <text className={styles.goldLabel} x="625" y="174">одна ω</text>
              <text className={styles.cyanLabel} x="851" y="308">v₁</text>
              <text className={styles.cyanLabel} x="920" y="318">v₂</text>
              <text className={styles.verdict} x="744" y="469" textAnchor="middle">одинаковы T, ν и ω</text>
              <text className={styles.verdictStrong} x="744" y="501" textAnchor="middle">дальше от оси → больше v</text>
            </g>
          </svg>
          <figcaption>За один оборот радиус-вектор поворачивается на <MathText text={String.raw`$2\pi$`} />, а точка проходит путь <MathText text={String.raw`$2\pi R$`} />. Все точки твёрдого диска делают оборот одновременно, но внешняя точка проходит больший путь и потому движется быстрее.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза периода и частоты">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио отмечает один полный оборот и время его выполнения" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио ставит метку и считает только полные обороты.</strong><p>Так период не путается с количеством оборотов, а частота — со временем наблюдения.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Период</span><strong>T — время одного оборота</strong></p>
            <p><span>Частота</span><strong>ν = N / Δt = 1 / T</strong></p>
            <p className={styles.result}><span>Угловая скорость</span><strong>ω = 2πν = 2π / T</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function CentripetalAccelerationNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Поворачивается скорость — появляется ускорение · § 14</p>
        <h2>Спидометр не изменился. Почему ускорение не равно нулю?</h2>
        <span>Два равных по модулю вектора скорости смотрят в разные стороны. Их разность направлена внутрь окружности — туда же направлено центростремительное ускорение.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 560" role="img" aria-labelledby="acc-circle-title acc-circle-desc">
            <title id="acc-circle-title">Направление и модуль центростремительного ускорения</title>
            <desc id="acc-circle-desc">Слева показаны касательные скорости в двух близких точках окружности и направленное к центру ускорение. Справа треугольник изменения скорости объясняет направление ускорения и зависимости от скорости и радиуса.</desc>
            <defs>
              <marker id="acc-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="acc-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Скорость по касательной и ускорение к центру">
              <text className={styles.panelTitle} x="248" y="49" textAnchor="middle">Векторы в двух близких точках</text>
              <circle className={styles.orbit} cx="248" cy="307" r="157" />
              <circle className={styles.center} cx="248" cy="307" r="7" />
              <path className={styles.radiusMuted} d="M248 307L118 219M248 307L375 214" />
              <circle className={styles.pointStart} cx="118" cy="219" r="13" />
              <circle className={styles.pointEnd} cx="375" cy="214" r="15" />
              <path className={styles.tangent} d="M118 219L168 145" markerEnd="url(#acc-cyan-arrow)" />
              <path className={styles.tangent} d="M375 214L429 288" markerEnd="url(#acc-cyan-arrow)" />
              <path className={styles.inward} d="M375 214L279 286" markerEnd="url(#acc-red-arrow)" />
              <text className={styles.cyanLabel} x="135" y="155">v₁</text>
              <text className={styles.cyanLabel} x="409" y="258">v₂</text>
              <text className={styles.redLabel} x="323" y="234">a</text>
              <text className={styles.verdictStrong} x="248" y="500" textAnchor="middle">v ⟂ a · a направлено к центру</text>
            </g>

            <path className={styles.divider} d="M500 35V520" />

            <g aria-label="Изменение вектора скорости и зависимости ускорения">
              <text className={styles.panelTitle} x="744" y="49" textAnchor="middle">Почему направление меняется</text>
              <path className={styles.vectorOne} d="M598 182L711 127" markerEnd="url(#acc-cyan-arrow)" />
              <path className={styles.vectorTwo} d="M598 182L714 246" markerEnd="url(#acc-cyan-arrow)" />
              <path className={styles.deltaVector} d="M711 127L714 246" markerEnd="url(#acc-red-arrow)" />
              <text className={styles.cyanLabel} x="654" y="133">v₁</text>
              <text className={styles.cyanLabel} x="656" y="244">v₂</text>
              <text className={styles.redLabel} x="727" y="192">Δv</text>
              <path className={styles.ruleLine} d="M573 305H925" />
              <text className={styles.verdict} x="592" y="345">скорость ×2</text>
              <text className={styles.verdictStrong} x="907" y="345" textAnchor="end">ускорение ×4</text>
              <path className={styles.ratioTrack} d="M592 365H889" /><path className={styles.ratioFillLong} d="M592 365H889" />
              <text className={styles.verdict} x="592" y="419">радиус ×2</text>
              <text className={styles.verdictStrong} x="907" y="419" textAnchor="end">ускорение ÷2</text>
              <path className={styles.ratioTrack} d="M592 439H889" /><path className={styles.ratioFillShort} d="M592 439H741" />
              <text className={styles.formulaLabel} x="744" y="505" textAnchor="middle">a = v² / R = ω²R</text>
            </g>
          </svg>
          <figcaption>Центростремительное ускорение меняет направление скорости, а не обязательно её модуль. Поэтому оно перпендикулярно мгновенной скорости. Квадрат в <MathText text={String.raw`$a=v^2/R$`} /> делает рост скорости особенно существенным.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза центростремительного ускорения">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-skeptical-v1.png" alt="Мио переносит два вектора скорости в одну точку и строит их разность" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио совмещает начала скоростей и достраивает Δv.</strong><p>Разность смотрит внутрь окружности, хотя оба исходных вектора касаются траектории.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Модуль скорости</span><strong>может быть постоянным</strong></p>
            <p><span>Вектор скорости</span><strong>непрерывно поворачивается</strong></p>
            <p className={styles.result}><span>Ускорение</span><strong>к центру · перпендикулярно v</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
