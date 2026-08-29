import { coulombForceDistractors } from "../distractors.ts";
import { coulombForce } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Заряды даны в мкКл, расстояние — в см: при подстановке это даёт множитель
// 90 перед q₁q₂/r² (см. COULOMB_PREFIX в solver.ts). Диапазон расстояний
// подобран так, чтобы ответы оставались в пределах двух знаков после запятой.

function meters(p: Params): number {
  return p.r / 100;
}

function explanationFor(p: Params, answer: number): string {
  return (
    `Переводим в СИ: $q_1 = ${p.q1}\\cdot 10^{-6}$ Кл, ` +
    `$q_2 = ${p.q2}\\cdot 10^{-6}$ Кл, $r = ${formatMathValue(meters(p))}$ м. ` +
    `Закон Кулона: $F = k\\frac{q_1 q_2}{r^2} = ${formatMathValue(answer)}$ Н. ` +
    `Расстояние входит в знаменатель и возводится в квадрат: при уменьшении ` +
    `расстояния вдвое сила растёт в четыре раза.`
  );
}

export const coulombForceBlueprint: TaskBlueprint = {
  id: "coulomb-force",
  skill: "Закон Кулона",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    q1: { min: 1, max: 9, step: 1, unit: "мкКл" },
    q2: { min: 2, max: 9, step: 1, unit: "мкКл" },
    r: { min: 10, max: 30, step: 10, unit: "см" },
  },
  formula: "F=k\\frac{|q_1||q_2|}{r^2}",
  answerUnit: "Н",
  answerKind: "positive",
  solver: coulombForce,
  distractors: coulombForceDistractors,
  textTemplate: (p) =>
    `Два точечных заряда ${p.q1} мкКл и ${p.q2} мкКл закрепили на расстоянии ${p.r} см друг от друга. ` +
    `Найдите модуль силы их взаимодействия. Коэффициент $k = 9\\cdot 10^{9}$ Н·м²/Кл².`,
  explanationTemplate: explanationFor,
  trap: "Не переводит мкКл в Кл и сантиметры в метры или не возводит расстояние в квадрат.",
  coachLines: {
    correct: () =>
      "Да. Сначала единицы СИ, затем $F = k\\frac{q_1 q_2}{r^2}$: расстояние в знаменателе в квадрате.",
    wrong: (p, selected, correct) =>
      `Проверь два места: перевод единиц (мкКл → Кл, см → м) и квадрат расстояния. ` +
      `Здесь $F = ${formatAnswerValue(correct)}$ Н, а не ${formatAnswerValue(selected)}$ Н.`,
  },
  constraints: [(p) => decimalPlaces(coulombForce(p)) <= 2],
  difficultyFor: (p) => (p.r === 30 ? 1 : p.r === 10 ? 2 : 3),
};
