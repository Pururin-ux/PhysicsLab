import { emfInductionDistractors } from "../distractors.ts";
import { inductionEmf } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Рамка полностью выходит из поля: поток меняется от BS до нуля, поэтому
// средняя ЭДС индукции равна ΔΦ/Δt = BS/t.
function explanationFor(p: Params, answer: number): string {
  return (
    `Поток меняется от $BS$ до нуля, значит $\\Delta \\Phi = BS$. ` +
    `По закону электромагнитной индукции $\\mathcal{E} = \\frac{\\Delta \\Phi}{\\Delta t} = ` +
    `\\frac{${formatMathValue(p.B)} \\cdot ${formatMathValue(p.S)}}{${formatMathValue(p.t)}} = ` +
    `${formatMathValue(answer)}$ В. Время стоит в знаменателе: чем быстрее ` +
    `убрать рамку, тем больше ЭДС.`
  );
}

export const emfInductionBlueprint: TaskBlueprint = {
  id: "emf-induction",
  skill: "ЭДС индукции",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 3,
  params: {
    B: { min: 0.2, max: 2, step: 0.2, unit: "Тл" },
    S: { min: 0.1, max: 0.5, step: 0.1, unit: "м²" },
    t: { min: 0.2, max: 1, step: 0.1, unit: "с" },
  },
  formula: "\\mathcal{E}=\\frac{\\Delta\\Phi}{\\Delta t}",
  answerUnit: "В",
  answerKind: "positive",
  solver: inductionEmf,
  distractors: emfInductionDistractors,
  textTemplate: (p) =>
    `Рамку площадью ${formatAnswerValue(p.S)} м² равномерно выдвигают из однородного магнитного поля ` +
    `индукцией ${formatAnswerValue(p.B)} Тл. Рамка полностью выходит из поля за ${formatAnswerValue(p.t)} с. ` +
    `Найдите среднее значение ЭДС индукции в рамке.`,
  explanationTemplate: explanationFor,
  trap: "Умножает поток на время вместо деления или берёт сам поток вместо скорости его изменения.",
  coachLines: {
    correct: () =>
      "Да. ЭДС индукции равна скорости изменения потока: изменение потока делим на время.",
    wrong: (p, selected, correct) =>
      `Сначала найди изменение потока: $\\Delta \\Phi = BS = ${formatMathValue(p.B)} \\cdot ${formatMathValue(p.S)}$. ` +
      `Затем раздели на время ${formatAnswerValue(p.t)} с: получится ${formatAnswerValue(correct)} В, ` +
      `а не ${formatAnswerValue(selected)} В.`,
  },
  constraints: [(p) => decimalPlaces(inductionEmf(p)) <= 2],
  difficultyFor: (_p, answer) => (decimalPlaces(answer) <= 1 ? 2 : 3),
};
