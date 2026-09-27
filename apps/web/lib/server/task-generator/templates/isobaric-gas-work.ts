import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const contexts = [
  "Газ в цилиндре с подвижным поршнем",
  "Газ под поршнем",
  "Газ в учебной модели тепловой машины",
] as const;

function contextFor(params: Params): string {
  const variant = Math.abs(Math.trunc(params.__variant ?? 0));
  return contexts[variant % contexts.length];
}

function work(params: Params): number {
  // 1 кПа · 1 л = 1 Дж.
  return params.pressure * params.volumeChange;
}

const distractors: DistractorRule[] = [
  { label: "подставляешь конечный объём вместо изменения", compute: p => p.pressure * (p.volumeStart + p.volumeChange) },
  { label: "подставляешь начальный объём вместо изменения", compute: p => p.pressure * p.volumeStart },
  { label: "делишь результат на тысячу при переводе кПа·л в Дж", compute: p => work(p) / 1000 },
];

export const isobaricGasWorkBlueprint: TaskBlueprint = {
  id: "isobaric-gas-work",
  skill: "Работа газа при изобарном расширении",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    pressure: { min: 100, max: 250, step: 25, unit: "кПа" },
    volumeStart: { min: 5, max: 10, step: 5, unit: "л" },
    volumeChange: { min: 15, max: 25, step: 5, unit: "л" },
  },
  formula: "A=p\\Delta V",
  answerUnit: "Дж",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: work,
  distractors,
  textTemplate: p => contextFor(p) + " медленно расширяется при постоянном давлении " +
    p.pressure + " кПа. Объём увеличивается с " + p.volumeStart + " до " +
    (p.volumeStart + p.volumeChange) + " л. Какую работу совершает газ? Ответ дайте в джоулях.",
  explanationTemplate: (p, answer) => "Изменение объёма: " + p.volumeChange +
    " л. Здесь 1 кПа·л = 1 Дж, поэтому $A=p\\Delta V=" +
    formatMathValue(p.pressure) + "\\cdot" + formatMathValue(p.volumeChange) +
    "=" + formatMathValue(answer) + "$ Дж. Газ расширился, значит его работа положительна.",
  trap: "Вычитай начальный объём из конечного. При данных единицах 1 кПа·л = 1 Дж.",
  coachLines: {
    correct: p => "Верно. При давлении " + p.pressure + " кПа газ совершает положительную работу при расширении.",
    wrong: (_p, selected, correct) => "Для работы газа возьми изменение объёма, а не один из объёмов. Получается " +
      formatAnswerValue(correct) + " Дж, а не " + formatAnswerValue(selected) + " Дж.",
  },
  variantCount: contexts.length,
};
