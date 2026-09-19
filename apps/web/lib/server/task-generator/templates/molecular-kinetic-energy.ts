import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { variantIndex } from "../solver.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const BOLTZMANN_SCALED = 0.0138;
const gases = ["гелия", "неона", "аргона", "одноатомного идеального газа"] as const;

function absoluteTemperature(p: Params): number {
  return p.tempC + 273;
}

function gasFor(p: Params): string {
  return gases[variantIndex(p, gases.length)];
}

const distractors: DistractorRule[] = [
  { label: "нашёл kT и пропустил множитель 3/2", compute: (p) => BOLTZMANN_SCALED * absoluteTemperature(p) },
  { label: "подставил температуру по Цельсию вместо абсолютной", compute: (p) => 1.5 * BOLTZMANN_SCALED * p.tempC },
  { label: "перепутал коэффициент 3/2 с 2/3", compute: (p) => (2 / 3) * BOLTZMANN_SCALED * absoluteTemperature(p) },
];

export const molecularKineticEnergyBlueprint: TaskBlueprint = {
  id: "molecular-kinetic-energy",
  skill: "Средняя кинетическая энергия молекул",
  topic: "Молекулярная физика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    tempC: { min: 27, max: 127, step: 50, unit: "°C" },
  },
  formula: "\\overline{E_k}=\\frac{3}{2}kT",
  answerUnit: "· 10⁻²¹ Дж",
  answerKind: "positive",
  solver: (p) => 1.5 * BOLTZMANN_SCALED * absoluteTemperature(p),
  distractors,
  textTemplate: (p) => `Газ ${gasFor(p)} находится при температуре ${formatAnswerValue(p.tempC)} °C. Определите среднюю кинетическую энергию поступательного движения молекулы. Примите k = 1,38 · 10⁻²³ Дж/К. Ответ запишите коэффициентом перед 10⁻²¹ Дж.`,
  explanationTemplate: (p, answer) => `Переводим температуру: $T=${formatMathValue(p.tempC)}+273=${formatMathValue(absoluteTemperature(p))}$ К. Затем $\\overline{E_k}=\\frac32kT=\\frac32\\cdot1{,}38\\cdot10^{-23}\\cdot${formatMathValue(absoluteTemperature(p))}=${formatMathValue(answer)}\\cdot10^{-21}$ Дж. Вид газа не меняет среднюю энергию при заданной температуре.`,
  trap: "В формулу входит абсолютная температура: сначала прибавь 273, затем учти множитель 3/2.",
  coachLines: {
    correct: (p) => `Да. При ${formatAnswerValue(p.tempC)} °C абсолютная температура равна ${formatAnswerValue(absoluteTemperature(p))} К, а средняя энергия определяется только этой температурой.`,
    wrong: (p, selected, correct) => `Проверь два шага: $T=t+273=${formatAnswerValue(absoluteTemperature(p))}$ К и $\\overline{E_k}=\\frac32kT$. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  variantCount: gases.length,
};
