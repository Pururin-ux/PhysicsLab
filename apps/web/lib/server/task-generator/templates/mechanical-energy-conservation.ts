import { GRAVITY } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const contexts = [
  "Металлическую шайбу подбросили вертикально вверх",
  "Небольшой мяч бросили вертикально вверх",
] as const;

function contextFor(p: Params) {
  return contexts[Math.abs(Math.trunc(p.__variant ?? 0)) % contexts.length];
}

function maximumHeight(p: Params) {
  return p.v * p.v / (2 * GRAVITY);
}

export const mechanicalEnergyConservationBlueprint: TaskBlueprint = {
  id: "mechanical-energy-conservation",
  skill: "Сохранение механической энергии",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    m: { min: 0.2, max: 0.9, step: 0.1, unit: "кг" },
    v: { min: 2, max: 40, step: 2, unit: "м/с" },
  },
  formula: "\\frac{mv_0^2}{2}=mgh_{\\max}",
  answerUnit: "м",
  answerKind: "positive",
  solver: maximumHeight,
  distractors: [
    { label: "не разделил на два", compute: p => p.v * p.v / GRAVITY },
    { label: "не возвёл скорость в квадрат", compute: p => p.v / (2 * GRAVITY) },
    { label: "не сократил массу", compute: p => p.m * p.v * p.v / (2 * GRAVITY) },
  ],
  textTemplate: p => `${contextFor(p)} со скоростью ${p.v} м/с. Масса тела ${formatAnswerValue(p.m)} кг. На какую максимальную высоту относительно точки бросания оно поднимется? Сопротивлением воздуха пренебречь, g = ${GRAVITY} Н/кг.`,
  explanationTemplate: (p, answer) => `В точке бросания $E_k=\\frac{mv_0^2}{2}$, а в верхней точке $E_p=mgh_{\\max}$. Масса сокращается: $h_{\\max}=\\frac{v_0^2}{2g}=\\frac{${p.v}^2}{2\\cdot${GRAVITY}}=${formatMathValue(answer)}$ м.`,
  trap: "При отсутствии сопротивления кинетическая энергия переходит в потенциальную; массу можно сократить, но скорость остаётся в квадрате.",
  coachLines: {
    correct: () => "Верно: в верхней точке скорость равна нулю, а начальная кинетическая энергия полностью перешла в потенциальную.",
    wrong: (_p, selected, correct) => `Приравняй $\\frac{mv_0^2}{2}$ и $mgh$: масса сократится, а высота получится ${formatAnswerValue(correct)} м, не ${formatAnswerValue(selected)} м.`,
  },
  variantCount: contexts.length,
};
