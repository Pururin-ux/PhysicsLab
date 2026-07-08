import { densityVolumeRatioDistractors } from "../distractors.ts";
import { densityVolumeRatio } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const materialContexts = [
  "Для демонстрационного опыта вырезали два кубика из разных материалов",
  "Лаборант сравнивает два кубика одинаковой формы, но разного состава",
  "На весах сравнивают два кубика из разных материалов",
  "Для опыта изготовили два кубика одинаковой формы, но из разных материалов",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return materialContexts[variant % materialContexts.length];
}

export const densityVolumeRatioBlueprint: TaskBlueprint = {
  id: "density-volume-ratio",
  skill: "Плотность и объём: отношение масс",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    rho1: { min: 1, max: 8, step: 1, unit: "г/см³" },
    a1: { min: 1, max: 4, step: 1, unit: "см" },
    rho2: { min: 1, max: 8, step: 1, unit: "г/см³" },
    a2: { min: 1, max: 4, step: 1, unit: "см" },
  },
  formula: "\\frac{m_1}{m_2} = \\frac{\\rho_1 a_1^3}{\\rho_2 a_2^3}",
  answerUnit: "раз",
  answerKind: "positive",
  solver: densityVolumeRatio,
  distractors: densityVolumeRatioDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Первый — из материала плотностью ${p.rho1} г/см³ с ребром ${p.a1} см, второй — из материала плотностью ${p.rho2} г/см³ с ребром ${p.a2} см. Найдите отношение массы первого кубика к массе второго, $m_1/m_2$.`,
  explanationTemplate: (p, answer) =>
    `Масса растёт с объёмом, то есть с кубом ребра: $\\frac{m_1}{m_2} = \\frac{\\rho_1 a_1^3}{\\rho_2 a_2^3} = \\frac{${p.rho1} \\cdot ${p.a1}^3}{${p.rho2} \\cdot ${p.a2}^3} = ${formatMathValue(answer)}$. Сравнивать нужно объёмы, а не рёбра.`,
  trap: "Сравнивает рёбра кубиков напрямую, забывая, что масса пропорциональна кубу ребра.",
  coachLines: {
    correct: () =>
      "Да. Масса пропорциональна объёму: $\\rho a^3$, а не просто ребру $a$.",
    wrong: (_p, selected, correct) =>
      `Масса растёт как куб ребра: $m \\propto \\rho a^3$. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [
    (p) => {
      const ratio = densityVolumeRatio(p);
      return (
        Number.isFinite(ratio) &&
        Math.abs(ratio - 1) > 0.15 &&
        ratio > 0.1 &&
        ratio < 10
      );
    },
  ],
  variantCount: materialContexts.length,
};
