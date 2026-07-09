import { workForceDistanceDistractors } from "../distractors.ts";
import { variantIndex, workForceDistance } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function directionText(p: Params): string {
  return variantIndex(p, 2) === 0
    ? "направлена вдоль перемещения"
    : "направлена против перемещения";
}

export const workForceDistanceBlueprint: TaskBlueprint = {
  id: "work-force-distance",
  skill: "Работа постоянной силы",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    F: { min: 10, max: 120, step: 10, unit: "Н" },
    s: { min: 2, max: 20, step: 2, unit: "м" },
  },
  formula: "A=Fs\\cos\\alpha",
  answerUnit: "Дж",
  answerKind: "signed",
  solver: workForceDistance,
  distractors: workForceDistanceDistractors,
  textTemplate: (p) =>
    `На тело действует постоянная сила ${p.F} Н, ${directionText(p)}. Тело переместилось на ${p.s} м. Найдите работу этой силы.`,
  explanationTemplate: (p, answer) => {
    const signText = variantIndex(p, 2) === 0 ? "\\cos 0^\\circ=1" : "\\cos 180^\\circ=-1";

    return `Работа силы: $A=Fs\\cos\\alpha$. Здесь ${signText}, поэтому $A=${p.F}\\cdot${p.s}\\cdot${variantIndex(p, 2) === 0 ? "1" : "(-1)"}=${formatMathValue(answer)}$ Дж.`;
  },
  trap: "Знак работы зависит от направления силы относительно перемещения.",
  coachLines: {
    correct: () =>
      "Верно. Если сила против перемещения, работа отрицательна.",
    wrong: (_p, selected, correct) =>
      `Проверь знак: работа зависит от угла между силой и перемещением. Правильно ${formatAnswerValue(correct)} Дж, а не ${formatAnswerValue(selected)} Дж.`,
  },
  variantCount: 2,
};
