import { idealGasPressureDistractors } from "../distractors.ts";
import { GAS_CONSTANT, idealGasPressure } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const vesselContexts = [
  "В баллоне находится идеальный газ",
  "В герметичном сосуде находится идеальный газ",
  "В лабораторной колбе находится идеальный газ",
  "В газовом резервуаре находится идеальный газ",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return vesselContexts[variant % vesselContexts.length];
}

function kelvinOf(p: Params): number {
  return p.tCelsius + 273;
}

// Температура дана в °C намеренно: перевод в кельвины — главная ловушка
// уравнения состояния идеального газа на экзамене.
export const idealGasStateBlueprint: TaskBlueprint = {
  id: "ideal-gas-state",
  skill: "Уравнение состояния идеального газа",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    n: { min: 0.5, max: 4, step: 0.5, unit: "моль" },
    tCelsius: { min: -73, max: 127, step: 50, unit: "°C" },
    V: { min: 5, max: 20, step: 5, unit: "л" },
  },
  formula: "pV = nRT",
  answerUnit: "кПа",
  answerKind: "positive",
  solver: idealGasPressure,
  distractors: idealGasPressureDistractors,
  textTemplate: (p) =>
    `${contextFor(p)} объёмом ${p.V} л количеством вещества ${formatAnswerValue(p.n)} моль при температуре ${p.tCelsius} °C. Найдите давление газа.`,
  explanationTemplate: (p, answer) =>
    `Переводим температуру в кельвины: $T = ${p.tCelsius} + 273 = ${kelvinOf(p)}$ К. По уравнению состояния $p = \\frac{nRT}{V} = \\frac{${formatMathValue(p.n)} \\cdot ${formatMathValue(GAS_CONSTANT)} \\cdot ${kelvinOf(p)}}{${p.V}} = ${formatMathValue(answer)}$ кПа.`,
  trap: "Температуру нужно перевести в кельвины: $T = t + 273$, иначе уравнение состояния не работает.",
  coachLines: {
    correct: (p) =>
      `Да. Ты перевёл температуру в кельвины: $T = ${p.tCelsius} + 273 = ${kelvinOf(p)}$ К.`,
    wrong: (_p, selected, correct) =>
      `Уравнение $pV=nRT$ работает только с кельвинами. Получается ${formatAnswerValue(correct)} кПа, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: vesselContexts.length,
};
