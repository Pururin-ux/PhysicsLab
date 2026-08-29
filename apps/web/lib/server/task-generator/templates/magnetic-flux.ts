import { magneticFluxDistractors } from "../distractors.ts";
import { magneticFlux } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Плоскость рамки перпендикулярна линиям индукции: Ф = BS без косинуса.
function explanationFor(p: Params, answer: number): string {
  return (
    `Рамка перпендикулярна полю, поэтому линии проходят через всю площадь: ` +
    `$\\Phi = BS = ${formatMathValue(p.B)} \\cdot ${formatMathValue(p.S)} = ` +
    `${formatMathValue(answer)}$ Вб.`
  );
}

export const magneticFluxBlueprint: TaskBlueprint = {
  id: "magnetic-flux",
  skill: "Магнитный поток",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    B: { min: 0.2, max: 2, step: 0.2, unit: "Тл" },
    S: { min: 0.2, max: 0.9, step: 0.1, unit: "м²" },
  },
  formula: "\\Phi=BS\\cos\\alpha",
  answerUnit: "Вб",
  answerKind: "positive",
  solver: magneticFlux,
  distractors: magneticFluxDistractors,
  textTemplate: (p) =>
    `Плоская рамка площадью ${formatAnswerValue(p.S)} м² расположена перпендикулярно линиям ` +
    `индукции однородного магнитного поля с индукцией ${formatAnswerValue(p.B)} Тл. ` +
    `Найдите магнитный поток через рамку.`,
  explanationTemplate: explanationFor,
  trap: "Путает, когда поток максимален: считает по площади, не перпендикулярной полю.",
  coachLines: {
    correct: () =>
      "Да. Когда рамка перпендикулярна линиям индукции, поток максимален: Ф = BS.",
    wrong: (p, selected, correct) =>
      `Поток — это произведение индукции на площадь, через которую проходят линии: ` +
      `${formatAnswerValue(p.B)} · ${formatAnswerValue(p.S)} = ${formatAnswerValue(correct)} Вб, ` +
      `а не ${formatAnswerValue(selected)} Вб.`,
  },
  difficultyFor: (_p, answer) => (decimalPlaces(answer) <= 1 ? 1 : 2),
};
