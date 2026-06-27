import { inclineForceDistractors } from "../distractors.ts";
import { inclineForce } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

const contexts = [
  "Брусок покоится на гладкой наклонной плоскости",
  "Небольшое тело находится на наклонной направляющей без трения",
  "Груз расположен на гладкой наклонной плоскости",
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
    `${contextFor(p)} под углом ${p.angle}° к горизонту. Масса тела ${p.m} кг, g = 10 м/с². Найдите модуль составляющей силы тяжести вдоль плоскости.`,
  explanationTemplate: (p, answer) =>
    `Вдоль плоскости направлена составляющая mg sin α: ${p.m} · 10 · sin ${p.angle}° = ${answer} Н. Выражение mg cos α даёт перпендикулярную составляющую.`,
  trap: "Путает составляющие mg sin α и mg cos α.",
  coachLines: {
    correct: (p) =>
      `Да. Вдоль наклонной плоскости действует составляющая mg sin α, здесь α = ${p.angle}°.`,
    wrong: (p, selected, correct) =>
      `Вдоль плоскости нужна проекция mg sin ${p.angle}°, а mg cos α направлена перпендикулярно плоскости. Ответ ${correct} Н, а не ${selected} Н.`,
  },
  variantCount: contexts.length,
};
