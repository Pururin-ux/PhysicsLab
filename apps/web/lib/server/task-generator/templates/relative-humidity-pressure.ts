import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const contexts = [
  "В кабинете физики",
  "В закрытой учебной лаборатории",
  "В школьной метеостанции",
  "В помещении после проветривания",
] as const;

function contextFor(params: Params): string {
  const variant = Math.abs(Math.trunc(params.__variant ?? 0));
  return contexts[variant % contexts.length];
}

function vaporPressure(params: Params): number {
  return params.pSat * params.phi / 100;
}

function relativeHumidity(params: Params): number {
  return params.phi;
}

const distractors: DistractorRule[] = [
  { label: "увеличивает отношение на десять процентных пунктов", compute: p => p.phi + 10 },
  { label: "уменьшает отношение на десять процентных пунктов", compute: p => p.phi - 10 },
  { label: "делит найденную долю ещё раз пополам", compute: p => p.phi / 2 },
];

export const relativeHumidityPressureBlueprint: TaskBlueprint = {
  id: "relative-humidity-pressure",
  skill: "Относительная влажность воздуха",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    phi: { min: 30, max: 80, step: 10, unit: "%" },
    pSat: { min: 1.2, max: 3, step: 0.6, unit: "кПа" },
  },
  formula: "\\varphi=\\frac{p_{\\text{п}}}{p_{\\text{н}}}\\cdot100\\%",
  answerUnit: "%",
  answerKind: "positive",
  solver: relativeHumidity,
  distractors,
  textTemplate: (params) =>
    `${contextFor(params)} парциальное давление водяного пара равно ${formatAnswerValue(vaporPressure(params))} кПа. Давление насыщенного пара при той же температуре равно ${formatAnswerValue(params.pSat)} кПа. Найдите относительную влажность воздуха.`,
  explanationTemplate: (params, answer) =>
    `Сравниваем давление пара с давлением насыщенного пара при той же температуре: $\\varphi=\\frac{${formatMathValue(vaporPressure(params))}}{${formatMathValue(params.pSat)}}\\cdot100\\%=${formatMathValue(answer)}\\%$.`,
  trap: "В знаменателе должно быть давление насыщенного пара при той же температуре. Результат — доля от предела насыщения, выраженная в процентах.",
  coachLines: {
    correct: () => "Верно. Ты сравнил фактическое давление водяного пара с пределом насыщения при той же температуре.",
    wrong: (_params, selected, correct) =>
      `Сначала найди отношение $p_{\\text{п}}/p_{\\text{н}}$, затем умножь его на 100 %. Получается ${formatAnswerValue(correct)} %, а не ${formatAnswerValue(selected)} %.`,
  },
  variantCount: contexts.length,
};
