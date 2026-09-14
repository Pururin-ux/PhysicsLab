import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const G = 10;

function immersedVolumeM3(p: Params) {
  return p.volume / 1_000_000;
}

function archimedesForce(p: Params) {
  return p.rho * G * immersedVolumeM3(p);
}

function formatVolumeM3(value: number) {
  return value
    .toFixed(6)
    .replace(/0+$/, "")
    .replace(/\.$/, "")
    .replace(".", "{,}");
}

export const archimedesForceBlueprint: TaskBlueprint = {
  id: "archimedes-force",
  skill: "Сила Архимеда",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    rho: { min: 800, max: 1200, step: 100, unit: "кг/м³" },
    volume: { min: 100, max: 1000, step: 100, unit: "см³" },
  },
  formula: "F_A=\\rho_{\\text{ж}}gV_{\\text{погр}}",
  answerUnit: "Н",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: archimedesForce,
  distractors: [
    { label: "не учёл множитель g", compute: (p) => archimedesForce(p) / G },
    { label: "ошибся на один разряд при переводе объёма", compute: (p) => archimedesForce(p) * 10 },
    { label: "ошибся на два разряда при переводе объёма", compute: (p) => archimedesForce(p) * 100 },
  ],
  textTemplate: (p) =>
    `Тело полностью погружено в жидкость плотностью ${p.rho} кг/м³ и не касается дна. Объём тела ${p.volume} см³. Примите g = 10 Н/кг. Найдите силу Архимеда.`,
  explanationTemplate: (p, answer) =>
    `Погружённый объём равен всему объёму тела: $V_{\\text{погр}}=${p.volume}$ см³ $=${formatVolumeM3(immersedVolumeM3(p))}$ м³. Тогда $F_A=\\rho_{\\text{ж}}gV_{\\text{погр}}=${p.rho}\\cdot10\\cdot${formatVolumeM3(immersedVolumeM3(p))}=${formatMathValue(answer)}$ Н.`,
  trap: "Подставляет объём в см³ без перевода в м³ или использует полный объём вместо погружённого.",
  coachLines: {
    correct: (p) =>
      `Верно. Для полностью погружённого тела объём вытесненной жидкости равен ${p.volume} см³.`,
    wrong: (p, selected, correct) =>
      `Переведи ${p.volume} см³ в м³ и умножь плотность, g и погружённый объём. Получится ${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`,
  },
};
