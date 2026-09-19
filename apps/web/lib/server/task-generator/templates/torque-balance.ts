import { variantIndex } from "../solver.ts";
import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

const contexts = [
  "На лабораторном рычаге",
  "На диске с неподвижной горизонтальной осью",
  "На коромысле учебных весов",
  "На модели рулевого колеса",
] as const;

function balancingForce(p: Params): number {
  return (p.F1 * p.l1) / p.l2;
}

const distractors: DistractorRule[] = [
  { label: "перепутал плечи местами", compute: (p) => (p.F1 * p.l2) / p.l1 },
  { label: "сложил плечи", compute: (p) => (p.F1 * (p.l1 + p.l2)) / p.l2 },
  { label: "принял момент первой силы за вторую силу", compute: (p) => (p.F1 * p.l1) / 100 },
];

export const torqueBalanceBlueprint: TaskBlueprint = {
  id: "torque-balance",
  skill: "Равновесие моментов сил",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    F1: { min: 10, max: 50, step: 10, unit: "Н" },
    l1: { min: 10, max: 50, step: 10, unit: "см" },
    l2: { min: 10, max: 50, step: 10, unit: "см" },
  },
  formula: "F_1l_1=F_2l_2",
  answerUnit: "Н",
  answerKind: "positive",
  solver: balancingForce,
  distractors,
  textTemplate: (p) =>
    `${contexts[variantIndex(p, contexts.length)]} силы действуют перпендикулярно плечам и стремятся повернуть тело в противоположные стороны. $F_1=${p.F1}$ Н, $l_1=${p.l1}$ см, $l_2=${p.l2}$ см. Какой должна быть сила $F_2$, чтобы тело оставалось в равновесии?`,
  explanationTemplate: (p, answer) =>
    `Для равновесия модули противоположных моментов равны: $F_1l_1=F_2l_2$. Поэтому $F_2=F_1l_1/l_2=${p.F1}\\cdot${p.l1}/${p.l2}=${formatAnswerValue(answer)}$ Н. Оба плеча заданы в одинаковых единицах, поэтому при нахождении отношения перевод не требуется.`,
  trap: "Использует расстояние до точки приложения вместо плеча или меняет плечи местами.",
  coachLines: {
    correct: () => "Да. Противоположные моменты равны, поэтому их алгебраическая сумма равна нулю.",
    wrong: (p, selected, correct) =>
      `Сравни произведения силы на её плечо: $F_1l_1=F_2l_2$. Получается ${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`,
  },
  constraints: [
    (p) => p.l1 !== p.l2,
    (p) => (p.F1 * p.l1) % p.l2 === 0,
    (p) => balancingForce(p) <= 200,
  ],
  variantCount: contexts.length,
};
