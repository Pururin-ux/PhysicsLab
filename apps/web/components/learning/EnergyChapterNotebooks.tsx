import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./EnergyChapterNotebooks.module.css";

export function WorkAndPowerNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Проекция вдоль перемещения · § 33</p>
        <h2>Сила тянет вверх и вперёд. Какая её часть совершает работу?</h2>
        <span>Работу определяет не весь вектор силы, а его составляющая вдоль перемещения. Перпендикулярная составляющая может менять опору или траекторию, но в выбранном перемещении работы не совершает.</span>
      </header>
      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 540" role="img" aria-labelledby="work-title work-desc">
            <title id="work-title">Проекция силы и работа как площадь под графиком</title>
            <desc id="work-desc">Слева сила F разложена на составляющие вдоль и поперёк перемещения бруска. Справа работа переменной силы показана площадью под графиком проекции силы от перемещения.</desc>
            <defs>
              <marker id="work-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="work-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>
            <g aria-label="Разложение силы относительно перемещения">
              <text className={styles.panelTitle} x="250" y="48" textAnchor="middle">Сила и перемещение</text>
              <path className={styles.ground} d="M55 391H449" />
              <g className={styles.block}><path d="M157 292H313V378H157Z" /><circle cx="190" cy="391" r="13" /><circle cx="282" cy="391" r="13" /></g>
              <path className={styles.displacement} d="M109 454H382" markerEnd="url(#work-cyan-arrow)" />
              <text className={styles.cyanLabel} x="113" y="439">Δr</text>
              <path className={styles.force} d="M235 292L391 164" markerEnd="url(#work-red-arrow)" />
              <text className={styles.redLabel} x="372" y="151">F</text>
              <path className={styles.projection} d="M235 292H391" markerEnd="url(#work-cyan-arrow)" />
              <text className={styles.cyanLabel} x="326" y="278">F cos α</text>
              <path className={styles.perpendicular} d="M391 164V292" />
              <text className={styles.mutedLabel} x="399" y="229">F⊥</text>
              <path className={styles.angle} d="M287 292A52 52 0 0 0 275 259" />
              <text className={styles.goldLabel} x="289" y="263">α</text>
              <text className={styles.verdictStrong} x="250" y="504" textAnchor="middle">A = F Δr cos α</text>
            </g>
            <path className={styles.divider} d="M500 34V506" />
            <g aria-label="Работа как площадь под графиком силы">
              <text className={styles.panelTitle} x="747" y="48" textAnchor="middle">Переменная сила</text>
              <path className={styles.axis} d="M572 439V104M572 439H928" markerEnd="url(#work-cyan-arrow)" />
              <text className={styles.axisLabel} x="547" y="113">Fᵣ</text><text className={styles.axisLabel} x="906" y="469">Δr</text>
              <path className={styles.areaFill} d="M572 369L694 369L694 279L814 194L900 132V439H572Z" />
              <path className={styles.forceGraph} d="M572 369H694V279L814 194L900 132" />
              <path className={styles.guide} d="M694 279V439M814 194V439" />
              <text className={styles.areaLabel} x="739" y="349">A = площадь</text>
              <text className={styles.verdict} x="747" y="498" textAnchor="middle">делим фигуру на простые участки</text>
            </g>
          </svg>
          <figcaption>Для постоянной силы площадь — прямоугольник <MathText text={String.raw`$F_r\Delta r$`} />. Для переменной силы работа по-прежнему равна площади под графиком проекции силы, но эту площадь приходится складывать по участкам.</figcaption>
        </figure>
        <aside className={styles.measurementLens} aria-label="Измерительная линза работы силы">
          <div className={styles.mioAction}><Image src="/images/mio/mio-attentive-v1.png" alt="Мио опускает перпендикуляр от вектора силы на направление перемещения" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" /><div><span>Измерительная линза</span><strong>Мио проецирует силу на линию перемещения.</strong><p>Знак проекции сразу показывает, помогает сила движению или мешает.</p></div></div>
          <div className={styles.lensLedger}><p><span>Острый угол</span><strong>A &gt; 0</strong></p><p><span>Прямой угол</span><strong>A = 0</strong></p><p className={styles.result}><span>Тупой угол</span><strong>A &lt; 0</strong></p></div>
        </aside>
      </div>
      <section className={styles.threeStrip} aria-labelledby="power-tradeoff-title"><header><p>Одна мощность двигателя</p><h3 id="power-tradeoff-title">Сила или скорость?</h3></header><article><span>Быстро</span><h4>Большая v · меньшая F</h4><p>На ровной дороге сопротивление меньше, поэтому та же мощность позволяет двигаться быстрее.</p></article><article><span>В гору</span><h4>Меньшая v · большая F</h4><p>При <MathText text={String.raw`$P=Fv$`} /> снижение скорости оставляет больше силы для преодоления подъёма.</p></article></section>
    </div>
  );
}

export function PotentialEnergySystemNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}><p>Энергия принадлежит взаимодействию · § 34</p><h2>Груз неподвижен. Почему энергия всё равно есть?</h2><span>Потенциальная энергия описывает не одиночный предмет, а взаимное положение тел системы. Число зависит от выбранного нуля; изменение между двумя состояниями — нет.</span></header>
      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 540" role="img" aria-labelledby="potential-title potential-desc">
            <title id="potential-title">Потенциальная энергия системы тело — Земля и упругой пружины</title>
            <desc id="potential-desc">Слева один груз показан относительно двух нулевых уровней: значения mgh различаются, но изменение при перемещении одинаково. Справа энергия пружины растёт как квадрат деформации.</desc>
            <g aria-label="Два нулевых уровня потенциальной энергии">
              <text className={styles.panelTitle} x="255" y="48" textAnchor="middle">Система «груз + Земля»</text>
              <path className={styles.zeroLine} d="M66 407H438" /><text className={styles.zeroLabel} x="76" y="396">нуль 1</text>
              <path className={styles.zeroLineAlt} d="M66 283H438" /><text className={styles.zeroLabelAlt} x="76" y="272">нуль 2</text>
              <g className={styles.hangingMass}><path d="M205 135H307V229H205Z" /><text x="256" y="190" textAnchor="middle">m</text></g>
              <path className={styles.heightOne} d="M335 229V407M324 229H346M324 407H346" />
              <path className={styles.heightTwo} d="M381 229V283M370 229H392M370 283H392" />
              <text className={styles.goldLabel} x="348" y="327">h₁</text><text className={styles.cyanLabel} x="394" y="263">h₂</text>
              <text className={styles.verdict} x="255" y="455" textAnchor="middle">Eₚ меняется вместе с выбранным нулём</text>
              <text className={styles.verdictStrong} x="255" y="494" textAnchor="middle">ΔEₚ = −Aвзаимодействия</text>
            </g>
            <path className={styles.divider} d="M510 34V506" />
            <g aria-label="Энергия деформированной пружины">
              <text className={styles.panelTitle} x="752" y="48" textAnchor="middle">Упругая система</text>
              <path className={styles.spring} d="M579 164H626L641 139L671 189L701 139L731 189L761 139L791 189L821 139L836 164H909" />
              <path className={styles.springWall} d="M579 116V212M565 128H579M565 152H579M565 176H579M565 200H579" />
              <path className={styles.axis} d="M594 430V250M594 430H918" />
              <text className={styles.axisLabel} x="567" y="263">Eₚ</text><text className={styles.axisLabel} x="901" y="460">x</text>
              <path className={styles.energyFill} d="M594 430C690 426 807 378 900 270V430Z" />
              <path className={styles.energyCurve} d="M594 430C690 426 807 378 900 270" />
              <text className={styles.areaLabel} x="745" y="344">Eₚ = kx² / 2</text>
              <text className={styles.verdictStrong} x="752" y="494" textAnchor="middle">вдвое больше x → вчетверо больше Eₚ</text>
            </g>
          </svg>
          <figcaption>Высота (h) относится к системе «тело + Земля», а деформация (x) — к взаимному положению частей упругого тела. Одинаковое слово «потенциальная» не означает одну универсальную формулу.</figcaption>
        </figure>
        <aside className={styles.measurementLens} aria-label="Измерительная линза изменения потенциальной энергии"><div className={styles.mioAction}><Image src="/images/mio/mio-thinking-v1.png" alt="Мио проводит два нулевых уровня и сравнивает изменение энергии" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" /><div><span>Измерительная линза</span><strong>Мио меняет нулевой уровень, не двигая груз.</strong><p>Оба значения энергии сдвигаются, но разность между положениями остаётся той же.</p></div></div><div className={styles.lensLedger}><p><span>Значение Eₚ</span><strong>зависит от нуля</strong></p><p><span>Изменение ΔEₚ</span><strong>не зависит от нуля</strong></p><p className={styles.result}><span>Работа силы системы</span><strong><MathText text={String.raw`$A=-\Delta E_p$`} /></strong></p></div></aside>
      </div>
    </div>
  );
}

export function KineticAndTotalEnergyNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}><p>Работа меняет движение · § 35</p><h2>Скорость изменилась. Куда записать работу всех сил?</h2><span>Работа равнодействующей изменяет кинетическую энергию. Но кинетическая и потенциальная энергии — только механическая часть полного энергетического счёта системы.</span></header>
      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 520" role="img" aria-labelledby="kinetic-title kinetic-desc">
            <title id="kinetic-title">Теорема об изменении кинетической энергии и полный энергетический счёт</title>
            <desc id="kinetic-desc">Слева тележка ускоряется от v0 до v, а работа равнодействующей равна разности кинетических энергий. Справа механическая энергия показана как часть полной энергии вместе с внутренней.</desc>
            <defs><marker id="kinetic-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker><marker id="kinetic-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker></defs>
            <g aria-label="Работа равнодействующей и изменение скорости"><text className={styles.panelTitle} x="263" y="48" textAnchor="middle">Два состояния одного тела</text><path className={styles.ground} d="M54 405H474" /><g className={styles.block}><path d="M86 305H201V383H86Z" /><circle cx="112" cy="397" r="12" /><circle cx="176" cy="397" r="12" /></g><path className={styles.velocityShort} d="M87 272H174" markerEnd="url(#kinetic-cyan-arrow)" /><text className={styles.cyanLabel} x="94" y="255">v₀</text><path className={styles.stateArrow} d="M218 344H289" markerEnd="url(#kinetic-red-arrow)" /><text className={styles.redLabel} x="228" y="327">Aрез</text><g className={styles.block}><path d="M309 289H448V383H309Z" /><circle cx="342" cy="397" r="12" /><circle cx="416" cy="397" r="12" /></g><path className={styles.velocityLong} d="M309 252H455" markerEnd="url(#kinetic-cyan-arrow)" /><text className={styles.cyanLabel} x="318" y="235">v</text><text className={styles.verdictStrong} x="263" y="464" textAnchor="middle">Aрез = ΔEₖ = mv²/2 − mv₀²/2</text></g>
            <path className={styles.divider} d="M514 34V486" />
            <g aria-label="Полная, механическая и внутренняя энергия"><text className={styles.panelTitle} x="752" y="48" textAnchor="middle">Энергетический счёт системы</text><rect className={styles.totalBox} x="560" y="103" width="387" height="342" rx="30" /><text className={styles.totalLabel} x="585" y="137">ПОЛНАЯ ЭНЕРГИЯ</text><rect className={styles.mechanicalBox} x="590" y="167" width="327" height="122" rx="22" /><text className={styles.mechanicalLabel} x="614" y="199">МЕХАНИЧЕСКАЯ</text><rect className={styles.kineticBox} x="615" y="220" width="126" height="48" rx="14" /><text className={styles.boxText} x="678" y="250" textAnchor="middle">Eₖ</text><rect className={styles.potentialBox} x="758" y="220" width="126" height="48" rx="14" /><text className={styles.boxText} x="821" y="250" textAnchor="middle">Eₚ</text><rect className={styles.internalBox} x="590" y="315" width="327" height="92" rx="22" /><text className={styles.internalLabel} x="753" y="353" textAnchor="middle">ВНУТРЕННЯЯ Eвнутр</text><text className={styles.verdictStrong} x="753" y="390" textAnchor="middle">E = Eмех + Eвнутр</text></g>
          </svg>
          <figcaption>Кинетическая энергия зависит от системы отсчёта, потому что от неё зависит скорость. Полная энергия выбранной системы включает механическую и внутреннюю энергии — это разные уровни одного счёта, а не конкурирующие ответы.</figcaption>
        </figure>
        <aside className={styles.measurementLens} aria-label="Измерительная линза энергетического счёта"><div className={styles.mioAction}><Image src="/images/mio/mio-skeptical-v1.png" alt="Мио проверяет, какая работа и какая энергия указаны в решении" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" /><div><span>Измерительная линза</span><strong>Мио подписывает силу, систему и два состояния.</strong><p>«Энергия изменилась» недостаточно: нужно назвать её вид и границы системы.</p></div></div><div className={styles.lensLedger}><p><span>Работа равнодействующей</span><strong>ΔEₖ</strong></p><p><span>Механическая энергия</span><strong>Eₖ + Eₚ</strong></p><p className={styles.result}><span>Полная энергия</span><strong>Eмех + Eвнутр</strong></p></div></aside>
      </div>
    </div>
  );
}

export function EnergyConservationBoundaryNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}><p>Система решает, что сохраняется · § 36</p><h2>Брусок остановился от трения. Энергия исчезла?</h2><span>Если считать только механическое движение бруска, энергия уменьшилась. Если включить в систему стол и его микрочастицы, та же энергия обнаруживается как увеличение внутренней.</span></header>
      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 540" role="img" aria-labelledby="energy-law-title energy-law-desc">
            <title id="energy-law-title">Границы сохранения механической и полной энергии</title>
            <desc id="energy-law-desc">Слева замкнутая система без трения сохраняет сумму кинетической и потенциальной энергий. Справа брусок тормозится на столе: механическая энергия уменьшается, а внутренняя энергия бруска и стола возрастает.</desc>
            <defs><marker id="energy-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker><marker id="energy-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker></defs>
            <g aria-label="Сохранение механической энергии без трения"><text className={styles.panelTitle} x="255" y="48" textAnchor="middle">Только тяжесть и упругость</text><path className={styles.arcTrack} d="M68 162C159 442 346 442 444 162" /><circle className={styles.ballHigh} cx="97" cy="230" r="19" /><circle className={styles.ballLow} cx="258" cy="389" r="19" /><path className={styles.motionPath} d="M116 245C168 335 211 374 237 383" markerEnd="url(#energy-cyan-arrow)" /><g className={styles.energyBars}><rect x="86" y="454" width="74" height="16" /><rect x="160" y="454" width="18" height="16" /><rect x="251" y="454" width="18" height="16" /><rect x="269" y="454" width="74" height="16" /></g><text className={styles.goldLabel} x="91" y="500">Eₚ</text><text className={styles.cyanLabel} x="288" y="500">Eₖ</text><text className={styles.verdictStrong} x="255" y="113" textAnchor="middle">Eₖ + Eₚ = const</text></g>
            <path className={styles.divider} d="M510 34V506" />
            <g aria-label="Переход механической энергии во внутреннюю при трении"><text className={styles.panelTitle} x="753" y="48" textAnchor="middle">Трение внутри системы</text><rect className={styles.frictionBoundary} x="553" y="89" width="400" height="377" rx="35" /><text className={styles.boundaryText} x="578" y="121">система: брусок + стол</text><path className={styles.ground} d="M590 328H918" /><g className={styles.block}><path d="M627 239H748V316H627Z" /></g><path className={styles.velocityLong} d="M627 207H800" markerEnd="url(#energy-cyan-arrow)" /><text className={styles.cyanLabel} x="637" y="190">v → 0</text><path className={styles.frictionForce} d="M748 288H635" markerEnd="url(#energy-red-arrow)" /><text className={styles.redLabel} x="767" y="294">Fтр</text><path className={styles.transferArrow} d="M690 351V414" markerEnd="url(#energy-red-arrow)" /><text className={styles.verdict} x="750" y="374">Eмех уменьшается</text><text className={styles.verdictStrong} x="750" y="428" textAnchor="middle">Eвнутр возрастает</text><text className={styles.verdictStrong} x="750" y="452" textAnchor="middle">на ту же величину</text></g>
          </svg>
          <figcaption>Полная энергия замкнутой системы сохраняется всегда. Механическая энергия сохраняется только в более узкой модели: внутри системы действуют силы тяжести или упругости, а внешняя работа равна нулю.</figcaption>
        </figure>
        <aside className={styles.measurementLens} aria-label="Измерительная линза закона сохранения энергии"><div className={styles.mioAction}><Image src="/images/mio/mio-skeptical-v2.png" alt="Мио расширяет границу системы, включая в неё брусок и стол" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" /><div><span>Измерительная линза</span><strong>Мио расширяет границу: теперь стол тоже внутри системы.</strong><p>«Потеря» механической энергии превращается в измеримое нагревание тел.</p></div></div><div className={styles.lensLedger}><p><span>Внешняя работа</span><strong>меняет Eмех</strong></p><p><span>Трение внутри</span><strong>Eмех → Eвнутр</strong></p><p className={styles.result}><span>Замкнутая система</span><strong>Eполн = const</strong></p></div></aside>
      </div>
      <div className={styles.distinctions}><section><span>Механическая</span><h3>Сохраняется не всегда</h3><p>Нужны нулевая внешняя работа и отсутствие превращения во внутреннюю энергию из-за трения или сопротивления.</p></section><section><span>Полная</span><h3>Сохраняется в замкнутой системе</h3><p>Учитывает механическую и внутреннюю энергии. Их сумма не уменьшается при нагревании.</p></section><section><span>Открытая система</span><h3>Энергия пересекает границу</h3><p>Работа внешней силы или теплообмен меняют энергетический счёт выбранной системы.</p></section></div>
    </div>
  );
}
