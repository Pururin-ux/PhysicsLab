import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./MomentumNotebooks.module.css";

export function MomentumSystemNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Сначала выбираем систему · § 31</p>
        <h2>Тележки толкнули друг друга. Почему общий импульс не изменился?</h2>
        <span>У каждого тела импульс может измениться из-за внутренних сил. Для всей выбранной системы эти силы образуют пары и сокращаются; изменить её суммарный импульс способен только внешний импульс.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 540" role="img" aria-labelledby="momentum-system-title momentum-system-desc">
            <title id="momentum-system-title">Импульс тела и импульс системы тележек</title>
            <desc id="momentum-system-desc">Слева сравниваются импульсы лёгкой и тяжёлой тележек при одинаковой скорости. Справа пунктирная граница объединяет две тележки в систему: силы между ними внутренние и противоположные, а внешняя сила меняет импульс всей системы.</desc>
            <defs>
              <marker id="momentum-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="momentum-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Сравнение импульсов двух тел">
              <text className={styles.panelTitle} x="245" y="48" textAnchor="middle">Одна скорость · разные массы</text>
              <path className={styles.track} d="M53 394H447" />
              <g className={styles.cartLight}><path d="M83 300H208V372H83Z" /><circle cx="111" cy="386" r="14" /><circle cx="181" cy="386" r="14" /></g>
              <text className={styles.massLabel} x="145" y="342" textAnchor="middle">m</text>
              <path className={styles.velocity} d="M82 261H207" markerEnd="url(#momentum-cyan-arrow)" />
              <text className={styles.velocityLabel} x="91" y="246">v</text>
              <g className={styles.cartHeavy}><path d="M255 278H420V372H255Z" /><path d="M276 298H399V352H276Z" /><circle cx="290" cy="386" r="14" /><circle cx="385" cy="386" r="14" /></g>
              <text className={styles.massLabel} x="337" y="334" textAnchor="middle">3m</text>
              <path className={styles.velocity} d="M255 239H380" markerEnd="url(#momentum-cyan-arrow)" />
              <text className={styles.velocityLabel} x="264" y="224">v</text>
              <path className={styles.momentumLight} d="M84 452H139" markerEnd="url(#momentum-red-arrow)" />
              <path className={styles.momentumHeavy} d="M255 452H420" markerEnd="url(#momentum-red-arrow)" />
              <text className={styles.momentumLabel} x="84" y="493">p = mv</text>
              <text className={styles.momentumLabel} x="255" y="493">p = 3mv</text>
            </g>

            <path className={styles.divider} d="M490 34V506" />

            <g aria-label="Внутренние и внешняя силы системы">
              <text className={styles.panelTitle} x="735" y="48" textAnchor="middle">Граница механической системы</text>
              <rect className={styles.systemBoundary} x="546" y="104" width="375" height="338" rx="42" />
              <text className={styles.boundaryLabel} x="570" y="136">система: тележка 1 + тележка 2</text>
              <path className={styles.track} d="M574 361H890" />
              <g className={styles.cartLight}><path d="M604 284H712V340H604Z" /><circle cx="630" cy="353" r="12" /><circle cx="687" cy="353" r="12" /></g>
              <g className={styles.cartHeavy}><path d="M756 274H866V340H756Z" /><circle cx="781" cy="353" r="12" /><circle cx="842" cy="353" r="12" /></g>
              <path className={styles.internalForce} d="M712 263H753" markerEnd="url(#momentum-cyan-arrow)" />
              <path className={styles.internalForce} d="M756 244H715" markerEnd="url(#momentum-cyan-arrow)" />
              <text className={styles.internalLabel} x="722" y="232">F₁₂ = −F₂₁</text>
              <path className={styles.externalForce} d="M505 314H590" markerEnd="url(#momentum-red-arrow)" />
              <text className={styles.externalLabel} x="516" y="296">Fвнеш</text>
              <text className={styles.verdict} x="735" y="407" textAnchor="middle">внутренние силы меняют части</text>
              <text className={styles.verdictStrong} x="735" y="475" textAnchor="middle">Δpсист = Fвнеш · Δt</text>
            </g>
          </svg>
          <figcaption>Граница системы — часть решения. Если локомотив находится снаружи выбранной системы «вагон», его тяга внешняя; если включить локомотив в систему, ту же пару взаимодействия придётся классифицировать заново.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза импульса системы">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="Мио обводит границу выбранной механической системы" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио сначала обводит тела, которые считает одной системой.</strong><p>Только после этого силы получают роли «внутренняя» и «внешняя».</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Одно тело</span><strong><MathText text={String.raw`$\vec p=m\vec v$`} /></strong></p>
            <p><span>Система</span><strong><MathText text={String.raw`$\vec p_{сист}=\sum\vec p_i$`} /></strong></p>
            <p className={styles.result}><span>Изменение системы</span><strong><MathText text={String.raw`$\Delta\vec p_{сист}=\vec F_{внеш}\Delta t$`} /></strong></p>
          </div>
        </aside>
      </div>

      <section className={styles.timeComparison} aria-labelledby="impulse-time-title">
        <header><p>Одинаковое Δp · разное время остановки</p><h3 id="impulse-time-title">Почему подушка безопасности уменьшает силу?</h3></header>
        <article><div className={styles.shortTime}><span /></div><h4>Короткое торможение</h4><p>То же изменение импульса за малое Δt требует большой средней силы.</p></article>
        <article><div className={styles.longTime}><span /></div><h4>Долгое торможение</h4><p>Ремень и подушка увеличивают Δt, поэтому средняя сила уменьшается.</p></article>
      </section>
    </div>
  );
}

export function MomentumConservationNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Сравниваем «до» и «после» · § 32</p>
        <h2>Тележки сцепились. Что именно осталось неизменным?</h2>
        <span>Скорости и кинетическая энергия могут измениться. Сохраняется векторная сумма импульсов выбранной системы — и только если внешний импульс за время взаимодействия равен нулю или им можно пренебречь.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 540" role="img" aria-labelledby="momentum-law-title momentum-law-desc">
            <title id="momentum-law-title">Неупругое столкновение и реактивное движение</title>
            <desc id="momentum-law-desc">Слева показаны две тележки до столкновения и сцепившаяся система после него. Справа воздух вылетает из шарика назад, а тележка движется вперёд; импульсы частей направлены противоположно.</desc>
            <defs>
              <marker id="conservation-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="conservation-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Тележки до и после неупругого столкновения">
              <text className={styles.panelTitle} x="286" y="48" textAnchor="middle">Неупругое столкновение</text>
              <text className={styles.phaseLabel} x="72" y="105">ДО</text>
              <path className={styles.track} d="M62 231H493" />
              <g className={styles.cartLight}><path d="M88 157H204V211H88Z" /><circle cx="115" cy="224" r="12" /><circle cx="177" cy="224" r="12" /></g>
              <g className={styles.cartHeavy}><path d="M342 147H462V211H342Z" /><circle cx="370" cy="224" r="12" /><circle cx="434" cy="224" r="12" /></g>
              <path className={styles.velocity} d="M89 132H270" markerEnd="url(#conservation-cyan-arrow)" />
              <path className={styles.velocitySlow} d="M342 122H430" markerEnd="url(#conservation-cyan-arrow)" />
              <text className={styles.velocityLabel} x="99" y="118">v₁</text><text className={styles.velocityLabel} x="351" y="108">v₂</text>
              <path className={styles.beforeAfter} d="M278 253V306" markerEnd="url(#conservation-red-arrow)" />
              <text className={styles.phaseLabel} x="72" y="348">ПОСЛЕ</text>
              <path className={styles.track} d="M62 466H493" />
              <g className={styles.joinedCart}><path d="M188 379H374V446H188Z" /><path d="M279 379V446" /><circle cx="225" cy="459" r="12" /><circle cx="340" cy="459" r="12" /></g>
              <path className={styles.velocity} d="M189 352H347" markerEnd="url(#conservation-cyan-arrow)" />
              <text className={styles.velocityLabel} x="198" y="338">v</text>
              <text className={styles.verdictStrong} x="278" y="507" textAnchor="middle">m₁v₁ + m₂v₂ = (m₁ + m₂)v</text>
            </g>

            <path className={styles.divider} d="M526 34V506" />

            <g aria-label="Реактивное движение тележки с воздушным шаром">
              <text className={styles.panelTitle} x="755" y="48" textAnchor="middle">Разделение одной системы</text>
              <path className={styles.track} d="M570 404H932" />
              <g className={styles.rocketCart}><path d="M671 329H851V384H671Z" /><circle cx="710" cy="397" r="13" /><circle cx="818" cy="397" r="13" /></g>
              <path className={styles.balloonSide} d="M754 149C694 149 668 189 682 236C692 269 724 291 754 304C784 291 816 269 826 236C840 189 814 149 754 149Z" />
              <path className={styles.balloonTie} d="M754 304V329M741 304H767" />
              <path className={styles.airJet} d="M682 231C635 213 618 222 584 203M682 246C637 248 620 258 590 270" markerEnd="url(#conservation-red-arrow)" />
              <path className={styles.velocity} d="M696 111H866" markerEnd="url(#conservation-cyan-arrow)" />
              <text className={styles.velocityLabel} x="705" y="96">vтележки</text>
              <text className={styles.externalLabel} x="565" y="188">pвоздуха</text>
              <text className={styles.verdict} x="755" y="449" textAnchor="middle">до прокола: pсист = 0</text>
              <text className={styles.verdictStrong} x="755" y="486" textAnchor="middle">pтележки = −pвоздуха</text>
            </g>
          </svg>
          <figcaption>Сцепившиеся тележки сохраняют общий импульс, но часть механической энергии переходит во внутреннюю. Закон сохранения импульса не утверждает, что сохраняются скорости или кинетическая энергия.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза закона сохранения импульса">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-skeptical-v2.png" alt="Мио проверяет внешние силы до записи закона сохранения импульса" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио не сокращает импульсы, пока не проверит внешние силы.</strong><p>В коротком столкновении их импульсом иногда можно пренебречь — это условие модели, а не автоматическое правило.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>До взаимодействия</span><strong><MathText text={String.raw`$\sum\vec p_{до}$`} /></strong></p>
            <p><span>Внешний импульс</span><strong><MathText text={String.raw`$\vec F_{внеш}\Delta t\approx0$`} /></strong></p>
            <p className={styles.result}><span>После взаимодействия</span><strong><MathText text={String.raw`$\sum\vec p_{после}=\sum\vec p_{до}$`} /></strong></p>
          </div>
        </aside>
      </div>

      <div className={styles.distinctions}>
        <section><span>Сцепление</span><h3>Импульс сохраняется</h3><p>После абсолютно неупругого удара тела движутся вместе. Общий импульс делят на общую массу.</p></section>
        <section><span>Энергия</span><h3>Не обязана сохраняться как механическая</h3><p>Деформация и нагрев получают часть энергии. Равенство импульсов «до» и «после» этого не запрещает.</p></section>
        <section><span>Реактивное движение</span><h3>Части расходятся</h3><p>Газ получает импульс назад, аппарат — равный по модулю противоположный импульс вперёд.</p></section>
      </div>
    </div>
  );
}
