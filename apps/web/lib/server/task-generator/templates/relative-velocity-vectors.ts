import { relativeVelocityVectorsDistractors } from "../distractors.ts";
import { perpendicularVelocityMagnitude, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

// Пары скоростей ограничены пифагоровыми тройками: ответ обязан быть
// целым, иначе варианты ответов превращаются в некрасивые корни.
function isPythagoreanPair(p: Params): boolean {
  return Number.isInteger(Math.hypot(p.v1, p.v2));
}

// Три сюжета с одинаковой физикой расширяют пул текстов: сами пары
// скоростей — редкие пифагоровы, их всего около дюжины.
const stories = [
  {
    text: (p: Params) =>
      `Лодка движется относительно воды со скоростью ${p.v1} м/с перпендикулярно течению. Скорость течения ${p.v2} м/с. Найдите модуль скорости лодки относительно берега.`,
    subject: "лодки",
  },
  {
    text: (p: Params) =>
      `Катер пересекает реку, держа скорость ${p.v1} м/с строго поперёк потока. Течение сносит его со скоростью ${p.v2} м/с. Найдите модуль скорости катера относительно берега.`,
    subject: "катера",
  },
  {
    text: (p: Params) =>
      `Дрон летит со скоростью ${p.v1} м/с перпендикулярно ветру. Ветер сносит его со скоростью ${p.v2} м/с. Найдите модуль скорости дрона относительно земли.`,
    subject: "дрона",
  },
] as const;

export const relativeVelocityVectorsBlueprint: TaskBlueprint = {
  id: "relative-velocity-vectors",
  skill: "Сложение перпендикулярных скоростей",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    v1: { min: 3, max: 16, step: 1, unit: "м/с" },
    v2: { min: 3, max: 16, step: 1, unit: "м/с" },
  },
  formula: "v=\\sqrt{v_1^2+v_2^2}",
  answerUnit: "м/с",
  answerKind: "positive",
  solver: perpendicularVelocityMagnitude,
  distractors: relativeVelocityVectorsDistractors,
  diagram: (p) => ({
    kind: "vector",
    spec: {
      id: "relative-velocity-task",
      gridRange: Math.max(p.v1, p.v2),
      layout: "chain",
      vectors: [
        { id: "v1", dx: 0, dy: p.v1, label: "v₁", tone: "blue" },
        { id: "v2", dx: p.v2, dy: 0, label: "v₂", tone: "gold" },
      ],
      showResultant: true,
      resultantLabel: "v",
      resultantTone: "ember",
    },
  }),
  textTemplate: (p) => stories[variantIndex(p, stories.length)].text(p),
  explanationTemplate: (p, answer) =>
    `Скорости перпендикулярны, поэтому модули не складываются напрямую — работает теорема Пифагора: v = √(${p.v1}² + ${p.v2}²) = √${p.v1 * p.v1 + p.v2 * p.v2} = ${answer} м/с.`,
  trap: "Складывает модули перпендикулярных скоростей вместо векторного сложения.",
  coachLines: {
    correct: () => "Да. Перпендикулярные скорости складываются по теореме Пифагора.",
    wrong: (p, selected, correct) =>
      selected === p.v1 + p.v2
        ? `Модули складывать нельзя — скорости перпендикулярны. По Пифагору получается ${correct} м/с.`
        : `Построй треугольник скоростей ${stories[variantIndex(p, stories.length)].subject}: катеты ${p.v1} и ${p.v2}, гипотенуза ${correct} м/с, а не ${selected} м/с.`,
  },
  constraints: [isPythagoreanPair, (p) => p.v1 !== p.v2],
  variantCount: stories.length,
};
