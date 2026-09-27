import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";
import {
  HC_EV_NANOMETERS,
  PLANCK_CONSTANT_EV_SECONDS,
  getBohrTransition,
  hydrogenLevelEnergyEv,
} from "../../../physics/bohr-transition-model.ts";

const transitions = [
  { initialN: 3, finalN: 2 },
  { initialN: 4, finalN: 2 },
  { initialN: 5, finalN: 2 },
  { initialN: 6, finalN: 2 },
] as const;

function values(params: Params) {
  return transitions[params.transitionId - 1] ?? transitions[0];
}

function photonEnergy(params: Params) {
  const value = values(params);
  return getBohrTransition(value.initialN, value.finalN).photonEnergyEv;
}

function answerForEnergy(energyEv: number, params: Params) {
  return params.quantity === 1
    ? Number((energyEv / PLANCK_CONSTANT_EV_SECONDS / 1e14).toFixed(2))
    : Math.round(HC_EV_NANOMETERS / energyEv);
}

const distractors: DistractorRule[] = [
  {
    label: "подставляешь сумму модулей энергий вместо их разности",
    compute: params => {
      const value = values(params);
      return answerForEnergy(
        Math.abs(hydrogenLevelEnergyEv(value.initialN)) + Math.abs(hydrogenLevelEnergyEv(value.finalN)),
        params,
      );
    },
  },
  {
    label: "забываешь квадрат главного квантового числа",
    compute: params => {
      const value = values(params);
      const energyEv = 13.6 * Math.abs(1 / value.initialN - 1 / value.finalN);
      return answerForEnergy(energyEv, params);
    },
  },
  {
    label: "берёшь энергию только начального состояния",
    compute: params => {
      const value = values(params);
      return answerForEnergy(Math.abs(hydrogenLevelEnergyEv(value.initialN)), params);
    },
  },
];

export const bohrTransitionRadiationBlueprint: TaskBlueprint = {
  id: "bohr-transition-radiation",
  skill: "Частота и длина волны при переходе атома",
  topic: "Физика атома",
  group: "quantum",
  difficulty: 1,
  params: {
    transitionId: { min: 1, max: transitions.length, step: 1, unit: "переход" },
    quantity: { min: 1, max: 2, step: 1, unit: "величина" },
  },
  formula: "E_n=-\\frac{13{,}6\\,\\text{эВ}}{n^2},\\quad h\\nu=|E_i-E_f|,\\quad \\lambda=\\frac{c}{\\nu}",
  answerUnit: params => params.quantity === 1 ? "10¹⁴ Гц" : "нм",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: params => answerForEnergy(photonEnergy(params), params),
  distractors,
  textTemplate: params => {
    const value = values(params);
    const quantity = params.quantity === 1
      ? "частоту излучения в единицах 10¹⁴ Гц"
      : "длину волны излучения в нанометрах";
    return `Атом водорода переходит из состояния n = ${value.initialN} в состояние n = ${value.finalN} и испускает фотон. Найди ${quantity}. Используй уровни энергии атома водорода.`;
  },
  explanationTemplate: (params, answer) => {
    const value = values(params);
    const transition = getBohrTransition(value.initialN, value.finalN);
    const initialEnergy = formatMathValue(transition.initialEnergyEv);
    const finalEnergy = formatMathValue(transition.finalEnergyEv);
    const photonEnergy = formatMathValue(transition.photonEnergyEv);

    if (params.quantity === 1) {
      return `Сначала найди энергии уровней: $E_{${value.initialN}}=-\\frac{13{,}6}{${value.initialN}^2}=${initialEnergy}$ эВ и $E_{${value.finalN}}=-\\frac{13{,}6}{${value.finalN}^2}=${finalEnergy}$ эВ. При излучении атом переходит на более низкий уровень, поэтому энергия фотона равна разности энергий по модулю: $\\Delta E=|E_i-E_f|=${photonEnergy}$ эВ. Тогда $\\nu=\\frac{\\Delta E}{h}\\approx${formatMathValue(answer)}\\cdot10^{14}$ Гц.`;
    }

    return `Энергии уровней: $E_{${value.initialN}}=${initialEnergy}$ эВ и $E_{${value.finalN}}=${finalEnergy}$ эВ. Энергия испущенного фотона $\\Delta E=|E_i-E_f|=${photonEnergy}$ эВ. Используй $hc\\approx${formatMathValue(HC_EV_NANOMETERS)}$ эВ·нм: $\\lambda=\\frac{hc}{\\Delta E}\\approx\\frac{${formatMathValue(HC_EV_NANOMETERS)}}{${photonEnergy}}=${formatMathValue(answer)}$ нм.`;
  },
  trap: "Сначала найди разность энергий двух состояний. Энергия фотона зависит от этой разности, а не от энергии одного уровня.",
  coachLines: {
    correct: () => "Верно: частота и длина волны определяются одной и той же разностью энергий состояний.",
    wrong: (_params, selected, correct) => `Проверь разность энергий уровней и единицы ответа. Верный результат — ${formatAnswerValue(correct)}, твой ответ — ${formatAnswerValue(selected)}.`,
  },
};
