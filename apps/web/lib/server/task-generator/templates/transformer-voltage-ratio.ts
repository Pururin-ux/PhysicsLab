import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { primaryTurns: 200, secondaryTurns: 50, inputVolts: 12 },
  { primaryTurns: 100, secondaryTurns: 200, inputVolts: 6 },
  { primaryTurns: 240, secondaryTurns: 120, inputVolts: 18 },
  { primaryTurns: 80, secondaryTurns: 320, inputVolts: 4 },
  { primaryTurns: 300, secondaryTurns: 150, inputVolts: 20 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function outputVolts(params: Params) {
  const { primaryTurns, secondaryTurns, inputVolts } = values(params);
  return inputVolts * secondaryTurns / primaryTurns;
}

const distractors: DistractorRule[] = [
  { label: "переворачиваешь отношение числа витков", compute: (params) => {
    const { primaryTurns, secondaryTurns, inputVolts } = values(params);
    return inputVolts * primaryTurns / secondaryTurns;
  } },
  { label: "считаешь, что напряжение не меняется", compute: (params) => values(params).inputVolts },
  { label: "возводишь отношение витков в квадрат", compute: (params) => {
    const { primaryTurns, secondaryTurns, inputVolts } = values(params);
    return inputVolts * (secondaryTurns / primaryTurns) ** 2;
  } },
];

export const transformerVoltageRatioBlueprint: TaskBlueprint = {
  id: "transformer-voltage-ratio",
  skill: "Напряжение идеального трансформатора",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "U_2=U_1\\frac{N_2}{N_1}",
  answerUnit: "В",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: outputVolts,
  distractors,
  textTemplate: (params) => {
    const { primaryTurns, secondaryTurns, inputVolts } = values(params);
    return "Первичная обмотка учебного трансформатора содержит " + primaryTurns +
      " витков, вторичная — " + secondaryTurns + ". На первичную подают " +
      formatAnswerValue(inputVolts) + " В переменного напряжения. В идеальной модели без потерь найди напряжение вторичной обмотки в вольтах.";
  },
  explanationTemplate: (params, answer) => {
    const { primaryTurns, secondaryTurns, inputVolts } = values(params);
    return "Для идеального трансформатора отношение действующих напряжений равно отношению витков: " +
      "$U_2=U_1\\frac{N_2}{N_1}=" + formatMathValue(inputVolts) + "\\cdot\\frac{" +
      secondaryTurns + "}{" + primaryTurns + "}=" + formatMathValue(answer) +
      "\\,\\text{В}$. Частота остаётся прежней; из одного напряжения нельзя вывести мощность без нагрузки.";
  },
  trap: "Проверь, какая обмотка первичная: N₂/N₁, а не N₁/N₂. Повышение напряжения не означает создание энергии.",
  coachLines: {
    correct: () => "Верно. Отношение напряжений следует за отношением числа витков в идеальном трансформаторе.",
    wrong: (params, selected, correct) => {
      const { primaryTurns, secondaryTurns } = values(params);
      return "Сравни обмотки: N₂/N₁ = " + secondaryTurns + "/" + primaryTurns +
        ". По формуле U₂ = U₁·N₂/N₁ получится " + formatAnswerValue(correct) +
        " В; твой ответ — " + formatAnswerValue(selected) + " В.";
    },
  },
  variantCount: cases.length,
};
