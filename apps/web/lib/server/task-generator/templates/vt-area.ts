import { vtAreaDistractors } from "../distractors.ts";
import { vtAreaDisplacement } from "../solver.ts";
import type { GraphSpec, Params, TaskBlueprint } from "../types.ts";

function graphFor(p: Params): GraphSpec {
  const totalTime = p.t1 + p.t2;
  const finalVelocity = p.v + p.dv;

  return {
    type: "vt",
    series: [
      { t: 0, v: p.v },
      { t: p.t1, v: p.v },
      { t: totalTime, v: finalVelocity },
    ],
    xLabel: "t, с",
    yLabel: "v, м/с",
    xRange: [0, totalTime],
    yRange: [0, finalVelocity + 2],
  };
}

export const vtAreaBlueprint: TaskBlueprint = {
  id: "vt-area",
  skill: "Площадь под графиком v(t)",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    v: { min: 2, max: 10, step: 2, unit: "м/с" },
    t1: { min: 2, max: 5, step: 1, unit: "с" },
    dv: { min: 2, max: 6, step: 2, unit: "м/с" },
    t2: { min: 2, max: 5, step: 1, unit: "с" },
  },
  graph: graphFor,
  formula: "s=v(t_1+t_2)+\\frac{\\Delta v\\,t_2}{2}",
  answerUnit: "м",
  answerKind: "positive",
  solver: vtAreaDisplacement,
  distractors: vtAreaDistractors,
  textTemplate: (p) =>
    `По графику v(t): первые ${p.t1} с скорость равна ${p.v} м/с, затем за следующие ${p.t2} с скорость равномерно увеличивается на ${p.dv} м/с. Найдите перемещение тела.`,
  explanationTemplate: (p, answer) =>
    `Перемещение равно площади под v(t): прямоугольник ${p.v} · (${p.t1} + ${p.t2}) и треугольная добавка $\\frac{${p.dv} \\cdot ${p.t2}}{2}$. Сумма равна ${answer} м.`,
  trap: "Считает только прямоугольник, только треугольник или умножает конечную скорость на весь промежуток.",
  coachLines: {
    correct: (p) =>
      `Да. Перемещение — это площадь под v(t): прямоугольник плюс добавка за последние ${p.t2} с.`,
    wrong: (_p, selected, correct) =>
      `Сложи площади под графиком: $v(t_1 + t_2) + \\frac{\\Delta v \\, t_2}{2}$. Получается ${correct} м, выбранный ответ ${selected} м.`,
  },
};
