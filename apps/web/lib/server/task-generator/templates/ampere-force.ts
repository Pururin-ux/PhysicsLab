import { ampereForceDistractors } from "../distractors.ts";
import { ampereForce } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Проводник перпендикулярен линиям индукции, поэтому sin α = 1 и F = BIL.
function explanationFor(p: Params, answer: number): string {
  return (
    `Проводник перпендикулярен полю, поэтому $F_A = BIL = ` +
    `${formatMathValue(p.B)} \\cdot ${p.I} \\cdot ${formatMathValue(p.L)} = ` +
    `${formatMathValue(answer)}$ Н. Длина — в метрах, сила тока — в амперах.`
  );
}

export const ampereForceBlueprint: TaskBlueprint = {
  id: "ampere-force",
  skill: "Сила Ампера",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    B: { min: 0.2, max: 2, step: 0.1, unit: "Тл" },
    I: { min: 1, max: 10, step: 1, unit: "А" },
    L: { min: 0.2, max: 1, step: 0.2, unit: "м" },
  },
  formula: "F_A=BIL\\sin\\alpha",
  answerUnit: "Н",
  answerKind: "positive",
  solver: ampereForce,
  distractors: ampereForceDistractors,
  textTemplate: (p) =>
    `Прямой проводник длиной ${formatAnswerValue(p.L)} м с током ${p.I} А поместили в однородное ` +
    `магнитное поле индукцией ${formatAnswerValue(p.B)} Тл перпендикулярно линиям индукции. ` +
    `Найдите модуль силы, действующей на проводник.`,
  explanationTemplate: explanationFor,
  trap: "Теряет один из трёх множителей: индукцию, силу тока или длину проводника.",
  coachLines: {
    correct: () =>
      "Да. Три множителя: индукция поля, сила тока и длина части проводника, которая находится в поле.",
    wrong: (p, selected, correct) =>
      `Выпиши все три величины: B = ${formatAnswerValue(p.B)} Тл, I = ${p.I} А, ` +
      `L = ${formatAnswerValue(p.L)} м. $F = ${formatAnswerValue(correct)}$ Н, а не ${formatAnswerValue(selected)}$ Н.`,
  },
  difficultyFor: (_p, answer) => (Number.isInteger(answer) ? 1 : 2),
};
