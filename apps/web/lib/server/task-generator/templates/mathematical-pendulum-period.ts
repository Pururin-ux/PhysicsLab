import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const gravityMPerS2 = 9.8;
const lengthsM = [0.25, 0.5, 1, 2.25, 4] as const;

function values(params: Params) {
  return { lengthM: lengthsM[params.caseId - 1] ?? lengthsM[0], gravityMPerS2 };
}

function exactPeriod(params: Params) {
  const { lengthM, gravityMPerS2: gravity } = values(params);
  return 2 * Math.PI * Math.sqrt(lengthM / gravity);
}

function periodRoundedToHundredth(params: Params) {
  return Math.round(exactPeriod(params) * 100) / 100;
}

const distractors: DistractorRule[] = [
  {
    label: "подставляешь отношение длины к g без квадратного корня",
    compute: (params) => 2 * Math.PI * (values(params).lengthM / values(params).gravityMPerS2),
  },
  {
    label: "меняешь местами длину нити и g",
    compute: (params) => 2 * Math.PI * Math.sqrt(values(params).gravityMPerS2 / values(params).lengthM),
  },
  {
    label: "делишь найденный период пополам",
    compute: (params) => periodRoundedToHundredth(params) / 2,
  },
];

export const mathematicalPendulumPeriodBlueprint: TaskBlueprint = {
  id: "mathematical-pendulum-period",
  skill: "Период математического маятника",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: lengthsM.length, step: 1, unit: "случай" } },
  formula: "T=2\\pi\\sqrt{\\frac{l}{g}}",
  answerUnit: "с",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: periodRoundedToHundredth,
  distractors,
  textTemplate: (params) => {
    const { lengthM, gravityMPerS2: gravity } = values(params);
    return `Длина нити математического маятника равна ${formatAnswerValue(lengthM)} м. Для расчёта возьмите g = ${formatAnswerValue(gravity)} м/с². Найдите период малых колебаний и округлите ответ до сотых секунды.`;
  },
  explanationTemplate: (params, answer) => {
    const { lengthM, gravityMPerS2: gravity } = values(params);
    return `Для малых колебаний математического маятника $T=2\\pi\\sqrt{\\frac{l}{g}}=2\\pi\\sqrt{\\frac{${formatMathValue(lengthM)}}{${formatMathValue(gravity)}}}\\approx ${formatMathValue(answer)}$ с. Длина измеряется до центра груза; масса груза в этой модели в формулу не входит.`;
  },
  trap: "Используй модель малых колебаний: длина нити находится под корнем в числителе, g — в знаменателе.",
  coachLines: {
    correct: () => "Верно. При большей длине маятник совершает колебания медленнее, а масса груза период не задаёт.",
    wrong: (params, selected, correct) => {
      const { lengthM, gravityMPerS2: gravity } = values(params);
      return `Проверь T = 2π√(l/g): l = ${formatAnswerValue(lengthM)} м, g = ${formatAnswerValue(gravity)} м/с². Получается ${formatAnswerValue(correct)} с; твой ответ — ${formatAnswerValue(selected)} с.`;
    },
  },
  variantCount: lengthsM.length,
};
