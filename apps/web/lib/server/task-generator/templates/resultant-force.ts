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
  group: "dynamics",
  difficulty: 1,
  params: {
    f1: { min: 10, max: 100, step: 5, unit: "Н" },
    f2: { min: 10, max: 100, step: 5, unit: "Н" },
  },
  formula: "F_{\\text{рез}}=\\left|\\vec F_1+\\vec F_2\\right|",
  answerUnit: "Н",
  answerKind: "positive",
  solver: resultantForce,
  distractors: resultantForceDistractors,
  textTemplate: (p) => {
    const direction = forcesAreCodirectional(p)
      ? "в одном направлении"
      : "в противоположных направлениях";
    return `На тело вдоль одной прямой действуют силы ${p.f1} Н и ${p.f2} Н ${direction}. Найдите модуль равнодействующей.`;
  },
  explanationTemplate: (p, answer) =>
    forcesAreCodirectional(p)
      ? `Силы направлены в одну сторону, поэтому их модули складываются: ${p.f1} + ${p.f2} = ${answer} Н.`
      : `Силы направлены встречно, поэтому из большего модуля вычитаем меньший: |${p.f1} − ${p.f2}| = ${answer} Н. Складывать их модули нельзя.`,
  trap: "Не учитывает направления сил.",
  coachLines: {
    correct: (p) =>
      forcesAreCodirectional(p)
        ? "Да. Силы в одну сторону складываются."
        : "Да. Для встречных сил из большего модуля вычитают меньший.",
    wrong: (p, selected, correct) => {
      const action = forcesAreCodirectional(p) ? "сложить" : "вычесть меньшую силу из большей";
      return `Сначала проверь направления: нужно ${action}. Получается ${correct} Н, а не ${selected} Н.`;
    },
  },
  constraints: [(p) => forcesAreCodirectional(p) || p.f1 !== p.f2],
  variantCount: 2,
};
