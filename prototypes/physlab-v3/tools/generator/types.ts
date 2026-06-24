export type Difficulty = 1 | 2 | 3;

export type Params = Record<string, number>;

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
  difficulty: Difficulty;
  params: Record<string, ParamRange>;
  graph?: GraphSpec | ((p: Params) => GraphSpec);
  formula: string;
  solver: (p: Params) => number;
  distractors: DistractorRule[];
  textTemplate: (p: Params, answer: number) => string;
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
}

export interface GeneratedTask {
  id: string;
  blueprint: string;
  skill: string;
  topic: string;
  difficulty: Difficulty;
  params: Params;
  text: string;
  formula: string;
  graph?: GraphSpec;
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
