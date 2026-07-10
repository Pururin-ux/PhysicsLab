import { thinLensImageDistanceDistractors } from "../distractors.ts";
import { thinLensImageDistance, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const objects = ["предмет", "свечу", "небольшую фигурку"];

function objectFor(p: Params): string {
  return objects[variantIndex(p, objects.length)];
}

export const thinLensImageDistanceBlueprint: TaskBlueprint = {
  id: "thin-lens-image-distance",
  skill: "Формула тонкой линзы",
  topic: "Оптика",
  group: "optics",
  difficulty: 2,
  params: {
    F: { min: 5, max: 25, step: 5, unit: "см" },
    dObj: { min: 10, max: 60, step: 5, unit: "см" },
  },
  formula: "\\frac{1}{F}=\\frac{1}{d_o}+\\frac{1}{d_i}",
  answerUnit: "см",
  answerKind: "positive",
  answerFormat: "numeric_input",
  diagram: (p) => ({
    kind: "optics",
    spec: {
      scene: "thin_lens",
      lensType: "converging",
      focalLength: p.F,
      objectDistance: p.dObj,
      imageDistance: thinLensImageDistance(p),
      unit: "см",
    },
  }),
  solver: thinLensImageDistance,
  distractors: thinLensImageDistanceDistractors,
  textTemplate: (p) =>
    `Перед собирающей тонкой линзой с фокусным расстоянием ${p.F} см на расстоянии ${p.dObj} см от неё поставили ${objectFor(p)}. На каком расстоянии от линзы получится действительное изображение?`,
  explanationTemplate: (p, answer) =>
    `Из формулы тонкой линзы $\\frac{1}{F}=\\frac{1}{d_o}+\\frac{1}{d_i}$ выражаем расстояние до изображения: $d_i=\\frac{F d_o}{d_o-F}=\\frac{${p.F}\\cdot${p.dObj}}{${p.dObj}-${p.F}}=${formatMathValue(answer)}$ см.`,
  trap: "Сначала вырази d_i из формулы линзы: в знаменателе стоит разность d_o − F, а не сумма.",
  coachLines: {
    correct: () => "Верно. Предмет дальше фокуса — изображение действительное, по формуле линзы.",
    wrong: (_p, selected, correct) =>
      `Проверь знаменатель: d_i = F·d_o/(d_o − F) = ${formatAnswerValue(correct)} см, а не ${formatAnswerValue(selected)} см.`,
  },
  constraints: [
    // Действительное изображение: предмет строго дальше фокуса (не в фокусе).
    (p) => p.dObj > p.F,
    // Ответ «чистый» — целый или половинный, и влезает в диаграмму.
    (p) => {
      const answer = thinLensImageDistance(p);
      return Math.abs(answer * 2 - Math.round(answer * 2)) < 1e-9 && answer <= 90;
    },
  ],
  variantCount: objects.length,
};
