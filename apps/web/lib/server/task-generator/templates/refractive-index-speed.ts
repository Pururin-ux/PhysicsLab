import { decimalsOf } from "../../../answer/numeric-answer.ts";
import { refractiveIndexSpeedDistractors } from "../distractors.ts";
import { refractiveIndexFromSpeed, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Среды называем нейтрально: конкретные вещества имеют табличные показатели
// преломления, и подпись «вода» при вычисленном n=2 была бы физически ложной.
const media = ["прозрачном веществе", "прозрачной среде", "прозрачном материале"];

function mediumFor(p: Params): string {
  return media[variantIndex(p, media.length)];
}

function speedText(p: Params): string {
  return formatAnswerValue(p.v8);
}

export const refractiveIndexSpeedBlueprint: TaskBlueprint = {
  id: "refractive-index-speed",
  skill: "Показатель преломления",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: {
    // Скорость в единицах 10^8 м/с: константы 10^8 сокращаются, ученик
    // не вводит научную нотацию.
    v8: { min: 1.2, max: 2.5, step: 0.1, unit: "10⁸ м/с" },
  },
  formula: "n=\\frac{c}{v}",
  // Показатель преломления безразмерный: пустая единица — осознанный контракт,
  // NumericAnswerInput не показывает суффикс и не анонсирует пустую единицу.
  answerUnit: "",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: refractiveIndexFromSpeed,
  distractors: refractiveIndexSpeedDistractors,
  textTemplate: (p) =>
    `Скорость света в вакууме равна 3·10⁸ м/с, а в ${mediumFor(p)} свет распространяется со скоростью ${speedText(p)}·10⁸ м/с. Найдите абсолютный показатель преломления этого вещества.`,
  explanationTemplate: (p, answer) =>
    `Показатель преломления — отношение скорости света в вакууме к скорости в среде: $n=\\frac{c}{v}=\\frac{3\\cdot10^8}{${formatMathValue(p.v8)}\\cdot10^8}=${formatMathValue(answer)}$. Степени $10^8$ сокращаются.`,
  trap: "Показатель преломления — это c/v, а не v/c: у вещества он всегда не меньше единицы.",
  coachLines: {
    correct: () => "Верно. Свет в веществе медленнее, поэтому n = c/v всегда больше единицы.",
    wrong: (_p, selected, correct) =>
      `Проверь порядок деления: n = c/v = ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}. Показатель преломления вещества не бывает меньше 1.`,
  },
  constraints: [
    // Ответ должен быть «чистым» (не более двух знаков) и физичным (n > 1).
    (p) => decimalsOf(3 / p.v8) <= 2,
    (p) => 3 / p.v8 > 1,
  ],
  variantCount: media.length,
};
