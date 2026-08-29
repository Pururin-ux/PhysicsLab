import { waveLengthDistractors } from "../distractors.ts";
import { waveLength } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

function explanationFor(p: Params, answer: number): string {
  return (
    `За период волна уходит на одну длину волны: $\\lambda = \\frac{v}{\\nu} = ` +
    `\\frac{${p.speed}}{${p.freq}} = ${formatMathValue(answer)}$ м.`
  );
}

export const waveLengthBlueprint: TaskBlueprint = {
  id: "wave-length",
  skill: "Длина волны",
  topic: "Колебания и волны",
  group: "oscillations",
  difficulty: 1,
  params: {
    speed: { min: 100, max: 400, step: 50, unit: "м/с" },
    freq: { min: 10, max: 100, step: 5, unit: "Гц" },
  },
  formula: "\\lambda=\\frac{v}{\\nu}=vT",
  answerUnit: "м",
  answerKind: "positive",
  solver: waveLength,
  distractors: waveLengthDistractors,
  textTemplate: (p) =>
    `Источник колеблется с частотой ${p.freq} Гц, скорость распространения волны в среде ` +
    `${p.speed} м/с. Найдите длину волны.`,
  explanationTemplate: explanationFor,
  trap: "Перемножает скорость и частоту вместо деления.",
  coachLines: {
    correct: () =>
      "Да. Длина волны — расстояние, которое волна проходит за один период: скорость делим на частоту.",
    wrong: (p, selected, correct) =>
      `Вырази длину волны из $v = \\lambda \\nu$: ${p.speed} / ${p.freq} = ${correct} м, ` +
      `а не ${selected} м.`,
  },
  constraints: [(p) => decimalPlaces(waveLength(p)) <= 2],
  difficultyFor: (_p, answer) => (decimalPlaces(answer) <= 1 ? 1 : 2),
};
