import { decimalsOf } from "../../../answer/numeric-answer.ts";
import { lensImageHeightDistractors } from "../distractors.ts";
import { lensImageHeight, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const objects = ["предмет", "свеча", "стрелка-указатель"];

function objectFor(p: Params): string {
  return objects[variantIndex(p, objects.length)];
}

// Диаграмма честная: фокусное расстояние восстанавливается из формулы линзы
// F = d_o·d_i/(d_o + d_i) — при любых положительных d_o, d_i изображение
// действительное и перевёрнутое, что и рисует solution-состояние.
function focalFor(p: Params): number {
  return (p.dObj * p.di) / (p.dObj + p.di);
}

export const lensImageHeightBlueprint: TaskBlueprint = {
  id: "lens-image-height",
  skill: "Увеличение линзы",
  topic: "Оптика",
  group: "optics",
  difficulty: 2,
  params: {
    h: { min: 2, max: 6, step: 1, unit: "см" },
    dObj: { min: 20, max: 40, step: 10, unit: "см" },
    di: { min: 10, max: 80, step: 10, unit: "см" },
  },
  // Явные индексы не дают спутать расстояние до предмета с расстоянием
  // до изображения: |Γ| = d_i/d_o = H/h.
  formula: "H=h\\,\\frac{d_i}{d_o}",
  answerUnit: "см",
  answerKind: "positive",
  diagram: (p) => ({
    kind: "optics",
    spec: {
      scene: "thin_lens",
      lensType: "converging",
      focalLength: focalFor(p),
      objectDistance: p.dObj,
      objectHeight: p.h,
      imageDistance: p.di,
      imageHeight: lensImageHeight(p),
      unit: "см",
    },
  }),
  solver: lensImageHeight,
  distractors: lensImageHeightDistractors,
  textTemplate: (p) =>
    `Перед собирающей линзой находится ${objectFor(p)} высотой ${p.h} см. Расстояние от предмета до линзы ${p.dObj} см. Линза создаёт действительное изображение на расстоянии ${p.di} см от неё. Найдите модуль высоты изображения.`,
  explanationTemplate: (p, answer) =>
    `Модуль линейного увеличения: $|\\Gamma|=\\frac{d_i}{d_o}=\\frac{${p.di}}{${p.dObj}}$. Поэтому $H=h|\\Gamma|=${p.h}\\cdot\\frac{${p.di}}{${p.dObj}}=${formatMathValue(answer)}$ см. Действительное изображение перевёрнуто, но требуется модуль его высоты.`,
  trap: "В |Γ| = dᵢ/dₒ расстояние линза—изображение дели на расстояние предмет—линза, а не наоборот.",
  coachLines: {
    correct: () => "Верно. |Γ| = dᵢ/dₒ, а модуль высоты изображения равен h|Γ|.",
    wrong: (_p, selected, correct) =>
      `Проверь порядок расстояний: |Γ| = dᵢ/dₒ, поэтому модуль высоты ${formatAnswerValue(correct)} см, а не ${formatAnswerValue(selected)} см.`,
  },
  constraints: [
    // Изображение не совпадает с предметом (иначе «высота не меняется»
    // перестаёт быть ошибкой) — и валидатор бы отбросил дубликат.
    (p) => p.di !== p.dObj,
    // Высота изображения «чистая» и разумная для карточки.
    (p) => {
      const answer = lensImageHeight(p);
      return decimalsOf(answer) <= 1 && answer <= 24;
    },
  ],
  variantCount: objects.length,
};
