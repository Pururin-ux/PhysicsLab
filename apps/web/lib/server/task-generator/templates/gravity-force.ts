import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const G = 9.8;

function gravityForce(p: Params) {
  return G * p.m;
}

export const gravityForceBlueprint: TaskBlueprint = {
  id: "gravity-force",
  skill: "Сила тяжести и масса",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    m: { min: 0.5, max: 25, step: 0.5, unit: "кг" },
  },
  formula: "F_{\\text{т}}=gm",
  answerUnit: "Н",
  answerKind: "positive",
  solver: gravityForce,
  distractors: [
    { label: "записал массу как силу", compute: (p) => p.m },
    { label: "разделил массу на g", compute: (p) => p.m / G },
    { label: "использовал граммы вместо килограммов", compute: (p) => G * p.m * 1000 },
  ],
  textTemplate: (p) =>
    `Тело массой ${formatAnswerValue(p.m)} кг находится у поверхности Земли. Примите g = 9,8 Н/кг. Найдите модуль действующей на тело силы тяжести.`,
  explanationTemplate: (p, answer) =>
    `Сила тяжести приложена к телу: $F_{\\text{т}}=gm=9{,}8\\cdot${formatMathValue(p.m)}=${formatMathValue(answer)}$ Н. Килограммы сократились с кг в знаменателе Н/кг.`,
  trap: "Путает массу в килограммах с силой в ньютонах или делит на g вместо умножения.",
  coachLines: {
    correct: (p) =>
      `Да. Земля действует на тело с силой 9,8 · ${formatAnswerValue(p.m)} Н.`,
    wrong: (p, selected, correct) =>
      `Сила тяжести равна gm: 9,8 · ${formatAnswerValue(p.m)} = ${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`,
  },
};
