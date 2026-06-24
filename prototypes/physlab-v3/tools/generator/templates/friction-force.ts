import { frictionForceDistractors } from "../distractors.ts";
import { frictionForce } from "../solver.ts";
import type { TaskBlueprint } from "../types.ts";

export const frictionForceBlueprint: TaskBlueprint = {
  id: "friction-force",
  skill: "Сила трения скольжения",
  topic: "Динамика",
  difficulty: 1,
  params: {
    mu: { min: 0.1, max: 0.5, step: 0.1, unit: "" },
    m: { min: 2, max: 20, step: 1, unit: "кг" },
  },
  formula: "F_{\\text{тр}}=\\mu N=\\mu mg",
  answerUnit: "Н",
  solver: frictionForce,
  distractors: frictionForceDistractors,
  textTemplate: (p) =>
    `Брусок массой ${p.m} кг скользит по горизонтальной поверхности. Коэффициент трения равен ${p.mu}, g = 10 м/с². Найдите модуль силы трения.`,
  trap: "Использует N = mg без учета коэффициента трения или переносит равенство N = mg на негоризонтальную ситуацию.",
  coachLines: {
    correct: (p) =>
      `Верно: на горизонтальной поверхности N = mg, поэтому Fтр = μmg = ${p.mu} · ${p.m} · 10.`,
    wrong: (_p, selected, correct) =>
      `Для горизонтальной поверхности N = mg, а сила трения равна μN. Получается ${correct} Н, а не ${selected} Н.`,
  },
};
