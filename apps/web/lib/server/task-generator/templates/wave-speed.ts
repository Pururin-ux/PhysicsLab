import { waveSpeedDistractors } from "../distractors.ts";
import { waveSpeed } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

function explanationFor(p: Params, answer: number): string {
  return (
    `За одну секунду источник делает ${p.freq} колебаний, и за это время волна ` +
    `уходит на расстояние, равное ${p.freq} длинам волны: ` +
    `$v = \\lambda \\nu = ${p.lambda} \\cdot ${p.freq} = ${formatMathValue(answer)}$ м/с.`
  );
}

export const waveSpeedBlueprint: TaskBlueprint = {
  id: "wave-speed",
  skill: "Скорость распространения волны",
  topic: "Колебания и волны",
  group: "oscillations",
  difficulty: 1,
  params: {
    lambda: { min: 1, max: 20, step: 1, unit: "м" },
    freq: { min: 2, max: 30, step: 1, unit: "Гц" },
  },
  formula: "v=\\lambda\\nu=\\frac{\\lambda}{T}",
  answerUnit: "м/с",
  answerKind: "positive",
  solver: waveSpeed,
  distractors: waveSpeedDistractors,
  textTemplate: (p) =>
    `Волна длиной ${p.lambda} м распространяется в среде с частотой ${p.freq} Гц. ` +
    `Найдите скорость распространения волны.`,
  explanationTemplate: explanationFor,
  trap: "Складывает или делит длину волны и частоту вместо умножения.",
  coachLines: {
    correct: () =>
      "Да. Длина волны — путь за один период, значит скорость равна длине волны, умноженной на частоту.",
    wrong: (p, selected, correct) =>
      `Скорость = длина волны × частота: ${p.lambda} · ${p.freq} = ${correct} м/с, ` +
      `а не ${selected} м/с.`,
  },
  difficultyFor: (_p, answer) => (answer <= 100 ? 1 : answer <= 300 ? 2 : 3),
};
