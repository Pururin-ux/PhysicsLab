import { fuelCombustionHeat } from "../solver.ts";
import type { DistractorRule, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const distractors: DistractorRule[] = [
  { label: "взял q как готовый ответ и не учёл массу", compute: (p) => p.q },
  { label: "разделил q на массу вместо умножения", compute: (p) => p.q / p.m },
  { label: "лишний раз перевёл мегаджоули в килоджоули", compute: (p) => p.q * p.m / 1000 },
];

export const fuelCombustionHeatBlueprint: TaskBlueprint = {
  id: "fuel-combustion-heat",
  skill: "Теплота полного сгорания топлива",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    q: { min: 10, max: 50, step: 5, unit: "МДж/кг" },
    m: { min: 2, max: 10, step: 1, unit: "кг" },
  },
  formula: "Q = qm",
  answerUnit: "МДж",
  answerKind: "positive",
  solver: fuelCombustionHeat,
  distractors,
  textTemplate: (p) => `Удельная теплота сгорания топлива равна ${formatAnswerValue(p.q)} МДж/кг. Какое количество теплоты выделится при полном сгорании ${formatAnswerValue(p.m)} кг этого топлива?`,
  explanationTemplate: (p, answer) => `При полном сгорании $Q=qm=${formatMathValue(p.q)}\cdot${formatMathValue(p.m)}=${formatMathValue(answer)}$ МДж. Значение $q$ уже показывает энергию одного килограмма топлива.`,
  trap: "Удельная теплота сгорания относится к одному килограмму: для массы m её нужно умножить на m.",
  coachLines: {
    correct: () => "Да. При полном сгорании количество теплоты прямо пропорционально массе: $Q=qm$.",
    wrong: (_p, selected, correct) => `Умножь удельную теплоту сгорания на массу. Получается ${formatAnswerValue(correct)} МДж, а не ${formatAnswerValue(selected)} МДж.`,
  },
};
