import { GRAVITY, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function target(p: Params) { return variantIndex(p, 3); }
function energy(p: Params) { return GRAVITY * p.m * p.h; }
function answer(p: Params) {
  if (target(p) === 1) return energy(p) / (GRAVITY * p.h);
  if (target(p) === 2) return energy(p) / (GRAVITY * p.m);
  return energy(p);
}
function unit(p: Params) { return ["Дж", "кг", "м"][target(p)]; }

export const gravitationalPotentialEnergyBlueprint: TaskBlueprint = {
  id: "gravitational-potential-energy",
  skill: "Потенциальная энергия поднятого тела",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    m: { min: 1, max: 10, step: 1, unit: "кг" },
    h: { min: 1, max: 8, step: 1, unit: "м" },
  },
  formula: "E_p=mgh",
  answerUnit: unit,
  answerKind: "positive",
  solver: answer,
  distractors: [
    { label: "не учёл ускорение свободного падения", compute: p => target(p) === 0 ? p.m * p.h : target(p) === 1 ? energy(p) / p.h : energy(p) / p.m },
    { label: "неверно преобразовал произведение", compute: p => target(p) === 0 ? energy(p) * 2 : target(p) === 1 ? p.m + p.h : p.h + GRAVITY },
    { label: "сложил данные вместо последовательного умножения или деления", compute: p => target(p) === 0 ? energy(p) + p.m + p.h : target(p) === 1 ? p.m + GRAVITY : p.h + 2 * GRAVITY },
  ],
  textTemplate: p => {
    const E = energy(p);
    if (target(p) === 1) return `Центр груза находится на высоте ${p.h} м над выбранным нулевым уровнем. Его потенциальная энергия ${E} Дж. Примите g = ${GRAVITY} Н/кг. Найдите массу груза.`;
    if (target(p) === 2) return `Груз массой ${p.m} кг имеет потенциальную энергию ${E} Дж относительно выбранного нулевого уровня. Примите g = ${GRAVITY} Н/кг. На какой высоте находится его центр?`;
    return `Груз массой ${p.m} кг находится на высоте ${p.h} м над выбранным нулевым уровнем. Примите g = ${GRAVITY} Н/кг. Найдите его потенциальную энергию.`;
  },
  explanationTemplate: (p, result) => {
    const E = energy(p);
    if (target(p) === 1) return `Из $E_p=mgh$ получаем $m=\\frac{E_p}{gh}=\\frac{${E}}{${GRAVITY}\\cdot${p.h}}=${formatMathValue(result)}$ кг.`;
    if (target(p) === 2) return `Из $E_p=mgh$ получаем $h=\\frac{E_p}{mg}=\\frac{${E}}{${p.m}\\cdot${GRAVITY}}=${formatMathValue(result)}$ м.`;
    return `$E_p=mgh=${p.m}\\cdot${GRAVITY}\\cdot${p.h}=${formatMathValue(result)}$ Дж.`;
  },
  trap: "Высоту отсчитывают от явно выбранного нулевого уровня, а в произведении Eₚ=mgh нельзя пропускать g.",
  coachLines: {
    correct: p => target(p) === 0 ? "Верно: потенциальная энергия зависит и от массы, и от высоты над выбранным нулевым уровнем." : "Верно: неизвестный множитель найден делением энергии на два известных множителя.",
    wrong: (p, selected, correct) => `Используй $E_p=mgh$ и сначала выдели неизвестную величину. Получается ${formatAnswerValue(correct)} ${unit(p)}, а не ${formatAnswerValue(selected)} ${unit(p)}.`,
  },
  variantCount: 3,
};
