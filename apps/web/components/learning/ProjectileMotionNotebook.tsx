import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./ProjectileMotionNotebook.module.css";

export function ProjectileMotionNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лаборатория водяной струи · § 22 · дополнительное чтение</p>
        <h2>Один бросок раскладывается на два независимых движения</h2>
        <span>По горизонтали скорость постоянна, по вертикали её каждую секунду изменяет тяжесть. Их совместная запись даёт параболу — пока сопротивлением воздуха можно пренебречь.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 1020 560" role="img" aria-labelledby="projectile-title projectile-desc">
            <title id="projectile-title">Опыт с водяной струёй и разложение начальной скорости</title>
            <desc id="projectile-desc">Слева показаны траектории при углах 30, 45 и 60 градусов с одинаковой начальной скоростью. Углы 30 и 60 градусов дают одинаковую дальность, а 45 градусов — максимальную. Справа начальная скорость разложена на горизонтальную и вертикальную составляющие.</desc>
            <defs>
              <marker id="projectile-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="projectile-gold-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.goldHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="projectile-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Сравнение траекторий водяной струи">
              <text className={styles.panelTitle} x="335" y="45" textAnchor="middle">Меняем только угол сопла</text>
              <path className={styles.ground} d="M68 455H655" markerEnd="url(#projectile-cyan-arrow)" />
              <path className={styles.verticalAxis} d="M92 474V82" markerEnd="url(#projectile-cyan-arrow)" />
              <text className={styles.axisLabel} x="635" y="486">x</text><text className={styles.axisLabel} x="69" y="94">y</text>

              <path className={styles.nozzle} d="M54 468H91V438H128" />
              <circle className={styles.valve} cx="70" cy="452" r="11" />
              <path className={styles.arcLow} d="M104 438Q320 278 536 438" />
              <path className={styles.arcHigh} d="M104 438Q320 72 536 438" />
              <path className={styles.arcMax} d="M104 438Q350 150 596 438" />
              <text className={styles.goldLabel} x="235" y="312">30°</text>
              <text className={styles.cyanLabel} x="380" y="170">45° · Lmax</text>
              <text className={styles.redLabel} x="217" y="126">60°</text>

              <path className={styles.rangeGuide} d="M104 505H536" />
              <path className={styles.rangeCap} d="M104 493V517M536 493V517" />
              <text className={styles.verdictSmall} x="320" y="535" textAnchor="middle">L₃₀ = L₆₀ при одинаковом v₀</text>
              <circle className={styles.drop} cx="536" cy="438" r="8" />
              <circle className={styles.dropMax} cx="596" cy="438" r="8" />
            </g>

            <path className={styles.divider} d="M680 28V530" />

            <g transform="translate(710 62)" aria-label="Разложение начальной скорости по осям">
              <text className={styles.panelTitle} x="135" y="0" textAnchor="middle">Начальная скорость</text>
              <path className={styles.componentAxis} d="M20 228H270M20 228V28" />
              <path className={styles.velocityVector} d="M20 228L212 84" markerEnd="url(#projectile-cyan-arrow)" />
              <path className={styles.horizontalComponent} d="M20 228H212" markerEnd="url(#projectile-gold-arrow)" />
              <path className={styles.verticalComponent} d="M212 228V84" markerEnd="url(#projectile-red-arrow)" />
              <path className={styles.componentGuide} d="M20 84H212" />
              <text className={styles.cyanLabel} x="126" y="129">v₀</text>
              <text className={styles.goldLabel} x="106" y="257">v₀x = v₀ cos α</text>
              <text className={styles.redLabel} x="221" y="160">v₀y</text>
              <path className={styles.gravityVector} d="M250 84V184" markerEnd="url(#projectile-red-arrow)" />
              <text className={styles.redLabel} x="260" y="139">g</text>

              <g className={styles.equations}>
                <text x="14" y="325">x = v₀x t</text>
                <text x="14" y="363">y = v₀y t − gt² / 2</text>
                <text x="14" y="413">L = v₀² sin 2α / g</text>
              </g>
              <text className={styles.verdict} x="135" y="463" textAnchor="middle">горизонталь — равномерно</text>
              <text className={styles.verdict} x="135" y="491" textAnchor="middle">вертикаль — с ускорением −g</text>
            </g>
          </svg>
          <figcaption>При одинаковых высотах старта и приземления углы <MathText text={String.raw`$\alpha$`} /> и <MathText text={String.raw`$90^\circ-\alpha$`} /> дают одинаковую дальность, но разную высоту. Угол 45° даёт максимальную дальность только в модели без сопротивления воздуха.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза опыта с водяной струёй">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио фиксирует положение сопла и сравнивает траектории водяной струи" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио меняет одну величину за раз.</strong><p>Сначала сохраняет скорость и меняет угол; затем фиксирует угол и поднимает сосуд, увеличивая скорость струи.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Одинаковый v₀</span><strong>угол меняет H и L</strong></p>
            <p><span>Одинаковый α</span><strong>больший v₀ увеличивает H и L</strong></p>
            <p className={styles.result}><span>Граница модели</span><strong>воздух и вращение не учтены</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
