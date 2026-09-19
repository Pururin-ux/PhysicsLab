import type { DistractorRule, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const distractors: DistractorRule[] = [
  { label: "не перевёл литры в кубические метры", compute: (p) => p.N / p.V },
  { label: "умножил число частиц на объём", compute: (p) => p.N * p.V * 10 },
  { label: "перевернул отношение N/V", compute: (p) => (p.V / p.N) * 10 },
];

export const particleConcentrationBlueprint: TaskBlueprint = {
  id: "particle-concentration",
  skill: "Концентрация частиц",
  topic: "Молекулярная физика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    N: { min: 2, max: 12, step: 2, unit: "· 10²³ частиц" },
    V: { min: 1, max: 6, step: 1, unit: "л" },
  },
  formula: "n = \\frac{N}{V}",
  answerUnit: "· 10²⁵ м⁻³",
  answerKind: "positive",
  solver: (p) => (10 * p.N) / p.V,
  distractors,
  textTemplate: (p) => `В сосуде объёмом ${formatAnswerValue(p.V)} л находится ${formatAnswerValue(p.N)} · 10²³ молекул газа. Определите концентрацию молекул. Ответ запишите коэффициентом перед 10²⁵ м⁻³.`,
  explanationTemplate: (p, answer) => `Переводим объём: $V=${formatMathValue(p.V)}\\cdot10^{-3}$ м³. Затем $n=\\frac{N}{V}=\\frac{${formatMathValue(p.N)}\\cdot10^{23}}{${formatMathValue(p.V)}\\cdot10^{-3}}=${formatMathValue(answer)}\\cdot10^{25}$ м⁻³.`,
  trap: "Концентрация — число частиц в единице объёма. Переведи литры в кубические метры и раздели N на V.",
  coachLines: {
    correct: () => "Да. Концентрация равна числу частиц, делённому на объём в кубических метрах: $n=N/V$.",
    wrong: (_p, selected, correct) => `Сначала используй $1\\,\\text{л}=10^{-3}\\,\\text{м}^3$, затем раздели число частиц на объём. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [(p) => (10 * p.N) % p.V === 0],
};
