import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { speedMPerS: 1500, echoTimeS: 0.2 },
  { speedMPerS: 1480, echoTimeS: 0.3 },
  { speedMPerS: 1450, echoTimeS: 0.4 },
  { speedMPerS: 1460, echoTimeS: 0.25 },
  { speedMPerS: 1500, echoTimeS: 0.12 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function distance(params: Params) {
  const value = values(params);
  return Math.round((value.speedMPerS * value.echoTimeS / 2 + Number.EPSILON) * 10) / 10;
}

const distractors: DistractorRule[] = [
  { label: "не учитываешь обратный путь импульса", compute: params => values(params).speedMPerS * values(params).echoTimeS },
  { label: "делишь расстояние пополам дважды", compute: params => distance(params) / 2 },
  { label: "переворачиваешь отношение скорости и времени", compute: params => values(params).echoTimeS / (2 * values(params).speedMPerS) },
];

export const echoRangingBlueprint: TaskBlueprint = {
  id: "echo-ranging",
  skill: "Расстояние по эхосигналу",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "l=\\frac{v\\Delta t}{2}",
  answerUnit: "м",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: distance,
  distractors,
  textTemplate: params => {
    const value = values(params);
    return `Эхолот направил звуковой импульс ко дну. Отражённый сигнал вернулся через ${formatAnswerValue(value.echoTimeS)} с. Скорость звука в воде — ${value.speedMPerS} м/с. Найди глубину.`;
  },
  explanationTemplate: (params, answer) => {
    const value = values(params);
    return `За ${formatMathValue(value.echoTimeS)} с сигнал прошёл путь до дна и обратно. В одну сторону он прошёл половину пути: $l=\\frac{v\\Delta t}{2}=\\frac{${value.speedMPerS}\\cdot${formatMathValue(value.echoTimeS)}}{2}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Время отсчитано до возвращения сигнала, поэтому раздели полный путь на два: импульс прошёл расстояние до дна и обратно.",
  coachLines: {
    correct: () => "Верно: эхосигнал проходит до дна и обратно, а глубина — половина этого пути.",
    wrong: (_params, selected, correct) => `Учти оба участка пути сигнала: до дна и обратно. Глубина равна половине полного пути; здесь это ${formatAnswerValue(correct)} м. Твой ответ — ${formatAnswerValue(selected)} м.`,
  },
  variantCount: cases.length,
};
