import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function intervalValue(params: Params) {
  return params.markRange / (params.markCount - 1);
}

function upperMark(params: Params) {
  return params.lowerMark + params.markRange;
}

const distractors: DistractorRule[] = [
  {
    label: "отсчитываешь деления от нуля",
    compute: params => params.positionFromLower * intervalValue(params),
  },
  {
    label: "считаешь отметки вместо промежутков",
    compute: params => params.lowerMark + params.markRange * params.positionFromLower / params.markCount,
  },
  {
    label: "сдвигаешь мениск на одно деление",
    compute: params => params.lowerMark + (params.positionFromLower + 1) * intervalValue(params),
  },
];

export const graduatedScaleReadingBlueprint: TaskBlueprint = {
  id: "graduated-scale-reading",
  skill: "Отсчёт объёма по шкале мензурки",
  topic: "Измерения",
  group: "measurements",
  difficulty: 1,
  params: {
    lowerMark: { min: 10, max: 30, step: 10, unit: "мл" },
    markRange: { min: 20, max: 40, step: 10, unit: "мл" },
    markCount: { min: 5, max: 11, step: 2, unit: "штрихов" },
    positionFromLower: { min: 1, max: 9, step: 1, unit: "промежутков" },
  },
  formula: "N_{\\text{пр}}=N_{\\text{отм}}-1,\\quad c=\\frac{V_2-V_1}{N_{\\text{пр}}},\\quad V=V_1+kc",
  answerUnit: "мл",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: params => params.lowerMark + params.positionFromLower * intervalValue(params),
  distractors,
  constraints: [
    params => params.positionFromLower < params.markCount - 1,
    params => params.markRange % (params.markCount - 1) === 0,
  ],
  textTemplate: params =>
    `На шкале мензурки между отметками ${formatAnswerValue(params.lowerMark)} мл и ${formatAnswerValue(upperMark(params))} мл нанесено ${formatAnswerValue(params.markCount)} штрихов, включая крайние. Все промежутки равны. Нижняя точка мениска совпадает с делением №${formatAnswerValue(params.positionFromLower)} после отметки ${formatAnswerValue(params.lowerMark)} мл. Какой объём воды показывает мензурка? Ответ дай в миллилитрах.`,
  explanationTemplate: (params, answer) => {
    const divisionValue = intervalValue(params);
    const upper = upperMark(params);
    const intervalCount = params.markCount - 1;
    return `От ${formatMathValue(params.lowerMark)} мл до ${formatMathValue(upper)} мл нанесено ${formatMathValue(params.markCount)} штрихов, значит, между ними ${formatMathValue(intervalCount)} равных промежутков. Цена деления: $c=(${formatMathValue(upper)}-${formatMathValue(params.lowerMark)})/${formatMathValue(intervalCount)}=${formatMathValue(divisionValue)}$ мл. Деление №${formatMathValue(params.positionFromLower)} выше отметки ${formatMathValue(params.lowerMark)} мл: $V=${formatMathValue(params.lowerMark)}+${formatMathValue(params.positionFromLower)}·${formatMathValue(divisionValue)}=${formatMathValue(answer)}$ мл.`;
  },
  trap: "Сначала от общего числа штрихов отними один: так узнаешь число промежутков. Затем найди цену деления и отсчитай от подписанной отметки.",
  coachLines: {
    correct: () => "Верно: ты отсчитал от подписанной отметки и учёл только промежутки между штрихами.",
    wrong: (params, selected, correct) =>
      `Между ${formatAnswerValue(params.markCount)} штрихами ${formatAnswerValue(params.markCount - 1)} промежутков. Раздели разность значений на число промежутков, затем отсчитай от ${formatAnswerValue(params.lowerMark)} мл до деления №${formatAnswerValue(params.positionFromLower)}. Получается ${formatAnswerValue(correct)} мл; ты указал ${formatAnswerValue(selected)} мл.`,
  },
};
