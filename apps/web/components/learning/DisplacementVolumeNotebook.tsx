"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import { calculateDisplacementVolume } from "../../lib/physics/displacement-volume-model";
import { MathText } from "../ui/MathText";
import styles from "./DisplacementVolumeNotebook.module.css";

const initialReadingMl = 20;
const finalReadingMl = 32;
const divisionMl = 2;
const measurement = (() => {
  const result = calculateDisplacementVolume({
    initialReadingMl,
    finalReadingMl,
    divisionMl,
    fullySubmerged: true,
    noSpill: true,
    assumeHalfDivisionReadingBound: true,
  });
  if (!result.valid) throw new Error("The displacement scene needs a valid measurement");
  return result;
})();

const scaleY = (millilitres: number) => 280 - millilitres * 6;
const initialY = scaleY(initialReadingMl);
const finalY = scaleY(finalReadingMl);

function WaterLevel({ y, raised }: { y: number; raised: boolean }) {
  return <>
    <path className={styles.water} d={`M109 ${y - 8} Q146 ${y + 8} 183 ${y - 8} L183 277 H109 Z`} />
    {raised && <path className={styles.rise} d={`M109 ${finalY - 8} Q146 ${finalY + 8} 183 ${finalY - 8} V${initialY - 8} Q146 ${initialY + 8} 109 ${initialY - 8} Z`} />}
    <path className={styles.meniscus} d={`M109 ${y - 8} Q146 ${y + 8} 183 ${y - 8}`} />
  </>;
}

function GraduatedCylinder({ immersed, solved }: { immersed: boolean; solved: boolean }) {
  const currentY = immersed ? finalY : initialY;

  return <svg className={styles.cylinder} viewBox="0 0 360 315" role="img" aria-label={immersed
    ? `Одна мензурка: сначала ${initialReadingMl} миллилитров, после полного погружения камешка ${finalReadingMl} миллилитра. Найди прирост уровня по разности отсчётов.${solved ? ` Он равен ${measurement.volumeMl} миллилитрам.` : ""}`
    : `Мензурка с водой: уровень ${initialReadingMl} миллилитров, камешек ещё снаружи.`}>
    <defs>
      <linearGradient id="displacement-glass" x1="0" x2="1">
        <stop offset="0" stopColor="var(--surface-primary)" stopOpacity=".35" />
        <stop offset=".45" stopColor="var(--surface-primary)" stopOpacity=".04" />
        <stop offset="1" stopColor="var(--surface-primary)" stopOpacity=".5" />
      </linearGradient>
    </defs>
    <text x="105" y="23" className={styles.svgTitle}>МЕНЗУРКА · МЛ</text>
    <path className={styles.glassFill} d="M105 39 H189 V272 Q189 284 177 284 H117 Q105 284 105 272 Z" />
    <WaterLevel y={currentY} raised={immersed} />
    {immersed && <>
      <path className={styles.stone} d="M121 254 Q125 244 135 244 L146 233 L160 237 L171 249 L169 266 Q162 276 147 275 L131 272 Z" />
      <path className={styles.stoneDetail} d="M131 254 L141 251 M154 244 L163 250 M150 265 L159 263" />
      <path className={styles.previousLevel} d={`M109 ${initialY - 8} Q146 ${initialY + 8} 183 ${initialY - 8}`} />
    </>}
    <path className={styles.glassOutline} d="M105 39 V272 Q105 284 117 284 H177 Q189 284 189 272 V39" />
    <path className={styles.glassGleam} d="M112 47 V116 M181 47 V80" />
    {Array.from({ length: 21 }, (_, index) => {
      const value = index * divisionMl;
      const y = scaleY(value);
      return <g key={value}>
        <path className={value % 10 === 0 ? styles.majorTick : styles.minorTick} d={`M189 ${y} H${value % 10 === 0 ? 205 : 198}`} />
        {value % 10 === 0 && <text x="211" y={y + 5} className={styles.tickLabel}>{value}</text>}
      </g>;
    })}
    <path className={styles.base} d="M132 285 V294 H159 V285 M120 294 H172" />
    {immersed ? <>
      <path className={styles.deltaBracket} d={`M77 ${finalY} H68 V${initialY} H77`} />
      <text x="14" y="118" className={styles.deltaLabel}>{solved ? `${measurement.volumeMl} мл` : "ΔV = ?"}</text>
      <text x="253" y={finalY + 5} className={styles.finalLabel}>после · 32 мл</text>
      <text x="253" y={initialY + 5} className={styles.initialLabel}>до · 20 мл</text>
      <path className={styles.guideLine} d={`M233 ${finalY} H247 M233 ${initialY} H247`} />
    </> : <>
      <text x="253" y={initialY + 5} className={styles.initialLabel}>вода · 20 мл</text>
      <path className={styles.guideLine} d={`M233 ${initialY} H247`} />
      <path className={styles.stone} d="M257 259 L269 244 L284 247 L294 258 L290 274 L275 281 L261 275 Z" />
      <path className={styles.stoneDetail} d="M268 255 L277 252 M279 269 L288 263" />
      <text x="250" y="301" className={styles.stoneLabel}>камешек</text>
    </>}
  </svg>;
}

export function DisplacementVolumeNotebook() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [immersed, setImmersed] = useState(false);
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const parsed = checked === null || !/^\d+(?:[,.]\d+)?$/.test(checked) ? null : Number(checked.replace(",", "."));
  const solved = parsed === measurement.volumeCm3 || showSolution;

  useEffect(() => {
    if (showSolution) resultRef.current?.focus();
  }, [showSolution]);

  function toggleStone() {
    setImmersed(previous => !previous);
    setDraft("");
    setChecked(null);
    setShowSolution(false);
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(draft.trim());
    setShowSolution(false);
  }

  return <div className={styles.composition}>
    <header className={styles.intro}>
      <div>
        <p className={styles.eyebrow}>Опыт в блокноте</p>
        <h2>Сколько места занял камешек?</h2>
        <p>Сделай два отсчёта на одной шкале. Вода остаётся в мензурке; меняется только то, что в неё погружено.</p>
      </div>
      <figure className={styles.mio}>
        <Image src={MIO_SCENES.measurement} alt="Мио сверяет уровень воды с отметкой на мензурке" width={1536} height={1024} sizes="(max-width: 520px) 104px, 188px" />
        <figcaption>Мио смотрит на уровень воды на высоте глаз.</figcaption>
      </figure>
    </header>

    <div className={styles.workbench}>
      <div className={styles.observation}>
        <p className={styles.step}>До погружения <strong>20 мл</strong></p>
        <button type="button" onClick={toggleStone}>{immersed ? "Поднять камешек" : "Погрузить камешек"}</button>
        {immersed && <p className={styles.step}>После погружения <strong>32 мл</strong></p>}
      </div>
      <div className={styles.stage}>
        <figure className={styles.figure}>
          <GraduatedCylinder immersed={immersed} solved={solved} />
          <figcaption>{immersed
            ? "Штриховая линия — прежний уровень. Камешек целиком под водой, вода не пролилась. Верхняя линия показывает новый отсчёт."
            : "Сначала прочитай показание воды. Цена деления этой шкалы — 2 мл."}</figcaption>
        </figure>
        <div className={styles.working}>
          {immersed ? <>
            <p className={styles.prompt}>На сколько миллилитров поднялась вода?</p>
            <form onSubmit={checkAnswer} className={styles.form}>
              <label htmlFor="displacement-answer">Объём камешка, см³</label>
              <div className={styles.answerRow}>
                <input id="displacement-answer" type="text" inputMode="decimal" autoComplete="off" required value={draft} onChange={event => { setDraft(event.target.value); setChecked(null); setShowSolution(false); }} aria-describedby="displacement-hint" />
                <span>см³</span>
                <button type="submit">Проверить</button>
              </div>
              <p id="displacement-hint" className={styles.hint}>1 мл = 1 см³. Введи только число.</p>
            </form>
            {checked !== null && <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
              <p>{parsed === measurement.volumeCm3 ? "Верно: объём камешка — 12 см³." : parsed === null ? "Введи число без единицы измерения." : parsed === finalReadingMl ? "32 мл — показание воды вместе с камешком. Сравни его с прежними 20 мл." : "Сравни два отсчёта: вычти первый из второго."}</p>
              {parsed !== measurement.volumeCm3 && parsed !== null && !showSolution && <button type="button" className={styles.solutionButton} onClick={() => setShowSolution(true)}>Показать разбор</button>}
            </div>}
            {solved && <div className={styles.result} ref={resultRef} role="region" aria-label="Разбор измерения объёма" tabIndex={-1}>
              <p><MathText text={String.raw`$V=V_2-V_1$`} /></p>
              <p><MathText text={String.raw`$V=32\,\text{мл}-20\,\text{мл}=12\,\text{мл}$`} /></p>
              <p><MathText text={String.raw`$12\,\text{мл}=12\,\text{см}^3$`} /></p>
              <p>Миллилитр и кубический сантиметр — равные объёмы. Объём тела нашли косвенно, по разности двух отсчётов.</p>
            </div>}
          </> : <p className={styles.before}>Погрузи камешек и посмотри, как изменится показание <em>той же</em> мензурки.</p>}
        </div>
      </div>
    </div>
    {solved && measurement.uncertainty && <details className={styles.precision}><summary>Насколько точен результат?</summary><p>Если условно считать каждый отсчёт точным в пределах половины деления (±{measurement.uncertainty.perReadingBoundMl} мл), осторожная граница для разности — ±{measurement.uncertainty.conservativeDifferenceBoundMl} мл. Это учебная оценка при таком допущении, а не паспортная погрешность мензурки.</p></details>}
  </div>;
}
