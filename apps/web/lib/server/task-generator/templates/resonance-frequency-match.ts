import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [0.5, 0.8, 1.2, 1.5, 2.5] as const;

function naturalFrequency(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

const roundToHundredth = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const distractors: DistractorRule[] = [
  { label: "берёшь половину собственной частоты", compute: params => roundToHundredth(naturalFrequency(params) / 2) },
  { label: "удваиваешь собственную частоту", compute: params => roundToHundredth(naturalFrequency(params) * 2) },
  { label: "путаешь частоту с периодом", compute: params => roundToHundredth(1 / naturalFrequency(params)) },
];

export const resonanceFrequencyMatchBlueprint: TaskBlueprint = {
  id: "resonance-frequency-match",
  skill: "Условие резонанса",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "\\nu_{\\text{внеш}}\\approx\\nu_0",
  answerUnit: "Гц",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: naturalFrequency,
  distractors,
  textTemplate: params => `Собственная частота маятника равна ${formatAnswerValue(naturalFrequency(params))} Гц. В простой модели при какой частоте внешних толчков амплитуда будет особенно большой? Считай условием резонанса близость частот. Ответ дай в герцах.`,
  explanationTemplate: params => `Резонанс возникает, когда частота внешней силы близка к собственной частоте системы: \\nu_{\\text{внеш}}\\approx\\nu_0=${formatMathValue(naturalFrequency(params))} Гц.`,
  trap: "Сопоставь частоту толчков с собственной частотой маятника, а не с периодом.",
  coachLines: {
    correct: () => "Верно: при близких частотах система особенно сильно откликается на внешние толчки.",
    wrong: (params, selected, correct) => `Для резонанса частота толчков должна быть близка к собственной частоте: ${formatAnswerValue(correct)} Гц. Твой ответ — ${formatAnswerValue(selected)} Гц.`,
  },
  variantCount: cases.length,
};
