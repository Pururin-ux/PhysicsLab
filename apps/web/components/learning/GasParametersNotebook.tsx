import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./GasParametersNotebook.module.css";

const parameterGroups = [
  {
    label: "Измеряем сосуд",
    title: "Макропараметры",
    values: ["p — давление", "V — объём", "T — температура"],
    note: "Описывают газ как целую систему, без слежения за отдельной молекулой.",
  },
  {
    label: "Описываем модель",
    title: "Микропараметры",
    values: ["m₀ — масса молекулы", "n = N/V — концентрация", "v² — средний квадрат скорости"],
    note: "Относятся к частицам и статистике их беспорядочного движения.",
  },
] as const;

export function GasParametersNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Запись о состоянии газа · § 3</p>
        <h2>Манометр показывает давление. МКТ объясняет, откуда оно берётся</h2>
        <span>Одно состояние газа можно описать на двух уровнях. Не смешиваем то, что измеряет прибор, с величинами молекулярной модели.</span>
      </header>

      <div className={styles.parameterSpread}>
        {parameterGroups.map((group) => (
          <section key={group.title}>
            <span>{group.label}</span>
            <h3>{group.title}</h3>
            <ul>{group.values.map((value) => <li key={value}>{value}</li>)}</ul>
            <p>{group.note}</p>
          </section>
        ))}
        <div className={styles.bridge} aria-label="Основное уравнение молекулярно-кинетической теории идеального газа">
          <span>Мост между уровнями</span>
          <div className={styles.formulaStack}>
            <MathText text={String.raw`$p=\frac13nm_0\overline{v^2}$`} />
            <MathText text={String.raw`$p=\frac23n\overline{E_k}$`} />
          </div>
          <p>Давление растёт, когда в единице объёма больше частиц или когда их средняя кинетическая энергия выше.</p>
        </div>
      </div>

      <div className={styles.workspace}>
        <figure className={styles.graphSheet}>
          <svg viewBox="0 0 720 430" role="img" aria-labelledby="gas-graph-title gas-graph-desc">
            <title id="gas-graph-title">Зависимость давления идеального газа от концентрации</title>
            <desc id="gas-graph-desc">Две прямые выходят из начала координат. Более крутая прямая соответствует большей средней кинетической энергии молекул.</desc>
            <defs>
              <marker id="gas-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 10 5 0 10Z" />
              </marker>
            </defs>
            <path className={styles.axis} d="M90 350H650M90 350V55" markerEnd="url(#gas-axis-arrow)" />
            <path className={styles.gridLine} d="M90 270H620M90 190H620M90 110H620M220 350V80M350 350V80M480 350V80M610 350V80" />
            <path className={styles.coolLine} d="M90 350L610 182" />
            <path className={styles.hotLine} d="M90 350L500 82" />
            <text className={styles.axisLabel} x="657" y="360">n</text>
            <text className={styles.axisLabel} x="72" y="47">p</text>
            <text className={styles.coolLabel} x="515" y="200">меньше Ēₖ</text>
            <text className={styles.hotLabel} x="390" y="92">больше Ēₖ</text>
          </svg>
          <figcaption><strong>Наклон прямой хранит энергию движения.</strong><span>При одной концентрации более крутая линия даёт большее давление, потому что <MathText text={String.raw`$p=\frac23n\overline{E_k}$`} />.</span></figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза Мио для концентрации и давления">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="Мио сопоставляет показание манометра с моделью движения молекул" width={1254} height={1254} sizes="(max-width:760px) 112px, 150px" />
            <div><span>Измерительная линза</span><s>Давление — это число молекул</s><strong>Мио сохраняет два множителя.</strong></div>
          </div>
          <div className={styles.factorNotes}>
            <p><span>Сколько частиц</span><MathText text={String.raw`$n=\frac NV$`} /><small>концентрация, м⁻³</small></p>
            <p><span>Как они движутся</span><MathText text={String.raw`$\overline{E_k}=\frac{m_0\overline{v^2}}2$`} /><small>средняя энергия, Дж</small></p>
            <p><span>Что измерит стенка</span><MathText text={String.raw`$p=\frac23n\overline{E_k}$`} /><small>давление, Па</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.modelBoundary} aria-label="Границы модели идеального газа">
        <div><span>Материальные точки</span><p>Размеры молекул пренебрежимо малы по сравнению с расстояниями между ними.</p></div>
        <div><span>Свободный полёт</span><p>Между столкновениями взаимодействием молекул пренебрегают.</p></div>
        <div><span>Область применимости</span><p>Модель хорошо приближает разреженные газы при не слишком больших давлениях.</p></div>
      </section>

      <p className={styles.conclusion}>Прибор даёт макроскопический результат. Основное уравнение МКТ объясняет его через концентрацию и статистику теплового движения, не обещая траекторию каждой молекулы.</p>
    </div>
  );
}
