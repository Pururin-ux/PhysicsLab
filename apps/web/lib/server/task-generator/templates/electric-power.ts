import { electricPowerDistractors } from "../distractors.ts";
import { electricPower, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function voltage(p: Params): number {
  return p.I * p.R;
}

function textFor(p: Params): string {
  const U = voltage(p);

  switch (variantIndex(p, 3)) {
    case 1:
      return `Через резистор течет ток ${p.I} А, напряжение на резисторе ${U} В. Найдите мощность тока на этом участке цепи.`;
    case 2:
      return `На резисторе сопротивлением ${p.R} Ом поддерживают напряжение ${U} В. Найдите мощность, выделяющуюся на резисторе.`;
    default:
      return `Через резистор сопротивлением ${p.R} Ом течет ток ${p.I} А. Найдите мощность тока на резисторе.`;
  }
}

export const electricPowerBlueprint: TaskBlueprint = {
  id: "electric-power",
  skill: "Мощность электрического тока",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    I: { min: 2, max: 10, step: 1, unit: "А" },
    R: { min: 2, max: 30, step: 2, unit: "Ом" },
  },
  formula: "P=UI=I^2R=\\frac{U^2}{R}",
  answerUnit: "Вт",
  answerKind: "positive",
  solver: electricPower,
  distractors: electricPowerDistractors,
  textTemplate: textFor,
  explanationTemplate: (p, answer) => {
    const U = voltage(p);

    return `Можно использовать $P=I^2R$ или $P=UI$. Здесь $U=IR=${p.I}\\cdot${p.R}=${U}$ В, поэтому $P=${p.I}^2\\cdot${p.R}=${formatMathValue(answer)}$ Вт.`;
  },
  trap: "Не останавливайся на напряжении U=IR: мощность — это P=UI или P=I²R.",
  coachLines: {
    correct: () =>
      "Да. Мощность показывает, сколько энергии участок цепи получает за секунду.",
    wrong: (_p, selected, correct) =>
      `Проверь, не нашел ли ты только напряжение. Мощность равна ${formatAnswerValue(correct)} Вт, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [(p) => p.I !== p.R],
  variantCount: 3,
};
