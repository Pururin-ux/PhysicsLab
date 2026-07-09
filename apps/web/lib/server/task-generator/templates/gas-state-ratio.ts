import { gasStateRatioDistractors } from "../distractors.ts";
import { gasStateRatioPressure } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function answerIsClean(p: Params): boolean {
  const answer = gasStateRatioPressure(p);
  return answer > 20 && answer <= 600 && Math.abs(answer - Math.round(answer)) < 1e-9;
}

export const gasStateRatioBlueprint: TaskBlueprint = {
  id: "gas-state-ratio",
  skill: "Связь параметров газа",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    p1: { min: 80, max: 240, step: 20, unit: "кПа" },
    V1: { min: 2, max: 10, step: 1, unit: "л" },
    V2: { min: 2, max: 10, step: 1, unit: "л" },
    temp1C: { min: 27, max: 327, step: 100, unit: "°C" },
    temp2C: { min: 27, max: 327, step: 100, unit: "°C" },
  },
  formula: "\\frac{p_1V_1}{T_1}=\\frac{p_2V_2}{T_2}",
  answerUnit: "кПа",
  answerKind: "positive",
  solver: gasStateRatioPressure,
  distractors: gasStateRatioDistractors,
  textTemplate: (p) =>
    `Идеальный газ имел давление ${p.p1} кПа, объем ${p.V1} л и температуру ${p.temp1C} °C. После изменения состояния объем стал ${p.V2} л, температура ${p.temp2C} °C. Найдите новое давление газа.`,
  explanationTemplate: (p, answer) => {
    const t1 = p.temp1C + 273;
    const t2 = p.temp2C + 273;

    return `Температуру переводим в кельвины: $T_1=${t1}$ К, $T_2=${t2}$ К. Из $\\frac{p_1V_1}{T_1}=\\frac{p_2V_2}{T_2}$ получаем $p_2=\\frac{${p.p1}\\cdot${p.V1}\\cdot${t2}}{${t1}\\cdot${p.V2}}=${formatMathValue(answer)}$ кПа.`;
  },
  trap: "В газовых уравнениях температуру подставляют в кельвинах, а объемное отношение нельзя переворачивать.",
  coachLines: {
    correct: () =>
      "Верно. Для одной и той же массы газа работает отношение pV/T.",
    wrong: (_p, selected, correct) =>
      `Проверь перевод температуры в Кельвины и отношение объемов. Получается ${formatAnswerValue(correct)} кПа, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [
    answerIsClean,
    (p) => p.V1 !== p.V2,
    (p) => p.temp1C !== p.temp2C,
  ],
};
