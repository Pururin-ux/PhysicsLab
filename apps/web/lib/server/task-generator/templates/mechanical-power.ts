import { variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function target(p: Params) { return variantIndex(p, 3); }
function work(p: Params) { return p.P * p.t; }
function answer(p: Params) { return target(p) === 1 ? work(p) : target(p) === 2 ? p.t : p.P; }
function unit(p: Params) { return ["Вт", "Дж", "с"][target(p)]; }

export const mechanicalPowerBlueprint: TaskBlueprint = {
  id: "mechanical-power",
  skill: "Механическая мощность",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    P: { min: 50, max: 500, step: 50, unit: "Вт" },
    t: { min: 2, max: 20, step: 2, unit: "с" },
  },
  formula: "P=\\frac{A}{t}",
  answerUnit: unit,
  answerKind: "positive",
  solver: answer,
  distractors: [
    { label: "перепутал работу и мощность", compute: p => target(p) === 0 ? work(p) : target(p) === 1 ? p.P : work(p) },
    { label: "перепутал умножение и деление", compute: p => target(p) === 0 ? p.P / p.t : target(p) === 1 ? p.P / p.t : p.P },
    { label: "сложил данные вместо связи P=A/t", compute: p => target(p) === 0 ? p.P + p.t : target(p) === 1 ? work(p) + p.P : p.t + p.P },
  ],
  textTemplate: p => {
    const A = work(p);
    if (target(p) === 1) return `Механизм развивает мощность ${p.P} Вт и работает ${p.t} с. Какую работу он совершает за это время?`;
    if (target(p) === 2) return `Механизм совершил работу ${A} Дж при мощности ${p.P} Вт. Сколько времени продолжалась работа?`;
    return `Механизм совершил работу ${A} Дж за ${p.t} с. Какова его мощность?`;
  },
  explanationTemplate: (p, result) => {
    const A = work(p);
    if (target(p) === 1) return `Работа равна мощности, умноженной на время: $A=Pt=${p.P}\\cdot${p.t}=${formatMathValue(result)}$ Дж.`;
    if (target(p) === 2) return `Время равно работе, делённой на мощность: $t=\\frac{A}{P}=\\frac{${A}}{${p.P}}=${formatMathValue(result)}$ с.`;
    return `Мощность равна работе за единицу времени: $P=\\frac{A}{t}=\\frac{${A}}{${p.t}}=${formatMathValue(result)}$ Вт.`;
  },
  trap: "Путает работу в джоулях с мощностью в ваттах или меняет местами умножение и деление.",
  coachLines: {
    correct: p => target(p) === 0 ? "Верно: мощность показывает, сколько джоулей работы совершается за секунду." : target(p) === 1 ? "Верно: при постоянной мощности работа накапливается со временем." : "Верно: время получили, разделив всю работу на работу за одну секунду.",
    wrong: (p, selected, correct) => `Используй связь P = A/t и сначала назови неизвестную величину. Получается ${formatAnswerValue(correct)} ${unit(p)}, а не ${formatAnswerValue(selected)} ${unit(p)}.`,
  },
  variantCount: 3,
};
