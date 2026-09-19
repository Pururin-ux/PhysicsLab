import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const MATERIALS: Record<number, { name: string; rho: number }> = {
  1: { name: "железа", rho: 0.1 },
  2: { name: "нихрома", rho: 1.1 },
};

function materialFor(params: Params) {
  return MATERIALS[params.materialId] ?? MATERIALS[1];
}

function resistance(params: Params) {
  const value = materialFor(params).rho * params.length / params.area;
  return Math.round(value * 1000) / 1000;
}

function rounded(value: number) {
  return Math.round(value * 1000) / 1000;
}

const distractors: DistractorRule[] = [
  { label: "умножил на площадь вместо деления", compute: p => rounded(materialFor(p).rho * p.length * p.area) },
  { label: "ошибка масштаба удельного сопротивления", compute: p => rounded(resistance(p) * 10) },
  { label: "ошибка масштаба площади сечения", compute: p => rounded(resistance(p) / 10) },
];

export const conductorResistanceBlueprint: TaskBlueprint = {
  id: "conductor-resistance",
  skill: "Сопротивление проводника по размерам и материалу",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    materialId: { min: 1, max: 2, step: 1, unit: "материал" },
    length: { min: 1, max: 5, step: 1, unit: "м" },
    area: { min: 0.5, max: 2, step: 1.5, unit: "мм²" },
  },
  formula: "R=\\rho\\frac{l}{S}",
  answerUnit: "Ом",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: resistance,
  distractors,
  textTemplate: params => {
    const material = materialFor(params);
    return `Проводник из ${material.name} имеет длину ${formatAnswerValue(params.length)} м и площадь поперечного сечения ${formatAnswerValue(params.area)} мм². Удельное сопротивление материала ρ = ${formatAnswerValue(material.rho)} Ом·мм²/м. Найдите сопротивление проводника.`;
  },
  explanationTemplate: (params, answer) => {
    const material = materialFor(params);
    return `$R=\\rho\\frac{l}{S}=${formatMathValue(material.rho)}\\cdot\\frac{${formatMathValue(params.length)}}{${formatMathValue(params.area)}}=${formatMathValue(answer)}$ Ом.`;
  },
  trap: "Площадь поперечного сечения стоит в знаменателе: более толстый провод имеет меньшее сопротивление при тех же длине и материале.",
  coachLines: {
    correct: params => `Верно. Для ${materialFor(params).name} учтены и удельное сопротивление, и геометрия образца.`,
    wrong: (_params, selected, correct) => `Проверь положение площади S в формуле: $R=\\rho l/S$. Получается ${formatAnswerValue(correct)} Ом, а не ${formatAnswerValue(selected)} Ом.`,
  },
};
