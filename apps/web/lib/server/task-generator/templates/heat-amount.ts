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
  textTemplate: (p) =>
    `Нужно нагреть ${contextFor(p)} массой ${formatAnswerValue(p.m)} кг на ${p.dT} °C. Удельная теплоёмкость воды $c = 4200$ Дж/(кг·°C). Какое количество теплоты для этого потребуется?`,
  explanationTemplate: (p, answer) =>
    `$Q = cm\\Delta T = ${formatMathValue(WATER_SPECIFIC_HEAT_KJ)} \\cdot ${formatMathValue(p.m)} \\cdot ${p.dT} = ${formatMathValue(answer)}$ кДж (теплоёмкость взята в кДж/(кг·°C), поэтому ответ сразу в кДж).`,
  trap: "В формуле $Q=cm\\Delta T$ все три множителя обязательны: не забывай ни один из них.",
  coachLines: {
    correct: () =>
      "Да. $Q = cm\\Delta T$ — важны все три множителя: теплоёмкость, масса и изменение температуры.",
    wrong: (_p, selected, correct) =>
      `Проверь, что учтены все три множителя: $c$, $m$ и $\\Delta T$. Получается ${formatAnswerValue(correct)} кДж, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: waterContexts.length,
};
