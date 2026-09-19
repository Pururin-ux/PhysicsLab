import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function rotationFrequency(p: Params): number {
  return p.N / p.t;
}

const distractors: DistractorRule[] = [
  { label: "нашёл период вместо частоты", compute: (p) => p.t / p.N },
  { label: "умножил число оборотов на время", compute: (p) => p.N * p.t },
  { label: "разделил время на число оборотов без смысла единицы", compute: (p) => p.t / Math.max(1, p.N / 2) },
];

export const rotationFrequencyBlueprint: TaskBlueprint = {
  id: "rotation-frequency",
  skill: "Частота равномерного вращения",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    N: { min: 12, max: 120, step: 6, unit: "оборотов" },
    t: { min: 2, max: 20, step: 2, unit: "с" },
  },
  formula: "\\nu=\\frac{N}{\\Delta t}",
  answerUnit: "с⁻¹",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: rotationFrequency,
  distractors,
  textTemplate: (p) =>
    `Вал равномерно совершил ${p.N} оборотов за ${p.t} с. Найдите частоту его вращения.`,
  explanationTemplate: (p, answer) =>
    `Частота показывает число полных оборотов за единицу времени: $\\nu=\\frac{N}{\\Delta t}=\\frac{${p.N}}{${p.t}}=${formatMathValue(answer)}$ с$^{-1}$.`,
  trap: "Путает частоту со временем одного оборота или умножает обороты на время.",
  coachLines: {
    correct: () => "Да. Частота — это число полных оборотов за одну секунду.",
    wrong: (p, selected, correct) =>
      `Раздели число оборотов на всё время наблюдения. Получается ${formatAnswerValue(correct)} с⁻¹, а не ${formatAnswerValue(selected)} с⁻¹.`,
  },
};
