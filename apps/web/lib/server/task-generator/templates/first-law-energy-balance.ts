import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { heat: 680, gasWork: 320 },
  { heat: -560, gasWork: -200 },
  { heat: 420, gasWork: 420 },
  { heat: 1000, gasWork: 400 },
] as const;

function values(params: Params) {
  const chosen = cases[params.caseId - 1] ?? cases[0];
  return { heat: chosen.heat * params.scale, gasWork: chosen.gasWork * params.scale };
}

function change(params: Params): number {
  const { heat, gasWork } = values(params);
  return heat - gasWork;
}

const distractors: DistractorRule[] = [
  { label: "складываешь Q и работу газа вместо вычитания", compute: p => { const v = values(p); return v.heat + v.gasWork; } },
  { label: "принимаешь Q за всё изменение внутренней энергии", compute: p => values(p).heat },
  { label: "теряешь направление теплопередачи", compute: p => -values(p).heat },
];

function condition(params: Params): string {
  const { heat, gasWork } = values(params);
  if (params.caseId === 1) return "Газ получил " + heat + " Дж при теплообмене и совершил работу " + gasWork + " Дж.";
  if (params.caseId === 2) return "Газ отдал окружению " + Math.abs(heat) +
    " Дж при теплообмене. Внешние силы совершили над газом работу " + Math.abs(gasWork) + " Дж.";
  if (params.caseId === 3) return "Идеальный газ изотермически расширился: получил " +
    heat + " Дж при теплообмене и совершил работу " + gasWork + " Дж.";
  return "Одноатомный идеальный газ изобарно расширился: получил " +
    heat + " Дж при теплообмене и совершил работу " + gasWork + " Дж.";
}

export const firstLawEnergyBalanceBlueprint: TaskBlueprint = {
  id: "first-law-energy-balance",
  skill: "Первый закон термодинамики",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    caseId: { min: 1, max: 4, step: 1, unit: "случай" },
    scale: { min: 1, max: 3, step: 1, unit: "множитель" },
  },
  formula: "\\Delta U=Q-A_{\\text{газа}}",
  answerUnit: "Дж",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: change,
  distractors,
  textTemplate: params => condition(params) + " Найдите изменение внутренней энергии газа в джоулях. Если ответ отрицателен, укажите минус.",
  explanationTemplate: (params, answer) => {
    const { heat, gasWork } = values(params);
    return "Для работы газа первый закон имеет вид $\\Delta U=Q-A_{\\text{газа}}$. " +
      "Здесь $Q=" + formatMathValue(heat) + "$ Дж и $A_{\\text{газа}}=" +
      formatMathValue(gasWork) + "$ Дж. Поэтому $\\Delta U=" +
      formatMathValue(heat) + "-(" + formatMathValue(gasWork) + ")=" +
      formatMathValue(answer) + "$ Дж.";
  },
  trap: "Назови знак Q и знак работы именно газа. Работа внешних сил имеет противоположный знак.",
  coachLines: {
    correct: () => "Верно. Ты вычел работу газа из полученного системой количества теплоты с учётом знаков.",
    wrong: (_params, selected, correct) => "Проверь, чью работу ты использовал: $\\Delta U=Q-A_{\\text{газа}}$. Получается " +
      formatAnswerValue(correct) + " Дж, а не " + formatAnswerValue(selected) + " Дж.",
  },
};
