import { inclineForceDistractors } from "../distractors.ts";
import { GRAVITY, GRAVITY_TEXT, inclineForce } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

const contexts = [
  "Брусок лежит на наклонной плоскости; трением пренебречь",
  "Небольшое тело находится на наклонной направляющей без трения",
  "Груз расположен на наклонной плоскости; трением пренебречь",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return contexts[variant % contexts.length];
}

export const inclineForceBlueprint: TaskBlueprint = {
  id: "incline-force",
  skill: "Проекция силы тяжести на наклонную плоскость",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    angle: { min: 30, max: 60, step: 15, unit: "°" },
    m: { min: 2, max: 10, step: 1, unit: "кг" },
  },
  formula: "F_{\\parallel}=mg\\sin\\alpha",
  answerUnit: "Н",
  answerKind: "positive",
  solver: inclineForce,
  distractors: inclineForceDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Угол плоскости к горизонту ${p.angle}°. Масса тела ${p.m} кг, ${GRAVITY_TEXT}. Найдите модуль составляющей силы тяжести вдоль плоскости.`,
  explanationTemplate: (p, answer) =>
    `Вдоль плоскости направлена составляющая mg sin α: ${p.m} · ${GRAVITY} · sin ${p.angle}° = ${formatAnswerValue(answer)} Н. Выражение mg cos α даёт перпендикулярную составляющую.`,
  trap: "Путает составляющие mg sin α и mg cos α.",
  coachLines: {
    correct: (p) =>
      `Да. Вдоль наклонной плоскости действует составляющая mg sin α, здесь α = ${p.angle}°.`,
    wrong: (p, selected, correct) =>
      `Вдоль плоскости нужна проекция mg sin ${p.angle}°, а mg cos α направлена перпендикулярно плоскости. Ответ ${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`,
  },
  variantCount: contexts.length,
};
