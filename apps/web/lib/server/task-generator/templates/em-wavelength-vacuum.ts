import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const LIGHT_SPEED_M_PER_S = 300_000_000;
const cases = [50, 75, 100, 120, 200] as const;

function frequencyMHz(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function wavelengthM(params: Params) {
  return LIGHT_SPEED_M_PER_S / (frequencyMHz(params) * 1_000_000);
}

const distractors: DistractorRule[] = [
  { label: "не переводишь мегагерцы в герцы", compute: params => LIGHT_SPEED_M_PER_S / frequencyMHz(params) },
  { label: "делишь частоту на скорость вместо обратного", compute: params => frequencyMHz(params) / 300 },
  { label: "берёшь половину длины волны", compute: params => wavelengthM(params) / 2 },
];

export const emWavelengthVacuumBlueprint: TaskBlueprint = {
  id: "em-wavelength-vacuum",
  skill: "Длина электромагнитной волны в вакууме",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "\\lambda=\\frac{c}{\\nu}",
  answerUnit: "м",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: wavelengthM,
  distractors,
  textTemplate: params => "Радиосигнал распространяется в вакууме с частотой " +
    frequencyMHz(params) + " МГц. Прими скорость электромагнитной волны c ≈ 3·10⁸ м/с. Найди длину волны в метрах.",
  explanationTemplate: (params, answer) => {
    const frequency = frequencyMHz(params);
    return "Переведи частоту: $\\nu=" + frequency +
      "\\cdot10^6\\,\\text{Гц}$. Тогда $\\lambda=c/\\nu=(3\\cdot10^8)/(" +
      frequency + "\\cdot10^6)=" + formatMathValue(answer) +
      "\\,\\text{м}$. Это расстояние между точками одинаковой фазы вдоль направления распространения.";
  },
  trap: "В вакууме c ≈ 3·10⁸ м/с. Переведи МГц в Гц и раздели скорость на частоту: λ = c/ν.",
  coachLines: {
    correct: () => "Верно. Ты перевёл мегагерцы в герцы и нашёл расстояние за один период.",
    wrong: (params, selected, correct) =>
      "Частота " + frequencyMHz(params) +
      " МГц означает миллионы колебаний за секунду. Раздели 300 на число мегагерц: получится " +
      formatAnswerValue(correct) + " м; твой ответ — " + formatAnswerValue(selected) + " м.",
  },
  variantCount: cases.length,
};
