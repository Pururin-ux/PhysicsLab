import Image from "next/image";
import styles from "./LiquidStructureNotebook.module.css";

function SurfaceForceLens() {
  return (
    <svg viewBox="0 0 520 270" role="img" aria-label="Схема сил притяжения внутри жидкости и в поверхностном слое">
      <defs>
        <marker id="liquid-force-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path className={styles.forceMarker} d="M0 0L8 4L0 8Z" />
        </marker>
        <marker id="liquid-result-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path className={styles.resultMarker} d="M0 0L8 4L0 8Z" />
        </marker>
      </defs>
      <path className={styles.surface} d="M270 70C340 50 425 52 500 72" />
      <text className={styles.zoneTitle} x="28" y="28">Внутри жидкости</text>
      <text className={styles.zoneTitle} x="286" y="28">У поверхности</text>

      <g className={styles.particles}>
        <circle cx="126" cy="142" r="16" />
        <circle cx="70" cy="88" r="12" /><circle cx="126" cy="77" r="12" /><circle cx="182" cy="91" r="12" />
        <circle cx="68" cy="145" r="12" /><circle cx="184" cy="145" r="12" />
        <circle cx="72" cy="202" r="12" /><circle cx="126" cy="214" r="12" /><circle cx="180" cy="201" r="12" />
        <circle cx="390" cy="72" r="16" />
        <circle cx="334" cy="115" r="12" /><circle cx="390" cy="126" r="12" /><circle cx="447" cy="114" r="12" />
        <circle cx="338" cy="173" r="12" /><circle cx="394" cy="184" r="12" /><circle cx="448" cy="171" r="12" />
      </g>

      <g className={styles.forceArrows}>
        <path d="M114 130L82 99" /><path d="M126 125V91" /><path d="M139 130L171 101" />
        <path d="M109 142H82" /><path d="M143 142H171" />
        <path d="M114 155L84 190" /><path d="M126 159V199" /><path d="M139 155L168 189" />
        <path d="M378 83L345 108" /><path d="M390 89V115" /><path d="M402 83L436 107" />
        <path d="M380 86L347 160" /><path d="M400 86L438 158" />
      </g>
      <path className={styles.resultant} d="M390 90V235" />
      <text className={styles.balanceLabel} x="72" y="252">ΣF = 0</text>
      <text className={styles.resultLabel} x="406" y="235">Fᵣ внутрь</text>
    </svg>
  );
}

export function LiquidStructureNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Карта жидкости · § 8 · 10 класс</p>
        <h2>Почему жидкость хранит объём, но меняет форму?</h2>
        <span>Частицы остаются близко друг к другу, однако их положения равновесия временные. Это сочетание объясняет и малую сжимаемость, и текучесть.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.dropObservation}>
          <Image src="/images/liquids/water-drop-leaf-cc0.jpg" alt="Округлые капли воды на поверхности листа" fill sizes="(max-width:760px) 100vw, 52vw" />
          <figcaption><span>Наблюдение</span><h3>Капля сокращает свободную поверхность</h3><p>Форма зависит также от смачивания, тяжести и опоры. Округлость — наблюдаемый результат нескольких действий, а не фотография молекулярных сил.</p></figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза поверхностного слоя жидкости">
          <div className={styles.mioAction}><Image src="/images/mio/mio-skeptical-v2.png" alt="Мио переносит измерительную линзу с глубины жидкости на её поверхность" width={1254} height={1254} sizes="(max-width:760px) 104px, 138px" /><div><span>Измерительная линза</span><h3>Мио сравнивает два положения одной молекулы</h3><p>Внутри соседи окружают её со всех сторон. У поверхности сверху почти нет молекул жидкости — компенсация нарушается.</p></div></div>
          <SurfaceForceLens />
        </aside>
      </div>

      <section className={styles.motionLedger} aria-labelledby="liquid-motion-title">
        <header><span>Микроскопическая запись</span><h3 id="liquid-motion-title">Временное равновесие создаёт текучесть</h3></header>
        <article><b>1</b><strong>Колеблется</strong><p>Молекула некоторое время остаётся около временного положения.</p></article>
        <article><b>2</b><strong>Получает энергию</strong><p>Столкновения позволяют перейти к соседнему положению.</p></article>
        <article><b>3</b><strong>Перестраивает соседство</strong><p>Ближний порядок разрушается и снова возникает.</p></article>
        <article><b>→</b><strong>Жидкость течёт</strong><p>Слои способны медленно перемещаться, сохраняя плотное расположение частиц.</p></article>
      </section>

      <section className={styles.stateComparison} aria-labelledby="state-comparison-title">
        <header><span>Три состояния</span><h3 id="state-comparison-title">Жидкость занимает промежуточное положение</h3></header>
        <p><strong>Кристалл</strong><span>свой объём и форма</span><small>дальний порядок</small></p>
        <p className={styles.liquidState}><strong>Жидкость</strong><span>свой объём, форма сосуда</span><small>ближний порядок · текучесть</small></p>
        <p><strong>Газ</strong><span>заполняет предоставленный объём</span><small>частицы далеко друг от друга</small></p>
      </section>

      <p className={styles.boundary}><strong>Граница модели.</strong> Схема в линзе показывает направления сил качественно и не задаёт реальные траектории молекул. Поверхностное натяжение не отменяет действие тяжести, опоры и взаимодействия жидкости с поверхностью тела.</p>
      <p className={styles.credit}>Фотография: Guru Ethic · CC0 1.0. Полная ссылка и лицензия сохранены рядом с файлом.</p>
    </div>
  );
}
