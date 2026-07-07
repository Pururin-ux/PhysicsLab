import { inelasticCollisionSpeedDistractors } from "../distractors.ts";
import { inelasticCollisionSpeed } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const collisionContexts = [
  "На лабораторных рельсах первая тележка догоняет вторую и сцепляется с ней",
  "Две платформы движутся по одному прямому пути и после удара сцепляются",
  "Тележка с грузом догоняет вторую тележку; после столкновения они движутся вместе",
  "На демонстрационном треке две тележки после удара становятся одной системой",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return collisionContexts[variant % collisionContexts.length];
}

export const inelasticCollisionSpeedBlueprint: TaskBlueprint = {
  id: "inelastic-collision-speed",
  skill: "Неупругое столкновение",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: {
    m1: { min: 1, max: 8, step: 1, unit: "кг" },
    m2: { min: 1, max: 8, step: 1, unit: "кг" },
    v1: { min: 4, max: 16, step: 1, unit: "м/с" },
    v2: { min: 1, max: 10, step: 1, unit: "м/с" },
  },
  formula: "m_1v_1 + m_2v_2 = (m_1 + m_2)v",
  answerUnit: "м/с",
  answerKind: "positive",
  solver: inelasticCollisionSpeed,
  distractors: inelasticCollisionSpeedDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Массы тележек ${p.m1} кг и ${p.m2} кг, их скорости до столкновения ${p.v1} м/с и ${p.v2} м/с в одном направлении. Найдите скорость сцепившихся тележек после столкновения.`,
  explanationTemplate: (p, answer) =>
    `Импульс системы сохраняется: $m_1v_1 + m_2v_2 = (m_1+m_2)v$. Тогда $v = \\frac{${p.m1}\\cdot${p.v1}+${p.m2}\\cdot${p.v2}}{${p.m1}+${p.m2}} = ${formatMathValue(answer)}$ м/с.`,
  trap: "После сцепления дели суммарный импульс на общую массу, а не просто усредняй скорости.",
  coachLines: {
    correct: () =>
      "Да. При сцеплении сохраняется импульс всей системы: общий импульс делим на общую массу.",
    wrong: (_p, selected, correct) =>
      `Для сцепившихся тележек нужен закон сохранения импульса. Получается ${formatAnswerValue(correct)} м/с, а не ${formatAnswerValue(selected)} м/с.`,
  },
  constraints: [(p) => p.v1 > p.v2],
  variantCount: collisionContexts.length,
};
