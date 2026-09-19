import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./ThermalEquilibriumNotebook.module.css";

const measurementStages = [
  { number: "01", title: "Привести в контакт", text: "Термометр обменивается энергией с телом и сначала меняет собственную температуру." },
  { number: "02", title: "Дождаться постоянного показания", text: "Равновесие распознают по тому, что макроскопические параметры больше не меняются со временем." },
  { number: "03", title: "Снять отсчёт", text: "Только после равновесия температура термометра равна температуре исследуемого тела." },
] as const;

export function ThermalEquilibriumNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Протокол температуры · § 4</p>
        <h2>Термометр не сообщает температуру мгновенно</h2>
        <span>Измерение начинается с обмена энергией. Показание становится результатом только после установления теплового равновесия.</span>
      </header>

      <div className={styles.workspace}>
        <section className={styles.protocol} aria-labelledby="thermal-protocol-title">
          <div className={styles.protocolTitle}>
            <span>Один корректный отсчёт</span>
            <h3 id="thermal-protocol-title">Контакт → ожидание → равновесие</h3>
          </div>
          <ol>
            {measurementStages.map((stage) => (
              <li key={stage.number}>
                <span>{stage.number}</span>
                <div><strong>{stage.title}</strong><p>{stage.text}</p></div>
              </li>
            ))}
          </ol>
          <div className={styles.equilibriumRecord}>
            <span>В равновесии</span>
            <MathText text={String.raw`$T_{\text{тела}}=T_{\text{термометра}}$`} />
            <p>Плотность, давление и объём разных тел могут не совпадать. Общей становится температура.</p>
          </div>
        </section>

        <aside className={styles.measurementLens} aria-label="Измерительная линза Мио для корректного отсчёта температуры">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-skeptical-v2.png" alt="Мио останавливает преждевременный отсчёт термометра" width={1254} height={1254} sizes="(max-width:760px) 112px, 150px" />
            <div><span>Измерительная линза</span><s>Погрузить и сразу прочитать</s><strong>Мио ждёт постоянного показания.</strong></div>
          </div>
          <div className={styles.lensNotes}>
            <p><span>До равновесия</span><strong>Энергия переходит</strong><small>показание ещё изменяется</small></p>
            <p><span>В равновесии</span><strong>Температуры равны</strong><small>направленного обмена энергией нет</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.scaleBridge} aria-labelledby="temperature-scale-title">
        <div>
          <span>Две шкалы</span>
          <h3 id="temperature-scale-title">Одинаковый шаг, разные нули</h3>
          <p>Разность в 1 К равна разности в 1 °C. Но абсолютная температура начинается от физического нуля шкалы.</p>
        </div>
        <div className={styles.scaleLine} aria-label="Соответствие шкал Цельсия и Кельвина">
          <p><span>−273,15 °C</span><strong>0 К</strong><small>абсолютный нуль</small></p>
          <p><span>0 °C</span><strong>273,15 К</strong><small>таяние льда</small></p>
          <p><span>100 °C</span><strong>373,15 К</strong><small>кипение воды при нормальном давлении</small></p>
        </div>
        <MathText text={String.raw`$T=t+273{,}15$`} />
      </section>

      <section className={styles.energyBridge} aria-label="Связь температуры и средней кинетической энергии">
        <div><span>Энергетический смысл</span><h3>Температура задаёт среднюю энергию поступательного движения</h3></div>
        <MathText text={String.raw`$\overline{E_k}=\frac32kT$`} />
        <p>При одной температуре средняя кинетическая энергия одинакова для разных газов и не зависит от массы молекулы. Скорости при этом могут различаться.</p>
        <MathText text={String.raw`$p=nkT$`} />
        <p>В идеальном газе температура и концентрация вместе определяют давление.</p>
      </section>

      <div className={styles.distinctions}>
        <section><span>Температура</span><h3>Не «запас теплоты»</h3><p>Она характеризует состояние и связана со средней кинетической энергией частиц, а не с полным количеством энергии тела.</p></section>
        <section><span>Равновесие</span><h3>Не одинаковость всех величин</h3><p>Температуры равны, но вещества могут иметь разные плотности, объёмы, давления и концентрации.</p></section>
        <section><span>Масса молекулы</span><h3>Энергия равна, скорость — нет</h3><p>При одной температуре более лёгкие молекулы имеют большую среднюю квадратичную скорость.</p></section>
      </div>

      <p className={styles.conclusion}>Корректное измерение требует равновесия, а абсолютная температура позволяет перейти от показания термометра к средней энергии теплового движения частиц.</p>
    </div>
  );
}
