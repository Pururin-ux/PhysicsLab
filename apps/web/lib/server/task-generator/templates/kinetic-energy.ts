import { kineticEnergyDistractors } from "../distractors.ts";
import { kineticEnergy } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const energyContexts = [
  "Тележка движется по горизонтальному участку трека",
  "Груз скользит без трения по гладкой горизонтальной поверхности",
  "Шайба движется по льду с постоянной скоростью",
  "Модельный автомобиль проезжает прямой участок стенда",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return energyContexts[variant % energyContexts.length];
}

export const kineticEnergyBlueprint: TaskBlueprint = {
  id: "kinetic-energy",
  skill: "Кинетическая энергия",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    m: { min: 1, max: 12, step: 1, unit: "кг" },
    v: { min: 2, max: 20, step: 1, unit: "м/с" },
  },
  formula: "E_k = \\frac{mv^2}{2}",
  answerUnit: "Дж",
  answerKind: "positive",
  solver: kineticEnergy,
  distractors: kineticEnergyDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Масса тела ${p.m} кг, скорость ${p.v} м/с. Найдите кинетическую энергию тела.`,
  explanationTemplate: (p, answer) =>
    `$E_k = \\frac{mv^2}{2} = \\frac{${p.m}\\cdot${p.v}^2}{2} = ${formatMathValue(answer)}$ Дж.`,
  trap: "В кинетической энергии скорость возводится в квадрат, а всё произведение делится на 2.",
  coachLines: {
    correct: () =>
      "Да. В $E_k=\\frac{mv^2}{2}$ скорость обязательно в квадрате.",
    wrong: (_p, selected, correct) =>
      `Кинетическая энергия — это $\\frac{mv^2}{2}$, не импульс $mv$. Получается ${formatAnswerValue(correct)} Дж, а не ${formatAnswerValue(selected)} Дж.`,
  },
  constraints: [(p) => (p.m * p.v * p.v) % 2 === 0],
  variantCount: energyContexts.length,
};
