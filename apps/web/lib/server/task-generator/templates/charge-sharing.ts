import { chargeSharingDistractors } from "../distractors.ts";
import { chargeAfterContact } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const sphereContexts = [
  "На демонстрационном стенде находятся два одинаковых металлических шарика на изолирующих подставках",
  "В опыте по электростатике используют два одинаковых проводящих шарика",
  "На непроводящих стержнях закреплены два одинаковых по размеру металлических шарика",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return sphereContexts[variant % sphereContexts.length];
}

export const chargeSharingBlueprint: TaskBlueprint = {
  id: "charge-sharing",
  skill: "Деление заряда при контакте",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    q1: { min: -8, max: 8, step: 2, unit: "нКл" },
    q2: { min: -8, max: 8, step: 2, unit: "нКл" },
  },
  formula: "q' = \\frac{q_1 + q_2}{2}",
  answerUnit: "нКл",
  answerKind: "signed",
  solver: chargeAfterContact,
  distractors: chargeSharingDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Их заряды равны ${p.q1} нКл и ${p.q2} нКл. Шарики привели в соприкосновение и снова развели на исходное расстояние. Найдите заряд каждого шарика после этого.`,
  explanationTemplate: (p, answer) =>
    `После контакта одинаковых шариков заряд делится поровну: $q' = \\frac{q_1+q_2}{2} = \\frac{${p.q1} + (${p.q2})}{2} = ${formatMathValue(answer)}$ нКл.`,
  trap: "После контакта одинаковых шариков заряд не суммируется, а делится поровну — важен именно знак каждого заряда.",
  coachLines: {
    correct: () =>
      "Да. У одинаковых проводников заряд после контакта усредняется: $q' = \\frac{q_1+q_2}{2}$.",
    wrong: (_p, selected, correct) =>
      `Одинаковые шарики после контакта получают одинаковый заряд $\\frac{q_1+q_2}{2}$. Получается ${formatAnswerValue(correct)} нКл, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [(p) => p.q1 !== 0 && p.q2 !== 0 && p.q1 + p.q2 !== 0],
  variantCount: sphereContexts.length,
};
