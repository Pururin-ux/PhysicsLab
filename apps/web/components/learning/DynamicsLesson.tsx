"use client";

import { ArrowLeft, ArrowRight, Check, Play, Warning } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { defineLessonStageSequence } from "../../lib/learning/lesson-stage-contract";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";
import { LessonStageEngine } from "./LessonStageEngine";
import styles from "./DynamicsLesson.module.css";

const DYNAMICS_STAGES = defineLessonStageSequence([
  { id: "context", nextAction: "Сделать прогноз" },
  { id: "prediction", nextAction: "Запустить опыт" },
  { id: "observation", nextAction: "Разобрать силы" },
  { id: "causal-explanation", nextAction: "Записать правило" },
  { id: "representation", nextAction: "Посмотреть пример" },
  { id: "worked-example", nextAction: "Решить похожую" },
  { id: "faded-example", nextAction: "Решить без подсказки" },
  { id: "independent-practice", nextAction: "Разобрать торможение" },
  { id: "transfer", nextAction: "Подвести итог" },
  { id: "summary" },
] as const);

const dynamicsEngineClasses = {
  root: styles.lesson,
  header: styles.lessonHeader,
  progressMeta: styles.progressWrap,
  progressTrack: styles.progress,
  stageShell: styles.lessonStageShell,
  stage: styles.lessonStageFrame,
  footer: styles.lessonFooter,
  backButton: styles.backButton,
  nextButton: styles.nextButton,
};

type Prediction = "light" | "same" | "heavy";
type ForceChoice = "pull" | "resultant" | "sum";

function parseNumber(raw: string) {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function Choice({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={cn(styles.choice, selected && styles.choiceSelected)}><span className={styles.choiceMark} aria-hidden="true">{selected ? <Check size={14} weight="bold" /> : null}</span><span>{children}</span></button>;
}

function Feedback({ kind, children, containerRef }: { kind: "good" | "try" | "note"; children: ReactNode; containerRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={containerRef} className={cn(styles.feedback, styles[`feedback_${kind}`])} role={kind === "try" ? "alert" : "status"}><span aria-hidden="true">{kind === "good" ? <Check size={17} weight="bold" /> : kind === "try" ? <Warning size={17} weight="fill" /> : "↳"}</span><div>{children}</div></div>;
}

function NumberField({ id, value, onChange, suffix, label }: { id: string; value: string; onChange: (value: string) => void; suffix: string; label: string }) {
  return <div className={styles.answerField}><label htmlFor={id}>{label}</label><div><input id={id} value={value} onChange={(event) => onChange(event.target.value)} inputMode="decimal" autoComplete="off" /><span>{suffix}</span></div></div>;
}

function MotionTrace({ name, mass, acceleration, end, run, delay = 0, reveal }: { name: string; mass: string; acceleration: string; end: string; run: number; delay?: number; reveal: boolean }) {
  const reduceMotion = useReducedMotion();
  return <div className={styles.traceRow}>
    <div className={styles.traceMeta}><span className={styles.traceName}>{name}</span><span>{mass}</span><span>сила 4 Н</span></div>
    <div className={styles.traceTrack} aria-hidden="true"><span className={styles.trackStart}>старт</span><span className={styles.trackEnd}>1 с</span><motion.span key={`${run}-${name}`} className={styles.traceMarker} initial={{ left: "5%" }} animate={{ left: run > 0 ? end : "5%" }} transition={reduceMotion ? { duration: 0 } : { duration: 2.35, delay, ease: [0.32, 0.02, 0.25, 1] }} />{run > 0 ? <motion.span key={`trail-${run}-${name}`} className={styles.traceTrail} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={reduceMotion ? { duration: 0 } : { duration: 2.1, delay: delay + 0.12, ease: "linear" }} /> : null}</div>
    <div className={styles.traceResult}>{reveal ? <MathText text={`$a=${acceleration}$`} /> : <span aria-label="Ускорение пока неизвестно">ускорение — ?</span>}</div>
  </div>;
}

function SameForceExperiment({ run, reveal, compact = false }: { run: number; reveal: boolean; compact?: boolean }) {
  return <figure className={cn(styles.experiment, compact && styles.experimentCompact)} aria-labelledby="same-force-caption">
    <div className={styles.experimentHead}><div><p className={styles.eyebrow}>Воздушная дорожка · толчок в течение одной секунды</p><h3>Одинаковая сила, разная масса</h3></div><span className={styles.timeChip}>из покоя · 1 с</span></div>
    <div className={styles.traceStack}><MotionTrace name="Каретка 1" mass="1 кг" acceleration="4\,\text{м/с}^2" end="86%" run={run} reveal={reveal} /><MotionTrace name="Каретка 2" mass="2 кг" acceleration="2\,\text{м/с}^2" end="48%" run={run} delay={0.08} reveal={reveal} /></div>
    <figcaption id="same-force-caption">{reveal ? "Каретка 1 легче, поэтому за ту же секунду её скорость изменилась сильнее." : "Обе каретки стоят на старте. Результат появится после запуска."}</figcaption>
  </figure>;
}

function ForceDiagram({ id, compact = false }: { id: string; compact?: boolean }) {
  const arrowId = `${id}-arrow`;
  return <figure className={cn(styles.forceFigure, compact && styles.forceFigureCompact)} aria-labelledby={`${id}-caption`}>
    <svg viewBox="0 0 760 330" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>Силы, действующие на лабораторную каретку</title><desc id={`${id}-desc`}>{compact ? "Сила тяги 6 ньютонов направлена вправо, сила сопротивления 2 ньютона — влево. Реакция опоры направлена вверх, сила тяжести — вниз." : "Сила тяги 6 ньютонов направлена вправо, сила сопротивления 2 ньютона — влево."}</desc>
      <defs><marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
      <line className={styles.airTrackRail} x1="70" y1="244" x2="690" y2="244" />
      <line className={styles.airTrackEdge} x1="92" y1="258" x2="668" y2="258" />
      <path className={styles.gliderBody} d="M286 208 L306 166 Q310 154 326 154 H434 Q450 154 454 166 L474 208 L450 226 H310 Z" />
      <rect className={styles.gliderMass} x="348" y="119" width="64" height="37" rx="5" />
      <path className={styles.gliderRunner} d="M314 226 H446 L430 241 H330 Z" />
      <circle className={styles.gliderVent} cx="340" cy="191" r="5" />
      <circle className={styles.gliderVent} cx="420" cy="191" r="5" />
      <text className={styles.diagramBodyLabel} x="380" y="194" textAnchor="middle">каретка</text>
      <line className={cn(styles.diagramArrow, styles.diagramArrowPink)} markerEnd={`url(#${arrowId})`} x1="292" y1="176" x2="116" y2="176" /><text className={styles.diagramForceLabel} x="108" y="148">Fсопр = 2 Н</text><line className={cn(styles.diagramArrow, styles.diagramArrowCyan)} markerEnd={`url(#${arrowId})`} x1="468" y1="176" x2="660" y2="176" /><text className={styles.diagramForceLabel} x="535" y="148">Fтяги = 6 Н</text>
      {compact ? <><line className={styles.diagramArrow} markerEnd={`url(#${arrowId})`} x1="380" y1="145" x2="380" y2="55" /><text className={styles.diagramForceLabel} x="397" y="70">N</text><line className={styles.diagramArrow} markerEnd={`url(#${arrowId})`} x1="380" y1="227" x2="380" y2="312" /><text className={styles.diagramForceLabel} x="397" y="302">Fтяж = mg</text></> : null}
    </svg>
    <figcaption id={`${id}-caption`}>{compact ? <>Вверх и вниз каретка не разгоняется: <MathText text="$N=mg$" />. Вдоль дорожки тяга и сопротивление направлены навстречу друг другу.</> : "Вдоль дорожки тяга и сопротивление направлены навстречу друг другу."}</figcaption>
  </figure>;
}

function ForceCancellation() {
  const reduceMotion = useReducedMotion();
  const transition = (delay: number) => reduceMotion
    ? { duration: 0 }
    : { duration: 0.34, delay, ease: "easeOut" as const };

  return (
    <figure className={styles.cancellation} aria-labelledby="force-cancellation-caption">
      <div className={styles.cancellationLead}>
        <span>Сопоставим равные части</span>
        <p>В тяге 6 Н выделим 2 Н — ровно столько же, сколько даёт трение в другую сторону.</p>
      </div>
      <div
        className={styles.cancellationScene}
        role="img"
        aria-label="Два ньютона тяги вправо и два ньютона трения влево гасят друг друга. От тяги остаётся четыре ньютона вправо."
      >
        <motion.div
          className={styles.cancelPair}
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition(0.05)}
        >
          <span className={styles.leftForce}><ArrowLeft size={20} weight="bold" /> 2 Н</span>
          <span className={styles.cancelWords}>гасят друг друга</span>
          <span className={styles.rightForce}>2 Н <ArrowRight size={20} weight="bold" /></span>
        </motion.div>
        <motion.div
          className={styles.remainingForce}
          initial={reduceMotion ? false : { opacity: 0, scaleX: 0.72 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={transition(0.3)}
        >
          <span>остаётся</span>
          <strong>4 Н <ArrowRight size={24} weight="bold" /></strong>
        </motion.div>
      </div>
      <figcaption id="force-cancellation-caption">Сильнее тяга, поэтому каретка разгоняется вправо.</figcaption>
    </figure>
  );
}

export function BrakingBicycleDiagram({
  revealForce = true,
  showCaption = true,
}: {
  revealForce?: boolean;
  showCaption?: boolean;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const captionId = `${id}-caption`;
  const arrowId = `${id}-arrow`;

  const diagram = (
      <svg viewBox="0 0 760 330" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>Велосипед движется вправо и тормозит</title>
        <desc id={descriptionId}>
          {revealForce
            ? "Скорость направлена вправо, а результирующая сила торможения 180 ньютонов — влево."
            : "Велосипед движется вправо, но его скорость уменьшается; направление ускорения пока не показано."}
        </desc>
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line className={styles.diagramGround} x1="70" y1="278" x2="690" y2="278" />
        <circle className={styles.bicycleWheel} cx="265" cy="226" r="54" />
        <circle className={styles.bicycleWheel} cx="505" cy="226" r="54" />
        <circle className={styles.bicycleHub} cx="265" cy="226" r="6" />
        <circle className={styles.bicycleHub} cx="505" cy="226" r="6" />
        <path className={styles.bicycleFrame} d="M265 226 L344 219 L404 152 L505 226 M344 219 L386 226 L404 152 M386 226 L505 226" />
        <path className={styles.bicycleDetail} d="M391 147 H429 M404 152 L442 132 M442 132 H470 M333 216 L318 190 H348" />
        <circle className={styles.bicycleCrank} cx="386" cy="226" r="10" />
        <circle className={styles.riderHead} cx="388" cy="82" r="22" />
        <path className={styles.riderBody} d="M381 107 Q355 132 350 165 L404 176 L421 136 Q411 111 381 107 Z" />
        <path className={styles.riderLimb} d="M397 125 L438 142 L456 133 M363 156 L333 192 M397 173 L376 226 M405 174 L442 205" />
        <path className={styles.helmet} d="M367 78 Q384 50 410 69 L414 82 Q390 72 367 78 Z" />
        <line
          className={cn(styles.diagramArrow, styles.diagramArrowCyan)}
          markerEnd={`url(#${arrowId})`}
          x1="385"
          y1="80"
          x2="635"
          y2="80"
        />
        <text className={styles.diagramForceLabel} x="500" y="55">
          {revealForce ? "скорость v" : "v уменьшается"}
        </text>
        {revealForce ? (
          <>
            <line
              className={cn(styles.diagramArrow, styles.diagramArrowPink)}
              markerEnd={`url(#${arrowId})`}
              x1="330"
              y1="190"
              x2="105"
              y2="190"
            />
            <text className={styles.diagramForceLabel} x="105" y="160">Fрез = 180 Н</text>
          </>
        ) : (
          <text className={styles.diagramQuestion} x="105" y="183">a — ?</text>
        )}
      </svg>
  );

  if (!showCaption) {
    return <div className={styles.brakingFigure}>{diagram}</div>;
  }

  return (
    <figure className={styles.brakingFigure} aria-labelledby={captionId}>
      {diagram}
      <figcaption id={captionId}>
        Результирующая сила направлена против скорости, поэтому велосипед замедляется.
      </figcaption>
    </figure>
  );
}

export function DynamicsLesson() {
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [run, setRun] = useState(0);
  const [experimentBusy, setExperimentBusy] = useState(false);
  const [observed, setObserved] = useState(false);
  const [forceChoice, setForceChoice] = useState<ForceChoice | null>(null);
  const [practiceForce, setPracticeForce] = useState("");
  const [practiceAcceleration, setPracticeAcceleration] = useState("");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [independentForce, setIndependentForce] = useState("");
  const [independentAcceleration, setIndependentAcceleration] = useState("");
  const [independentChecked, setIndependentChecked] = useState(false);
  const [brakingAnswer, setBrakingAnswer] = useState("");
  const [brakingChecked, setBrakingChecked] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [summaryTried, setSummaryTried] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const practiceForceCorrect = parseNumber(practiceForce) === 9;
  const practiceAccelerationCorrect = parseNumber(practiceAcceleration) === 3;
  const practiceCorrect = practiceForceCorrect && practiceAccelerationCorrect;
  const independentForceCorrect = parseNumber(independentForce) === 12;
  const independentAccelerationCorrect = parseNumber(independentAcceleration) === 3;
  const independentCorrect = independentForceCorrect && independentAccelerationCorrect;
  const brakingCorrect = parseNumber(brakingAnswer) === 3;
  const summaryReady = summaryText.trim().length >= 12;
  const canContinue = step === 1
    ? prediction !== null
    : step === 2
      ? observed
      : step === 3
        ? forceChoice === "resultant"
        : step === 6
          ? practiceChecked && practiceCorrect
          : step === 7
            ? independentChecked && independentCorrect
            : step === 8
              ? brakingChecked && brakingCorrect
              : step === 9
                ? summarySaved
                : true;

  useEffect(() => () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); }, []);

  function runExperiment() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setRun((value) => value + 1); setObserved(false);
    if (reduceMotion) { setExperimentBusy(false); setObserved(true); return; }
    setExperimentBusy(true);
    timerRef.current = window.setTimeout(() => { setExperimentBusy(false); setObserved(true); }, 2550);
  }

  function renderStep() {
    if (step === 0) return <div className={styles.openingStage}><div className={styles.openingCopy}><p className={styles.eyebrow}>Перед опытом</p><h2 ref={headingRef} tabIndex={-1}>Почему лёгкую каретку разогнать проще, чем тяжёлую?</h2><p className={styles.lead}>Сила меняет скорость тела. Ускорение показывает, как быстро происходит это изменение. Сравним две лабораторные каретки на воздушной дорожке: подействуем одинаковой силой, но массы будут разными.</p></div><div className={styles.startNotes} aria-label="Что понадобится в уроке"><p><span>скорость</span> меняется, пока на тело действует сила</p><p><span>ускорение</span> показывает быстроту изменения скорости</p><p><span>масса</span> показывает, насколько трудно изменить движение тела</p></div></div>;

    if (step === 1) return <div className={styles.heroGrid}><div className={styles.predictionVisual}><SameForceExperiment run={0} reveal={false} compact /></div><div className={styles.heroQuestion}><p className={styles.eyebrow}>Твой прогноз</p><h2 ref={headingRef} tabIndex={-1}>Как изменится скорость за одну секунду?</h2><p className={styles.lead}>Каретка 1 имеет массу 1 кг, каретка 2 — 2 кг. На каждую вправо действует одинаковая сила 4 Н.</p><fieldset className={styles.choiceList}><legend className="sr-only">Выбери прогноз</legend><Choice selected={prediction === "light"} onClick={() => setPrediction("light")}>Каретка 1 разгонится сильнее</Choice><Choice selected={prediction === "same"} onClick={() => setPrediction("same")}>Обе разгонятся одинаково</Choice><Choice selected={prediction === "heavy"} onClick={() => setPrediction("heavy")}>Каретка 2 разгонится сильнее</Choice></fieldset></div></div>;

    if (step === 2) return <div className={styles.lessonStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Наблюдение</p><h2 ref={headingRef} tabIndex={-1}>Обе стартуют одновременно</h2><p className={styles.lead}>Сравни положение кареток в один и тот же момент времени.</p></div><SameForceExperiment run={run} reveal={observed} /><button type="button" className={styles.runButton} onClick={runExperiment} disabled={experimentBusy}><Play size={18} weight="fill" /> {experimentBusy ? "Наблюдаем…" : run > 0 ? "Запустить ещё раз" : "Запустить обе"}</button>{observed ? <Feedback containerRef={feedbackRef} kind={prediction === "light" ? "good" : "note"}><strong>Каретка 1 получила вдвое большее ускорение.</strong> Сила была одинаковой, а масса первой каретки — вдвое меньше.</Feedback> : null}</div>;

    if (step === 3) return <div className={styles.lessonStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Когда сил несколько</p><h2 ref={headingRef} tabIndex={-1}>Тяга разгоняет, сопротивление мешает</h2><p className={styles.lead}>Теперь каретка движется по дорожке с сопротивлением. Сравним встречные силы и посмотрим, какая часть тяги остаётся.</p></div><ForceDiagram id="force-choice" /><ForceCancellation /><div className={styles.termNote}><span>Новое слово</span><p><strong>Результирующая сила</strong> — сила, которая показывает итог совместного действия всех сил. Здесь после взаимного погашения остаётся 4 Н вправо.</p></div><fieldset className={styles.choiceList}><legend>Какая сила определяет разгон каретки?</legend><Choice selected={forceChoice === "pull"} onClick={() => setForceChoice("pull")}>Вся сила тяги: 6 Н вправо</Choice><Choice selected={forceChoice === "resultant"} onClick={() => setForceChoice("resultant")}>Оставшиеся 4 Н вправо</Choice><Choice selected={forceChoice === "sum"} onClick={() => setForceChoice("sum")}>Все 8 Н сразу</Choice></fieldset>{forceChoice ? <Feedback containerRef={feedbackRef} kind={forceChoice === "resultant" ? "good" : "try"}>{forceChoice === "resultant" ? "Верно. Встречные 2 Н погасили такую же часть тяги, поэтому осталось 4 Н вправо." : "Сравни встречные силы: 2 Н сопротивления гасят равную часть тяги. От 6 Н остаётся 4 Н вправо."}</Feedback> : null}</div>;

    if (step === 4) return <div className={styles.modelStage}><div><p className={styles.eyebrow}>Второй закон Ньютона</p><h2 ref={headingRef} tabIndex={-1}>Больше сила — больше ускорение. Больше масса — меньше ускорение.</h2><p className={styles.lead}>Ускорение направлено так же, как результирующая сила.</p></div><div className={styles.formulaHero}><MathText text="$\vec F_{\text{рез}}=m\vec a$" /></div><div className={styles.ruleReading}><MathText text="$a=\dfrac{F_{\text{рез}}}{m}$" /><p>Чтобы найти модуль ускорения, делим результирующую силу на массу тела.</p></div><div className={styles.sigmaNote}><span className={styles.sigmaMark}>Σ</span><p><strong>Σ читается «сумма».</strong> Запись <MathText text="$\Sigma \vec F$" /> означает сложить все силы с учётом их направлений. Дальше иногда будем использовать это короткое обозначение вместо <MathText text="$\vec F_{\text{рез}}$" />.</p></div></div>;

    if (step === 5) return <div className={styles.lessonStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Разберём задачу полностью</p><h2 ref={headingRef} tabIndex={-1}>Каретка массой 2 кг: тяга 6 Н, сопротивление 2 Н</h2></div><div className={styles.workedLayout}><ForceDiagram id="worked-force" compact /><div className={styles.schoolSolution}><div className={styles.givenBlock}><p><strong>Дано:</strong></p><MathText text="$m=2\,\text{кг}$" /><MathText text="$F_{\text{тяги}}=6\,\text{Н}$" /><MathText text="$F_{\text{сопр}}=2\,\text{Н}$" /><p className={styles.findLine}>Найти: <MathText text="$a$" /></p></div><ol className={styles.workedSteps}><li><span>·</span><div><b>Сравниваем встречные силы</b><p>Тяга сильнее. Сопротивление 2 Н гасит такую же часть тяги 6 Н.</p><MathText text="$F_{\text{рез}}=6-2=4\,\text{Н}$" /><small>остаётся 4 Н вправо</small></div></li><li><span>·</span><div><b>Делим оставшуюся силу на массу</b><MathText text="$a=\dfrac{F_{\text{рез}}}{m}=\dfrac{4}{2}=2\,\text{м/с}^2$" /></div></li><li><span>·</span><div><b>Записываем направление</b><p>Ускорение равно 2 м/с² и направлено вправо.</p></div></li></ol></div></div></div>;

    if (step === 6) return <div className={styles.lessonStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Теперь похожая задача</p><h2 ref={headingRef} tabIndex={-1}>Каретку массой 3 кг тянут вправо с силой 11 Н. Сопротивление — 2 Н.</h2><p className={styles.lead}>Сначала найди, сколько силы осталось после взаимного погашения, затем — ускорение.</p></div><div className={styles.answerPair}><NumberField id="dynamics-practice-force" label="Оставшаяся сила" value={practiceForce} onChange={(value) => { setPracticeForce(value); setPracticeChecked(false); }} suffix="Н вправо" /><NumberField id="dynamics-practice-acceleration" label="Ускорение" value={practiceAcceleration} onChange={(value) => { setPracticeAcceleration(value); setPracticeChecked(false); }} suffix="м/с² вправо" /></div><button type="button" className={styles.checkButton} onClick={() => setPracticeChecked(true)}>Проверить решение</button>{practiceChecked ? <Feedback containerRef={feedbackRef} kind={practiceCorrect ? "good" : "try"}>{practiceCorrect ? "Сопротивление гасит 2 Н из 11 Н: остаётся 9 Н вправо. 9 Н ÷ 3 кг = 3 м/с²." : !practiceForceCorrect ? "Сопротивление 2 Н гасит такую же часть тяги 11 Н. Сколько ньютонов останется вправо?" : "Осталось 9 Н вправо. Раздели эту силу на массу 3 кг."}</Feedback> : null}</div>;

    if (step === 7) return <div className={styles.lessonStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Теперь самостоятельно</p><h2 ref={headingRef} tabIndex={-1}>Каретку массой 4 кг тянут вправо с силой 14 Н. Сопротивление — 2 Н.</h2></div><div className={styles.answerPair}><NumberField id="dynamics-independent-force" label="Оставшаяся сила" value={independentForce} onChange={(value) => { setIndependentForce(value); setIndependentChecked(false); }} suffix="Н вправо" /><NumberField id="dynamics-independent-acceleration" label="Ускорение" value={independentAcceleration} onChange={(value) => { setIndependentAcceleration(value); setIndependentChecked(false); }} suffix="м/с² вправо" /></div><button type="button" className={styles.checkButton} onClick={() => setIndependentChecked(true)}>Проверить решение</button>{independentChecked ? <Feedback containerRef={feedbackRef} kind={independentCorrect ? "good" : "try"}>{independentCorrect ? "Сопротивление гасит 2 Н из 14 Н: остаётся 12 Н вправо. 12 Н ÷ 4 кг = 3 м/с²." : !independentForceCorrect ? "Сопоставь встречные силы: сопротивление гасит 2 Н тяги. Остаток направлен вправо." : "Раздели оставшиеся 12 Н на массу 4 кг."}</Feedback> : null}</div>;

    if (step === 8) return <div className={styles.brakingStage}><div className={styles.brakingVisual}><BrakingBicycleDiagram /></div><div className={styles.brakingCopy}><p className={styles.eyebrow}>Теперь торможение</p><h2 ref={headingRef} tabIndex={-1}>Велосипед едет вправо, а сила направлена влево</h2><p className={styles.lead}>Общая масса велосипедиста и велосипеда — 60 кг. Результирующая сила торможения — 180 Н влево. Найди модуль ускорения.</p><NumberField id="dynamics-braking" label="Модуль ускорения" value={brakingAnswer} onChange={(value) => { setBrakingAnswer(value); setBrakingChecked(false); }} suffix="м/с² влево" /><button type="button" className={styles.checkButton} onClick={() => setBrakingChecked(true)}>Проверить ответ</button>{brakingChecked ? <Feedback containerRef={feedbackRef} kind={brakingCorrect ? "good" : "try"}>{brakingCorrect ? "180 Н ÷ 60 кг = 3 м/с² влево. Ускорение направлено против скорости, поэтому велосипед замедляется." : "Раздели силу торможения 180 Н на общую массу 60 кг."}</Feedback> : null}{brakingCorrect ? <div className={styles.practiceLinks} aria-label="Следующие задачи"><Link href="/practice/family/newton-second" className={styles.practiceLink}>Ещё задачи на второй закон <ArrowRight size={18} weight="bold" /></Link><Link href="/practice/family/friction-force" className={styles.practiceLinkSecondary}>Перейти к силе трения <ArrowRight size={18} weight="bold" /></Link></div> : null}</div></div>;

    return <div className={styles.summaryStage}><div className={styles.stageIntro}><p className={styles.eyebrow}>Итог</p><h2 ref={headingRef} tabIndex={-1}>Что осталось главным?</h2><p className={styles.lead}>Запиши связь своими словами — так будет проще узнать её в следующей задаче.</p></div><label className={styles.summaryLabel} htmlFor="dynamics-summary">Объяснение для себя</label><textarea id="dynamics-summary" className={styles.summaryInput} value={summaryText} onChange={(event) => { setSummaryText(event.target.value); setSummaryTried(false); setSummarySaved(false); }} rows={5} placeholder="Например: при той же силе более тяжёлое тело получает меньшее ускорение…" aria-describedby="dynamics-summary-hint" /><p id="dynamics-summary-hint" className={styles.summaryHint}>Достаточно одной-двух фраз. Пиши так, как объяснил бы другу.</p><button type="button" className={styles.summaryButton} onClick={() => { if (!summaryReady) { setSummaryTried(true); setSummarySaved(false); return; } setSummarySaved(true); }}>Сохранить итог</button>{summaryTried && !summaryReady ? <p className={styles.summaryError} role="alert">Добавь ещё немного слов — хотя бы одну законченную мысль.</p> : null}{summarySaved ? <div className={styles.practiceLinks} aria-label="Следующие задачи"><p>Связь сформулирована. Можно потренироваться ещё.</p><Link href="/practice/family/newton-second" className={styles.practiceLink}>Ещё задачи на второй закон <ArrowRight size={18} weight="bold" /></Link></div> : null}</div>;
  }

  return (
    <LessonStageEngine
      ariaLabelledBy="dynamics-lesson-title"
      identity={
        <div>
          <Link href="/topics" className={styles.topicBack}>
            <ArrowLeft size={14} weight="bold" /> К темам
          </Link>
          <p id="dynamics-lesson-title">Динамика</p>
          <span>сила · масса · ускорение</span>
        </div>
      }
      progressAriaLabel="Урок о втором законе Ньютона"
      stages={DYNAMICS_STAGES}
      activeIndex={step}
      canContinue={canContinue}
      onActiveIndexChange={setStep}
      reduceMotion={Boolean(reduceMotion)}
      classes={dynamicsEngineClasses}
      themePreserveDark
      renderNextLabel={(label) => <>{label} <ArrowRight size={18} weight="bold" /></>}
    >
      {renderStep()}
    </LessonStageEngine>
  );
}
