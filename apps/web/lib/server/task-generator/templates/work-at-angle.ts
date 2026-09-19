import { variantIndex } from "../solver.ts";
import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const angles = [0, 60, 90, 120, 180] as const;
const cosineFactors = [1, 0.5, 0, -0.5, -1] as const;

function angleFor(p: Params): number {
  return angles[variantIndex(p, angles.length)];
}

function cosineFor(p: Params): number {
  return cosineFactors[variantIndex(p, cosineFactors.length)];
}

function workAtAngle(p: Params): number {
  return p.F * p.s * cosineFor(p);
}

const distractors: DistractorRule[] = [
  { label: "не учёл угол", compute: (p) => p.F * p.s },
  { label: "взял модуль работы", compute: (p) => Math.abs(workAtAngle(p)) },
  { label: "применил синус вместо косинуса", compute: (p) => p.F * p.s * Math.sin(angleFor(p) * Math.PI / 180) },
];

export const workAtAngleBlueprint: TaskBlueprint = {
  id: "work-at-angle",
  skill: "Работа силы под углом",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    F: { min: 10, max: 120, step: 10, unit: "Н" },
    s: { min: 2, max: 20, step: 2, unit: "м" },
  },
  formula: "A=Fs\\cos\\alpha",
  answerUnit: "Дж",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: workAtAngle,
  distractors,
  textTemplate: (p) =>
    `Тело переместилось на ${p.s} м. На него действовала постоянная сила ${p.F} Н под углом ${angleFor(p)}° к перемещению. Найдите работу этой силы.`,
  explanationTemplate: (p, answer) =>
    `Работу совершает составляющая силы вдоль перемещения: $A=Fs\\cos\\alpha=${p.F}\\cdot${p.s}\\cdot\\cos${angleFor(p)}^\\circ=${formatMathValue(answer)}$ Дж.`,
  trap: "Подставляет весь модуль силы без проекции или теряет отрицательный знак при тупом угле.",
  coachLines: {
    correct: () => "Да. Знак и модуль работы задаёт косинус угла между силой и перемещением.",
    wrong: (p, selected, correct) =>
      `Используй проекцию силы на перемещение: $A=Fs\\cos${angleFor(p)}^\\circ$. Получается ${formatAnswerValue(correct)} Дж, а не ${formatAnswerValue(selected)} Дж.`,
  },
  variantCount: angles.length,
};
