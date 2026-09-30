import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { wavelengthM: 0.5, frequencyHz: 4 },
  { wavelengthM: 0.6, frequencyHz: 5 },
  { wavelengthM: 0.45, frequencyHz: 4 },
  { wavelengthM: 0.9, frequencyHz: 3 },
  { wavelengthM: 1.1, frequencyHz: 4 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function speed(params: Params) {
  const value = values(params);
  return { ...value, speedMPerS: value.wavelengthM * value.frequencyHz };
}

const roundToTenth = (value: number) => Math.round((value + Number.EPSILON) * 10) / 10;

const distractors: DistractorRule[] = [
  { label: "делишь длину волны на частоту", compute: params => roundToTenth(speed(params).wavelengthM / speed(params).frequencyHz) },
  { label: "переворачиваешь отношение частоты и длины волны", compute: params => roundToTenth(speed(params).frequencyHz / speed(params).wavelengthM) },
  { label: "складываешь величины вместо применения связи", compute: params => roundToTenth(speed(params).frequencyHz + speed(params).wavelengthM) },
];

export const mechanicalWaveSpeedBlueprint: TaskBlueprint = {
  id: "mechanical-wave-speed",
  skill: "Скорость механической волны",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "v=\\lambda\\nu",
  answerUnit: "м/с",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: params => roundToTenth(speed(params).speedMPerS),
  distractors,
  textTemplate: params => {
    const value = speed(params);
    return `По натянутой струне распространяется поперечная волна. Длина волны равна ${formatAnswerValue(value.wavelengthM)} м, частота источника — ${value.frequencyHz} Гц. Найди скорость распространения волны в м/с.`;
  },
  explanationTemplate: (params, answer) => {
    const value = speed(params);
    return `За один период волна проходит расстояние, равное длине волны. Поэтому $v=\\lambda\\nu=${formatMathValue(value.wavelengthM)}\\cdot${value.frequencyHz}\\approx${formatMathValue(answer)}$ м/с.`;
  },
  trap: "Скорость волны равна произведению длины волны и частоты источника: v = λν. Проверь, что длина дана в метрах.",
  coachLines: {
    correct: () => "Верно: за каждую секунду источник создаёт ν волн, каждая длиной λ.",
    wrong: (params, selected, correct) => {
      const value = speed(params);
      return `Умножь длину волны ${formatAnswerValue(value.wavelengthM)} м на частоту ${value.frequencyHz} Гц: v ≈ ${formatAnswerValue(correct)} м/с. Твой ответ — ${formatAnswerValue(selected)} м/с.`;
    },
  },
  variantCount: cases.length,
};
