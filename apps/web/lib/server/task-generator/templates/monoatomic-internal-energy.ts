import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const GAS_CONSTANT = 8.31;
const gases = ["гелия", "неона", "аргона", "одноатомного идеального газа"] as const;

function gasFor(params: Params): string {
  const variant = Math.abs(Math.trunc(params.__variant ?? 0));
  return gases[variant % gases.length];
}

function internalEnergy(params: Params): number {
  return 1.5 * params.nu * GAS_CONSTANT * params.T / 1000;
}

const distractors: DistractorRule[] = [
  { label: "пропускаешь множитель три вторых", compute: p => p.nu * GAS_CONSTANT * p.T / 1000 },
  { label: "берёшь две трети вместо трёх вторых", compute: p => (2 / 3) * p.nu * GAS_CONSTANT * p.T / 1000 },
  { label: "считаешь температуру в градусах Цельсия", compute: p => 1.5 * p.nu * GAS_CONSTANT * (p.T - 273) / 1000 },
];

export const monoatomicInternalEnergyBlueprint: TaskBlueprint = {
  id: "monoatomic-internal-energy",
  skill: "Внутренняя энергия одноатомного идеального газа",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    nu: { min: 1, max: 5, step: 1, unit: "моль" },
    T: { min: 300, max: 600, step: 50, unit: "К" },
  },
  formula: "U=\\frac32\\nu RT",
  answerUnit: "кДж",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: internalEnergy,
  distractors,
  textTemplate: params => `Количество ${gasFor(params)} равно ${params.nu} моль, температура газа ${params.T} К. Найдите внутреннюю энергию газа. Ответ дайте в килоджоулях.`,
  explanationTemplate: (params, answer) => `Для одноатомного идеального газа $U=\\frac32\\nu RT=\\frac32\\cdot${params.nu}\\cdot${formatMathValue(GAS_CONSTANT)}\\cdot${params.T}=${formatMathValue(answer * 1000)}$ Дж $=${formatMathValue(answer)}$ кДж.`,
  trap: "Температура уже дана в кельвинах. Не потеряй множитель 3/2 и переведи джоули в килоджоули.",
  coachLines: {
    correct: params => `Верно. Для ${formatAnswerValue(params.nu)} моль при ${params.T} К внутренняя энергия найдена по формуле $U=\\frac32\\nu RT$.`,
    wrong: (_params, selected, correct) => `Проверь множитель $\\frac32$ и перевод в килоджоули. Получается ${formatAnswerValue(correct)} кДж, а не ${formatAnswerValue(selected)} кДж.`,
  },
  variantCount: gases.length,
};
