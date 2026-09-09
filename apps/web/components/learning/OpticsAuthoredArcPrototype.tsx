"use client";

import { useId, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { defineLessonStageSequence } from "../../lib/learning/lesson-stage-contract";
import { MathText } from "../ui/MathText";
import { LessonStageEngine } from "./LessonStageEngine";
import styles from "./OpticsAuthoredArcPrototype.module.css";

const MIN_ANGLE = 10;
const MAX_ANGLE = 70;
const INITIAL_ANGLE = 25;
const REQUIRED_ANGLES = [20, 45, 70] as const;
const EXPLORER_ORIGIN = { x: 260, y: 220 };
const PROBE_ORIGIN = { x: 280, y: 252 };

const stages = defineLessonStageSequence([
  { id: "orient", label: "Сориентироваться", nextAction: "Исследовать лучи" },
  { id: "compare", label: "Сравнить", nextAction: "Сформулировать связь" },
  { id: "formulate", label: "Сформулировать", nextAction: "Уточнить правило" },
  { id: "formalize", label: "Уточнить правило", nextAction: "Применить" },
  { id: "apply", label: "Применить" },
] as const);

const engineClasses = {
  root: styles.prototype,
  header: styles.header,
  progressMeta: styles.progressMeta,
  progressTrack: styles.progressTrack,
  stageShell: styles.stageShell,
  stage: styles.stage,
  footer: styles.footer,
  backButton: styles.backButton,
  nextButton: styles.nextButton,
};

function pointOnRay(
  angle: number,
  length: number,
  side: -1 | 1,
  origin = EXPLORER_ORIGIN,
) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: origin.x + side * Math.sin(radians) * length,
    y: origin.y - Math.cos(radians) * length,
  };
}

function ReflectionExplorer({
  angle,
  observedAngles,
  onChange,
}: {
  angle: number;
  observedAngles: readonly number[];
  onChange: (angle: number) => void;
}) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const incident = pointOnRay(angle, 162, -1);
  const reflected = pointOnRay(angle, 162, 1);

  return (
    <figure className={styles.explorer} aria-labelledby={`${id}-title`}>
      <div className={styles.explorerHeader}>
        <div>
          <p className={styles.kicker}>Зеркальная поверхность</p>
          <h4 id={`${id}-title`}>Меняй наклон падающего луча</h4>
        </div>
        <output className={styles.angleOutput} htmlFor={`${id}-angle`}>
          <span>Выбранный отсчёт</span>
          <b>{angle}°</b>
        </output>
      </div>

      <svg
        viewBox="0 0 520 292"
        className={styles.diagram}
        role="group"
        aria-label={`Падающий луч образует угол ${angle} градусов с нормалью. Отражённый луч показан по другую сторону нормали.`}
      >
        <defs>
          <marker id={`${id}-incident-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.incidentFill} />
          </marker>
          <marker id={`${id}-reflected-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.reflectedFill} />
          </marker>
        </defs>
        <path d="M 52 220 H 468" className={styles.mirror} />
        {Array.from({ length: 20 }, (_, index) => (
          <path key={index} d={`M ${66 + index * 20} 220 l -10 14`} className={styles.hatch} />
        ))}
        <path d="M 260 34 V 252" className={styles.normal} />
        <text x="270" y="51" className={styles.axisLabel}>нормаль</text>
        <text x="64" y="259" className={styles.axisLabel}>зеркало</text>
        <line x1={incident.x} y1={incident.y} x2="257" y2="217" className={styles.incidentRay} markerEnd={`url(#${id}-incident-arrow)`} />
        <line x1="263" y1="217" x2={reflected.x} y2={reflected.y} className={styles.reflectedRay} markerEnd={`url(#${id}-reflected-arrow)`} />
        <circle cx="260" cy="220" r="5" className={styles.hitPoint} />
        <text x={incident.x - 24} y={incident.y + 2} className={styles.incidentText}>падающий</text>
        <text x={reflected.x - 16} y={reflected.y + 2} className={styles.reflectedText}>отражённый</text>
      </svg>

      <div className={styles.control}>
        <label htmlFor={`${id}-angle`}>
          Угол падения от нормали
          <strong>{angle}°</strong>
        </label>
        <input
          id={`${id}-angle`}
          type="range"
          min={MIN_ANGLE}
          max={MAX_ANGLE}
          step={5}
          value={angle}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-describedby={`${id}-reading`}
        />
        <div className={styles.rangeEnds} aria-hidden="true"><span>{MIN_ANGLE}°</span><span>{MAX_ANGLE}°</span></div>
      </div>

      <figcaption id={`${id}-reading`} className={styles.reading} aria-live="polite">
        <span>Падающий луч: {angle}° от нормали</span>
        <span>Отражённый луч: {angle}° от нормали</span>
      </figcaption>

      <div className={styles.observationLedger} aria-live="polite">
        <div>
          <b>Сравнения</b>
          <span>Зафиксируй три разных положения ползунка.</span>
        </div>
        <ul>
          {REQUIRED_ANGLES.map((requiredAngle) => {
            const observed = observedAngles.includes(requiredAngle);
            return (
              <li key={requiredAngle} data-observed={observed ? "true" : "false"}>
                <span aria-hidden="true">{observed ? "●" : "○"}</span>
                <b>{requiredAngle}°</b>
                {observed ? <span>оба отсчёта: {requiredAngle}°</span> : <span>ещё не сравнили</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}

const formulationChoices = [
  { id: "same", text: "При каждом изменении оба отсчёта от нормали меняются одинаково." },
  { id: "right", text: "Угол отражённого луча всегда равен 90°." },
  { id: "larger", text: "Отражённый луч всегда образует больший угол." },
] as const;

const reflectionProbeCandidates = [
  // Treats the given surface angle as though it were already measured from
  // the normal: 35° from normal, or 55° from the mirror surface.
  { id: "surface-as-normal", label: "A", normalAngle: 35 },
  // Doubles the stated 35° *from the mirror surface*: 70° from the surface
  // is 20° from the normal. This is intentionally not the task-generator
  // `reflectionDoublesAngle` rule, whose parameter is already normal-based.
  { id: "double-surface", label: "B", normalAngle: 20 },
  // The law of reflection: 55° from the normal on the other side.
  { id: "law", label: "C", normalAngle: 55 },
] as const;

function ReflectionRayProbe({
  selectedId,
  checked,
  onSelect,
}: {
  selectedId: string;
  checked: boolean;
  onSelect: (id: string) => void;
}) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const incident = pointOnRay(55, 164, -1, PROBE_ORIGIN);
  const incidentArc = pointOnRay(55, 48, -1, PROBE_ORIGIN);
  const correctArc = pointOnRay(55, 44, 1, PROBE_ORIGIN);

  function selectWithKeyboard(event: KeyboardEvent<SVGGElement>, candidateId: string, candidateIndex: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(candidateId);
      return;
    }

    const nextIndex = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? (candidateIndex + 1) % reflectionProbeCandidates.length
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? (candidateIndex - 1 + reflectionProbeCandidates.length) % reflectionProbeCandidates.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? reflectionProbeCandidates.length - 1
            : null;
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(reflectionProbeCandidates[nextIndex].id);
    window.requestAnimationFrame(() => {
      const nextChoice = event.currentTarget.ownerSVGElement?.querySelector<SVGGElement>(`[data-probe-choice-id="${reflectionProbeCandidates[nextIndex].id}"]`);
      nextChoice?.focus();
    });
  }

  return (
    <figure className={styles.rayProbe} aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`}>
        <b>Выбери отражённый луч</b>
        <span>Падающий луч образует с поверхностью зеркала угол 35°.</span>
      </figcaption>
      <svg
        viewBox="0 0 560 344"
        className={styles.probeDiagram}
        aria-labelledby={`${id}-diagram-title`}
      >
        <title id={`${id}-diagram-title`}>Схема плоского зеркала с нормалью, падающим лучом и тремя возможными отражёнными лучами A, B и C.</title>
        <defs>
          <marker id={`${id}-incident-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.incidentFill} />
          </marker>
          <marker id={`${id}-outgoing-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" className={styles.candidateFill} />
          </marker>
        </defs>
        <path d="M 52 252 H 508" className={styles.mirror} />
        {Array.from({ length: 22 }, (_, index) => (
          <path key={index} d={`M ${64 + index * 20} 252 l -10 14`} className={styles.hatch} />
        ))}
        <path d="M 280 38 V 284" className={styles.normal} />
        <text x="291" y="56" className={styles.axisLabel}>нормаль</text>
        <text x="64" y="292" className={styles.axisLabel}>зеркало</text>
        <line
          x1={incident.x}
          y1={incident.y}
          x2={PROBE_ORIGIN.x}
          y2={PROBE_ORIGIN.y}
          className={styles.incidentRay}
          data-probe-incident="true"
          markerEnd={`url(#${id}-incident-arrow)`}
        />
        <path d={`M ${PROBE_ORIGIN.x - 48} ${PROBE_ORIGIN.y} A 48 48 0 0 1 ${incidentArc.x} ${incidentArc.y}`} className={styles.givenArc} />
        <text x={incidentArc.x - 30} y={incidentArc.y + 3} className={styles.givenAngle}>35°</text>
        <text x={incident.x - 16} y={incident.y - 12} className={styles.incidentText}>падающий луч</text>
        <circle cx={PROBE_ORIGIN.x} cy={PROBE_ORIGIN.y} r="5" className={styles.hitPoint} />
        <g role="radiogroup" aria-label="Варианты отражённого луча">
          {reflectionProbeCandidates.map((candidate, candidateIndex) => {
            const point = pointOnRay(candidate.normalAngle, 164, 1, PROBE_ORIGIN);
            const selected = selectedId === candidate.id;
            return (
              <g
                key={candidate.id}
                role="radio"
                aria-label={`Луч ${candidate.label}`}
                aria-checked={selected}
                tabIndex={selected || (!selectedId && candidateIndex === 0) ? 0 : -1}
                className={styles.probeChoice}
                data-probe-choice-id={candidate.id}
                data-selected={selected ? "true" : "false"}
                onClick={() => onSelect(candidate.id)}
                onKeyDown={(event) => selectWithKeyboard(event, candidate.id, candidateIndex)}
              >
                <line x1={PROBE_ORIGIN.x} y1={PROBE_ORIGIN.y} x2={point.x} y2={point.y} className={styles.probeHitTarget} />
                <line
                  x1={PROBE_ORIGIN.x}
                  y1={PROBE_ORIGIN.y}
                  x2={point.x}
                  y2={point.y}
                  className={styles.probeCandidateRay}
                  data-probe-ray={candidate.id}
                  markerEnd={`url(#${id}-outgoing-arrow)`}
                />
                <circle cx={point.x} cy={point.y} r="12" className={styles.probeFocusRing} />
                <text x={point.x + 8} y={point.y - 8} className={styles.probeCandidateLabel}>{candidate.label}</text>
              </g>
            );
          })}
        </g>
        {checked && selectedId === "law" ? (
          <g aria-hidden="true">
            <path d={`M ${PROBE_ORIGIN.x} ${PROBE_ORIGIN.y - 44} A 44 44 0 0 1 ${correctArc.x} ${correctArc.y}`} className={styles.revealedArc} />
            <text x={correctArc.x + 10} y={correctArc.y - 7} className={styles.revealedAngle}>55°</text>
          </g>
        ) : null}
      </svg>
      <p className={styles.probeInstruction}>Нажми на луч A, B или C. Выбранный луч подсветится; до проверки значения углов не показаны.</p>
    </figure>
  );
}

export function OpticsAuthoredArcPrototype() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [observedAngles, setObservedAngles] = useState<number[]>([]);
  const [formulation, setFormulation] = useState("");
  const [formulationChecked, setFormulationChecked] = useState(false);
  const [applyAnswer, setApplyAnswer] = useState("");
  const [applyChecked, setApplyChecked] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [analogueHelpOpen, setAnalogueHelpOpen] = useState(false);
  const [analogueHelpDismissed, setAnalogueHelpDismissed] = useState(false);
  const [selfExplanation, setSelfExplanation] = useState("");
  const reduceMotion = useReducedMotion() ?? false;
  const activeStage = stages[activeIndex];

  const comparisonComplete = observedAngles.length === REQUIRED_ANGLES.length;
  const formulationCorrect = formulation === "same";
  const applicationCorrect = applyAnswer === "law";
  const canContinue = activeIndex === 1
    ? comparisonComplete
    : activeIndex === 2
      ? formulationChecked && formulationCorrect
      : activeIndex === 4
        ? applyChecked && applicationCorrect
        : true;

  const stageContent = useMemo(() => {
    if (activeStage.id === "orient") {
      return (
        <div className={styles.splitStage}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Отражение света</p>
            <h2 data-lesson-stage-heading tabIndex={-1}>Найди опору для отсчёта</h2>
            <p>
              Луч приходит к зеркалу и уходит от него. Через точку встречи проводят <b>нормаль</b> — прямую, перпендикулярную зеркалу.
            </p>
            <p>
              Дальше будешь менять угол падающего луча <em>от нормали</em> и сравнивать его с углом отражённого луча. Пока правило не называем — сначала собери наблюдения.
            </p>
          </div>
          <div className={styles.orientationDiagram} aria-hidden="true">
            <span className={styles.orientationMirror} />
            <span className={styles.orientationNormal} />
            <span className={styles.orientationRayLeft} />
            <span className={styles.orientationRayRight} />
            <b>нормаль</b>
            <i>зеркало</i>
          </div>
        </div>
      );
    }

    if (activeStage.id === "compare") {
      return (
        <div className={styles.exploreStage}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Собери наблюдения</p>
            <h2 data-lesson-stage-heading tabIndex={-1}>Что меняется вместе?</h2>
            <p>Поставь ползунок на 20°, 45° и 70°. После каждого положения сравни два отсчёта от нормали.</p>
          </div>
          <ReflectionExplorer
            angle={angle}
            observedAngles={observedAngles}
            onChange={(nextAngle) => {
              setAngle(nextAngle);
              if (REQUIRED_ANGLES.includes(nextAngle as (typeof REQUIRED_ANGLES)[number])) {
                setObservedAngles((current) => current.includes(nextAngle) ? current : [...current, nextAngle]);
              }
            }}
          />
          {comparisonComplete ? <p className={styles.ready} role="status">Три сравнения записаны. Теперь можно описать связь.</p> : null}
        </div>
      );
    }

    if (activeStage.id === "formulate") {
      return (
        <div className={styles.formulationStage}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Твоя формулировка</p>
            <h2 data-lesson-stage-heading tabIndex={-1}>Что остаётся связанным при всех трёх положениях?</h2>
            <p>Выбери формулировку, которая описывает именно твои сравнения. Запись с греческими буквами появится после выбора.</p>
          </div>
          <fieldset className={styles.choices}>
            <legend>Связь между двумя отсчётами</legend>
            {formulationChoices.map((choice) => (
              <label key={choice.id} data-selected={formulation === choice.id ? "true" : "false"}>
                <input
                  type="radio"
                  name="reflection-formulation"
                  value={choice.id}
                  checked={formulation === choice.id}
                  onChange={() => { setFormulation(choice.id); setFormulationChecked(false); }}
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </fieldset>
          <button type="button" className={styles.checkButton} disabled={!formulation} onClick={() => setFormulationChecked(true)}>Проверить формулировку</button>
          {formulationChecked ? (
            <div className={formulationCorrect ? styles.feedbackGood : styles.feedbackTry} role={formulationCorrect ? "status" : "alert"}>
              <b>{formulationCorrect ? "Сходится" : "Вернись к сравнениям"}</b>
              <span>{formulationCorrect ? "Во всех трёх записях менялись оба отсчёта, но они оставались одинаковыми." : "Сравни отдельно 20°, 45° и 70°: какой из двух отсчётов меняется и как?"}</span>
            </div>
          ) : null}
        </div>
      );
    }

    if (activeStage.id === "formalize") {
      return (
        <div className={styles.formalizeStage}>
          <p className={styles.eyebrow}>Точная запись</p>
          <h2 data-lesson-stage-heading tabIndex={-1}>Закон отражения</h2>
          <p>Обозначим угол падения от нормали через α, а угол отражения от нормали — через β.</p>
          <div className={styles.formula}><MathText text={"$\\alpha = \\beta$"} /></div>
          <p>Угол падения равен углу отражения. Равенство относится именно к углам, отсчитанным от нормали, а не от поверхности зеркала.</p>
          <div className={styles.note}><b>Проверь границу модели</b><span>В этой схеме зеркало плоское, а оба луча лежат в одной плоскости с нормалью.</span></div>
        </div>
      );
    }

    const applicationFeedback = "35° задано относительно поверхности зеркала. Закон отражения сравнивает углы относительно нормали.";
    const showLevelOneCue = applyChecked && !applicationCorrect;
    const showLevelTwoHelp = analogueHelpOpen || (incorrectAttempts >= 2 && !analogueHelpDismissed);

    function checkApplication() {
      setApplyChecked(true);
      if (!applicationCorrect) {
        setIncorrectAttempts((current) => current + 1);
        setAnalogueHelpDismissed(false);
      }
    }

    return (
      <div className={styles.applyStage}>
        <p className={styles.eyebrow}>Новая ситуация</p>
        <h2 data-lesson-stage-heading tabIndex={-1}>Найди отражённый луч</h2>
        <div className={styles.problem}>Здесь угол дан <b>к поверхности зеркала</b>. Какой из трёх лучей согласуется с отражением от плоского зеркала?</div>
        <ReflectionRayProbe
          selectedId={applyAnswer}
          checked={applyChecked}
          onSelect={(candidateId) => { setApplyAnswer(candidateId); setApplyChecked(false); }}
        />
        <button type="button" className={styles.checkButton} disabled={!applyAnswer} onClick={checkApplication}>Проверить луч</button>
        {applicationCorrect && applyChecked ? (
          <div className={styles.successArea}>
            <div className={styles.feedbackGood} role="status">
              <b>Верно</b>
              <span>35° к поверхности → 55° к нормали → симметричный отражённый луч.</span>
            </div>
            <label className={styles.selfExplanationLabel} htmlFor="optics-prototype-self-explanation">
              Почему именно этот луч?
              <textarea
                id="optics-prototype-self-explanation"
                value={selfExplanation}
                onChange={(event) => setSelfExplanation(event.target.value)}
                placeholder="Можно написать своими словами — это необязательно."
                rows={3}
              />
            </label>
            <div className={styles.applyActions}>
              <Link className={styles.practiceLink} href="/practice/family/reflection-angle">Перейти к задачам по отражению</Link>
              <Link className={styles.topicLink} href="/topics">Вернуться к теме</Link>
            </div>
          </div>
        ) : null}
        {showLevelOneCue ? (
          <div className={styles.recoveryArea}>
            <div className={styles.feedbackTry} role="alert">
              <b>Пока не сходится</b>
              <span>{applicationFeedback}</span>
            </div>
            {!showLevelTwoHelp ? (
              <button type="button" className={styles.helpButton} onClick={() => { setAnalogueHelpDismissed(false); setAnalogueHelpOpen(true); }}>Помощь на другом примере</button>
            ) : null}
            {showLevelTwoHelp ? (
              <aside className={styles.analogueHelp} aria-labelledby="optics-analogue-title">
                <p className={styles.eyebrow}>Аналогичный пример</p>
                <h3 id="optics-analogue-title">Сначала назови отсчёт</h3>
                <p>Другой луч образует <b>20° с поверхностью</b>. Нормаль перпендикулярна поверхности, поэтому угол между лучом и нормалью равен <b>70°</b>.</p>
                <p>Отражённый луч строится по другую сторону нормали под таким же углом к нормали.</p>
                <button type="button" className={styles.returnButton} onClick={() => { setAnalogueHelpOpen(false); setAnalogueHelpDismissed(true); }}>Вернуться к исходной задаче</button>
              </aside>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }, [activeStage.id, angle, analogueHelpDismissed, analogueHelpOpen, applyAnswer, applyChecked, applicationCorrect, comparisonComplete, formulation, formulationChecked, formulationCorrect, incorrectAttempts, observedAngles, selfExplanation]);

  return (
    <main className={styles.page}>
      <LessonStageEngine
        identity={<div className={styles.identity}><p>Внутренний прототип · не учебный маршрут</p><h1 id="optics-authored-arc-title">Отражение: от сравнения к закону</h1></div>}
        ariaLabelledBy="optics-authored-arc-title"
        progressAriaLabel="Прогресс прототипа отражения света"
        stages={stages}
        activeIndex={activeIndex}
        canContinue={canContinue}
        onActiveIndexChange={setActiveIndex}
        reduceMotion={reduceMotion}
        classes={engineClasses}
      >
        <div>{stageContent}</div>
      </LessonStageEngine>
    </main>
  );
}
