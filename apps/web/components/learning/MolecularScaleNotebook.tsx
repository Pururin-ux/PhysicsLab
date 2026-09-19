import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./MolecularScaleNotebook.module.css";

const scaleSteps = [
  {
    eyebrow: "Измеряем образец",
    title: "18,0 г воды",
    formula: String.raw`$m=18{,}0\ \text{г}$`,
    note: "Это показание весов: макроскопическая масса, которую можно измерить напрямую.",
  },
  {
    eyebrow: "Считаем количество",
    title: "1,00 моль",
    formula: String.raw`$\nu=\frac{m}{M}=\frac{18{,}0}{18{,}0}=1{,}00\ \text{моль}$`,
    note: "Молярная масса воды связывает массу образца с числом одинаковых порций вещества.",
  },
  {
    eyebrow: "Переходим к частицам",
    title: "6,022 · 10²³ молекул",
    formula: String.raw`$N=\nu N_A=6{,}022\cdot10^{23}$`,
    note: "Постоянная Авогадро показывает, сколько частиц приходится на один моль.",
  },
] as const;

export function MolecularScaleNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Масштаб вещества · § 2</p>
        <h2>Весы видят граммы. Формулы позволяют пересчитать их в молекулы</h2>
        <span>Проследим один образец воды через три масштаба. Ни на одном шаге молекулы не становятся видимыми: меняется способ счёта.</span>
      </header>

      <div className={styles.workspace}>
        <section className={styles.scaleLedger} aria-labelledby="molecular-scale-title">
          <div className={styles.ledgerTitle}>
            <span>Один и тот же образец H₂O</span>
            <h3 id="molecular-scale-title">От показания весов к числу частиц</h3>
          </div>
          <ol>
            {scaleSteps.map((step, index) => (
              <li key={step.eyebrow}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{step.eyebrow}</small>
                  <strong>{step.title}</strong>
                  <MathText text={step.formula} />
                  <p>{step.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.measurementLens} aria-label="Измерительная линза Мио: связь одной молекулы и одного моля">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио проверяет единицы в записи молярной массы" width={1254} height={1254} sizes="(max-width:760px) 112px, 150px" />
            <div>
              <span>Измерительная линза</span>
              <s>Моль — это масса</s>
              <strong>Мио проверяет, что именно посчитано.</strong>
            </div>
          </div>
          <div className={styles.lensNotes}>
            <p><span>Количество вещества</span><MathText text={String.raw`$\nu=\frac{N}{N_A}$`} /><small>измеряется в молях</small></p>
            <p><span>Молярная масса</span><MathText text={String.raw`$M=\frac{m}{\nu}$`} /><small>измеряется в кг/моль</small></p>
            <p><span>Масса молекулы</span><MathText text={String.raw`$m_0=\frac{M}{N_A}$`} /><small>измеряется в килограммах</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.distinctions} aria-label="Различия между молекулярной и молярной массой">
        <article>
          <span>Без единицы</span>
          <h3>Относительная масса <MathText text="$M_r$" /></h3>
          <p>Показывает, во сколько раз масса молекулы больше атомной единицы массы. Для воды <MathText text="$M_r=18$" />.</p>
        </article>
        <article>
          <span>На один моль</span>
          <h3>Молярная масса <MathText text="$M$" /></h3>
          <p>Для воды <MathText text={String.raw`$M=18\ \text{г/моль}=0{,}018\ \text{кг/моль}$`} />. Число 18 похоже, но величина и единица другие.</p>
        </article>
        <article>
          <span>Одна частица</span>
          <h3>Масса молекулы <MathText text="$m_0$" /></h3>
          <p><MathText text={String.raw`$m_0\approx2{,}99\cdot10^{-26}\ \text{кг}$`} /> для воды. Это расчёт по модели, а не показание школьных весов.</p>
        </article>
      </section>

      <div className={styles.boundaryNote}>
        <span>Граница модели</span>
        <p>У молекулы нет чёткой механической границы. Оценка диаметра молекулы воды около 0,3 нм задаёт порядок размера, а не изображает её твёрдым шариком.</p>
      </div>

      <p className={styles.conclusion}>Связующая цепочка одна: <MathText text={String.raw`$m\;\longrightarrow\;\nu=\frac{m}{M}\;\longrightarrow\;N=\nu N_A$`} />. Единицы на каждом шаге показывают, какую физическую величину мы получили.</p>
    </div>
  );
}
