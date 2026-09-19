import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const prompts = [
  "Без коррекции изображение удалённого предмета фокусируется перед сетчаткой. Какая линза очков нужна?",
  "Без коррекции изображение близкого предмета фокусировалось бы за сетчаткой. Какая линза очков нужна?",
  "В рецепте указана оптическая сила −2 дптр. Какая это линза и какой дефект она корректирует в школьной модели?",
  "В рецепте указана оптическая сила +2,5 дптр. Какая это линза и какой дефект она корректирует в школьной модели?",
];

const optionLabels = [
  "Рассеивающая, D < 0; коррекция близорукости",
  "Собирающая, D > 0; коррекция дальнозоркости",
  "Собирающая, D < 0; коррекция близорукости",
  "Рассеивающая, D > 0; коррекция дальнозоркости",
] as const;

function answerFor(params: Params): number {
  return params.caseId === 2 || params.caseId === 4 ? 2 : 1;
}

function otherAnswer(offset: number): DistractorRule {
  return {
    label: `перепутан тип или знак корректирующей линзы ${offset}`,
    compute: params => ((answerFor(params) - 1 + offset) % 4) + 1,
  };
}

function explanation(params: Params): string {
  if (params.caseId === 1) return "Фокус перед сетчаткой означает близорукость. Рассеивающая линза с D < 0 уменьшает сходимость пучка и переносит фокус назад, на сетчатку.";
  if (params.caseId === 2) return "Фокус за сетчаткой означает дальнозоркость для близкого предмета. Собирающая линза с D > 0 добавляет сходимость и переносит фокус вперёд, на сетчатку.";
  if (params.caseId === 3) return "Отрицательная оптическая сила принадлежит рассеивающей линзе. В школьной модели её используют для коррекции близорукости.";
  return "Положительная оптическая сила принадлежит собирающей линзе. В школьной модели её используют для коррекции дальнозоркости.";
}

export const visionCorrectionBlueprint: TaskBlueprint = {
  id: "vision-correction",
  skill: "Коррекция зрения линзами",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: { caseId: { min: 1, max: 4, step: 1, unit: "сценарий" } },
  formula: "D<0\\;\\text{— рассеивающая};\\quad D>0\\;\\text{— собирающая}",
  answerUnit: "",
  answerKind: "signed",
  solver: answerFor,
  distractors: [otherAnswer(1), otherAnswer(2), otherAnswer(3)],
  optionText: value => optionLabels[value - 1] ?? String(value),
  textTemplate: params => prompts[params.caseId - 1] ?? prompts[0],
  explanationTemplate: params => explanation(params),
  trap: "Сначала отметь фокус относительно сетчатки. Перед сетчаткой — нужно ослабить сходимость; за сетчаткой — усилить.",
  coachLines: {
    correct: params => params.caseId === 1 || params.caseId === 3
      ? "Верно. Рассеивающая линза имеет отрицательную оптическую силу и корректирует близорукость."
      : "Верно. Собирающая линза имеет положительную оптическую силу и корректирует дальнозоркость.",
    wrong: params => `Не начинай со знака на память: сначала найди положение фокуса. ${explanation(params)}`,
  },
};
