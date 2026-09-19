import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function processCase(p: Params): 1 | 2 | 3 {
  return Math.max(1, Math.min(3, Math.round(p.caseId))) as 1 | 2 | 3;
}

function solve(p: Params): number {
  switch (processCase(p)) {
    case 1: return p.scale / p.factor;
    case 2: return p.base * p.factor;
    case 3: return p.scale * p.factor;
  }
}

const distractors: DistractorRule[] = [
  {
    label: "выбрал противоположную пропорциональность",
    compute: (p) => processCase(p) === 2 ? p.base / p.factor : processCase(p) === 1 ? p.scale * p.factor : p.scale / p.factor,
  },
  {
    label: "оставил искомую величину неизменной",
    compute: (p) => processCase(p) === 2 ? p.base : p.scale,
  },
  {
    label: "записал коэффициент изменения вместо величины",
    compute: (p) => p.factor,
  },
];

export const idealGasIsoprocessBlueprint: TaskBlueprint = {
  id: "ideal-gas-isoprocess",
  skill: "Законы изопроцессов",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 1,
  params: {
    caseId: { min: 1, max: 3, step: 1, unit: "" },
    base: { min: 2, max: 6, step: 2, unit: "л" },
    factor: { min: 2, max: 4, step: 1, unit: "раз" },
    scale: { min: 120, max: 240, step: 120, unit: "кПа" },
  },
  formula: "pV=\\mathrm{const};\\quad \\frac VT=\\mathrm{const};\\quad \\frac pT=\\mathrm{const}",
  answerUnit: (p) => processCase(p) === 2 ? "л" : "кПа",
  answerKind: "positive",
  solver: solve,
  distractors,
  textTemplate: (p) => {
    const factor = formatAnswerValue(p.factor);
    switch (processCase(p)) {
      case 1:
        return `При постоянной температуре объём данной порции идеального газа увеличили в ${factor} раза. Начальное давление газа ${formatAnswerValue(p.scale)} кПа. Определите конечное давление.`;
      case 2:
        return `При постоянном давлении идеальный газ занимал объём ${formatAnswerValue(p.base)} л при температуре 300 К. Абсолютную температуру увеличили в ${factor} раза. Определите новый объём газа.`;
      case 3:
        return `В жёстком герметичном сосуде давление идеального газа при температуре 300 К равно ${formatAnswerValue(p.scale)} кПа. Абсолютную температуру увеличили в ${factor} раза. Определите новое давление газа.`;
    }
  },
  explanationTemplate: (p, answer) => {
    switch (processCase(p)) {
      case 1:
        return `Температура постоянна, поэтому $p_1V_1=p_2V_2$. Объём увеличился в ${formatMathValue(p.factor)} раза, значит давление уменьшилось во столько же раз: $p_2=${formatMathValue(p.scale)}/${formatMathValue(p.factor)}=${formatMathValue(answer)}$ кПа.`;
      case 2:
        return `Давление постоянно, поэтому $V/T=\\mathrm{const}$. Абсолютная температура увеличилась в ${formatMathValue(p.factor)} раза — объём увеличился во столько же: $V_2=${formatMathValue(p.base)}\\cdot${formatMathValue(p.factor)}=${formatMathValue(answer)}$ л.`;
      case 3:
        return `Объём постоянен, поэтому $p/T=\\mathrm{const}$. Абсолютная температура увеличилась в ${formatMathValue(p.factor)} раза — давление увеличилось во столько же: $p_2=${formatMathValue(p.scale)}\\cdot${formatMathValue(p.factor)}=${formatMathValue(answer)}$ кПа.`;
    }
  },
  trap: "Сначала назови неизменный параметр. Он определяет, какие две величины связаны прямо, а какие обратно.",
  coachLines: {
    correct: (p) => processCase(p) === 1
      ? "Да. При постоянной температуре давление обратно пропорционально объёму."
      : processCase(p) === 2
        ? "Да. При постоянном давлении объём прямо пропорционален абсолютной температуре."
        : "Да. При постоянном объёме давление прямо пропорционально абсолютной температуре.",
    wrong: (p, selected, correct) => `Зафиксируй неизменный параметр и выбери соответствующее отношение. Получается ${formatAnswerValue(correct)}, а не ${formatAnswerValue(selected)}.`,
  },
  constraints: [
    (p) => processCase(p) === 2 ? p.scale === 120 && p.base !== p.factor : p.base === 2,
  ],
};
