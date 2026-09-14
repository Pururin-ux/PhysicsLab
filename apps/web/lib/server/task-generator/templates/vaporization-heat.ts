import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import {
  WATER_BOILING_TEMPERATURE_C,
  WATER_SPECIFIC_HEAT_KJ,
  WATER_VAPORIZATION_HEAT_KJ,
  vaporizationHeat,
} from "../solver.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const contexts = [
  "В открытом сосуде нагревают воду",
  "В школьном калориметре воду доводят до кипения",
  "Воду для опыта нагревают при нормальном атмосферном давлении",
  "Небольшую порцию воды нужно полностью превратить в пар",
] as const;

function contextFor(p: Params) {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return contexts[variant % contexts.length];
}

const distractors: DistractorRule[] = [
  { label: "учёл только парообразование при 100 °C", compute: (p) => p.m * WATER_VAPORIZATION_HEAT_KJ },
  { label: "учёл только нагревание воды до 100 °C", compute: (p) => p.m * WATER_SPECIFIC_HEAT_KJ * (WATER_BOILING_TEMPERATURE_C - p.temp0) },
  { label: "подставил конечную температуру вместо изменения температуры", compute: (p) => p.m * (WATER_SPECIFIC_HEAT_KJ * WATER_BOILING_TEMPERATURE_C + WATER_VAPORIZATION_HEAT_KJ) },
];

export const vaporizationHeatBlueprint: TaskBlueprint = {
  id: "vaporization-heat",
  skill: "Нагревание и парообразование",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 3,
  params: {
    m: { min: 0.1, max: 1, step: 0.1, unit: "кг" },
    temp0: { min: 20, max: 80, step: 10, unit: "°C" },
  },
  formula: "Q = cm\\Delta T + Lm",
  answerUnit: "кДж",
  answerKind: "positive",
  solver: vaporizationHeat,
  distractors,
  textTemplate: (p) =>
    contextFor(p) + ". Масса воды " + formatAnswerValue(p.m) + " кг, начальная температура " + p.temp0 + " °C. Сколько теплоты нужно, чтобы нагреть воду до 100 °C и полностью превратить её в пар? Удельная теплоёмкость воды " + WATER_SPECIFIC_HEAT_KJ + " кДж/(кг·°C), удельная теплота парообразования L = " + WATER_VAPORIZATION_HEAT_KJ + " кДж/кг.",
  explanationTemplate: (p, answer) =>
    "Сначала нагреваем воду до температуры кипения: $Q_1=cm\\Delta T$. Затем превращаем её в пар при 100 °C: $Q_2=Lm$. Поэтому $Q=m(c\\Delta T+L)=" + formatMathValue(p.m) + "\\cdot(" + WATER_SPECIFIC_HEAT_KJ + "\\cdot" + (WATER_BOILING_TEMPERATURE_C - p.temp0) + "+" + WATER_VAPORIZATION_HEAT_KJ + ")=" + formatMathValue(answer) + "$ кДж.",
  trap: "Если вода начинает ниже 100 °C, к теплоте парообразования нужно прибавить теплоту её нагревания.",
  coachLines: {
    correct: () => "Да. Ты отдельно учёл нагревание воды и её превращение в пар.",
    wrong: (_p, selected, correct) =>
      "Проверь обе стадии: сначала $cm\\Delta T$, затем $Lm$. Получается " + formatAnswerValue(correct) + " кДж, а не " + formatAnswerValue(selected) + " кДж.",
  },
  variantCount: contexts.length,
};
