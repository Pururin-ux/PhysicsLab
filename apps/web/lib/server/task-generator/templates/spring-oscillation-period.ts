import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { massKg: 0.25, stiffness: 100 },
  { massKg: 0.5, stiffness: 100 },
  { massKg: 0.25, stiffness: 25 },
  { massKg: 0.36, stiffness: 100 },
  { massKg: 0.64, stiffness: 100 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function exactPeriod(params: Params) {
  const { massKg, stiffness } = values(params);
  return 2 * Math.PI * Math.sqrt(massKg / stiffness);
}

function periodRoundedToHundredth(params: Params) {
  return Math.round(exactPeriod(params) * 100) / 100;
}

const distractors: DistractorRule[] = [
  {
    label: "подставляешь отношение массы к жёсткости без квадратного корня",
    compute: (params) => 2 * Math.PI * (values(params).massKg / values(params).stiffness),
  },
  {
    label: "меняешь местами массу и жёсткость",
    compute: (params) => 2 * Math.PI * Math.sqrt(values(params).stiffness / values(params).massKg),
  },
  {
    label: "делишь найденный период пополам",
    compute: (params) => periodRoundedToHundredth(params) / 2,
  },
];

export const springOscillationPeriodBlueprint: TaskBlueprint = {
  id: "spring-oscillation-period",
  skill: "Период пружинного маятника",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "T=2\\pi\\sqrt{\\frac{m}{k}}",
  answerUnit: "с",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: periodRoundedToHundredth,
  distractors,
  textTemplate: (params) => {
    const { massKg, stiffness } = values(params);
    return `Груз массой ${formatAnswerValue(massKg)} кг прикреплён к идеальной пружине жёсткостью ${stiffness} Н/м. Сопротивлением можно пренебречь. Найдите период малых колебаний. Ответ округлите до сотых секунды.`;
  },
  explanationTemplate: (params, answer) => {
    const { massKg, stiffness } = values(params);
    return `Для идеального пружинного маятника $T=2\\pi\\sqrt{\\frac{m}{k}}=2\\pi\\sqrt{\\frac{${formatMathValue(massKg)}}{${stiffness}}}\\approx ${formatMathValue(answer)}$ с. Массу подставляем в килограммах, жёсткость — в Н/м; период выражается в секундах.`;
  },
  trap: "Подставь массу в килограммах, а жёсткость — в Н/м. Квадратный корень охватывает отношение m/k целиком.",
  coachLines: {
    correct: () => "Верно. Период пружинного маятника растёт с массой и уменьшается при более жёсткой пружине.",
    wrong: (params, selected, correct) => {
      const { massKg, stiffness } = values(params);
      return `Проверь формулу T = 2π√(m/k): m = ${formatAnswerValue(massKg)} кг, k = ${stiffness} Н/м. После подстановки и округления получаем ${formatAnswerValue(correct)} с; твой ответ — ${formatAnswerValue(selected)} с.`;
    },
  },
  variantCount: cases.length,
};
