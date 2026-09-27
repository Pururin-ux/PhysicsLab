import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function emfMagnitude(params: Params): number {
  // 1 мВб / 1 мс = 1 Вб / 1 с = 1 В.
  return (params.turns * params.fluxChangeMilliWb) / params.intervalMs;
}

const distractors: DistractorRule[] = [
  {
    label: "не учитываешь число одинаково ориентированных витков",
    compute: params => params.fluxChangeMilliWb / params.intervalMs,
  },
  {
    label: "приравниваешь изменение потока к ЭДС, не деля на время",
    compute: params => params.turns * params.fluxChangeMilliWb,
  },
  {
    label: "переводишь миллисекунды в секунды, но оставляешь поток в милливеберах",
    compute: params => emfMagnitude(params) * 1000,
  },
];

export const inducedEmfMagnitudeBlueprint: TaskBlueprint = {
  id: "induced-emf-magnitude",
  skill: "Модуль ЭДС по изменению магнитного потока",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    fluxChangeMilliWb: { min: 3, max: 12, step: 3, unit: "мВб" },
    intervalMs: { min: 5, max: 20, step: 5, unit: "мс" },
    turns: { min: 2, max: 10, step: 2, unit: "витков" },
  },
  formula: "|\\mathcal E_{\\text{инд}}|=N\\frac{|\\Delta\\Phi_1|}{\\Delta t}",
  answerUnit: "В",
  answerKind: "magnitude",
  answerFormat: "numeric_input",
  solver: emfMagnitude,
  distractors,
  textTemplate: params =>
    `Катушка состоит из ${params.turns} одинаково ориентированных витков. За ${params.intervalMs} мс магнитный поток через каждый виток изменился по модулю на ${params.fluxChangeMilliWb} мВб. Найди модуль ЭДС индукции катушки в вольтах.`,
  explanationTemplate: (params, answer) =>
    `Через каждый виток поток меняется одинаково, поэтому модули ЭДС витков складываются. $|\\Delta\\Phi_1|=${formatMathValue(params.fluxChangeMilliWb)}\\,\\text{мВб}=${formatMathValue(params.fluxChangeMilliWb)}\\cdot10^{-3}\\,\\text{Вб}$ и $\\Delta t=${formatMathValue(params.intervalMs)}\\,\\text{мс}=${formatMathValue(params.intervalMs)}\\cdot10^{-3}\\,\\text{с}$. Тогда $|\\mathcal E_{\\text{инд}}|=N\\frac{|\\Delta\\Phi_1|}{\\Delta t}=${formatMathValue(params.turns)}\\cdot\\frac{${formatMathValue(params.fluxChangeMilliWb)}\\cdot10^{-3}}{${formatMathValue(params.intervalMs)}\\cdot10^{-3}}=${formatMathValue(answer)}\\,\\text{В}$. Удвоение скорости изменения потока при том же числе витков удвоило бы модуль ЭДС.`,
  trap: "Учитывай изменение потока через один виток, число одинаково ориентированных витков и время изменения. Само наличие магнитного потока не задаёт ЭДС; нужна скорость его изменения.",
  coachLines: {
    correct: () => "Верно. Чем быстрее меняется поток через витки, тем больше модуль ЭДС; для одинаково ориентированных витков их вклады складываются.",
    wrong: (params, selected, correct) =>
      `Для ${params.turns} витков раздели ${params.turns} × ${params.fluxChangeMilliWb} мВб на ${params.intervalMs} мс: это ${formatAnswerValue(correct)} В, а не ${formatAnswerValue(selected)} В. Множители 10⁻³ при переводе мВб и мс сокращаются.`,
  },
};
