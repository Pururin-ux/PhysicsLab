"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import {
  defineLessonStageSequence,
  getLessonStageDefinition,
} from "../../lib/learning/lesson-stage-contract";
import { MathText } from "../ui/MathText";
import { LessonStageEngine } from "./LessonStageEngine";
import styles from "./TopicPrimer.module.css";

const TOPIC_PRIMER_STAGES = defineLessonStageSequence([
  { id: "context", nextAction: "Сделать прогноз" },
  { id: "prediction", nextAction: "Сравнить с наблюдением" },
  { id: "observation", nextAction: "Объяснить результат" },
  { id: "causal-explanation", nextAction: "Записать связь" },
  { id: "representation", nextAction: "Разобрать пример" },
  { id: "worked-example", nextAction: "Дополнить решение" },
  { id: "faded-example", nextAction: "Решить самостоятельно" },
  { id: "independent-practice", nextAction: "Перенести идею" },
  { id: "transfer", nextAction: "Подвести итог" },
  { id: "summary" },
] as const);

const primerEngineClasses = {
  root: styles.primer,
  header: styles.header,
  progressMeta: styles.progressMeta,
  progressTrack: styles.progressTrack,
  stageShell: styles.stageShell,
  stage: styles.stage,
  footer: styles.footer,
  backButton: styles.backButton,
  nextButton: styles.nextButton,
};

export interface TopicPrimerAsset {
  src: string;
  alt: string;
  caption?: ReactNode;
  sizes?: string;
  objectPosition?: string;
  priority?: boolean;
}

export interface TopicPrimerChoice {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
}

export interface TopicPrimerPredictionChoice extends TopicPrimerChoice {
  /** Shown after the observation, never before the learner commits. */
  reflection?: ReactNode;
}

export type TopicPrimerInputValidation =
  | {
      kind: "number";
      expected: number;
      tolerance?: number;
    }
  | {
      kind: "text";
      accepted: readonly string[];
      caseSensitive?: boolean;
    };

interface TopicPrimerAnswerBase {
  prompt: ReactNode;
  correctFeedback: ReactNode;
  incorrectFeedback: ReactNode;
  checkLabel?: string;
}

export interface TopicPrimerInputAnswer extends TopicPrimerAnswerBase {
  kind: "input";
  label: string;
  suffix?: ReactNode;
  inputMode?: "decimal" | "numeric" | "text";
  validation: TopicPrimerInputValidation;
}

export interface TopicPrimerChoiceAnswer extends TopicPrimerAnswerBase {
  kind: "choice";
  legend: string;
  choices: readonly TopicPrimerChoice[];
  correctId: string;
}

export type TopicPrimerAnswer = TopicPrimerInputAnswer | TopicPrimerChoiceAnswer;

export interface TopicPrimerWorkedStep {
  label?: string;
  title: ReactNode;
  body?: ReactNode;
  /** KaTeX source; delimiters are optional. */
  formula?: string;
}

interface TopicPrimerStageCopy {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
}

export interface TopicPrimerPrediction extends TopicPrimerStageCopy {
  question: ReactNode;
  choices: readonly TopicPrimerPredictionChoice[];
  asset?: TopicPrimerAsset;
  visual?: ReactNode;
  committedText?: ReactNode;
}

export interface TopicPrimerObservation extends TopicPrimerStageCopy {
  asset?: TopicPrimerAsset;
  visual?: ReactNode;
  insight?: ReactNode;
}

export interface TopicPrimerModel extends TopicPrimerStageCopy {
  /** KaTeX source; delimiters are optional. */
  formula: string;
  formulaCaption?: ReactNode;
  principles?: readonly {
    label: ReactNode;
    explanation: ReactNode;
  }[];
  boundary?: ReactNode;
}

export interface TopicPrimerWorkedExample extends TopicPrimerStageCopy {
  problem: ReactNode;
  steps: readonly TopicPrimerWorkedStep[];
  conclusion?: ReactNode;
}

export interface TopicPrimerFadedExample extends TopicPrimerStageCopy {
  problem: ReactNode;
  shownSteps: readonly TopicPrimerWorkedStep[];
  answer: TopicPrimerAnswer;
}

export interface TopicPrimerIndependentProblem extends TopicPrimerStageCopy {
  problem: ReactNode;
  answer: TopicPrimerAnswer;
}

export interface TopicPrimerTransfer extends TopicPrimerStageCopy {
  problem?: ReactNode;
  asset?: TopicPrimerAsset;
  visual?: ReactNode;
  answer?: TopicPrimerAnswer;
  practiceHref: string;
  practiceLabel: string;
  completionText?: ReactNode;
}

export interface TopicPrimerConfig {
  topic: string;
  title: string;
  meta?: string;
  prediction: TopicPrimerPrediction;
  observation: TopicPrimerObservation;
  model: TopicPrimerModel;
  workedExample: TopicPrimerWorkedExample;
  fadedExample: TopicPrimerFadedExample;
  independentProblem: TopicPrimerIndependentProblem;
  transfer: TopicPrimerTransfer;
}

export interface TopicPrimerProps {
  config: TopicPrimerConfig;
  className?: string;
}

interface AnswerState {
  value: string;
  checked: boolean;
  correct: boolean;
}

const EMPTY_ANSWER: AnswerState = {
  value: "",
  checked: false,
  correct: false,
};

function formulaText(formula: string) {
  const trimmed = formula.trim();
  return trimmed.startsWith("$") && trimmed.endsWith("$") ? trimmed : `$${trimmed}$`;
}

function normalizedText(value: string, caseSensitive = false) {
  const compact = value.trim().replace(/\s+/g, " ");
  return caseSensitive ? compact : compact.toLocaleLowerCase("ru");
}

function isAnswerCorrect(answer: TopicPrimerAnswer, value: string) {
  if (answer.kind === "choice") return value === answer.correctId;

  const validation = answer.validation;
  if (validation.kind === "number") {
    const parsed = Number(
      value
        .trim()
        .replace(/[−–—]/g, "-")
        .replace(/\s+/g, "")
        .replace(",", "."),
    );
    if (!Number.isFinite(parsed)) return false;
    const tolerance = validation.tolerance ?? 1e-9;
    return Math.abs(parsed - validation.expected) <= tolerance;
  }

  const normalizedValue = normalizedText(value, validation.caseSensitive);
  return validation.accepted.some(
    (candidate) => normalizedText(candidate, validation.caseSensitive) === normalizedValue,
  );
}

function StageMedia({ asset, visual }: { asset?: TopicPrimerAsset; visual?: ReactNode }) {
  if (!asset && !visual) return null;

  return (
    <div className={styles.mediaColumn}>
      {asset ? (
        <figure className={styles.assetFigure}>
          <div className={styles.assetFrame}>
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              priority={asset.priority}
              sizes={asset.sizes ?? "(max-width: 760px) 100vw, 46vw"}
              className={styles.assetImage}
              style={{ objectPosition: asset.objectPosition ?? "50% 50%" }}
            />
          </div>
          {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
        </figure>
      ) : null}
      {visual ? <div className={styles.observationNode}>{visual}</div> : null}
    </div>
  );
}

function ChoiceButton({
  choice,
  selected,
  onSelect,
}: {
  choice: TopicPrimerChoice;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`${styles.choice}${selected ? ` ${styles.choiceSelected}` : ""}`}
      onClick={onSelect}
    >
      <span className={styles.choiceMark} aria-hidden="true">{selected ? "•" : ""}</span>
      <span className={styles.choiceCopy}>
        <b>{choice.label}</b>
        {choice.detail ? <small>{choice.detail}</small> : null}
      </span>
    </button>
  );
}

function AnswerControl({
  answer,
  state,
  onChange,
  onCheck,
  idPrefix,
}: {
  answer: TopicPrimerAnswer;
  state: AnswerState;
  onChange: (value: string) => void;
  onCheck: () => void;
  idPrefix: string;
}) {
  const feedbackId = `${idPrefix}-feedback`;
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.answerBlock}>
      <div className={styles.answerPrompt}>{answer.prompt}</div>

      {answer.kind === "input" ? (
        <div className={styles.inputField}>
          <label htmlFor={`${idPrefix}-input`}>{answer.label}</label>
          <div className={styles.inputLine}>
            <input
              id={`${idPrefix}-input`}
              value={state.value}
              onChange={(event) => onChange(event.target.value)}
              inputMode={answer.inputMode ?? (answer.validation.kind === "number" ? "decimal" : "text")}
              autoComplete="off"
              aria-invalid={state.checked && !state.correct ? "true" : undefined}
              aria-describedby={state.checked ? feedbackId : undefined}
            />
            {answer.suffix ? <span>{answer.suffix}</span> : null}
          </div>
        </div>
      ) : (
        <fieldset className={styles.answerChoices}>
          <legend>{answer.legend}</legend>
          {answer.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              selected={state.value === choice.id}
              onSelect={() => onChange(choice.id)}
            />
          ))}
        </fieldset>
      )}

      <button
        type="button"
        className={styles.checkButton}
        onClick={onCheck}
        disabled={state.value.trim().length === 0}
      >
        {answer.checkLabel ?? "Проверить"}
      </button>

      <AnimatePresence initial={false} mode="wait">
        {state.checked ? (
          <motion.div
            key={state.correct ? "correct" : "incorrect"}
            id={feedbackId}
            className={`${styles.feedback} ${state.correct ? styles.feedbackGood : styles.feedbackTry}`}
            role={state.correct ? "status" : "alert"}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -3 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
          >
            <b>{state.correct ? "Верно" : "Пока не сходится"}</b>
            <div>{state.correct ? answer.correctFeedback : answer.incorrectFeedback}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function WorkedSteps({ steps }: { steps: readonly TopicPrimerWorkedStep[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <ol className={styles.workedSteps}>
      {steps.map((step, index) => (
        <motion.li
          key={`${step.label ?? index}-${index}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.24, delay: 0.06 * index, ease: "easeOut" }}
        >
          <span className={styles.stepNumber}>{step.label ?? "·"}</span>
          <div className={styles.stepCopy}>
            <b>{step.title}</b>
            {step.body ? <div className={styles.stepBody}>{step.body}</div> : null}
            {step.formula ? <MathText text={formulaText(step.formula)} className={styles.stepFormula} /> : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function TopicPrimer({ config, className }: TopicPrimerProps) {
  const [stage, setStage] = useState(0);
  const [predictionId, setPredictionId] = useState("");
  const [faded, setFaded] = useState<AnswerState>(EMPTY_ANSWER);
  const [independent, setIndependent] = useState<AnswerState>(EMPTY_ANSWER);
  const [transfer, setTransfer] = useState<AnswerState>(EMPTY_ANSWER);
  const [summaryText, setSummaryText] = useState("");
  const [summaryTried, setSummaryTried] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");

  const predictionChoice = config.prediction.choices.find((choice) => choice.id === predictionId);
  const transferComplete = config.transfer.answer ? transfer.correct : true;
  const summaryReady = summaryText.trim().length >= 12;
  const canContinue = stage === 1
    ? predictionId.length > 0
    : stage === 6
      ? faded.correct
      : stage === 7
        ? independent.correct
        : stage === 8
          ? transferComplete
        : true;

  function updateAnswer(setter: (state: AnswerState) => void, value: string) {
    setter({ value, checked: false, correct: false });
  }

  function checkAnswer(answer: TopicPrimerAnswer, state: AnswerState, setter: (state: AnswerState) => void) {
    setter({ ...state, checked: true, correct: isAnswerCorrect(answer, state.value) });
  }

  function stageHeading(eyebrow: string | undefined, title: ReactNode, body?: ReactNode) {
    return (
      <div className={styles.stageIntro}>
        <p className={styles.eyebrow}>
          {eyebrow ?? getLessonStageDefinition(TOPIC_PRIMER_STAGES[stage].id).label}
        </p>
        <h3 data-lesson-stage-heading tabIndex={-1}>{title}</h3>
        {body ? <div className={styles.lead}>{body}</div> : null}
      </div>
    );
  }

  function renderStage() {
    if (stage === 0) {
      const current = config.prediction;
      return (
        <div className={`${styles.stageGrid}${current.asset || current.visual ? "" : ` ${styles.stageGridSingle}`}`}>
          <div className={styles.copyColumn}>
            {stageHeading(current.eyebrow ?? "Ситуация", current.title, current.body)}
            <p className={styles.contextPrompt}>Посмотри на ситуацию и отметь, что здесь хочется понять.</p>
          </div>
          <StageMedia asset={current.asset} visual={current.visual} />
        </div>
      );
    }

    if (stage === 1) {
      const current = config.prediction;
      return (
        <div className={styles.stageGridSingle}>
          <div className={styles.copyColumn}>
            {stageHeading(current.eyebrow ?? "Твой прогноз", current.title, current.body)}
            <fieldset className={styles.choiceList}>
              <legend>{current.question}</legend>
              {current.choices.map((choice) => (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  selected={predictionId === choice.id}
                  onSelect={() => setPredictionId(choice.id)}
                />
              ))}
            </fieldset>
            {predictionId ? (
              <p className={styles.commitment} role="status">
                {current.committedText ?? "Ответ сохранён. Теперь сверим его с тем, что произойдёт."}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    if (stage === 2) {
      const current = config.observation;
      return (
        <div className={`${styles.stageGrid}${current.asset || current.visual ? "" : ` ${styles.stageGridSingle}`}`}>
          <div className={styles.copyColumn}>
            {stageHeading(current.eyebrow ?? "Наблюдение", current.title, current.body)}
            {current.insight || predictionChoice?.reflection ? (
              <div className={styles.observationReading}>
                <span>Что видно</span>
                {current.insight ? <div className={styles.insight}>{current.insight}</div> : null}
                {predictionChoice?.reflection ? (
                  <div className={styles.reflection}>
                    <b>Сравни со своим ответом</b>
                    <div>{predictionChoice.reflection}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <StageMedia asset={current.asset} visual={current.visual} />
        </div>
      );
    }

    if (stage === 3) {
      const current = config.model;
      return (
        <div className={styles.causalStage}>
          {stageHeading(current.eyebrow ?? "Почему так", current.title, current.body)}
          {current.principles?.length ? (
            <dl className={styles.principles}>
              {current.principles.map((principle, index) => (
                <div key={index}>
                  <dt>{principle.label}</dt>
                  <dd>{principle.explanation}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      );
    }

    if (stage === 4) {
      const current = config.model;
      return (
        <div className={styles.modelStage}>
          {stageHeading("Схема и формула", current.title, current.body)}
          <div className={styles.formulaBlock}>
            <MathText text={formulaText(current.formula)} />
            {current.formulaCaption ? <small>{current.formulaCaption}</small> : null}
          </div>
          {current.boundary ? (
            <div className={styles.boundary}>
              <b>Где это работает</b>
              <div>{current.boundary}</div>
            </div>
          ) : null}
        </div>
      );
    }

    if (stage === 5) {
      const current = config.workedExample;
      return (
        <div className={styles.exampleStage}>
          {stageHeading(current.eyebrow ?? "Разберём вместе", current.title, current.body)}
          <div className={styles.problemLine}>{current.problem}</div>
          <WorkedSteps steps={current.steps} />
          {current.conclusion ? <div className={styles.conclusion}>{current.conclusion}</div> : null}
        </div>
      );
    }

    if (stage === 6) {
      const current = config.fadedExample;
      return (
        <div className={styles.exampleStage}>
          {stageHeading(current.eyebrow ?? "Дополни решение", current.title, current.body)}
          <div className={styles.problemLine}>{current.problem}</div>
          <WorkedSteps steps={current.shownSteps} />
          <AnswerControl
            answer={current.answer}
            state={faded}
            onChange={(value) => updateAnswer(setFaded, value)}
            onCheck={() => checkAnswer(current.answer, faded, setFaded)}
            idPrefix={`${id}-faded`}
          />
        </div>
      );
    }

    if (stage === 7) {
      const current = config.independentProblem;
      return (
        <div className={styles.independentStage}>
          {stageHeading(current.eyebrow ?? "Реши сам", current.title, current.body)}
          <div className={styles.independentProblem}>{current.problem}</div>
          <AnswerControl
            answer={current.answer}
            state={independent}
            onChange={(value) => updateAnswer(setIndependent, value)}
            onCheck={() => checkAnswer(current.answer, independent, setIndependent)}
            idPrefix={`${id}-independent`}
          />
        </div>
      );
    }

    if (stage === 8) {
      const current = config.transfer;
      return (
        <div className={`${styles.transferStage}${current.asset || current.visual ? ` ${styles.transferStageWithMedia}` : ""}`}>
          <div className={styles.copyColumn}>
            {stageHeading(current.eyebrow ?? "Та же идея по-новому", current.title, current.body)}
            {current.problem ? <div className={styles.transferProblem}>{current.problem}</div> : null}
            {current.answer ? (
              <AnswerControl
                answer={current.answer}
                state={transfer}
                onChange={(value) => updateAnswer(setTransfer, value)}
                onCheck={() => checkAnswer(current.answer as TopicPrimerAnswer, transfer, setTransfer)}
                idPrefix={`${id}-transfer`}
              />
            ) : null}
            {transferComplete ? (
              <p className={styles.transferReady} role="status">
                {current.completionText ?? "Готово. Теперь коротко сформулируем, что осталось главным."}
              </p>
            ) : null}
          </div>
          <StageMedia asset={current.asset} visual={current.visual} />
        </div>
      );
    }

    const current = config.transfer;
    return (
      <div className={styles.summaryStage}>
        {stageHeading("Итог", "Что осталось главным?", "Запиши связь своими словами — так будет проще узнать её в следующей задаче.")}
        <label className={styles.selfPrompt} htmlFor={`${id}-summary`}>
          Объяснение для себя
        </label>
        <textarea
          id={`${id}-summary`}
          className={styles.summaryInput}
          value={summaryText}
          onChange={(event) => {
            setSummaryText(event.target.value);
            setSummaryTried(false);
            setSummarySaved(false);
          }}
          rows={5}
          placeholder="Например: если масса больше, то при той же силе ускорение меньше…"
          aria-describedby={`${id}-summary-hint`}
        />
        <p id={`${id}-summary-hint`} className={styles.summaryHint}>
          Достаточно одной-двух фраз. Пиши так, как объяснил бы другу.
        </p>
        <button
          type="button"
          className={styles.summaryButton}
          onClick={() => {
            if (!summaryReady) {
              setSummaryTried(true);
              setSummarySaved(false);
              return;
            }
            setSummarySaved(true);
          }}
        >
          Сохранить итог
        </button>
        {summaryTried && !summaryReady ? (
          <p className={styles.summaryError} role="alert">Добавь ещё немного слов — хотя бы одну законченную мысль.</p>
        ) : null}
        {summarySaved ? (
          <div className={styles.practiceFinish}>
            <p>{current.completionText ?? "Связь сформулирована. Можно потренироваться ещё."}</p>
            <Link className={styles.practiceLink} href={current.practiceHref}>{current.practiceLabel}</Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <LessonStageEngine
      className={className}
      ariaLabelledBy={`${id}-title`}
      identity={
        <div className={styles.identity}>
          <p>{config.topic}</p>
          <h2 id={`${id}-title`}>{config.title}</h2>
          {config.meta ? <span>{config.meta}</span> : null}
        </div>
      }
      progressAriaLabel="Прогресс разбора"
      stages={TOPIC_PRIMER_STAGES}
      activeIndex={stage}
      canContinue={canContinue}
      onActiveIndexChange={setStage}
      reduceMotion={Boolean(reduceMotion)}
      classes={primerEngineClasses}
    >
      {renderStage()}
    </LessonStageEngine>
  );
}
