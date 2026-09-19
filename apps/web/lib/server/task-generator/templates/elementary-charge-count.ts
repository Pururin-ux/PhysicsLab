import type { DistractorRule, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const ELEMENTARY_CHARGE_COEFFICIENT = 1.6;

const distractors: DistractorRule[] = [
  { label: "умножил коэффициент заряда на 1,6 вместо деления", compute: (p) => p.N * ELEMENTARY_CHARGE_COEFFICIENT * ELEMENTARY_CHARGE_COEFFICIENT },
  { label: "разделил число зарядов на 1,6", compute: (p) => p.N / ELEMENTARY_CHARGE_COEFFICIENT },
  { label: "потерял порядок величины", compute: (p) => p.N * 10 },
];

export const elementaryChargeCountBlueprint: TaskBlueprint = {
  id: "elementary-charge-count",
  skill: "Дискретность электрического заряда",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: { N: { min: 2, max: 60, step: 1, unit: "элементарных зарядов" } },
  formula: "N = \\frac{|q|}{e}",
  answerUnit: "элементарных зарядов",
  answerKind: "positive",
  solver: (p) => p.N,
  distractors,
  textTemplate: (p) => `Модуль заряда частицы равен ${formatAnswerValue(p.N * ELEMENTARY_CHARGE_COEFFICIENT)} · 10⁻¹⁹ Кл. Модуль элементарного заряда e = 1,6 · 10⁻¹⁹ Кл. Сколько элементарных зарядов содержит этот заряд?`,
  explanationTemplate: (p, answer) => `Порядки $10^{-19}$ сокращаются: $N=\\frac{|q|}{e}=\\frac{${formatMathValue(p.N * ELEMENTARY_CHARGE_COEFFICIENT)}}{1{,}6}=${formatMathValue(answer)}$. Число $N$ получилось целым, как и требует дискретность заряда.`,
  trap: "Сравни модуль заряда с элементарным зарядом: одинаковый множитель 10⁻¹⁹ сокращается.",
  coachLines: {
    correct: () => "Да. Заряд тела содержит целое число элементарных зарядов: $N=|q|/e$.",
    wrong: (_p, selected, correct) => `Раздели модуль заряда на $e=1{,}6\\cdot10^{-19}$ Кл. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
};
