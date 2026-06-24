import { weightLiftDistractors } from "../distractors.ts";
import { apparentWeight } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

function movesUpward(p: Params): boolean {
  return Math.abs(Math.trunc(p.__variant ?? 0)) % 2 === 0;
}

export const weightLiftBlueprint: TaskBlueprint = {
  id: "weight-lift",
  skill: "Вес тела в ускоряющемся лифте",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    m: { min: 2, max: 100, step: 2, unit: "кг" },
    a: { min: 0.5, max: 4, step: 0.5, unit: "м/с²" },
  },
  formula: "N=m(g\\pm a)",
  answerUnit: "Н",
  answerKind: "positive",
  solver: apparentWeight,
  distractors: weightLiftDistractors,
  textTemplate: (p) => {
    const direction = movesUpward(p) ? "вертикально вверх" : "вертикально вниз";
    return `В лифте находится тело массой ${p.m} кг. Лифт движется с ускорением ${p.a} м/с², направленным ${direction}. При g = 10 м/с² найдите кажущийся вес тела.`;
  },
  explanationTemplate: (p, answer) =>
    movesUpward(p)
      ? `Ускорение направлено вверх, поэтому N = m(g + a) = ${p.m} · (10 + ${p.a}) = ${answer} Н. Знак выбирают по ускорению, а не по скорости лифта.`
      : `Ускорение направлено вниз, поэтому N = m(g − a) = ${p.m} · (10 − ${p.a}) = ${answer} Н. Прибавление a здесь было бы ловушкой знака.`,
  trap: "Прибавляет ma при ускорении вниз или вычитает ma при ускорении вверх.",
  coachLines: {
    correct: (p) =>
      movesUpward(p)
        ? "Верно: при ускорении вверх кажущийся вес увеличивается, N = m(g + a)."
        : "Верно: при ускорении вниз кажущийся вес уменьшается, N = m(g - a).",
    wrong: (p, selected, correct) => {
      const sign = movesUpward(p) ? "+" : "−";
      return `Направление ускорения задает знак: N = m(g ${sign} a). Получается ${correct} Н, а не ${selected} Н.`;
    },
  },
  variantCount: 2,
};
