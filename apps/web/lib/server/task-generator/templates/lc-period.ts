import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const piApprox = 3.14;
const cases = [
  { inductanceH: 0.25, capacitanceMicroF: 4 },
  { inductanceH: 1, capacitanceMicroF: 4 },
  { inductanceH: 1, capacitanceMicroF: 9 },
  { inductanceH: 4, capacitanceMicroF: 4 },
  { inductanceH: 1, capacitanceMicroF: 25 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function periodMs(params: Params) {
  const { inductanceH, capacitanceMicroF } = values(params);
  const capacitanceF = capacitanceMicroF * 1e-6;
  return Math.round(2 * piApprox * Math.sqrt(inductanceH * capacitanceF) * 1e3 * 100) / 100;
}

const distractors: DistractorRule[] = [
  {
    label: "не переводишь микрофарады в фарады",
    compute: (params) => {
      const { inductanceH, capacitanceMicroF } = values(params);
      return 2 * piApprox * Math.sqrt(inductanceH * capacitanceMicroF) * 1e3;
    },
  },
  {
    label: "забываешь множитель 2π в формуле Томсона",
    compute: (params) => {
      const { inductanceH, capacitanceMicroF } = values(params);
      return Math.sqrt(inductanceH * capacitanceMicroF);
    },
  },
  {
    label: "находишь только половину периода",
    compute: (params) => periodMs(params) / 2,
  },
];

export const lcPeriodBlueprint: TaskBlueprint = {
  id: "lc-period",
  skill: "Период свободных колебаний в LC-контуре",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "T=2\\pi\\sqrt{LC}",
  answerUnit: "мс",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: periodMs,
  distractors,
  textTemplate: (params) => {
    const { inductanceH, capacitanceMicroF } = values(params);
    return `В идеальном колебательном контуре индуктивность катушки L = ${formatAnswerValue(inductanceH)} Гн, электроёмкость конденсатора C = ${formatAnswerValue(capacitanceMicroF)} мкФ. Сопротивлением пренебречь. Прими π ≈ 3,14. Найди период свободных электромагнитных колебаний в миллисекундах.`;
  },
  explanationTemplate: (params, answer) => {
    const { inductanceH, capacitanceMicroF } = values(params);
    return `Переведи ёмкость в фарады: $C=${formatMathValue(capacitanceMicroF)}\\,\\text{мкФ}=${formatMathValue(capacitanceMicroF)}\\cdot10^{-6}\\,\\text{Ф}$. По формуле Томсона $T=2\\pi\\sqrt{LC}\\approx2\\cdot3{,}14\\sqrt{${formatMathValue(inductanceH)}\\cdot${formatMathValue(capacitanceMicroF)}\\cdot10^{-6}}\\,\\text{с}=${formatMathValue(answer)}\\,\\text{мс}$.`;
  },
  trap: "Сначала переведи ёмкость из мкФ в Ф; период по формуле Томсона получится в секундах, а для миллисекунд его нужно умножить на 1000.",
  coachLines: {
    correct: () => "Верно. В идеальном контуре период определяется индуктивностью и ёмкостью: T = 2π√(LC).",
    wrong: (params, selected, correct) => {
      const { inductanceH, capacitanceMicroF } = values(params);
      return `Проверь единицы: L = ${formatAnswerValue(inductanceH)} Гн, C = ${formatAnswerValue(capacitanceMicroF)} мкФ = ${formatAnswerValue(capacitanceMicroF)}·10⁻⁶ Ф. При π ≈ 3,14 формула T = 2π√(LC) даёт ${formatAnswerValue(correct)} мс; твой ответ — ${formatAnswerValue(selected)} мс.`;
    },
  },
  variantCount: cases.length,
};
