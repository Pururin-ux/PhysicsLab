import type { AnswerFormat } from "../../answer/numeric-answer.ts";
import type { CircuitDiagramSpec } from "../../physics/circuit-diagram-spec.ts";
import type { OpticsDiagramSpec } from "../../physics/optics-diagram-spec.ts";
import type { VectorDiagramSpec } from "../../physics/vector-diagram-spec.ts";

export type Difficulty = 1 | 2 | 3;
// Числовая семантика ответа — отдельная ось от формата ввода (answerFormat).
export type AnswerKind = "positive" | "magnitude" | "signed";
export type TemplateGroup =
  | "kinematics"
  | "dynamics"
  | "electrodynamics"
  | "thermodynamics"
  | "optics";

export type Params = Record<string, number>;

export const GENERATED_TASK_VARIANT = Symbol("generatedTaskVariant");

export interface ParamRange {
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface DistractorRule {
  label: string;
  compute: (p: Params) => number;
}

// Векторная диаграмма или схема цепи при задаче — рендерятся компонентами
// VectorDiagram/CircuitDiagram на карточке вопроса.
export type TaskDiagram =
  | { kind: "vector"; spec: VectorDiagramSpec }
  | { kind: "circuit"; spec: CircuitDiagramSpec }
  | { kind: "optics"; spec: OpticsDiagramSpec };

export interface GraphSpec {
  type: "vt" | "xt" | "at";
  series: { t: number; v?: number; x?: number }[];
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
}

export interface TaskBlueprint {
  id: string;
  skill: string;
  topic: string;
  group: TemplateGroup;
  difficulty: Difficulty;
  params: Record<string, ParamRange>;
  graph?: GraphSpec | ((p: Params) => GraphSpec);
  diagram?: TaskDiagram | ((p: Params) => TaskDiagram);
  formula: string;
  answerUnit: string | ((p: Params) => string);
  answerKind?: AnswerKind;
  // Формат ввода ответа. Отсутствует => "single_choice" (обратная совместимость
  // со всеми существующими шаблонами). Числовая семантика — в answerKind.
  answerFormat?: AnswerFormat;
  solver: (p: Params) => number;
  distractors: DistractorRule[];
  textTemplate: (p: Params, answer: number) => string;
  explanationTemplate?: (p: Params, answer: number) => string;
  trap: string;
  coachLines: {
    correct: (p: Params) => string;
    wrong: (p: Params, selected: number, correct: number) => string;
  };
  constraints?: ((p: Params) => boolean)[];
  variantCount?: number;
}

export interface GeneratedOption {
  id: "a" | "b" | "c" | "d";
  text: string;
  value: number;
  misconception?: string;
}

export interface GeneratedTask {
  [GENERATED_TASK_VARIANT]?: number;
  id: string;
  blueprint: string;
  skill: string;
  topic: string;
  difficulty: Difficulty;
  params: Params;
  text: string;
  formula: string;
  answerUnit: string;
  answerFormat: AnswerFormat;
  explanation?: string;
  graph?: GraphSpec;
  diagram?: TaskDiagram;
  // options/answer сохраняются для всех форматов: это методический QA
  // (валидатор проверяет 4 уникальных варианта) и источник значений
  // misconception для numeric-задач. API решает, показывать ли их клиенту.
  options: GeneratedOption[];
  answer: GeneratedOption["id"];
  answerValue: number;
  trap: string;
  coach_lines: {
    correct: string;
    wrong: string;
  };
}

export interface ValidationIssue {
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
