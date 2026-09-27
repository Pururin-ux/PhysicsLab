import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { firstPeakMs: 2, secondPeakMs: 7 },
  { firstPeakMs: 3, secondPeakMs: 11 },
  { firstPeakMs: 4, secondPeakMs: 14 },
  { firstPeakMs: 5, secondPeakMs: 25 },
  { firstPeakMs: 6, secondPeakMs: 46 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function periodMilliseconds(params: Params) {
  const { firstPeakMs, secondPeakMs } = values(params);
  return secondPeakMs - firstPeakMs;
}

function frequencyHertz(params: Params) {
  return 1000 / periodMilliseconds(params);
}

const distractors: DistractorRule[] = [
  { label: "не переводишь миллисекунды в секунды", compute: params => 1 / periodMilliseconds(params) },
  { label: "принимаешь время второго максимума за период", compute: params => 1000 / values(params).secondPeakMs },
  { label: "считаешь соседние одинаковые максимумы половиной периода", compute: params => 2000 / periodMilliseconds(params) },
];

export const acOscillogramFrequencyBlueprint: TaskBlueprint = {
  id: "ac-oscillogram-frequency",
  skill: "Частота переменного тока по двум максимумам",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "T=(t_2-t_1)\\cdot10^{-3}\\,\\text{с},\\qquad\\nu=\\frac{1}{T}",
  answerUnit: "Гц",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: frequencyHertz,
  distractors,
  textTemplate: params => {
    const { firstPeakMs, secondPeakMs } = values(params);
    return `В записи силы переменного тока два соседних положительных максимума приходятся на моменты t₁ = ${firstPeakMs} мс и t₂ = ${secondPeakMs} мс. Найди частоту тока в герцах.`;
  },
  explanationTemplate: (params, answer) => {
    const { firstPeakMs, secondPeakMs } = values(params);
    const periodMs = periodMilliseconds(params);
    return `Между соседними положительными максимумами проходит один полный период: $T=t_2-t_1=(${secondPeakMs}-${firstPeakMs})\\,\\text{мс}=${periodMs}\\,\\text{мс}=${formatMathValue(periodMs / 1000)}\\,\\text{с}$. Поэтому $\\nu=\\frac{1}{T}=\\frac{1}{${formatMathValue(periodMs / 1000)}\\,\\text{с}}=${formatMathValue(answer)}\\,\\text{Гц}$.`;
  },
  trap: "Соседние максимумы одного знака разделены полным периодом. Найди разность их времён и переведи миллисекунды в секунды перед вычислением частоты.",
  coachLines: {
    correct: () => "Верно. Между соседними положительными максимумами проходит один полный период; частота равна обратной величине периода в секундах.",
    wrong: (params, selected, correct) => {
      const { firstPeakMs, secondPeakMs } = values(params);
      return `Период равен ${secondPeakMs} − ${firstPeakMs} = ${periodMilliseconds(params)} мс. Переведи его в секунды и найди 1/T: ${formatAnswerValue(correct)} Гц. Твой ответ — ${formatAnswerValue(selected)} Гц.`;
    },
  },
  variantCount: cases.length,
};
