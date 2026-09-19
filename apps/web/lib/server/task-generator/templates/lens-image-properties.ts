import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const prompts = [
  "Предмет расположен дальше двойного фокуса собирающей линзы. Каким получится изображение?",
  "Предмет расположен в двойном фокусе собирающей линзы: d = 2F. Каким получится изображение?",
  "Предмет расположен между F и 2F собирающей линзы. Каким получится изображение?",
  "Предмет расположен ближе фокуса собирающей линзы: d < F. Каким получится изображение?",
  "Перед рассеивающей линзой находится действительный предмет. Каким будет его изображение?",
];

const collectingOptions = [
  "Действительное, перевёрнутое, уменьшенное",
  "Действительное, перевёрнутое, равное предмету",
  "Действительное, перевёрнутое, увеличенное",
  "Мнимое, прямое, увеличенное",
] as const;

const divergingOptions = [
  "Мнимое, прямое, уменьшенное",
  "Мнимое, прямое, увеличенное",
  "Действительное, перевёрнутое, уменьшенное",
  "Действительное, перевёрнутое, увеличенное",
] as const;

const answers: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 1 };

function answerFor(params: Params): number {
  return answers[params.caseId] ?? 1;
}

function otherAnswer(offset: number): DistractorRule {
  return {
    label: `выбран неверный тип изображения ${offset}`,
    compute: params => ((answerFor(params) - 1 + offset) % 4) + 1,
  };
}

function explanation(params: Params): string {
  if (params.caseId === 1) return "При d > 2F сами преломлённые лучи пересекаются между F и 2F. Изображение действительное, перевёрнутое и уменьшенное.";
  if (params.caseId === 2) return "При d = 2F изображение возникает в 2F по другую сторону линзы. Оно действительное, перевёрнутое и равно предмету по размеру.";
  if (params.caseId === 3) return "Когда F < d < 2F, сами лучи пересекаются дальше 2F. Изображение действительное, перевёрнутое и увеличенное.";
  if (params.caseId === 4) return "При d < F лучи за собирающей линзой расходятся. Пересекаются только их продолжения, поэтому изображение мнимое, прямое и увеличенное.";
  return "Рассеивающая линза при действительном предмете даёт мнимое, прямое и уменьшенное изображение: пересекаются продолжения расходящихся лучей.";
}

export const lensImagePropertiesBlueprint: TaskBlueprint = {
  id: "lens-image-properties",
  skill: "Свойства изображения в линзе",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: { caseId: { min: 1, max: 5, step: 1, unit: "сценарий" } },
  formula: "d\\;\\text{относительно}\\;F\\;\\text{и}\\;2F",
  answerUnit: "",
  answerKind: "positive",
  solver: answerFor,
  distractors: [otherAnswer(1), otherAnswer(2), otherAnswer(3)],
  optionText: (value, params) => (params.caseId === 5 ? divergingOptions : collectingOptions)[value - 1] ?? String(value),
  textTemplate: params => prompts[params.caseId - 1] ?? prompts[0],
  explanationTemplate: params => explanation(params),
  trap: "Сначала отметь тип линзы и положение предмета относительно F и 2F. Экран ловит только действительное изображение.",
  coachLines: {
    correct: params => params.caseId === 4 || params.caseId === 5
      ? "Верно. Здесь пересекаются продолжения лучей, поэтому изображение мнимое и прямое."
      : "Верно. Сами преломлённые лучи пересекаются, поэтому изображение действительное и перевёрнутое.",
    wrong: params => `Построй два луча: параллельный оси и проходящий через оптический центр. ${explanation(params)}`,
  },
};
