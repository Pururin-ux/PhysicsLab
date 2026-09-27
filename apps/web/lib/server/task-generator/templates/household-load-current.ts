import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const MODEL_VOLTAGE = 220;
const MODEL_CURRENT_LIMIT = 10;

function totalPower(params: Params): number {
  return params.firstPowerW + params.secondPowerW;
}

function totalCurrent(params: Params): number {
  return totalPower(params) / MODEL_VOLTAGE;
}

function limitComparison(current: number): string {
  if (current < MODEL_CURRENT_LIMIT) {
    return `Это ниже заданного в задаче предела ${MODEL_CURRENT_LIMIT} А.`;
  }
  if (current === MODEL_CURRENT_LIMIT) {
    return `Это ровно заданный в задаче предел ${MODEL_CURRENT_LIMIT} А; превышения нет.`;
  }
  return `Это выше заданного в задаче предела ${MODEL_CURRENT_LIMIT} А.`;
}

const distractors: DistractorRule[] = [
  { label: "учитываешь мощность только первого прибора", compute: p => p.firstPowerW / MODEL_VOLTAGE },
  { label: "делишь суммарную мощность на 110 В вместо 220 В", compute: p => totalPower(p) / 110 },
  { label: "принимаешь суммарную мощность в ваттах за ток в амперах", compute: totalPower },
];

export const householdLoadCurrentBlueprint: TaskBlueprint = {
  id: "household-load-current",
  skill: "Общий ток двух параллельных приборов",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    firstPowerW: { min: 660, max: 1100, step: 220, unit: "Вт" },
    secondPowerW: { min: 1100, max: 1980, step: 220, unit: "Вт" },
  },
  formula: "P_{\\Sigma}=P_1+P_2,\\quad I_{\\Sigma}=\\frac{P_{\\Sigma}}{U}",
  answerUnit: "А",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: totalCurrent,
  distractors,
  textTemplate: params =>
    `Два нагревательных прибора мощностью ${formatAnswerValue(params.firstPowerW)} Вт и ${formatAnswerValue(params.secondPowerW)} Вт одновременно подключены параллельно к сети 220 В. Каков ток в общем проводе? В ответе укажи только ток в амперах. После проверки сравним его с условным пределом 10 А.`,
  explanationTemplate: (params, answer) =>
    `При параллельном подключении оба прибора получают 220 В, а токи в общем проводе складываются. Сначала сложим мощности: $P_{\\Sigma}=${formatMathValue(params.firstPowerW)}+${formatMathValue(params.secondPowerW)}=${formatMathValue(totalPower(params))}\\,\\text{Вт}$. Затем $I_{\\Sigma}=P_{\\Sigma}/U=${formatMathValue(totalPower(params))}/220=${formatMathValue(answer)}\\,\\text{А}$. ${limitComparison(answer)}`,
  trap: "Сложи мощности одновременно работающих параллельных приборов и раздели сумму на 220 В. Сравни полученный ток с условным пределом задачи.",
  coachLines: {
    correct: params => `Верно: общий ток равен ${formatAnswerValue(totalCurrent(params))} А. ${limitComparison(totalCurrent(params))}`,
    wrong: (params, selected, correct) =>
      `Сначала сложи мощности приборов: ${formatAnswerValue(totalPower(params))} Вт. Затем раздели на 220 В: получится ${formatAnswerValue(correct)} А, а не ${formatAnswerValue(selected)} А. ${limitComparison(correct)}`,
  },
};
