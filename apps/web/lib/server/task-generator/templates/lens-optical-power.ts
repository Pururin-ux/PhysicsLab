import { decimalsOf } from "../../../answer/numeric-answer.ts";
import { lensOpticalPowerDistractors } from "../distractors.ts";
import { lensOpticalPower, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const contexts = [
  "собирающей линзы",
  "собирающей линзы очков",
  "собирающей линзы лупы",
];

function contextFor(p: Params): string {
  return contexts[variantIndex(p, contexts.length)];
}

export const lensOpticalPowerBlueprint: TaskBlueprint = {
  id: "lens-optical-power",
  skill: "Оптическая сила линзы",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: {
    // F=10 см отсеивается сам: там 100/F = F и правильный ответ совпадает
    // с дистрактором «взял само фокусное расстояние».
    Fcm: { min: 10, max: 100, step: 2.5, unit: "см" },
  },
  formula: "D=\\frac{1}{F}",
  answerUnit: "дптр",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: lensOpticalPower,
  distractors: lensOpticalPowerDistractors,
  textTemplate: (p) =>
    `Фокусное расстояние ${contextFor(p)} равно ${p.Fcm} см. Найдите оптическую силу этой линзы.`,
  explanationTemplate: (p, answer) =>
    `Оптическая сила — обратная величина фокусного расстояния, взятого в метрах: $D=\\frac{1}{F}=\\frac{1}{${formatMathValue(p.Fcm / 100)}\\ \\text{м}}=${formatMathValue(answer)}$ дптр.`,
  trap: "Перед делением переведи фокусное расстояние в метры: D = 1/F только при F в метрах.",
  coachLines: {
    correct: () => "Верно. Диоптрия — это 1/м, поэтому фокусное расстояние сначала переводим в метры.",
    wrong: (p, selected, correct) =>
      `Сначала переведи ${p.Fcm} см в метры, потом бери обратную величину: D = ${formatAnswerValue(correct)} дптр, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [
    // Ответ не длиннее одного знака после запятой.
    (p) => decimalsOf(100 / p.Fcm) <= 1,
  ],
  variantCount: contexts.length,
};
