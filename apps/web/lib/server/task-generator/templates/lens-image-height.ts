import { decimalsOf } from "../../../answer/numeric-answer.ts";
import { lensImageHeightDistractors } from "../distractors.ts";
import { lensImageHeight, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const objects = ["предмета", "свечи", "стрелки-указателя"];

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
  // Школьная запись: Γ = f/d = H/h (H — высота изображения, h — предмета).
  formula: "H=h\\,\\frac{f}{d}",
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
    `Собирающая линза даёт действительное изображение ${objectFor(p)} высотой ${p.h} см. Расстояние от предмета до линзы ${p.dObj} см, от линзы до изображения ${p.di} см. Найдите модуль высоты изображения.`,
  explanationTemplate: (p, answer) =>
    `Линейное увеличение линзы: $\\Gamma=\\frac{f}{d}=\\frac{${p.di}}{${p.dObj}}$. Высота изображения: $H=h\\,\\Gamma=${p.h}\\cdot\\frac{${p.di}}{${p.dObj}}=${formatMathValue(answer)}$ см. Само изображение перевёрнуто, но спрашивается модуль высоты.`,
  trap: "Увеличение — это f/d: расстояние до изображения дели на расстояние до предмета, а не наоборот.",
  coachLines: {
    correct: () => "Верно. Увеличение равно f/d, высота изображения — во столько же раз больше или меньше предмета.",
    wrong: (_p, selected, correct) =>
      `Проверь порядок деления в увеличении: Γ = f/d, поэтому высота ${formatAnswerValue(correct)} см, а не ${formatAnswerValue(selected)} см.`,
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
