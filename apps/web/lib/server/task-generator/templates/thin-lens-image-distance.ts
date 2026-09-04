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
  // Обозначения школьных учебников РБ: d — расстояние от предмета до линзы,
  // f — от линзы до изображения (а не англ. d_o/d_i).
  formula: "\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}",
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
    `Из формулы тонкой линзы $\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}$ выражаем расстояние до изображения: $f=\\frac{F d}{d-F}=\\frac{${p.F}\\cdot${p.dObj}}{${p.dObj}-${p.F}}=${formatMathValue(answer)}$ см.`,
  trap: "Сначала вырази f из формулы линзы: в знаменателе стоит разность d − F, а не сумма.",
  coachLines: {
    correct: () => "Верно. Предмет дальше фокуса — изображение действительное, по формуле линзы.",
    wrong: (_p, selected, correct) =>
      `Проверь знаменатель: f = F·d/(d − F) = ${formatAnswerValue(correct)} см, а не ${formatAnswerValue(selected)} см.`,
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
