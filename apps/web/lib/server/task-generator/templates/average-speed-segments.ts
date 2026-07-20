import { averageSpeedSegmentsDistractors } from "../distractors.ts";
import { averageSpeedSegments, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const stories = [
  "Автомобиль",
  "Велосипедист",
  "Поезд",
];

function subjectFor(p: Params): string {
  return stories[variantIndex(p, stories.length)];
}

// ЦТ/ЦЭ принимает в бланк только целое число, поэтому параметры подбираются
// так, чтобы весь путь делился на всё время нацело.
function answerIsWholeNumber(p: Params): boolean {
  const answer = averageSpeedSegments(p);
  return Number.isFinite(answer) && Math.abs(answer - Math.round(answer)) < 1e-9;
}

export const averageSpeedSegmentsBlueprint: TaskBlueprint = {
  id: "average-speed-segments",
  skill: "Средняя скорость на участках",
  topic: "Кинематика",
  group: "kinematics",
  // Два участка и числовой ввод — базово «2»; ответы целые (формат ЦТ),
  // поэтому прежней «3 за дробную точность» больше нет.
  difficulty: 2,
  params: {
    v1: { min: 2, max: 18, step: 2, unit: "м/с" },
    t1: { min: 2, max: 12, step: 2, unit: "с" },
    v2: { min: 4, max: 20, step: 2, unit: "м/с" },
    t2: { min: 3, max: 15, step: 3, unit: "с" },
  },
  formula: "v_{\\text{ср}}=\\frac{s_1+s_2}{t_1+t_2}",
  answerUnit: "м/с",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: averageSpeedSegments,
  distractors: averageSpeedSegmentsDistractors,
  textTemplate: (p) =>
    `${subjectFor(p)} двигался ${p.t1} с со скоростью ${p.v1} м/с, затем еще ${p.t2} с со скоростью ${p.v2} м/с. Найдите среднюю скорость за все время движения.`,
  explanationTemplate: (p, answer) =>
    `Сначала найдём весь путь: $s_1=${p.v1}\\cdot${p.t1}=${p.v1 * p.t1}$ м, $s_2=${p.v2}\\cdot${p.t2}=${p.v2 * p.t2}$ м. Тогда $v_{\\text{ср}}=\\frac{s_1+s_2}{t_1+t_2}=\\frac{${p.v1 * p.t1}+${p.v2 * p.t2}}{${p.t1}+${p.t2}}=${formatMathValue(answer)}$ м/с.`,
  trap: "Средняя скорость считается как весь путь, деленный на все время, а не как среднее арифметическое скоростей.",
  coachLines: {
    correct: () =>
      "Верно. Для средней скорости нужны весь путь и все время движения.",
    wrong: (_p, selected, correct) =>
      `Проверь, не усреднил ли ты скорости напрямую. Средняя скорость равна всему пути, деленному на все время: ${formatAnswerValue(correct)} м/с, а не ${formatAnswerValue(selected)} м/с.`,
  },
  constraints: [
    (p) => p.v1 !== p.v2,
    (p) => p.t1 !== p.t2,
    answerIsWholeNumber,
  ],
  variantCount: stories.length,
};
