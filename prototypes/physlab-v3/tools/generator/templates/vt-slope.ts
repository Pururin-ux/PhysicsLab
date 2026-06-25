import { vtSlopeDistractors } from "../distractors.ts";
import { vtSlopeAcceleration } from "../solver.ts";
import type { GraphSpec, Params, TaskBlueprint } from "../types.ts";

function graphFor(p: Params): GraphSpec {
  return {
    type: "vt",
    series: [
      { t: p.t1, v: p.v1 },
      { t: p.t2, v: p.v2 },
    ],
    xLabel: "t, с",
    yLabel: "v, м/с",
    xRange: [0, p.t2],
    yRange: [0, p.v2 + 2],
  };
}

export const vtSlopeBlueprint: TaskBlueprint = {
  id: "vt-slope",
  skill: "Наклон графика v(t)",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    v1: { min: 2, max: 10, step: 2, unit: "м/с" },
    v2: { min: 12, max: 30, step: 2, unit: "м/с" },
    t1: { min: 0, max: 2, step: 1, unit: "с" },
    t2: { min: 4, max: 10, step: 2, unit: "с" },
  },
  graph: graphFor,
  formula: "a=\\frac{\\Delta v}{\\Delta t}=\\frac{v_2-v_1}{t_2-t_1}",
  answerUnit: "м/с²",
  answerKind: "positive",
  solver: vtSlopeAcceleration,
  distractors: vtSlopeDistractors,
  textTemplate: (p) =>
    `На графике v(t) прямая проходит через точки (${p.t1} с; ${p.v1} м/с) и (${p.t2} с; ${p.v2} м/с). Найдите ускорение тела.`,
  explanationTemplate: (p, answer) =>
    `Ускорение равно наклону v(t): a = (${p.v2} − ${p.v1}) / (${p.t2} − ${p.t1}) = ${answer} м/с². Ловушка — брать v/t вместо Δv/Δt.`,
  trap: "Берет отношение скорости ко времени вместо изменения скорости к изменению времени.",
  coachLines: {
    correct: (p) =>
      `Да: ускорение равно наклону графика v(t), то есть (${p.v2} - ${p.v1}) / (${p.t2} - ${p.t1}).`,
    wrong: (_p, selected, correct) =>
      `Здесь нужен наклон, а не v/t: a = Δv/Δt. По двум точкам получается ${correct} м/с², выбранный ответ ${selected} м/с².`,
  },
  constraints: [
    (p) => p.v2 > p.v1,
    (p) => p.t2 > p.t1,
    (p) => {
      const acceleration = vtSlopeAcceleration(p);

      return (
        Number.isFinite(acceleration) &&
        acceleration > 0 &&
        acceleration <= 20 &&
        Math.abs(acceleration * 2 - Math.round(acceleration * 2)) < 1e-9
      );
    },
  ],
};
