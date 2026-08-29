import { echoDistanceDistractors } from "../distractors.ts";
import { ECHO_SPEED_BY_VARIANT, echoDistance, echoSpeed, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Вариант 0 — эхо в воздухе, вариант 1 — эхолот в воде.
function isWaterVariant(p: Params): boolean {
  return variantIndex(p, ECHO_SPEED_BY_VARIANT.length) === 1;
}

function explanationFor(p: Params, answer: number): string {
  const speed = echoSpeed(p);
  return (
    `Звук идёт до препятствия и обратно, поэтому его путь равен $2s$. ` +
    `$s = \\frac{v t}{2} = \\frac{${speed} \\cdot ${formatMathValue(p.t)}}{2} = ` +
    `${formatMathValue(answer)}$ м.`
  );
}

export const echoDistanceBlueprint: TaskBlueprint = {
  id: "echo-distance",
  skill: "Расстояние по эху",
  topic: "Колебания и волны",
  group: "oscillations",
  difficulty: 2,
  params: {
    t: { min: 0.2, max: 4, step: 0.1, unit: "с" },
  },
  formula: "s=\\frac{vt}{2}",
  answerUnit: "м",
  answerKind: "positive",
  solver: echoDistance,
  distractors: echoDistanceDistractors,
  textTemplate: (p) =>
    isWaterVariant(p)
      ? `Эхолот катера принял сигнал, отражённый от дна, через ${formatAnswerValue(p.t)} с после посылки. ` +
        `Скорость звука в воде 1500 м/с. Найдите глубину под катером.`
      : `Человек, стоя у скалы, хлопнул в ладоши и через ${formatAnswerValue(p.t)} с услышал эхо. ` +
        `Скорость звука в воздухе 340 м/с. Найдите расстояние от человека до скалы.`,
  explanationTemplate: explanationFor,
  trap: "Забывает, что звук проходит расстояние дважды: туда и обратно.",
  coachLines: {
    correct: (p) =>
      `Да. ${isWaterVariant(p) ? "Сигнал" : "Звук"} прошёл путь туда и обратно, ` +
      `поэтому измеренное время соответствует удвоенному расстоянию.`,
    wrong: (p, selected, correct) =>
      `Путь ${isWaterVariant(p) ? "сигнала" : "звука"} = 2s. Сначала найди путь ` +
      `${echoSpeed(p)} · ${formatAnswerValue(p.t)} м, затем раздели пополам: ` +
      `получится ${formatAnswerValue(correct)} м, а не ${formatAnswerValue(selected)} м.`,
  },
  difficultyFor: (p) => (isWaterVariant(p) ? 2 : 2),
  variantCount: 2,
};
