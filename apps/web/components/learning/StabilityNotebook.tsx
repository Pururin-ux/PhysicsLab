import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./StabilityNotebook.module.css";

export function StabilityNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Опыт с отвесом · § 28</p>
        <h2>Тело ещё стоит. Но куда проходит вертикаль веса?</h2>
        <span>Сначала находим точку приложения силы тяжести двумя подвесами. Затем смотрим не на высоту тела вообще, а на то, попадает ли вертикаль из этой точки внутрь опорной площадки.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.apparatus}>
          <svg viewBox="0 0 940 570" role="img" aria-labelledby="stability-title stability-desc">
            <title id="stability-title">Определение центра тяжести пластинки и условие опрокидывания</title>
            <desc id="stability-desc">На пластинке отмечены две линии отвеса от разных точек подвеса. Их пересечение является центром тяжести C. Справа вертикаль силы тяжести наклонённого бруска проходит через край опорной площадки — это граница опрокидывания.</desc>
            <defs>
              <marker id="stability-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
              <filter id="stability-shadow" x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity=".18" /></filter>
            </defs>

            <g aria-label="Два положения подвеса пластинки">
              <text className={styles.panelTitle} x="245" y="48" textAnchor="middle">Две подвески · одна точка C</text>
              <path className={styles.rail} d="M75 84H418" />
              <path className={styles.hook} d="M175 84V116M322 84V116" />
              <path className={styles.plate} d="M116 164C145 120 222 134 251 161C286 119 379 143 383 206C387 260 345 279 357 343C318 389 251 358 215 389C167 375 168 328 119 310C92 267 132 226 116 164Z" filter="url(#stability-shadow)" />
              <circle className={styles.suspensionPoint} cx="175" cy="151" r="7" />
              <circle className={styles.suspensionPoint} cx="322" cy="153" r="7" />
              <path className={styles.markedLineOne} d="M175 151L279 386" />
              <path className={styles.markedLineTwo} d="M322 153L206 380" />
              <g className={styles.centerMark}><circle cx="250" cy="314" r="12" /><path d="M232 314H268M250 296V332" /><text x="273" y="309">C</text></g>
              <g className={styles.plumb}><path d="M175 116V151M322 116V153" /><circle cx="175" cy="116" r="5" /><circle cx="322" cy="116" r="5" /></g>
              <text className={styles.caption} x="245" y="438" textAnchor="middle">Каждую линию отмечают при отдельной подвеске.</text>
              <text className={styles.verdict} x="245" y="475" textAnchor="middle">пересечение линий → центр тяжести</text>
            </g>

            <path className={styles.divider} d="M475 34V530" />

            <g aria-label="Брусок на границе опрокидывания">
              <text className={styles.panelTitle} x="710" y="48" textAnchor="middle">Граница опрокидывания</text>
              <path className={styles.ground} d="M523 448H889" />
              <path className={styles.baseBracket} d="M661 468V490M661 480H828M828 468V490" />
              <text className={styles.caption} x="744" y="516" textAnchor="middle">опорная площадка</text>
              <g className={styles.block} transform="rotate(31 828 448)" filter="url(#stability-shadow)">
                <path d="M682 205H828V448H682Z" />
                <path d="M700 223H810V430H700Z" />
                <circle cx="755" cy="326" r="9" />
                <text x="776" y="321">C</text>
              </g>
              <path className={styles.gravityLine} d="M828 322V442" markerEnd="url(#stability-red-arrow)" />
              <text className={styles.weightLabel} x="846" y="401">P</text>
              <path className={styles.edgeGuide} d="M828 183V452" />
              <circle className={styles.edgePoint} cx="828" cy="448" r="8" />
              <text className={styles.edgeLabel} x="844" y="420">край</text>
              <text className={styles.verdict} x="710" y="111" textAnchor="middle">вертикаль дошла до края</text>
              <text className={styles.caption} x="710" y="140" textAnchor="middle">дальше тело опрокинется</text>
            </g>
          </svg>
          <figcaption>Опорная площадка ограничена крайними точками контакта с опорой. Она может быть шире суммарной площади непосредственного контакта, например у стола на четырёх ножках.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для устойчивости">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-skeptical-v1.png" alt="Мио проверяет отвесом вертикаль из центра тяжести" width={1254} height={1254} sizes="(max-width:760px) 112px, 150px" />
            <div><span>Измерительная линза</span><s>Высокое всегда падает</s><strong>Мио продолжает вертикаль из C до опоры.</strong></div>
          </div>
          <div className={styles.lensRule}>
            <p><span>Вертикаль внутри опоры</span><strong>есть запас устойчивости</strong></p>
            <p><span>Вертикаль на краю</span><strong>граница опрокидывания</strong></p>
            <p><span>Вертикаль за краем</span><strong>момент веса опрокидывает</strong></p>
          </div>
        </aside>
      </div>

      <section className={styles.energyStates} aria-labelledby="equilibrium-types-title">
        <header><p>Три опыта с малым отклонением</p><h3 id="equilibrium-types-title">Куда тело движется после толчка?</h3></header>
        <article className={styles.stable}><div><span className={styles.ball} /><span className={styles.track} /></div><h4>Устойчивое</h4><p>Возвращается. При отклонении потенциальная энергия растёт; в положении равновесия она минимальна.</p></article>
        <article className={styles.unstable}><div><span className={styles.ball} /><span className={styles.track} /></div><h4>Неустойчивое</h4><p>Удаляется. Малое отклонение уменьшает потенциальную энергию и уводит тело от исходной точки.</p></article>
        <article className={styles.neutral}><div><span className={styles.ball} /><span className={styles.track} /></div><h4>Безразличное</h4><p>Остаётся в новом положении. Высота центра тяжести и потенциальная энергия не изменяются.</p></article>
      </section>

      <div className={styles.distinctions}>
        <section><span>Центр тяжести</span><h3>Точка приложения веса</h3><p>Для однородного симметричного тела совпадает с геометрическим центром, но может находиться и вне материала тела.</p></section>
        <section><span>Два груза</span><h3>Ближе к большей массе</h3><p>Для лёгкого стержня <MathText text={String.raw`$\dfrac{l_1}{l_2}=\dfrac{m_2}{m_1}$`} />: моменты весов относительно C уравновешиваются.</p></section>
        <section><span>Практический вывод</span><h3>Ниже C, шире опора</h3><p>Чтобы опрокинуть тело с низким центром тяжести и широкой опорой, его нужно отклонить на больший угол.</p></section>
      </div>
    </div>
  );
}
