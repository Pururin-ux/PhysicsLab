import { variantIndex } from "../solver.ts";
import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const contexts = [
  "двумя однородными шарами",
  "двумя материальными точками",
  "планетой и небольшим спутником",
  "двумя сферическими телами",
  "двумя далёкими небесными телами",
] as const;

function changeFactor(p: Params): number {
  return p.k ** 2;
}

function direction(p: Params): "increase" | "decrease" {
  return variantIndex(p, 10) % 2 === 0 ? "increase" : "decrease";
}

function context(p: Params): string {
  return contexts[Math.floor(variantIndex(p, 10) / 2)];
}

const distractors: DistractorRule[] = [
  { label: "учёл расстояние без квадрата", compute: (p) => p.k },
  { label: "сложил коэффициент с единицей", compute: (p) => p.k + 1 },
  { label: "использовал третью степень", compute: (p) => p.k ** 3 },
];

export const gravitationDistanceBlueprint: TaskBlueprint = {
  id: "gravitation-distance",
  skill: "Обратный квадрат расстояния в законе тяготения",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    k: { min: 2, max: 6, step: 1, unit: "раз" },
  },
  formula: "F\\sim\\frac{1}{r^2}",
  answerUnit: "раз",
  answerKind: "positive",
  solver: changeFactor,
  distractors,
  textTemplate: (p) => {
    const objectPair = context(p);
    return direction(p) === "increase"
      ? `Расстояние между центрами ${objectPair} увеличили в ${p.k} раза, не изменяя массы. Во сколько раз уменьшилась сила их взаимного притяжения?`
      : `Расстояние между центрами ${objectPair} уменьшили в ${p.k} раза, не изменяя массы. Во сколько раз увеличилась сила их взаимного притяжения?`;
  },
  explanationTemplate: (p, answer) =>
    `При неизменных массах $F\\sim\\frac{1}{r^2}$. Изменение расстояния в ${p.k} раза изменяет силу в $${p.k}^2=${answer}$ раз в противоположную сторону.`,
  trap: "Учитывает расстояние линейно и забывает квадрат.",
  coachLines: {
    correct: (p) => `Да. Квадрат коэффициента равен $${p.k}^2=${p.k ** 2}$.`,
    wrong: (p, selected, correct) =>
      `Расстояние входит в квадрате: нужно возвести ${p.k} в квадрат. Получается ${correct} раз, а не ${selected}.`,
  },
  variantCount: 10,
};
