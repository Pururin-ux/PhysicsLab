import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function emfMagnitude(params: Params): number {
  // 1 мГн · 1 А / 1 мс = 1 В: both metric prefixes cancel.
  return params.inductanceMilliHenries * params.currentChangeAmperes / params.durationMilliseconds;
}

const distractors: DistractorRule[] = [
  {
    label: "не учитываешь индуктивность катушки",
    compute: params => params.currentChangeAmperes / params.durationMilliseconds,
  },
  {
    label: "не делишь изменение тока на время",
    compute: params => params.inductanceMilliHenries * params.currentChangeAmperes,
  },
  {
    label: "переводишь миллисекунды, но оставляешь индуктивность в миллигенри",
    compute: params => emfMagnitude(params) * 1000,
  },
];

export const selfInductionEmfBlueprint: TaskBlueprint = {
  id: "self-induction-emf",
  skill: "Модуль ЭДС самоиндукции при изменении тока",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    inductanceMilliHenries: { min: 20, max: 100, step: 20, unit: "мГн" },
    currentChangeAmperes: { min: 1, max: 8, step: 1, unit: "А" },
    durationMilliseconds: { min: 10, max: 20, step: 10, unit: "мс" },
  },
  formula: "|\\mathcal E_{\\text{си}}|=L\\frac{|\\Delta I|}{\\Delta t}",
  answerUnit: "В",
  answerKind: "magnitude",
  answerFormat: "numeric_input",
  solver: emfMagnitude,
  distractors,
  textTemplate: params =>
    `Индуктивность катушки ${params.inductanceMilliHenries} мГн. Сила тока в ней равномерно выросла на ${params.currentChangeAmperes} А за ${params.durationMilliseconds} мс; индуктивность не менялась. Найди модуль средней ЭДС самоиндукции в вольтах.`,
  explanationTemplate: (params, answer) =>
    `Ток растёт, поэтому ЭДС самоиндукции направлена против выбранного положительного тока. Для модуля используем $|\\mathcal E_{\\text{си}}|=L\\frac{|\\Delta I|}{\\Delta t}$. $L=${formatMathValue(params.inductanceMilliHenries)}\\,\\text{мГн}=${formatMathValue(params.inductanceMilliHenries)}\\cdot10^{-3}\\,\\text{Гн}$, $\\Delta t=${formatMathValue(params.durationMilliseconds)}\\,\\text{мс}=${formatMathValue(params.durationMilliseconds)}\\cdot10^{-3}\\,\\text{с}$. Тогда $|\\mathcal E_{\\text{си}}|=\\frac{${formatMathValue(params.inductanceMilliHenries)}\\cdot10^{-3}\\cdot${formatMathValue(params.currentChangeAmperes)}}{${formatMathValue(params.durationMilliseconds)}\\cdot10^{-3}}=${formatMathValue(answer)}\\,\\text{В}$.`,
  trap: "Самоиндукция связана с изменением собственного тока катушки. Для мГн и мс множители 10⁻³ сокращаются; большее время при том же изменении тока даёт меньший модуль ЭДС.",
  coachLines: {
    correct: () => "Верно. Катушка противодействует росту тока, а модуль средней ЭДС зависит от скорости этого роста.",
    wrong: (params, selected, correct) =>
      `Раздели ${params.inductanceMilliHenries} мГн × ${params.currentChangeAmperes} А на ${params.durationMilliseconds} мс: получится ${formatAnswerValue(correct)} В, а не ${formatAnswerValue(selected)} В. При переводе мГн и мс множители 10⁻³ сокращаются.`,
  },
};
