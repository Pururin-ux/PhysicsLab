import { resultantForce2dDistractors } from "../distractors.ts";
import { perpendicularForceResultant, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

// Силы кратны 5 Н и образуют пифагоровы тройки: равнодействующая
// обязана быть целой, иначе варианты ответов — некрасивые корни.
function isPythagoreanPair(p: Params): boolean {
  return Number.isInteger(Math.hypot(p.f1, p.f2));
}

// Два сюжета с одинаковой геометрией расширяют пул текстов: кратных пяти
// пифагоровых пар в диапазоне немного.
const stories = [
  (p: Params) =>
    `К телу приложены две взаимно перпендикулярные силы: ${p.f1} Н и ${p.f2} Н. Найдите модуль равнодействующей.`,
  (p: Params) =>
    `Груз тянут двумя тросами: горизонтально с силой ${p.f1} Н и вертикально с силой ${p.f2} Н. Найдите модуль равнодействующей этих сил.`,
] as const;

export const resultantForce2dBlueprint: TaskBlueprint = {
  id: "resultant-force-2d",
  skill: "Равнодействующая перпендикулярных сил",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    f1: { min: 15, max: 80, step: 5, unit: "Н" },
    f2: { min: 15, max: 80, step: 5, unit: "Н" },
  },
  formula: "F=\\sqrt{F_1^2+F_2^2}",
  answerUnit: "Н",
  answerKind: "positive",
  solver: perpendicularForceResultant,
  distractors: resultantForce2dDistractors,
  diagram: (p) => ({
    kind: "vector",
    spec: {
      id: "resultant-force-2d-task",
      gridRange: Math.max(p.f1, p.f2) / 5,
      layout: "concurrent",
      vectors: [
        { id: "f1", dx: p.f1 / 5, dy: 0, label: "F₁", tone: "gold" },
        { id: "f2", dx: 0, dy: p.f2 / 5, label: "F₂", tone: "cyan" },
      ],
      angleMarks: [{ between: ["f1", "f2"] }],
      showResultant: true,
      resultantLabel: "F",
      resultantTone: "ember",
    },
  }),
  textTemplate: (p) => stories[variantIndex(p, stories.length)](p),
  explanationTemplate: (p, answer) =>
    `Силы перпендикулярны, поэтому их модули нельзя просто сложить — равнодействующая находится по теореме Пифагора: F = √(${p.f1}² + ${p.f2}²) = √${p.f1 * p.f1 + p.f2 * p.f2} = ${answer} Н.`,
  trap: "Складывает модули перпендикулярных сил вместо векторного сложения.",
  coachLines: {
    correct: () => "Да. Перпендикулярные силы складываются векторно — по теореме Пифагора.",
    wrong: (p, selected, correct) =>
      selected === p.f1 + p.f2
        ? `Арифметическая сумма работает только для сил вдоль одной прямой. Здесь угол 90°: F = √(${p.f1}² + ${p.f2}²) = ${correct} Н.`
        : `Построй прямоугольник сил: катеты ${p.f1} и ${p.f2}, диагональ ${correct} Н, а не ${selected} Н.`,
  },
  constraints: [isPythagoreanPair, (p) => p.f1 !== p.f2],
  variantCount: stories.length,
};
