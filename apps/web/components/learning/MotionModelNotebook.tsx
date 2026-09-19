import Image from "next/image";
import styles from "./MotionModelNotebook.module.css";

export function MotionModelNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Сначала вопрос, потом модель · § 1</p>
        <h2>Самолёт огромный. Почему в одной задаче он превращается в точку?</h2>
        <span>Физическая модель сохраняет только свойства, нужные для ответа. Размеры можно не учитывать, когда они не влияют на искомый результат; в другой задаче тот же объект придётся рассматривать подробно.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 570" role="img" aria-labelledby="model-title model-desc">
            <title id="model-title">Выбор модели материальной точки зависит от вопроса задачи</title>
            <desc id="model-desc">Три ситуации показывают самолёт на длинном маршруте, движение крыла бабочки и Землю на орбите и при суточном вращении. Справа поступательное движение сравнивается с вращением твёрдого тела.</desc>
            <defs>
              <marker id="model-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="model-gold-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.goldHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <g aria-label="Три решения о модели материальной точки">
              <text className={styles.panelTitle} x="272" y="47" textAnchor="middle">Размеры важны только относительно вопроса</text>

              <g transform="translate(55 89)">
                <rect className={styles.caseCard} width="434" height="116" rx="22" />
                <path className={styles.route} d="M32 73C109 24 242 28 359 69" markerEnd="url(#model-cyan-arrow)" />
                <path className={styles.plane} d="M198 42L236 54L262 43L246 66L262 86L234 74L198 86L209 65Z" />
                <text className={styles.caseTitle} x="26" y="27">Перелёт между городами</text>
                <text className={styles.yesLabel} x="408" y="31" textAnchor="end">МОЖНО → ТОЧКА</text>
                <text className={styles.caseNote} x="26" y="103">размер самолёта мал по сравнению с маршрутом</text>
              </g>

              <g transform="translate(55 222)">
                <rect className={styles.caseCard} width="434" height="116" rx="22" />
                <path className={styles.butterflyBody} d="M212 43V82" />
                <path className={styles.butterflyWing} d="M207 53C163 8 132 34 160 69C127 72 151 107 207 75M217 53C261 8 292 34 264 69C297 72 273 107 217 75" />
                <path className={styles.motionArc} d="M121 90A107 77 0 0 1 308 38" markerEnd="url(#model-gold-arrow)" />
                <text className={styles.caseTitle} x="26" y="27">Как движется крыло бабочки?</text>
                <text className={styles.noLabel} x="408" y="31" textAnchor="end">НЕЛЬЗЯ</text>
                <text className={styles.caseNote} x="26" y="103">форма, размер и движение частей входят в ответ</text>
              </g>

              <g transform="translate(55 355)">
                <rect className={styles.caseCard} width="434" height="148" rx="22" />
                <ellipse className={styles.earthOrbit} cx="224" cy="82" rx="165" ry="45" />
                <circle className={styles.sun} cx="224" cy="82" r="18" />
                <circle className={styles.earth} cx="375" cy="66" r="17" />
                <path className={styles.orbitArrow} d="M76 101C117 131 297 139 383 92" markerEnd="url(#model-cyan-arrow)" />
                <path className={styles.spinArrow} d="M360 51A22 22 0 1 1 357 80" markerEnd="url(#model-gold-arrow)" />
                <text className={styles.caseTitle} x="26" y="27">Земля: орбита или сутки?</text>
                <text className={styles.splitLabel} x="408" y="31" textAnchor="end">ЗАВИСИТ ОТ ВОПРОСА</text>
                <text className={styles.caseNote} x="26" y="134">для орбиты — точка; для суточного вращения размеры важны</text>
              </g>
            </g>

            <path className={styles.divider} d="M530 35V530" />

            <g aria-label="Поступательное движение и вращение твёрдого тела">
              <text className={styles.panelTitle} x="755" y="47" textAnchor="middle">Что делает всё твёрдое тело?</text>
              <text className={styles.subhead} x="755" y="94" textAnchor="middle">ПОСТУПАТЕЛЬНОЕ</text>
              <g className={styles.ruler} transform="translate(590 119)"><rect width="188" height="54" rx="10" /><circle cx="28" cy="27" r="7" /><circle cx="160" cy="27" r="7" /><text x="23" y="19">A</text><text x="155" y="19">B</text></g>
              <path className={styles.translationArrow} d="M630 201H866" markerEnd="url(#model-cyan-arrow)" />
              <g className={styles.rulerGhost} transform="translate(690 226)"><rect width="188" height="54" rx="10" /><circle cx="28" cy="27" r="7" /><circle cx="160" cy="27" r="7" /></g>
              <text className={styles.verdict} x="755" y="307" textAnchor="middle">AB остаётся параллельной самой себе</text>

              <path className={styles.ruleLine} d="M574 337H936" />
              <text className={styles.subhead} x="755" y="374" textAnchor="middle">ВРАЩЕНИЕ</text>
              <g className={styles.ruler} transform="translate(660 403) rotate(-28 94 27)"><rect width="188" height="54" rx="10" /><circle cx="28" cy="27" r="7" /><circle cx="160" cy="27" r="7" /><text x="23" y="19">A</text><text x="155" y="19">B</text></g>
              <path className={styles.rotationArrow} d="M607 475A154 98 0 0 0 882 438" markerEnd="url(#model-gold-arrow)" />
              <text className={styles.verdictStrong} x="755" y="526" textAnchor="middle">направление AB меняется</text>
            </g>
          </svg>
          <figcaption>Материальная точка — модель, а не маленький предмет. При поступательном движении все точки твёрдого тела описывают одинаковые, лишь смещённые траектории; при вращении одной точки уже недостаточно.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза выбора физической модели">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="Мио сначала подчёркивает вопрос задачи, затем решает, важны ли размеры тела" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио подчёркивает вопрос раньше, чем упрощает объект.</strong><p>Не «Земля — точка», а «для расчёта орбиты размерами Земли можно пренебречь».</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Что ищем?</span><strong>путь, время, вращение или движение части</strong></p>
            <p><span>Влияют ли размеры?</span><strong>если нет — заменяем тело точкой</strong></p>
            <p className={styles.result}><span>Вывод</span><strong>модель действует только в этой задаче</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
