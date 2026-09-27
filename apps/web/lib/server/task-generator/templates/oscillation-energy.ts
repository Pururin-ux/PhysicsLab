import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { stiffnessNPerM: 100, amplitudeCm: 10, displacementCm: 6 },
  { stiffnessNPerM: 80, amplitudeCm: 15, displacementCm: 9 },
  { stiffnessNPerM: 50, amplitudeCm: 20, displacementCm: 12 },
  { stiffnessNPerM: 120, amplitudeCm: 10, displacementCm: 3.6 },
  { stiffnessNPerM: 100, amplitudeCm: 16, displacementCm: 7 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function energies(params: Params) {
  const value = values(params);
  const amplitudeM = value.amplitudeCm / 100;
  const displacementM = value.displacementCm / 100;
  const totalJ = value.stiffnessNPerM * amplitudeM ** 2 / 2;
  const potentialJ = value.stiffnessNPerM * displacementM ** 2 / 2;
  return { ...value, amplitudeM, displacementM, totalJ, potentialJ, kineticJ: totalJ - potentialJ };
}

const roundToHundredth = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const distractors: DistractorRule[] = [
  { label: "принимаешь энергию пружины за кинетическую", compute: params => roundToHundredth(energies(params).potentialJ) },
  { label: "считаешь полную энергию кинетической в любом положении", compute: params => roundToHundredth(energies(params).totalJ) },
  { label: "подставляешь разность амплитуды и смещения вместо полного баланса энергий", compute: params => {
    const value = energies(params);
    return roundToHundredth(value.stiffnessNPerM * (value.amplitudeM - value.displacementM) ** 2 / 2);
  } },
];

export const oscillationEnergyBlueprint: TaskBlueprint = {
  id: "oscillation-energy",
  skill: "Энергия гармонических колебаний",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 2,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "W_k=\\frac{k}{2}(A^2-x^2)",
  answerUnit: "Дж",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: params => roundToHundredth(energies(params).kineticJ),
  distractors,
  textTemplate: params => {
    const value = energies(params);
    return `Груз массой 2 кг колеблется на вертикальной пружине жёсткостью ${value.stiffnessNPerM} Н/м. Пружина остаётся натянутой на всём ходу, сопротивлением можно пренебречь. Амплитуда равна ${value.amplitudeCm} см. В некоторый момент смещение от положения равновесия составляет ${value.displacementCm} см. Найдите кинетическую энергию груза и округлите ответ до сотых джоуля.`;
  },
  explanationTemplate: (params, answer) => {
    const value = energies(params);
    return `Относительно положения равновесия полная энергия равна $W=\\frac{kA^2}{2}=\\frac{${value.stiffnessNPerM}\\cdot${formatMathValue(value.amplitudeM)}^2}{2}=${formatMathValue(value.totalJ)}$ Дж. При смещении x потенциальная энергия системы $W_p=\\frac{kx^2}{2}=\\frac{${value.stiffnessNPerM}\\cdot${formatMathValue(value.displacementM)}^2}{2}=${formatMathValue(value.potentialJ)}$ Дж. Поэтому $W_k=W-W_p=${formatMathValue(value.totalJ)}-${formatMathValue(value.potentialJ)}\\approx${formatMathValue(answer)}$ Дж.`;
  },
  trap: "Сначала найди полную энергию при x=A, затем вычти энергию пружины при данном смещении. Амплитуду и смещение переведи из сантиметров в метры.",
  coachLines: {
    correct: () => "Верно: в эту точку часть полной энергии уже перешла в энергию пружины, осталась кинетическая.",
    wrong: (params, selected, correct) => {
      const value = energies(params);
      return `Найди W = kA²/2 = ${formatAnswerValue(value.totalJ)} Дж, затем Wₚ = kx²/2 = ${formatAnswerValue(value.potentialJ)} Дж. Их разность даёт Wₖ = ${formatAnswerValue(correct)} Дж; твой ответ — ${formatAnswerValue(selected)} Дж.`;
    },
  },
  variantCount: cases.length,
};
