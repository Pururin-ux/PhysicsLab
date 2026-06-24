import { resultantForceDistractors } from "../distractors.ts";
import { resultantForce } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

function forcesAreCodirectional(p: Params): boolean {
  return Math.abs(Math.trunc(p.__variant ?? 0)) % 2 === 0;
}

export const resultantForceBlueprint: TaskBlueprint = {
  id: "resultant-force",
  skill: "Равнодействующая коллинеарных сил",
  topic: "Динамика",
  difficulty: 1,
  params: {
    f1: { min: 10, max: 100, step: 5, unit: "Н" },
    f2: { min: 10, max: 100, step: 5, unit: "Н" },
  },
  formula: "F_{\\text{рез}}=\\left|\\vec F_1+\\vec F_2\\right|",
  answerUnit: "Н",
  solver: resultantForce,
  distractors: resultantForceDistractors,
  textTemplate: (p) => {
    const direction = forcesAreCodirectional(p)
      ? "в одном направлении"
      : "в противоположных направлениях";
    return `На тело вдоль одной прямой действуют силы ${p.f1} Н и ${p.f2} Н ${direction}. Найдите модуль равнодействующей.`;
  },
  trap: "Складывает модули встречных сил вместо вычитания или вычитает попутные силы.",
  coachLines: {
    correct: (p) =>
      forcesAreCodirectional(p)
        ? "Верно: сонаправленные силы складываются."
        : "Верно: для противоположно направленных сил из большего модуля вычитают меньший.",
    wrong: (p, selected, correct) => {
      const action = forcesAreCodirectional(p) ? "сложить" : "вычесть меньшую силу из большей";
      return `Сначала учтите направления: нужно ${action}. Результат ${correct} Н, а не ${selected} Н.`;
    },
  },
  constraints: [(p) => forcesAreCodirectional(p) || p.f1 !== p.f2],
  variantCount: 2,
};
