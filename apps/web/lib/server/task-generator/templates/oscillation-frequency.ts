import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { cycles: 24, seconds: 6 },
  { cycles: 30, seconds: 10 },
  { cycles: 36, seconds: 12 },
  { cycles: 50, seconds: 10 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function frequency(params: Params) {
  const value = values(params);
  return value.cycles / value.seconds;
}

const distractors: DistractorRule[] = [
  { label: "делишь время на число колебаний", compute: p => 1 / frequency(p) },
  { label: "принимаешь время наблюдения за период", compute: p => values(p).seconds },
  { label: "считаешь число циклов за всё время частотой", compute: p => values(p).cycles },
];

export const oscillationFrequencyBlueprint: TaskBlueprint = {
  id: "oscillation-frequency",
  skill: "Частота механических колебаний",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "\\nu=\\frac{N}{\\Delta t}=\\frac{1}{T}",
  answerUnit: "Гц",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: frequency,
  distractors,
  textTemplate: params => {
    const value = values(params);
    return `Маятник совершил ${value.cycles} полных колебаний за ${value.seconds} с. Найдите частоту колебаний в герцах.`;
  },
  explanationTemplate: (params, answer) => {
    const value = values(params);
    return `Частота — число полных колебаний за единицу времени: $\\nu=\\frac{N}{\\Delta t}=\\frac{${value.cycles}}{${value.seconds}}=${formatMathValue(answer)}$ Гц. Период одного колебания можно проверить отдельно: $T=\\frac{1}{\\nu}=${formatMathValue(1 / answer)}$ с.`;
  },
  trap: "Сначала отдели время одного цикла T от числа циклов за секунду ν. Если T увеличивается, ν уменьшается.",
  coachLines: {
    correct: () => "Верно. Частота показывает число полных колебаний за секунду.",
    wrong: (params, selected, correct) => {
      const value = values(params);
      return `Раздели число полных циклов на время наблюдения: ${value.cycles} ÷ ${value.seconds} = ${formatAnswerValue(correct)} Гц. Твой ответ — ${formatAnswerValue(selected)} Гц.`;
    },
  },
  variantCount: cases.length,
};
