import { snellIndexRatioDistractors } from "../distractors.ts";
import { snellIndexRatio, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Кураторские пары углов: переход в оптически более плотную среду (i > r),
// отношение синусов даёт «чистый» ответ в два знака. Пары с i + r = 90°
// исключены: там дистрактор с косинусами совпадает с перевёрнутым отношением
// синусов, и валидатор всё равно отбросил бы такой вариант.
const anglePairs: ReadonlyArray<readonly [number, number]> = [
  [45, 30],
  [60, 45],
  [53, 30],
  [37, 30],
  [50, 30],
  [64, 40],
  [40, 30],
  [50, 35],
  [55, 40],
  [60, 40],
  [64, 45],
];

function isCuratedPair(p: Params): boolean {
  return anglePairs.some(([i, r]) => i === p.i && r === p.r);
}

const stories = [
  "Луч света переходит из воздуха в прозрачную жидкость.",
  "Луч света входит из воздуха в прозрачную пластину.",
];

function storyFor(p: Params): string {
  return stories[variantIndex(p, stories.length)];
}

export const snellIndexRatioBlueprint: TaskBlueprint = {
  id: "snell-index-ratio",
  skill: "Закон преломления",
  topic: "Оптика",
  group: "optics",
  difficulty: 3,
  params: {
    i: { min: 37, max: 64, step: 1, unit: "°" },
    r: { min: 30, max: 45, step: 5, unit: "°" },
  },
  // Школьная запись РБ: α — угол падения, γ — угол преломления.
  formula: "\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}",
  answerUnit: "",
  answerKind: "positive",
  diagram: (p) => ({
    kind: "optics",
    spec: {
      scene: "refraction",
      incidenceAngleDeg: p.i,
      refractionAngleDeg: p.r,
      medium1Label: "среда 1 (воздух)",
      medium2Label: "среда 2",
      // Оба угла даны по условию — преломлённый луч виден сразу:
      // ответ задачи — отношение показателей, а не направление луча.
      refractedGiven: true,
    },
  }),
  solver: snellIndexRatio,
  distractors: snellIndexRatioDistractors,
  textTemplate: (p) =>
    `${storyFor(p)} Угол падения равен ${p.i}°, угол преломления равен ${p.r}° (оба отсчитаны от нормали). Во сколько раз показатель преломления второй среды больше показателя преломления первой? Ответ округлён до двух знаков.`,
  explanationTemplate: (p, answer) =>
    `По закону преломления $\\frac{n_2}{n_1}=\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{\\sin ${p.i}^\\circ}{\\sin ${p.r}^\\circ}=${formatMathValue(answer)}$. Луч отклонился к нормали ($\\gamma<\\alpha$), значит вторая среда оптически плотнее и отношение больше единицы.`,
  trap: "В законе преломления отношение синусов углов, а не самих углов; оба угла — от нормали.",
  coachLines: {
    correct: () => "Верно. Отношение показателей равно отношению синусов углов, отсчитанных от нормали.",
    wrong: (_p, selected, correct) =>
      `Проверь, что делишь синусы и в правильном порядке: sin α / sin γ = ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [isCuratedPair, (p) => p.r > 0 && p.r < p.i && p.i < 90],
  variantCount: stories.length,
};
