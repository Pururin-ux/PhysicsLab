import Link from "next/link";
import { MathText } from "../ui/MathText";
import styles from "./HeatTransferNotebook.module.css";

const heatJ = 9_200;
const massKg = 1;
const samples = [
  { material: "Алюминий", capacity: 920 },
  { material: "Железо", capacity: 460 },
  { material: "Свинец", capacity: 120 },
] as const;

function temperatureRise(capacity: number): string {
  const rise = heatJ / (massKg * capacity);
  return Number.isInteger(rise) ? String(rise) : rise.toFixed(1).replace(".", ",");
}

export function HeatTransferNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>§ 13 · 10 класс</p>
        <h2>Получили одинаковую энергию. Почему нагрев разный?</h2>
        <span>Три образца массой 1 кг получили по 9,2 кДж. Сравни, на сколько изменится их температура без смены агрегатного состояния.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.chart}>
          <div className={styles.chartHeading}><strong>Передано каждому образцу</strong><b>Q = 9,2 кДж</b></div>
          <div className={styles.scale} aria-hidden="true"><span>0</span><span>20</span><span>40</span><span>60</span><span>80 К</span></div>
          <div className={styles.rows}>
            {samples.map(sample => {
              const rise = heatJ / (massKg * sample.capacity);
              return (
                <div className={styles.row} key={sample.material}>
                  <div className={styles.sample}><strong>{sample.material}</strong><small>c = {sample.capacity} Дж/(кг·К)</small></div>
                  <div className={styles.track} aria-hidden="true"><span style={{ width: String(rise / 80 * 100) + "%" }} /></div>
                  <output>+{temperatureRise(sample.capacity)} К</output>
                </div>
              );
            })}
          </div>
          <figcaption>Длина полосы соответствует росту температуры ΔT, а не полученной энергии: Q и масса у всех одинаковые.</figcaption>
        </figure>

        <aside className={styles.lens}>
          <span className={styles.kicker}>Сравни измерения</span>
          <h3>Меньшая теплоёмкость — больший нагрев</h3>
          <strong><MathText text="$\Delta T=\frac{Q}{cm}$" /></strong>
          <p>Свинцу нужно меньше энергии, чтобы нагреть 1 кг на 1 К. Поэтому при равных Q и массе его температура меняется сильнее.</p>
          <small>Здесь нет плавления, парообразования и механической работы.</small>
        </aside>
      </div>

      <div className={styles.energyRecord}>
        <div><span>Получает энергию при теплообмене</span><strong>Q &gt; 0</strong></div>
        <div><span>Отдаёт энергию при теплообмене</span><strong>Q &lt; 0</strong></div>
        <p>Q — сколько энергии передано через границу выбранной системы. Это не запас «тепла» внутри тела: его состояние описывает внутренняя энергия U.</p>
      </div>

      <p className={styles.boundary}>Формула <MathText text="$Q=cm\Delta T$" /> относится к нагреванию или охлаждению без фазового перехода. При плавлении или парообразовании теплота может передаваться и при постоянной температуре. У газа удельная теплоёмкость зависит также от процесса.</p>
      <nav className={styles.revisit} aria-label="Связанные объяснения">
        <span>Уже знакомые случаи</span>
        <Link href="/learn/heat-amount-and-balance">Нагревание и тепловой баланс</Link>
        <Link href="/learn/melting-and-crystallization">Плавление при постоянной температуре</Link>
        <Link href="/learn/evaporation-and-boiling">Парообразование</Link>
      </nav>
    </div>
  );
}
