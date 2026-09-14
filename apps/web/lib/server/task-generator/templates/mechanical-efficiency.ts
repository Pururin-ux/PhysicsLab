import { variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function target(p: Params) { return variantIndex(p, 3); }
function useful(p: Params) { return p.A * p.eta / 100; }
function answer(p: Params) { return target(p) === 0 ? p.eta : target(p) === 1 ? useful(p) : p.A; }
function unit(p: Params) { return target(p) === 0 ? "%" : "Дж"; }

export const mechanicalEfficiencyBlueprint: TaskBlueprint = {
  id: "mechanical-efficiency",
  skill: "Коэффициент полезного действия",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    A: { min: 200, max: 1000, step: 100, unit: "Дж" },
    eta: { min: 20, max: 80, step: 10, unit: "%" },
  },
  formula: "\\eta=\\frac{A_{\\text{пол}}}{A_{\\text{сов}}}\\cdot100\\%",
  answerUnit: unit,
  answerKind: "positive",
  solver: answer,
  distractors: [
    { label: "использовал бесполезную работу вместо полезной", compute: p => target(p) === 0 ? 100 - p.eta : target(p) === 1 ? p.A - useful(p) : p.A - useful(p) },
    { label: "не перевёл проценты в долю", compute: p => target(p) === 0 ? p.eta / 100 : target(p) === 1 ? p.A * p.eta : useful(p) },
    { label: "перепутал часть и целое", compute: p => target(p) === 0 ? 100 / p.eta : target(p) === 1 ? p.A : p.A * 100 / (100 - p.eta) },
  ],
  textTemplate: p => {
    const Auseful = useful(p);
    if (target(p) === 1) return `Механизм совершил ${p.A} Дж полной работы при КПД ${p.eta}%. Какую полезную работу он совершил?`;
    if (target(p) === 2) return `Полезная работа механизма равна ${Auseful} Дж, а КПД — ${p.eta}%. Какова полная совершённая работа?`;
    return `Механизм совершил ${p.A} Дж полной работы, из них ${Auseful} Дж — полезная работа. Чему равен КПД?`;
  },
  explanationTemplate: (p, result) => {
    const Auseful = useful(p);
    if (target(p) === 1) return `Полезная работа составляет ${p.eta}% от полной: $A_{\\text{пол}}=\\frac{${p.eta}}{100}\\cdot${p.A}=${formatMathValue(result)}$ Дж.`;
    if (target(p) === 2) return `Из $\\eta=\\frac{A_{\\text{пол}}}{A_{\\text{сов}}}\\cdot100\\%$ получаем $A_{\\text{сов}}=\\frac{${Auseful}\\cdot100}{${p.eta}}=${formatMathValue(result)}$ Дж.`;
    return `КПД равен доле полезной работы: $\\eta=\\frac{${Auseful}}{${p.A}}\\cdot100\\%=${formatMathValue(result)}\\%$.`;
  },
  trap: "Путает полезную и полную работу или подставляет проценты без перевода в долю.",
  coachLines: {
    correct: p => target(p) === 0 ? "Верно: КПД показывает долю полезной работы во всей совершённой работе." : target(p) === 1 ? "Верно: полезная работа — указанная процентная доля полной работы." : "Верно: полная работа — это целое, относительно которого задана полезная доля.",
    wrong: (p, selected, correct) => `Сначала обозначь целое — полную работу — и её полезную часть. Получается ${formatAnswerValue(correct)} ${unit(p)}, а не ${formatAnswerValue(selected)} ${unit(p)}.`,
  },
  constraints: [p => p.eta !== 50],
  variantCount: 3,
};
