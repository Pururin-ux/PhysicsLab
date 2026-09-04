import { heatAmountDistractors } from "../distractors.ts";
import { WATER_SPECIFIC_HEAT_KJ, heatAmount } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const waterContexts = [
  "воду в электрическом чайнике",
  "воду в кастрюле на плите",
  "воду в баке водонагревателя",
  "воду в лабораторном калориметре",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return waterContexts[variant % waterContexts.length];
}

export const heatAmountBlueprint: TaskBlueprint = {
  id: "heat-amount",
  skill: "Количество теплоты при нагревании",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    m: { min: 0.5, max: 5, step: 0.5, unit: "кг" },
    dT: { min: 5, max: 40, step: 5, unit: "°C" },
  },
  formula: "Q = cm\\Delta T",
  answerUnit: "кДж",
  answerKind: "positive",
  solver: heatAmount,
  distractors: heatAmountDistractors,
  // Условие показывается обычным текстом (QuestionCard не прогоняет его через
  // MathText), поэтому здесь не должно быть $…$ — иначе доллары видны ученику.
  textTemplate: (p) =>
    `Нужно нагреть ${contextFor(p)} массой ${formatAnswerValue(p.m)} кг на ${p.dT} °C. Удельная теплоёмкость воды c = 4200 Дж/(кг·°C). Считайте, что тепло получает только вода: потерь и нагрева сосуда нет. Какое количество теплоты получит вода?`,
  explanationTemplate: (p, answer) =>
    `При постоянной теплоёмкости и без фазового перехода $Q = cm\\Delta T = ${formatMathValue(WATER_SPECIFIC_HEAT_KJ)} \\cdot ${formatMathValue(p.m)} \\cdot ${p.dT} = ${formatMathValue(answer)}$ кДж. Потерями и нагревом сосуда по условию пренебрегаем.`,
  trap: "В $Q=cm\\Delta T$ нужны все три множителя. Эта формула даёт теплоту воды; потери и теплоёмкость сосуда должны быть исключены условием.",
  coachLines: {
    correct: () =>
      "Да. При постоянной c и без потерь $Q = cm\\Delta T$: теплоёмкость, масса и изменение температуры.",
    wrong: (_p, selected, correct) =>
      `Проверь, что учтены все три множителя: $c$, $m$ и $\\Delta T$. Получается ${formatAnswerValue(correct)} кДж, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: waterContexts.length,
};
