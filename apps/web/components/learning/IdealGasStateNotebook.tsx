import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./IdealGasStateNotebook.module.css";

function ApparatusDrawing() {
  return (
    <svg viewBox="0 0 720 390" role="img" aria-labelledby="gas-apparatus-title gas-apparatus-desc">
      <title id="gas-apparatus-title">Установка для проверки уравнения состояния газа</title>
      <desc id="gas-apparatus-desc">Герметичный гофрированный сосуд погружён в водяную баню. Манометр измеряет давление, линейка — объём, термометр — температуру.</desc>
      <defs>
        <linearGradient id="bath-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#36bfd0" stopOpacity=".17" />
          <stop offset="1" stopColor="#36bfd0" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity=".08" />
          <stop offset=".5" stopColor="currentColor" stopOpacity=".24" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".06" />
        </linearGradient>
        <filter id="apparatus-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#001a22" floodOpacity=".18" />
        </filter>
      </defs>

      <path className={styles.bench} d="M40 338H680" />
      <path className={styles.bath} d="M250 132L276 338H577L603 132Z" fill="url(#bath-water)" />
      <path className={styles.waterLine} d="M264 204C302 192 340 214 378 202S454 214 492 202 552 207 590 198" />

      <g filter="url(#apparatus-shadow)">
        <path className={styles.vesselTop} d="M333 112H520L506 139H347Z" fill="url(#metal)" />
        <path className={styles.bellows} d="M348 140H505L494 158H358L348 176H505L494 194H358L348 212H505L494 230H358L348 248H505L494 266H358L348 284H505L494 306H358Z" fill="url(#metal)" />
        <path className={styles.vesselBottom} d="M350 306H502L488 326H365Z" fill="url(#metal)" />
        <path className={styles.screw} d="M426 112V50M390 50H462M406 36H446M426 36V18" />
      </g>

      <g className={styles.ruler} aria-hidden="true">
        <path d="M548 105V320" />
        {Array.from({ length: 12 }, (_, index) => {
          const y = 112 + index * 18;
          return <path key={y} d={`M548 ${y}h${index % 2 === 0 ? 26 : 15}`} />;
        })}
        <text x="579" y="224">V</text>
      </g>

      <g className={styles.manometer} aria-hidden="true">
        <path d="M346 128C312 128 294 105 294 82H171V245C171 286 223 286 223 245V119" />
        <path className={styles.manometerLiquid} d="M171 196V245C171 286 223 286 223 245V156" />
        <path d="M146 82H318" />
        <text x="111" y="183">p</text>
      </g>

      <g className={styles.thermometer} aria-hidden="true">
        <path d="M636 77V275a28 28 0 1 1-30 0V77a15 15 0 0 1 30 0Z" />
        <path className={styles.thermometerLiquid} d="M621 101V286a13 13 0 1 0 0 25 13 13 0 0 0 0-25" />
        <path d="M644 116h18M644 152h12M644 188h18M644 224h12M644 260h18" />
        <text x="668" y="190">T</text>
      </g>

      <g className={styles.callout}>
        <path d="M405 88C365 68 328 62 280 67" />
        <text x="64" y="53">винт меняет объём</text>
        <path d="M282 68H210" />
        <path d="M512 333C555 350 594 350 635 336" />
        <text x="506" y="370">горячая вода меняет T</text>
      </g>
    </svg>
  );
}

export function IdealGasStateNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная запись · § 5</p>
        <h2>Одна порция газа — разные состояния</h2>
        <span>Давление, объём и температура меняются вместе. Уравнение состояния отделяет сам газ от способа, которым его перевели из состояния 1 в состояние 2.</span>
      </header>

      <section className={styles.labSpread} aria-labelledby="gas-lab-title">
        <div className={styles.apparatus}>
          <div className={styles.sectionHeading}>
            <span>Установка</span>
            <h3 id="gas-lab-title">Три измерения для каждого состояния</h3>
          </div>
          <ApparatusDrawing />
          <div className={styles.instrumentLegend}>
            <p><strong>Манометр</strong><span>давление p</span></p>
            <p><strong>Линейка</strong><span>объём V</span></p>
            <p><strong>Термометр</strong><span>температура T</span></p>
          </div>
        </div>

        <aside className={styles.protocol} aria-label="Протокол сравнения двух состояний газа">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио следит, чтобы сосуд оставался герметичным" width={1254} height={1254} sizes="(max-width:760px) 104px, 132px" />
            <div><span>Условие опыта</span><strong>Мио закрывает клапан.</strong><p>Масса и молярная масса газа между отсчётами не меняются.</p></div>
          </div>
          <ol>
            <li><span>1</span><p>Записать <strong>p₁, V₁, T₁</strong>.</p></li>
            <li><span>2</span><p>Нагреть газ и изменить объём винтом.</p></li>
            <li><span>3</span><p>После равновесия записать <strong>p₂, V₂, T₂</strong>.</p></li>
          </ol>
          <div className={styles.invariant}>
            <span>Сравниваем не отдельные числа</span>
            <MathText text={String.raw`$\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}$`} />
            <p>Для данной порции идеального газа отношение остаётся постоянным в пределах погрешности опыта.</p>
          </div>
        </aside>
      </section>

      <section className={styles.stateLedger} aria-label="Запись двух состояний идеального газа">
        <div><span>Состояние 1</span><strong>p₁ · V₁</strong><small>делим на абсолютную T₁</small></div>
        <MathText text={String.raw`$\frac{p_1V_1}{T_1}$`} />
        <div className={styles.equalMark}><span>один газ</span><strong>=</strong><small>тот же состав и масса</small></div>
        <MathText text={String.raw`$\frac{p_2V_2}{T_2}$`} />
        <div><span>Состояние 2</span><strong>p₂ · V₂</strong><small>делим на абсолютную T₂</small></div>
      </section>

      <section className={styles.measurementLens} aria-label="Измерительная линза для уравнения состояния">
        <div><span>Измерительная линза</span><h3>Проверь единицы до подстановки</h3></div>
        <p><strong>T только в К</strong><small>T = t + 273,15</small></p>
        <p><strong>pV имеет размер энергии</strong><small>1 Па·м³ = 1 кПа·л = 1 Дж</small></p>
        <p><strong>Количество газа фиксировано</strong><small>иначе pV/T уже не одна константа</small></p>
      </section>

      <div className={styles.equationPair}>
        <section>
          <span>Сравнить два состояния</span>
          <MathText text={String.raw`$\frac{pV}{T}=\mathrm{const}$`} />
          <p>Уравнение Клапейрона работает для неизменных массы и молярной массы газа.</p>
        </section>
        <section>
          <span>Рассчитать одно состояние</span>
          <MathText text={String.raw`$pV=\nu RT$`} />
          <p>Уравнение Клапейрона — Менделеева связывает конкретное состояние с количеством вещества.</p>
        </section>
        <section>
          <span>Смесь газов</span>
          <MathText text={String.raw`$p=p_1+p_2+\ldots$`} />
          <p>Каждый компонент вносит парциальное давление; для идеальной смеси давления складываются.</p>
        </section>
      </div>

      <p className={styles.boundary}><strong>Граница модели.</strong> Уравнения применяют при не слишком больших давлениях и вдали от температур, где собственный объём частиц и межмолекулярное взаимодействие уже нельзя считать малыми.</p>
    </div>
  );
}
