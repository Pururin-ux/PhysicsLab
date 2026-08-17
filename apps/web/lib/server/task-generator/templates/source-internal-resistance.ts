import { sourceInternalResistanceDistractors } from "../distractors.ts";
import { circuitCurrentWithInternal } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

// Ток должен получаться целым, а ловушка ε/R — отличимой от ответа.
function currentIsInteger(p: Params): boolean {
  return Number.isInteger(p.emf / (p.R + p.r));
}

export const sourceInternalResistanceBlueprint: TaskBlueprint = {
  id: "source-internal-resistance",
  skill: "Закон Ома для полной цепи",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    emf: { min: 6, max: 36, step: 2, unit: "В" },
    r: { min: 1, max: 3, step: 1, unit: "Ом" },
    R: { min: 2, max: 15, step: 1, unit: "Ом" },
  },
  formula: "I=\\frac{\\varepsilon}{R+r}",
  answerUnit: "А",
  answerKind: "positive",
  solver: circuitCurrentWithInternal,
  distractors: sourceInternalResistanceDistractors,
  diagram: () => ({
    kind: "circuit",
    spec: {
      id: "source-internal-task",
      topology: "source-internal",
      sourceLabel: "ε",
      internalResistanceLabel: "r",
      resistorLabels: ["R"],
      tone: "gold",
    },
  }),
  textTemplate: (p) =>
    `ЭДС источника ${p.emf} В, его внутреннее сопротивление ${p.r} Ом. К источнику подключён резистор сопротивлением ${p.R} Ом. Найдите силу тока в цепи.`,
  explanationTemplate: (p, answer) =>
    `Ток в полной цепи определяется суммой внешнего и внутреннего сопротивлений: I = ε / (R + r) = ${p.emf} / (${p.R} + ${p.r}) = ${answer} А.`,
  trap: "Не учитывает внутреннее сопротивление источника.",
  coachLines: {
    correct: () => "Да. В полной цепи ток ограничивают оба сопротивления: и R, и r.",
    wrong: (p, selected, correct) =>
      selected === p.emf / p.R
        ? `Ты поделил только на внешнее R. Внутреннее сопротивление тоже в цепи: I = ${p.emf}/(${p.R}+${p.r}) = ${correct} А.`
        : `Сложи сопротивления до деления: I = ε/(R+r) = ${correct} А, а не ${selected} А.`,
  },
  constraints: [currentIsInteger, (p) => p.R > p.r],
};
