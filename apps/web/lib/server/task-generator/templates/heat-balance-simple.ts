import { heatBalanceSimpleDistractors } from "../distractors.ts";
import { heatBalanceFinalTemperature } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function answerIsClean(p: Params): boolean {
  const answer = heatBalanceFinalTemperature(p);
  return answer > p.tempCold && answer < p.tempHot && Math.abs(answer - Math.round(answer)) < 1e-9;
}

export const heatBalanceSimpleBlueprint: TaskBlueprint = {
  id: "heat-balance-simple",
  skill: "Тепловой баланс при смешивании",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    mHot: { min: 1, max: 5, step: 1, unit: "кг" },
    tempHot: { min: 50, max: 90, step: 5, unit: "°C" },
    mCold: { min: 1, max: 5, step: 1, unit: "кг" },
    tempCold: { min: 10, max: 30, step: 5, unit: "°C" },
  },
  formula: "m_1c(T_1-T)=m_2c(T-T_2)",
  answerUnit: "°C",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: heatBalanceFinalTemperature,
  distractors: heatBalanceSimpleDistractors,
  textTemplate: (p) =>
    `Смешали ${p.mHot} кг воды при температуре ${p.tempHot} °C и ${p.mCold} кг воды при температуре ${p.tempCold} °C. Потерями тепла пренебречь. Найдите установившуюся температуру смеси.`,
  explanationTemplate: (p, answer) =>
    `Для одинакового вещества теплоёмкость сокращается: $m_1(T_1-T)=m_2(T-T_2)$. Поэтому $T=\\frac{m_1T_1+m_2T_2}{m_1+m_2}=\\frac{${p.mHot}\\cdot${p.tempHot}+${p.mCold}\\cdot${p.tempCold}}{${p.mHot}+${p.mCold}}=${formatMathValue(answer)}^\\circ C$.`,
  trap: "Температуру смеси нельзя находить простым средним, если массы воды разные.",
  coachLines: {
    correct: () =>
      "Да. Горячая вода отдает столько тепла, сколько получает холодная.",
    wrong: (_p, selected, correct) =>
      `Учти массы обеих порций воды. Итоговая температура ${formatAnswerValue(correct)} °C, а не ${formatAnswerValue(selected)} °C.`,
  },
  constraints: [answerIsClean, (p) => p.mHot !== p.mCold],
};
