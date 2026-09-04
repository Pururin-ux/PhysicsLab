import { weightLiftDistractors } from "../distractors.ts";
import { GRAVITY, GRAVITY_TEXT, apparentWeight } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

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
  formula: "P=N=m(g\\pm a)",
  answerUnit: "Н",
  answerKind: "positive",
  solver: apparentWeight,
  distractors: weightLiftDistractors,
  textTemplate: (p) => {
    const direction = movesUpward(p) ? "вертикально вверх" : "вертикально вниз";
    return `В лифте находится тело массой ${p.m} кг. Лифт движется с ускорением ${formatAnswerValue(p.a)} м/с², направленным ${direction}. При ${GRAVITY_TEXT} найдите кажущийся вес тела.`;
  },
  explanationTemplate: (p, answer) =>
    movesUpward(p)
      ? `Ускорение направлено вверх, поэтому реакция опоры $N=m(g+a)=${p.m}·(${GRAVITY}+${formatAnswerValue(p.a)})=${formatAnswerValue(answer)}$ Н. Вес P действует на опору, N — на тело; при контакте их модули равны. Знак выбирают по ускорению, а не по скорости лифта.`
      : `Ускорение направлено вниз, поэтому реакция опоры $N=m(g-a)=${p.m}·(${GRAVITY}-${formatAnswerValue(p.a)})=${formatAnswerValue(answer)}$ Н. Вес P действует на опору, N — на тело; при контакте их модули равны. Здесь знак выбирают по ускорению.`,
  trap: "Выбирает знак по скорости лифта, а не по ускорению.",
  coachLines: {
    correct: (p) =>
      movesUpward(p)
        ? "Да. При ускорении вверх модули реакции N и веса P увеличиваются: P=N=m(g+a)."
        : "Да. При ускорении вниз модули реакции N и веса P уменьшаются: P=N=m(g−a).",
    wrong: (p, selected, correct) => {
      const sign = movesUpward(p) ? "+" : "−";
      return `Направление ускорения задаёт знак: N = m(g ${sign} a). Получается ${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`;
    },
  },
  variantCount: 2,
};
