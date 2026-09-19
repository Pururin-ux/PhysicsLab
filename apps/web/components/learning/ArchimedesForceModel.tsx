"use client";

import Image from "next/image";
import { useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { MathText } from "../ui/MathText";
import styles from "./ArchimedesForceModel.module.css";

const stages = [
  { id: "observe", label: "Сравнить жидкости" },
  { id: "measure", label: "Измерить силу" },
] as const;

const liquids = [
  { id: "water", label: "Вода", density: 1000 },
  { id: "salt", label: "Солёная вода", density: 1200 },
] as const;

const volumes = [200, 400] as const;

const initial = {
  stage: 0,
  observationAnswer: "",
  liquid: "water",
  volume: 400,
  forceAnswer: "",
  summaryText: "",
  summarySaved: false,
};

function formatForce(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",");
}

export function ArchimedesForceModel() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(
    "textbook-archimedes-force",
    state,
    setState,
    stages.length,
    "lesson",
    { saveInitial: false },
  );
  const stage = stages[state.stage]?.id ?? "observe";
  const liquid = liquids.find((item) => item.id === state.liquid) ?? liquids[0];
  const immersedVolumeM3 = state.volume * 0.000001;
  const force = liquid.density * 10 * immersedVolumeM3;
  const forceOptions = [
    { id: "correct", value: force },
    { id: "half", value: force / 2 },
    { id: "more", value: force * 1.5 },
  ];
  const bodyHeight = state.volume === 400 ? 126 : 82;
  const bodyTop = state.volume === 400 ? 314 : 336;

  if (!draft.ready) {
    return <div className={styles.model}><p className={styles.loading}>Готовлю опыт…</p></div>;
  }

  return (
    <div className={styles.model}>
      <header className={styles.intro}>
        <p>Лабораторная запись · § 29</p>
        <h2>Почему нижняя грань выталкивает сильнее?</h2>
        <span>Сначала меняем плотность среды, не меняя тело. Затем связываем разность сил давления с весом вытесненной жидкости.</span>
      </header>

      <div className={styles.stageTabs} role="group" aria-label="Этап опыта с выталкивающей силой">
        {stages.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={stage === item.id} onClick={() => setState((current) => ({ ...current, stage: index }))}>
            <span>{index + 1}</span>{item.label}
          </button>
        ))}
      </div>

      {stage === "observe" ? (
        <section className={styles.stage} aria-labelledby="archimedes-observation-question">
          <figure className={styles.diagram}>
            <svg viewBox="0 0 920 530" role="img" aria-labelledby="archimedes-observe-title archimedes-observe-desc">
              <title id="archimedes-observe-title">Положение одинакового тела в жидкостях разной плотности</title>
              <desc id="archimedes-observe-desc">В трёх сосудах одно и то же тело тонет, находится в равновесии внутри жидкости или всплывает. Меняется только плотность жидкости.</desc>
              <defs>
                <marker id="observe-up-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
                <marker id="observe-down-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
              </defs>
              <text className={styles.panelTitle} x="460" y="46" textAnchor="middle">Одно тело · масса и объём неизменны</text>
              {[170, 460, 750].map((x, index) => {
                const bodyY = [348, 255, 156][index];
                const upLength = [62, 82, 102][index];
                const labels = ["ρт > ρж", "ρт = ρж", "ρт < ρж"];
                const verdicts = ["тонет", "равновесие внутри", "всплывает"];
                return (
                  <g key={x} aria-label={`${labels[index]}: ${verdicts[index]}`}>
                    <path className={styles.vessel} d={`M${x - 105} 118V421Q${x - 105} 441 ${x - 85} 441H${x + 85}Q${x + 105} 441 ${x + 105} 421V118`} />
                    <path className={`${styles.liquid} ${index === 2 ? styles.denseLiquid : ""}`} d={`M${x - 101} 176H${x + 101}V419Q${x + 101} 437 ${x + 83} 437H${x - 83}Q${x - 101} 437 ${x - 101} 419Z`} />
                    <path className={styles.surface} d={`M${x - 101} 176Q${x - 52} 166 ${x} 176T${x + 101} 176`} />
                    <rect className={styles.testBody} x={x - 39} y={bodyY} width="78" height="58" rx="9" />
                    <path className={styles.forceUp} d={`M${x - 18} ${bodyY + 25}V${bodyY + 25 - upLength}`} markerEnd="url(#observe-up-arrow)" />
                    <path className={styles.forceDown} d={`M${x + 18} ${bodyY + 8}V${bodyY + 108}`} markerEnd="url(#observe-down-arrow)" />
                    <text className={styles.forceUpLabel} x={x - 48} y={bodyY + 8}>Fₐ</text>
                    <text className={styles.forceDownLabel} x={x + 34} y={bodyY + 97}>Fт</text>
                    <text className={styles.rhoLabel} x={x} y="473" textAnchor="middle">{labels[index]}</text>
                    <text className={styles.verdict} x={x} y="505" textAnchor="middle">{verdicts[index]}</text>
                  </g>
                );
              })}
            </svg>
            <figcaption>Положение тела определяется сравнением двух сил. При частичном погружении тело само меняет вытесненный объём, пока <MathText text={String.raw`$F_A=F_{т}$`} />.</figcaption>
          </figure>

          <div className={styles.questionPanel}>
            <p className={styles.stepLabel}>Меняем одну величину</p>
            <h3 id="archimedes-observation-question">Что нужно изменить, чтобы то же тело поднялось выше?</h3>
            <div className={styles.options}>
              <button type="button" aria-pressed={state.observationAnswer === "density"} onClick={() => setState((current) => ({ ...current, observationAnswer: "density" }))}>Увеличить плотность жидкости</button>
              <button type="button" aria-pressed={state.observationAnswer === "mass"} onClick={() => setState((current) => ({ ...current, observationAnswer: "mass" }))}>Увеличить массу того же тела</button>
              <button type="button" aria-pressed={state.observationAnswer === "gravity"} onClick={() => setState((current) => ({ ...current, observationAnswer: "gravity" }))}>Усилить действие силы тяжести</button>
            </div>
            {state.observationAnswer ? (
              <p className={state.observationAnswer === "density" ? styles.correct : styles.correction} role="status">
                {state.observationAnswer === "density" ? "Верно. Более плотная жидкость создаёт большую силу Архимеда при том же погружённом объёме." : "Тело в сравнении не меняем. Увеличение плотности жидкости усиливает выталкивание."}
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <section className={styles.stage} aria-labelledby="archimedes-force-question">
          <figure className={styles.diagram}>
            <svg viewBox="0 0 920 560" role="img" aria-labelledby="archimedes-measure-title archimedes-measure-desc">
              <title id="archimedes-measure-title">Измерение силы Архимеда динамометром</title>
              <desc id="archimedes-measure-desc">Тело полностью погружено в жидкость и подвешено к динамометру. Давление снизу больше давления сверху, поэтому результирующая сила направлена вверх.</desc>
              <defs>
                <marker id="measure-up-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
                <marker id="measure-down-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
              </defs>
              <g aria-label="Лабораторная установка с динамометром">
                <text className={styles.panelTitle} x="232" y="44" textAnchor="middle">Показание уменьшается на Fₐ</text>
                <path className={styles.stand} d="M60 490H396M112 490V58H325" />
                <rect className={styles.scale} x="268" y="72" width="112" height="174" rx="18" />
                <path className={styles.scaleMarks} d="M290 100H316M290 124H307M290 148H316M290 172H307M290 196H316M290 220H307" />
                <path className={styles.spring} d="M330 88V105l-13 10 26 16-26 16 26 16-26 16 26 16-13 10v41" />
                <path className={styles.thread} d={`M330 246V${bodyTop}`} />
                <path className={styles.tank} d="M163 243V481H430V243" />
                <path className={`${styles.tankLiquid} ${state.liquid === "salt" ? styles.denseLiquid : ""}`} d="M167 282H426V477H167Z" />
                <path className={styles.surface} d="M167 282Q231 270 296 282T426 282" />
                <rect className={styles.testBody} x="270" y={bodyTop} width="120" height={bodyHeight} rx="11" />
                <text className={styles.volumeInside} x="330" y={bodyTop + bodyHeight / 2 + 7} textAnchor="middle">{state.volume} см³</text>
                <text className={styles.apparatusLabel} x="94" y="526">тело не касается дна</text>
              </g>
              <path className={styles.divider} d="M478 32V528" />
              <g aria-label="Разность сил давления сверху и снизу">
                <text className={styles.panelTitle} x="698" y="44" textAnchor="middle">Глубже → давление больше</text>
                <rect className={styles.pressureBody} x="622" y="194" width="152" height="150" rx="12" />
                <path className={styles.topPressure} d="M698 137V188" markerEnd="url(#measure-down-arrow)" />
                <path className={styles.bottomPressure} d="M698 422V352" markerEnd="url(#measure-up-arrow)" />
                <path className={styles.sidePressure} d="M556 236H615M840 236H781M538 302H615M858 302H781" />
                <text className={styles.forceDownLabel} x="718" y="160">F₁ = p₁S</text>
                <text className={styles.forceUpLabel} x="718" y="406">F₂ = p₂S</text>
                <text className={styles.sideLabel} x="698" y="104" textAnchor="middle">верхняя грань</text>
                <text className={styles.sideLabel} x="698" y="467" textAnchor="middle">нижняя грань</text>
                <text className={styles.equation} x="698" y="510" textAnchor="middle">Fₐ = F₂ − F₁ = ρжgVпогр</text>
              </g>
            </svg>
            <figcaption>Боковые силы давления взаимно компенсируются. Снизу тело находится глубже, поэтому <MathText text={String.raw`$F_2>F_1$`} /> и их разность направлена вверх.</figcaption>
          </figure>

          <div className={styles.experimentPanel}>
            <div className={styles.mioAction}>
              <Image src="/images/mio/mio-attentive-v1.png" alt="Мио сверяет погружённый объём и показание динамометра" width={1254} height={1254} sizes="(max-width:720px) 92px, 126px" />
              <div><span>Измерительная линза</span><strong>Мио проверяет объём именно под водой.</strong><p>При полном погружении он равен объёму всего тела.</p></div>
            </div>
            <div className={styles.controls}>
              <div role="group" aria-label="Жидкость">
                {liquids.map((item) => <button key={item.id} type="button" aria-pressed={state.liquid === item.id} onClick={() => setState((current) => ({ ...current, liquid: item.id, forceAnswer: "" }))}>{item.label}</button>)}
              </div>
              <div role="group" aria-label="Погружённый объём">
                {volumes.map((volume) => <button key={volume} type="button" aria-pressed={state.volume === volume} onClick={() => setState((current) => ({ ...current, volume, forceAnswer: "" }))}>{volume} см³</button>)}
              </div>
            </div>
            <h3 id="archimedes-force-question">На сколько ньютонов уменьшится показание?</h3>
            <div className={styles.options}>
              {forceOptions.map((option) => <button key={option.id} type="button" aria-pressed={state.forceAnswer === option.id} onClick={() => setState((current) => ({ ...current, forceAnswer: option.id }))}>{formatForce(option.value)} Н</button>)}
            </div>
            {state.forceAnswer ? (
              <div className={styles.result}>
                <p className={state.forceAnswer === "correct" ? styles.correct : styles.correction} role="status">{state.forceAnswer === "correct" ? "Верно. Показание уменьшается на величину силы Архимеда." : "Проверь перевод объёма в кубические метры и формулу силы Архимеда."}</p>
                <p><span>Погружённый объём</span><strong>{state.volume} см³ = {immersedVolumeM3.toFixed(4).replace(".", ",")} м³</strong></p>
                <p><span>Сила Архимеда</span><strong>{liquid.density} · 10 · {immersedVolumeM3.toFixed(4).replace(".", ",")} = {formatForce(force)} Н</strong></p>
              </div>
            ) : null}
          </div>
        </section>
      )}

      <div className={styles.distinctions}>
        <section><span>Причина</span><h3>Давление снизу больше</h3><p>Выталкивание создаёт результирующая сил давления, а не отдельная «сила воды» без механизма.</p></section>
        <section><span>В формуле</span><h3>Только объём под водой</h3><p>При частичном погружении <MathText text={String.raw`$V_{погр}$`} /> меньше полного объёма тела.</p></section>
        <section><span>Граница модели</span><h3>Тело окружено средой</h3><p>Расчёт показания предполагает, что тело не касается дна и жидкость действует на его поверхности.</p></section>
      </div>

      {draft.error ? <p className={styles.storageError} role="alert">{draft.error}</p> : null}
    </div>
  );
}
