import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { variantIndex } from "../solver.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const AVOGADRO_COEFFICIENT = 6.022;
const substances = [
  { name: "воды H₂O", molarMass: 18 },
  { name: "кислорода O₂", molarMass: 32 },
  { name: "углекислого газа CO₂", molarMass: 44 },
  { name: "аммиака NH₃", molarMass: 17 },
] as const;

function substanceFor(p: Params) {
  return substances[variantIndex(p, substances.length)];
}

function sampleMass(p: Params): number {
  return p.nu * substanceFor(p).molarMass;
}

const distractors: DistractorRule[] = [
  { label: "остановился на количестве вещества", compute: (p) => p.nu },
  { label: "умножил массу на постоянную Авогадро без деления на молярную массу", compute: (p) => sampleMass(p) * AVOGADRO_COEFFICIENT },
  { label: "перевернул отношение массы и молярной массы", compute: (p) => AVOGADRO_COEFFICIENT / p.nu },
];

export const moleculeCountFromMassBlueprint: TaskBlueprint = {
  id: "molecule-count-from-mass",
  skill: "Число молекул по массе вещества",
  topic: "Молекулярная физика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    nu: { min: 0.5, max: 4, step: 0.5, unit: "моль" },
  },
  formula: "N = \\frac{m}{M}N_A",
  answerUnit: "· 10²³ молекул",
  answerKind: "positive",
  solver: (p) => p.nu * AVOGADRO_COEFFICIENT,
  distractors,
  textTemplate: (p) => {
    const substance = substanceFor(p);
    return `Образец ${substance.name} имеет массу ${formatAnswerValue(sampleMass(p))} г. Молярная масса вещества ${substance.molarMass} г/моль. Сколько молекул содержит образец? Ответ запишите коэффициентом перед 10²³.`;
  },
  explanationTemplate: (p, answer) => {
    const substance = substanceFor(p);
    return `Сначала находим количество вещества: $\\nu=\\frac{m}{M}=\\frac{${formatMathValue(sampleMass(p))}}{${substance.molarMass}}=${formatMathValue(p.nu)}$ моль. Затем $N=\\nu N_A=${formatMathValue(p.nu)}\\cdot6{,}022\\cdot10^{23}=${formatMathValue(answer)}\\cdot10^{23}$ молекул.`;
  },
  trap: "Сначала раздели массу образца на молярную массу. Только количество вещества в молях умножай на постоянную Авогадро.",
  coachLines: {
    correct: (p) => `Да. Образец содержит ${formatAnswerValue(p.nu)} моль, поэтому число молекул равно $\\nu N_A$.`,
    wrong: (p, selected, correct) => `Проверь цепочку $m\\to\\nu\\to N$: сначала $\\nu=m/M=${formatAnswerValue(p.nu)}$ моль, затем умножение на $6{,}022\\cdot10^{23}$. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: substances.length,
};
