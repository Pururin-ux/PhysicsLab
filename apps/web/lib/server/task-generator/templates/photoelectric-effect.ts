import { photoelectricEffectDistractors } from "../distractors.ts";
import { photoelectricAnswer } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Уравнение Эйнштейна для фотоэффекта в электронвольтах: hν = A + E_к.
// Искомая величина — максимальная кинетическая энергия электрона, поэтому
// обо́их данных (энергия фотона и работа выхода) хватает для единственного
// варианта задачи: третий параметр только плодил бы одинаковые тексты.
function explanationFor(p: Params, answer: number): string {
  return (
    `По уравнению Эйнштейна $h\\\\nu = A + E_{\\\\text{к}}$, откуда ` +
    `$E_{\\\\text{к}} = h\\\\nu - A = ${formatMathValue(p.ePhoton)} - ${formatMathValue(p.aWork)} = ` +
    `${formatMathValue(answer)}$ эВ. Работа выхода вычитается, а не прибавляется.`
  );
}

export const photoelectricEffectBlueprint: TaskBlueprint = {
  id: "photoelectric-effect",
  skill: "Уравнение фотоэффекта",
  topic: "Квантовая физика",
  group: "quantum",
  difficulty: 2,
  params: {
    ePhoton: { min: 2, max: 8, step: 0.5, unit: "эВ" },
    aWork: { min: 1, max: 5, step: 0.5, unit: "эВ" },
  },
  formula: "h\\nu=A+E_{\\text{к}}",
  answerUnit: "эВ",
  answerKind: "positive",
  solver: photoelectricAnswer,
  distractors: photoelectricEffectDistractors,
  textTemplate: (p) =>
    `Свет с энергией фотона ${formatAnswerValue(p.ePhoton)} эВ выбивает электроны из металла, ` +
    `работа выхода которого ${formatAnswerValue(p.aWork)} эВ. Найдите максимальную кинетическую ` +
    `энергию вылетевших электронов.`,
  explanationTemplate: explanationFor,
  trap: "Складывает энергии вместо вычитания или называет энергию фотона вместо искомой величины.",
  coachLines: {
    correct: () =>
      "Да. Энергия фотона расходуется на работу выхода и на кинетическую энергию электрона.",
    wrong: (p, selected, correct) =>
      `Запиши $h\\\\nu = A + E_{\\\\text{к}}$ и вырази кинетическую энергию. ` +
      `Ответ ${formatAnswerValue(correct)} эВ, а не ${formatAnswerValue(selected)} эВ.`,
  },
  difficultyFor: (_p, answer) => (Number.isInteger(answer) ? 2 : 3),
};
