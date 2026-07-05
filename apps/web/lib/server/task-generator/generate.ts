import { pathToFileURL } from "node:url";
import { chargeSharingBlueprint } from "./templates/charge-sharing.ts";
import { densityVolumeRatioBlueprint } from "./templates/density-volume-ratio.ts";
import { frictionForceBlueprint } from "./templates/friction-force.ts";
import { freeFallBlueprint } from "./templates/free-fall.ts";
import { heatAmountBlueprint } from "./templates/heat-amount.ts";
import { idealGasStateBlueprint } from "./templates/ideal-gas-state.ts";
import { impulseMomentumBlueprint } from "./templates/impulse-momentum.ts";
import { inclineForceBlueprint } from "./templates/incline-force.ts";
import { newtonSecondBlueprint } from "./templates/newton-second.ts";
import { ohmLawBlueprint } from "./templates/ohm-law.ts";
import { relativeVelocityVectorsBlueprint } from "./templates/relative-velocity-vectors.ts";
import { resultantForceBlueprint } from "./templates/resultant-force.ts";
import { sourceInternalResistanceBlueprint } from "./templates/source-internal-resistance.ts";
import { vtAreaBlueprint } from "./templates/vt-area.ts";
import { vtSlopeBlueprint } from "./templates/vt-slope.ts";
import { weightLiftBlueprint } from "./templates/weight-lift.ts";
import type {
  GeneratedOption,
  GeneratedTask,
  GraphSpec,
  TaskDiagram,
  Params,
  ParamRange,
  TaskBlueprint,
  TemplateGroup,
} from "./types.ts";
import { GENERATED_TASK_VARIANT } from "./types.ts";
import {
  formatAnswerValue,
  isAnswerValueAllowed,
  normalizeAnswerValue,
} from "./validator.ts";

const optionIds: GeneratedOption["id"][] = ["a", "b", "c", "d"];
const candidateCache = new Map<string, Params[]>();

export const blueprints = {
  "free-fall": freeFallBlueprint,
  "vt-slope": vtSlopeBlueprint,
  "vt-area": vtAreaBlueprint,
  "relative-velocity-vectors": relativeVelocityVectorsBlueprint,
  "newton-second": newtonSecondBlueprint,
  "friction-force": frictionForceBlueprint,
  "incline-force": inclineForceBlueprint,
  "resultant-force": resultantForceBlueprint,
  "weight-lift": weightLiftBlueprint,
  "ohm-law": ohmLawBlueprint,
  "source-internal-resistance": sourceInternalResistanceBlueprint,
  "density-volume-ratio": densityVolumeRatioBlueprint,
  "impulse-momentum": impulseMomentumBlueprint,
  "charge-sharing": chargeSharingBlueprint,
  "ideal-gas-state": idealGasStateBlueprint,
  "heat-amount": heatAmountBlueprint,
};

export type TemplateId = keyof typeof blueprints;

export type TemplateRegistryEntry = {
  id: TemplateId;
  topic: string;
  skill: string;
  group: TemplateGroup;
};

export const templateRegistry: readonly TemplateRegistryEntry[] = (
  Object.keys(blueprints) as TemplateId[]
).map((id) => {
  const blueprint = blueprints[id];

  return {
    id,
    topic: blueprint.topic,
    skill: blueprint.skill,
    group: blueprint.group,
  };
});

export function isTemplateId(templateId: string): templateId is TemplateId {
  return templateId in blueprints;
}

export function getTemplateIdsByGroup(group: TemplateGroup): TemplateId[] {
  return templateRegistry
    .filter((entry) => entry.group === group)
    .map((entry) => entry.id);
}

function valuesFromRange(range: ParamRange): number[] {
  const values: number[] = [];
  const steps = Math.floor((range.max - range.min) / range.step);

  for (let index = 0; index <= steps; index += 1) {
    values.push(normalizeAnswerValue(range.min + index * range.step));
  }

  return values;
}

function enumerateParams(blueprint: TaskBlueprint): Params[] {
  const entries = Object.entries(blueprint.params);
  const variants = blueprint.variantCount ?? 1;
  let combinations: Params[] = [{}];

  for (const [key, range] of entries) {
    const values = valuesFromRange(range);
    const next: Params[] = [];

    for (const combination of combinations) {
      for (const value of values) {
        next.push({ ...combination, [key]: value });
      }
    }

    combinations = next;
  }

  if (variants > 1) {
    combinations = combinations.flatMap((combination) =>
      Array.from({ length: variants }, (_, variant) => ({
        ...combination,
        __variant: variant,
      })),
    );
  }

  return combinations.filter((params) =>
    blueprint.constraints ? blueprint.constraints.every((constraint) => constraint(params)) : true,
  );
}

function publicParams(params: Params): Params {
  return Object.fromEntries(Object.entries(params).filter(([key]) => !key.startsWith("__")));
}

function graphFor(blueprint: TaskBlueprint, params: Params): GraphSpec | undefined {
  if (!blueprint.graph) {
    return undefined;
  }

  return typeof blueprint.graph === "function" ? blueprint.graph(params) : blueprint.graph;
}

function diagramFor(blueprint: TaskBlueprint, params: Params): TaskDiagram | undefined {
  if (!blueprint.diagram) {
    return undefined;
  }

  return typeof blueprint.diagram === "function" ? blueprint.diagram(params) : blueprint.diagram;
}

function answerUnitFor(blueprint: TaskBlueprint, params: Params): string {
  return typeof blueprint.answerUnit === "function"
    ? blueprint.answerUnit(params)
    : blueprint.answerUnit;
}

function explanationFor(blueprint: TaskBlueprint, params: Params, answer: number): string {
  const generatedExplanation = blueprint.explanationTemplate?.(params, answer).trim();

  if (generatedExplanation) {
    return generatedExplanation;
  }

  const trapExplanation = blueprint.trap.trim();

  return trapExplanation || `Используйте формулу: ${blueprint.formula}`;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  let state = seed >>> 0;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function createOptions(blueprint: TaskBlueprint, params: Params, index: number): GeneratedOption[] {
  const answer = normalizeAnswerValue(blueprint.solver(params));
  const options: { value: number; misconception?: string }[] = [
    { value: answer },
    ...blueprint.distractors.map((rule) => ({
      value: normalizeAnswerValue(rule.compute(params)),
      misconception: rule.label,
    })),
  ];

  return seededShuffle(options, index + 1).map((option, optionIndex) => ({
    id: optionIds[optionIndex],
    text: formatAnswerValue(option.value),
    value: option.value,
    misconception: option.misconception,
  }));
}

function isValidCandidate(blueprint: TaskBlueprint, params: Params): boolean {
  const answer = normalizeAnswerValue(blueprint.solver(params));
  const values = [
    answer,
    ...blueprint.distractors.map((rule) => normalizeAnswerValue(rule.compute(params))),
  ];

  return (
    isAnswerValueAllowed(blueprint.answerKind, answer) &&
    values.every((value) => Number.isFinite(value)) &&
    new Set(values).size === values.length
  );
}

function createTask(blueprint: TaskBlueprint, params: Params, index: number): GeneratedTask {
  const answerValue = normalizeAnswerValue(blueprint.solver(params));
  const options = createOptions(blueprint, params, index);
  const answerOption = options.find((option) => option.value === answerValue);
  const wrongOption = options.find((option) => option.value !== answerValue) ?? options[0];

  if (!answerOption) {
    throw new Error(`Internal generator error: missing answer option for ${blueprint.id}.`);
  }

  return {
    [GENERATED_TASK_VARIANT]: params.__variant,
    id: `${blueprint.id}-${String(index + 1).padStart(4, "0")}`,
    blueprint: blueprint.id,
    skill: blueprint.skill,
    topic: blueprint.topic,
    difficulty: blueprint.difficulty,
    params: publicParams(params),
    text: blueprint.textTemplate(params, answerValue),
    formula: blueprint.formula,
    answerUnit: answerUnitFor(blueprint, params),
    explanation: explanationFor(blueprint, params, answerValue),
    graph: graphFor(blueprint, params),
    diagram: diagramFor(blueprint, params),
    options,
    answer: answerOption.id,
    answerValue,
    trap: blueprint.trap,
    coach_lines: {
      correct: blueprint.coachLines.correct(params),
      wrong: blueprint.coachLines.wrong(params, wrongOption.value, answerValue),
    },
  };
}

export function getBlueprint(templateId: string): TaskBlueprint {
  if (!isTemplateId(templateId)) {
    throw new Error(
      `Unknown template "${templateId}". Available templates: ${Object.keys(blueprints).join(", ")}.`,
    );
  }

  return blueprints[templateId];
}

export interface GenerateTasksOptions {
  offset?: number;
}

export function generateTasks(
  templateId: string,
  count: number,
  { offset = 0 }: GenerateTasksOptions = {},
): GeneratedTask[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Count must be a positive integer, received ${count}.`);
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error(`Offset must be a non-negative integer, received ${offset}.`);
  }

  const blueprint = getBlueprint(templateId);
  const validCandidates =
    candidateCache.get(blueprint.id) ??
    enumerateParams(blueprint).filter((params) => isValidCandidate(blueprint, params));
  candidateCache.set(blueprint.id, validCandidates);

  if (validCandidates.length === 0) {
    throw new Error(`Template "${templateId}" produced no valid parameter sets.`);
  }

  return Array.from({ length: count }, (_, index) => {
    const absoluteIndex = offset + index;
    const params = validCandidates[absoluteIndex % validCandidates.length];
    return createTask(blueprint, params, absoluteIndex);
  });
}

function readCliArg(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) {
    return fallback;
  }

  return process.argv[index + 1] ?? fallback;
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  return Boolean(entry && import.meta.url === pathToFileURL(entry).href);
}

if (isDirectRun()) {
  const template = readCliArg("template", "free-fall");
  const count = Number(readCliArg("count", "10"));
  const tasks = generateTasks(template ?? "free-fall", count);
  console.log(JSON.stringify(tasks, null, 2));
}
