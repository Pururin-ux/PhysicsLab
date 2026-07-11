import { phaseChangeHeatDistractors } from "../distractors.ts";
import {
  ICE_FUSION_HEAT_KJ,
  ICE_SPECIFIC_HEAT_KJ,
  phaseChangeHeat,
} from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const iceContexts = [
  "Кусок льда достали из морозильной камеры",
  "Лёд для опыта находится при отрицательной температуре",
  "В калориметре нужно подготовить воду из холодного льда",
  "Ледяную заготовку нужно нагреть и расплавить",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return iceContexts[variant % iceContexts.length];
}

export const phaseChangeHeatBlueprint: TaskBlueprint = {
  id: "phase-change-heat",
  skill: "Нагревание и плавление",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 3,
  params: {
    m: { min: 0.2, max: 2, step: 0.2, unit: "кг" },
    temp0: { min: -30, max: -5, step: 5, unit: "°C" },
  },
  formula: "Q = cm\\Delta T + \\lambda m",
  answerUnit: "кДж",
  answerKind: "positive",
  solver: phaseChangeHeat,
  distractors: phaseChangeHeatDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Масса льда ${formatAnswerValue(p.m)} кг, начальная температура ${p.temp0} °C. Сколько теплоты нужно, чтобы нагреть лёд до 0 °C и полностью расплавить? $c_{\\text{льда}} = 2{,}1$ кДж/(кг·°C), $\\lambda = 334$ кДж/кг.`,
  explanationTemplate: (p, answer) =>
    `Есть две стадии: нагрев до 0 °C и плавление. $Q = cm\\Delta T + \\lambda m = ${formatMathValue(p.m)}\\cdot(${formatMathValue(ICE_SPECIFIC_HEAT_KJ)}\\cdot${Math.abs(p.temp0)} + ${ICE_FUSION_HEAT_KJ}) = ${formatMathValue(answer)}$ кДж.`,
  trap: "Если вещество сначала нагревается, а потом плавится, нужно сложить две теплоты: $cm\\Delta T$ и $\\lambda m$.",
  coachLines: {
    correct: () =>
      "Да. Здесь две стадии, поэтому теплоты складываются: нагрев до 0 °C и плавление.",
    wrong: (_p, selected, correct) =>
      `Не пропускай одну из стадий: сначала $cm\\Delta T$, потом $\\lambda m$. Получается ${formatAnswerValue(correct)} кДж, а не ${formatAnswerValue(selected)} кДж.`,
  },
  constraints: [(p) => p.m !== 1],
  variantCount: iceContexts.length,
};
