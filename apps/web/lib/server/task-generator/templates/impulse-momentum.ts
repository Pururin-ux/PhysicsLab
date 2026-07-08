import { impulseFromForceTimeDistractors } from "../distractors.ts";
import { impulseFromForceTime } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const pushContexts = [
  "Тележку испытывают на прямых рельсах лабораторного стенда",
  "Баржу буксируют вдоль ровного участка канала",
  "Деталь перемещают вдоль горизонтального конвейера",
  "Сани испытывают на стартовом участке трассы",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return pushContexts[variant % pushContexts.length];
}

// Масса — намеренная приманка: Δp = FΔt её не использует, задача проверяет
// именно умение распознать, какие данные вообще нужны.
export const impulseMomentumBlueprint: TaskBlueprint = {
  id: "impulse-momentum",
  skill: "Импульс силы",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    m: { min: 1, max: 10, step: 1, unit: "кг" },
    F: { min: 2, max: 20, step: 1, unit: "Н" },
    dt: { min: 0.5, max: 4, step: 0.5, unit: "с" },
  },
  formula: "\\Delta p = F \\, \\Delta t",
  answerUnit: "кг·м/с",
  answerKind: "positive",
  solver: impulseFromForceTime,
  distractors: impulseFromForceTimeDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. На тело массой ${p.m} кг в течение ${formatAnswerValue(p.dt)} с действует постоянная сила ${formatAnswerValue(p.F)} Н. Найдите модуль изменения импульса тела за это время.`,
  explanationTemplate: (p, answer) =>
    `По теореме об изменении импульса $\\Delta p = F \\Delta t = ${formatMathValue(p.F)} \\cdot ${formatMathValue(p.dt)} = ${formatMathValue(answer)}$ кг·м/с. Масса тела для этой формулы не нужна.`,
  trap: "Не все данные в тексте нужны для формулы: масса здесь лишняя — используй $\\Delta p = F\\Delta t$.",
  coachLines: {
    correct: () => "Да. $\\Delta p = F\\Delta t$ — масса тела в эту формулу не входит.",
    wrong: (_p, selected, correct) =>
      `Изменение импульса — это $F\\Delta t$, масса здесь ни при чём. Получается ${formatAnswerValue(correct)} кг·м/с, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: pushContexts.length,
};
