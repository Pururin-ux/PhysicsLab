import Image from "next/image";
import styles from "./EvaporationEquilibriumNotebook.module.css";

function Particle({ x, y, tone = "vapor" }: { x: number; y: number; tone?: "vapor" | "liquid" | "warm" }) {
  return <g className={styles[tone]} transform={`translate(${x} ${y})`}><circle r="7" /><circle cx="-8" cy="4" r="3" /><circle cx="8" cy="4" r="3" /></g>;
}

function DynamicEquilibriumVessel() {
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Закрытый сосуд: сначала испарение преобладает, затем число испаряющихся и конденсирующихся молекул за одинаковое время становится равным">
      <defs>
        <linearGradient id="vapor-glass" x1="0" y1="0" x2="0" y2="1"><stop stopColor="currentColor" stopOpacity=".03" /><stop offset="1" stopColor="currentColor" stopOpacity=".11" /></linearGradient>
        <marker id="evap-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path className={styles.evapMarker} d="M0 0L8 4L0 8Z" /></marker>
        <marker id="cond-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path className={styles.condMarker} d="M0 0L8 4L0 8Z" /></marker>
      </defs>

      <g transform="translate(24 42)">
        <text className={styles.stageKicker} x="145" y="-16" textAnchor="middle">СРАЗУ ПОСЛЕ ЗАКРЫТИЯ</text>
        <path className={styles.jar} d="M36 20H254V286Q254 316 224 316H66Q36 316 36 286Z" />
        <path className={styles.liquidFill} d="M39 220Q88 207 145 219T251 218V286Q251 313 224 313H66Q39 313 39 286Z" />
        <path className={styles.surfaceLine} d="M39 220Q88 207 145 219T251 218" />
        <path className={styles.lid} d="M24 20H266M52 3H238" />
        <Particle x={78} y={260} tone="liquid" /><Particle x={115} y={244} tone="liquid" /><Particle x={156} y={271} tone="liquid" /><Particle x={202} y={246} tone="liquid" />
        <Particle x={92} y={104} /><Particle x={178} y={74} /><Particle x={218} y={145} />
        <g className={styles.evapFlux}><path d="M76 213C72 176 80 148 92 121" /><path d="M122 213C116 170 132 136 151 104" /><path d="M170 216C168 169 181 132 201 102" /><path d="M214 214C227 187 228 171 220 160" /></g>
        <g className={styles.condFlux}><path d="M178 89C164 124 158 164 159 205" /></g>
        <text className={styles.evapText} x="51" y="348">Nисп ↑</text><text className={styles.relation} x="145" y="348">&gt;</text><text className={styles.condText} x="182" y="348">Nконд ↓</text>
      </g>

      <path className={styles.timeline} d="M323 198H394" /><path className={styles.timelineHead} d="M384 188L396 198L384 208" />
      <text className={styles.timelineLabel} x="359" y="176" textAnchor="middle">пар накапливается</text>

      <g transform="translate(408 42)">
        <text className={styles.stageKicker} x="145" y="-16" textAnchor="middle">ДИНАМИЧЕСКОЕ РАВНОВЕСИЕ</text>
        <path className={styles.jar} d="M36 20H254V286Q254 316 224 316H66Q36 316 36 286Z" />
        <path className={styles.liquidFill} d="M39 220Q88 207 145 219T251 218V286Q251 313 224 313H66Q39 313 39 286Z" />
        <path className={styles.surfaceLine} d="M39 220Q88 207 145 219T251 218" />
        <path className={styles.lid} d="M24 20H266M52 3H238" />
        <Particle x={75} y={262} tone="liquid" /><Particle x={118} y={244} tone="liquid" /><Particle x={161} y={271} tone="liquid" /><Particle x={207} y={246} tone="liquid" />
        <Particle x={73} y={93} /><Particle x={129} y={137} /><Particle x={183} y={73} /><Particle x={222} y={128} /><Particle x={157} y={174} />
        <g className={styles.evapFlux}><path d="M74 213C70 176 75 147 84 111" /><path d="M143 214C136 180 143 154 153 132" /><path d="M212 214C226 183 226 160 222 143" /></g>
        <g className={styles.condFlux}><path d="M105 108C107 143 114 176 122 207" /><path d="M183 88C174 122 170 157 171 204" /><path d="M225 140C214 164 210 181 207 207" /></g>
        <text className={styles.evapText} x="51" y="348">Nисп ↑</text><text className={styles.relation} x="145" y="348">=</text><text className={styles.condText} x="182" y="348">Nконд ↓</text>
      </g>
    </svg>
  );
}

export function EvaporationEquilibriumNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная запись · § 9 · 10 класс</p>
        <h2>Жидкость не перестаёт испаряться — меняется баланс двух потоков</h2>
        <span>В закрытом сосуде молекулы всё время пересекают поверхность в обе стороны. Насыщенный пар появляется тогда, когда встречные потоки становятся равными.</span>
      </header>

      <section className={styles.apparatus} aria-labelledby="equilibrium-title">
        <div className={styles.mioAction}>
          <Image src="/images/mio/mio-attentive-v1.png" alt="Мио закрывает сосуд и отдельно считает молекулы, покидающие жидкость и возвращающиеся в неё" width={1254} height={1254} sizes="(max-width:760px) 96px, 142px" />
          <div><span>Действие Мио</span><h3 id="equilibrium-title">Закрывает сосуд и ведёт два счётчика</h3><p>Уровень становится постоянным не потому, что движение прекратилось. За одинаковое время поверхность покидает столько же молекул, сколько возвращается.</p></div>
        </div>
        <DynamicEquilibriumVessel />
        <div className={styles.mobileEquilibrium} aria-label="Два этапа установления динамического равновесия в закрытом сосуде">
          <article><span>1 · Сразу после закрытия</span><strong>Испарение преобладает</strong><p><b>Nисп ↑</b><em>&gt;</em><b>Nконд ↓</b></p><small>Пар накапливается, обратный поток растёт.</small></article>
          <i aria-hidden="true">↓</i>
          <article><span>2 · Через некоторое время</span><strong>Потоки становятся равными</strong><p><b>Nисп ↑</b><em>=</em><b>Nконд ↓</b></p><small>Уровень постоянен, движение молекул продолжается.</small></article>
        </div>
      </section>

      <section className={styles.energyLens} aria-labelledby="energy-lens-title">
        <header><span>Измерительная линза</span><h3 id="energy-lens-title">Почему испарение обычно охлаждает жидкость?</h3></header>
        <div className={styles.energyTrack} aria-label="Молекула с большой кинетической энергией покидает поверхность жидкости">
          <span className={styles.liquidBand}>жидкость</span>
          <span className={styles.fastParticle}>быстрая молекула</span>
          <span className={styles.escapeArrow}>покидает поверхность ↑</span>
        </div>
        <div className={styles.energyResult}><strong>Средняя кинетическая энергия оставшихся молекул уменьшается</strong><span>Если энергия извне не поступает, температура жидкости понижается.</span></div>
      </section>

      <section className={styles.vaporLedger} aria-labelledby="vapor-ledger-title">
        <header><span>Запись состояния</span><h3 id="vapor-ledger-title">Насыщение — свойство равновесия при данной температуре</h3></header>
        <article><b>T = const</b><strong>Меняем объём</strong><p>Пока есть жидкость и пар остаётся насыщенным, часть молекул испаряется или конденсируется. Давление насыщенного пара не меняется.</p></article>
        <article><b>T ↑</b><strong>Нагреваем</strong><p>Давление насыщенного пара растёт значительно быстрее, чем давление идеального газа той же неизменной массы.</p></article>
        <article><b>Другая жидкость</b><strong>Меняем вещество</strong><p>Чем слабее взаимодействуют молекулы жидкости, тем больше равновесная концентрация пара и его давление.</p></article>
      </section>

      <section className={styles.openClosed} aria-labelledby="open-closed-title">
        <header><span>Граница системы</span><h3 id="open-closed-title">Открытие сосуда меняет не крышку, а баланс</h3></header>
        <p><strong>Закрыт</strong><span>пар накапливается</span><small>Nисп → Nконд</small></p>
        <p><strong>Равновесие</strong><span>насыщенный пар</span><small>Nисп = Nконд</small></p>
        <p><strong>Открыт</strong><span>часть пара уходит</span><small>Nисп &gt; Nконд</small></p>
      </section>

      <p className={styles.boundary}><strong>Граница модели.</strong> Независимость давления от объёма относится к насыщенному пару при постоянной температуре, пока в системе остаётся жидкость. Для ненасыщенного пара неизменной массы вдали от насыщения применима модель идеального газа.</p>
    </div>
  );
}
