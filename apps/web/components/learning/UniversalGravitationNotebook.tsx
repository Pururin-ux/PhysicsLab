import Image from "next/image";
import type { CSSProperties } from "react";
import { MathText } from "../ui/MathText";
import styles from "./UniversalGravitationNotebook.module.css";

const distanceRows = [
  { distance: "r", force: "F" },
  { distance: "2r", force: "F / 4" },
  { distance: "3r", force: "F / 9" },
] as const;

export function UniversalGravitationNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Полевая запись · § 23</p>
        <h2>Массы усиливают притяжение. Расстояние ослабляет его в квадрате</h2>
        <span>Сначала отмечаем центры тел, затем измеряем расстояние между ними. Именно это r входит в закон всемирного тяготения.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.fieldDiagram}>
          <svg viewBox="0 0 820 430" role="img" aria-labelledby="gravitation-title gravitation-desc">
            <title id="gravitation-title">Два шара притягиваются с равными по модулю противоположными силами</title>
            <desc id="gravitation-desc">Расстояние r отложено между центрами шаров массами m1 и m2. Стрелки сил направлены друг к другу вдоль линии центров.</desc>
            <defs>
              <radialGradient id="body-one" cx="35%" cy="30%">
                <stop offset="0" stopColor="#f4c98f" />
                <stop offset=".58" stopColor="#d57c52" />
                <stop offset="1" stopColor="#7e3e34" />
              </radialGradient>
              <radialGradient id="body-two" cx="35%" cy="30%">
                <stop offset="0" stopColor="#8bdbea" />
                <stop offset=".58" stopColor="#1a9eb9" />
                <stop offset="1" stopColor="#0b5068" />
              </radialGradient>
              <marker id="force-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path className={styles.forceArrow} d="M0 0 10 5 0 10Z" />
              </marker>
            </defs>

            <g className={styles.centerLine}>
              <path d="M154 226H675" />
              <path d="M154 214V238M675 214V238" />
            </g>
            <circle className={styles.bodyOne} cx="154" cy="226" r="86" />
            <circle className={styles.bodyTwo} cx="675" cy="226" r="55" />
            <g className={styles.centers}>
              <circle cx="154" cy="226" r="5" />
              <circle cx="675" cy="226" r="5" />
              <text x="154" y="338" textAnchor="middle">масса m₁</text>
              <text x="675" y="316" textAnchor="middle">масса m₂</text>
            </g>
            <g className={styles.forces}>
              <path d="M278 188H382" markerEnd="url(#force-arrow)" />
              <path d="M551 264H447" markerEnd="url(#force-arrow)" />
              <text x="330" y="166" textAnchor="middle">F₁₂</text>
              <text x="500" y="298" textAnchor="middle">F₂₁</text>
            </g>
            <g className={styles.measure}>
              <path d="M154 82V116M675 82V116M162 97H667" />
              <path d="M162 97l12-7v14ZM667 97l-12-7v14Z" />
              <text x="414" y="78" textAnchor="middle">r — между центрами</text>
            </g>
            <g className={styles.forceEquality}>
              <text x="414" y="386" textAnchor="middle">|F₁₂| = |F₂₁|</text>
            </g>
          </svg>
          <figcaption>Силы образуют пару третьего закона Ньютона: равны по модулю, противоположны и приложены к разным телам.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для расстояния между телами">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио отмечает центры двух тел перед измерением расстояния" width={1254} height={1254} sizes="(max-width:760px) 110px, 150px" />
            <div><span>Измерительная линза</span><s>r от края до края</s><strong>Мио ставит метки в центрах.</strong></div>
          </div>
          <div className={styles.formula}>
            <span>Закон</span>
            <MathText text="$F=G\frac{m_1m_2}{r^2}$" />
            <small>Для материальных точек и однородных шаров. У шаров r измеряется между центрами.</small>
          </div>
        </aside>
      </div>

      <section className={styles.inverseSquare} aria-labelledby="inverse-square-title">
        <div className={styles.scaleIntro}><p>Одна пара масс</p><h3 id="inverse-square-title">Отодвигаем тела</h3><span>Массы не меняются. Меняется только расстояние.</span></div>
        {distanceRows.map((row, index) => (
          <article key={row.distance} style={{ "--bar-scale": String(100 / (index + 1) ** 2) + "%" } as CSSProperties}>
            <span>Расстояние</span><strong>{row.distance}</strong>
            <div aria-hidden="true"><i /></div>
            <b>{row.force}</b>
          </article>
        ))}
      </section>

      <div className={styles.planetConnection}>
        <section>
          <span>У поверхности планеты</span>
          <h3>Масса и радиус вместе задают g</h3>
          <MathText text="$g=G\frac{M}{R^2}$" />
          <p>Большая масса увеличивает g, большой радиус уменьшает его. Поэтому размер планеты сам по себе ещё не определяет тяжесть.</p>
        </section>
        <section>
          <span>На высоте h</span>
          <h3>От центра становится дальше</h3>
          <MathText text="$g_h=G\frac{M}{(R+h)^2}$" />
          <p>Если подняться на высоту, равную радиусу планеты, расстояние до центра станет 2R, а ускорение уменьшится в четыре раза.</p>
        </section>
        <section>
          <span>Круговая орбита</span>
          <h3>Спутник всё время падает</h3>
          <MathText text="$v_{\text{кр}}=\sqrt{\frac{GM}{r}}$" />
          <p>Притяжение сообщает центростремительное ускорение. При большем радиусе круговой орбиты скорость меньше.</p>
        </section>
      </div>

      <p className={styles.conclusion}>Закон связывает одно взаимодействие на разных масштабах: незаметное притяжение предметов, тяжесть у поверхности и движение спутника. Граница модели — расстояние до центра и отсутствие существенных других сил.</p>
    </div>
  );
}
