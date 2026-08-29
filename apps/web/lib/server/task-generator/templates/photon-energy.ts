import { photonEnergyDistractors } from "../distractors.ts";
import { photonEnergy, variantIndex } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Вариант 0 — энергия по частоте (E = hν), вариант 1 — длина волны по частоте
// (λ = c/ν). Сетка частот шагом 0,5·10¹⁴ Гц: при h = 6,6·10⁻³⁴ Дж·с это даёт
// ответы в 10⁻¹⁹ Дж ровно с двумя знаками — школьный уровень точности.
// Пул параметров физически узкий (постоянная Планка и две цифры после запятой),
// поэтому порог уникальных текстов задан ниже стандартного (см. generate.test).
function isEnergyVariant(p: Params): boolean {
  return variantIndex(p, 2) === 0;
}

function waveLengthNm(p: Params): number {
  return 3000 / p.nu;
}

function solverFor(p: Params): number {
  return isEnergyVariant(p) ? photonEnergy(p) : waveLengthNm(p);
}

function explanationFor(p: Params, answer: number): string {
  if (isEnergyVariant(p)) {
    return (
      `$E = h\\nu = 6{,}6\\cdot 10^{-34} \\cdot ${formatMathValue(p.nu)}\\cdot 10^{14} = ` +
      `${formatMathValue(answer)}\\cdot 10^{-19}$ Дж. Перемножай степени десятки отдельно: ` +
      `$10^{-34} \\cdot 10^{14} = 10^{-20}$.`
    );
  }

  return (
    `Длина волны связана со скоростью света и частотой: ` +
    `$\\lambda = \\frac{c}{\\nu} = \\frac{3\\cdot 10^{8}}{${formatMathValue(p.nu)}\\cdot 10^{14}} = ` +
    `${formatMathValue(answer)}$ нм.`
  );
}

export const photonEnergyBlueprint: TaskBlueprint = {
  id: "photon-energy",
  skill: "Энергия фотона",
  topic: "Квантовая физика",
  group: "quantum",
  difficulty: 2,
  params: {
    nu: { min: 2, max: 12, step: 0.5, unit: "10¹⁴ Гц" },
  },
  formula: "E=h\\nu,\\qquad \\lambda=\\frac{c}{\\nu}",
  answerUnit: (p) => (isEnergyVariant(p) ? "10⁻¹⁹ Дж" : "нм"),
  answerKind: "positive",
  solver: solverFor,
  distractors: photonEnergyDistractors,
  textTemplate: (p) =>
    isEnergyVariant(p)
      ? `Найдите энергию фотона света с частотой ${formatAnswerValue(p.nu)}·10¹⁴ Гц. ` +
        `Постоянная Планка $h = 6{,}6\\cdot 10^{-34}$ Дж·с.`
      : `Свет имеет частоту ${formatAnswerValue(p.nu)}·10¹⁴ Гц. Найдите длину волны этого света в нанометрах. ` +
        `Скорость света $c = 3\\cdot 10^{8}$ м/с.`,
  explanationTemplate: explanationFor,
  trap: "Ошибается в степени десятки или путает, что делить: энергию на частоту или скорость на частоту.",
  coachLines: {
    correct: (p) =>
      isEnergyVariant(p)
        ? "Да. Энергия фотона растёт с частотой: $E = h\\nu$."
        : "Да. Длина волны и частота связаны через скорость света: $\\lambda = \\frac{c}{\\nu}$.",
    wrong: (p, selected, correct) => {
      const unit = isEnergyVariant(p) ? "10⁻¹⁹ Дж" : "нм";
      return (
        `Проверь степени десятки и порядок действий. ` +
        `Здесь ответ ${formatAnswerValue(correct)} ${unit}, а не ${formatAnswerValue(selected)} ${unit}.`
      );
    },
  },
  difficultyFor: (p) => (isEnergyVariant(p) ? 2 : 3),
  // Длина волны в условии школы округляется до целых или до одной цифры:
  // 461,5 нм читается как ответ, 461,538 — уже нет.
  constraints: [
    (p) => (isEnergyVariant(p) ? true : decimalPlaces(solverFor(p)) <= 1),
  ],
  variantCount: 2,
};
