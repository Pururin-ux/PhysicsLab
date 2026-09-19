import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const prompts = [
  "Луч света переходит из воздуха в воду под ненулевым углом к нормали. Как изменится его направление?",
  "Луч света выходит из воды в воздух под ненулевым углом к нормали. Как изменится его направление?",
  "Луч света падает из воздуха на воду точно вдоль нормали. Что произойдёт с его направлением?",
  "Луч прошёл из воздуха в воду по некоторому пути. Что произойдёт, если направить свет обратно вдоль преломлённого луча?",
];

const optionLabels: Record<number, readonly string[]> = {
  1: ["Отклонится к нормали", "Отклонится от нормали", "Пойдёт вдоль границы", "Вернётся по падающему лучу"],
  2: ["Отклонится к нормали", "Отклонится от нормали", "Пойдёт вдоль границы", "Не выйдет из воды при любом угле"],
  3: ["Отклонится к нормали", "Отклонится от нормали", "Не изменит направление", "Повернёт на 90°"],
  4: ["Пойдёт по другому пути", "Останется в воде", "Вернётся по прежнему пути", "Пойдёт вдоль границы"],
};

const answers: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 3 };

function answerFor(params: Params): number {
  return answers[params.caseId] ?? 1;
}

function otherAnswer(offset: number): DistractorRule {
  return {
    label: `выбран неверный вывод ${offset}`,
    compute: params => ((answerFor(params) - 1 + offset) % 4) + 1,
  };
}

function explanation(params: Params): string {
  if (params.caseId === 1) return "Вода оптически плотнее воздуха. При переходе в более плотную среду преломлённый луч отклоняется к нормали, поэтому угол преломления меньше угла падения.";
  if (params.caseId === 2) return "При выходе из воды в воздух луч переходит в оптически менее плотную среду и отклоняется от нормали: угол преломления больше угла падения.";
  if (params.caseId === 3) return "При падении вдоль нормали угол падения равен нулю. Луч проходит границу по той же прямой и не меняет направление.";
  return "Ход световых лучей обратим. При обратном направлении луч пройдёт тот же путь через границу сред в противоположную сторону.";
}

export const refractionDirectionBlueprint: TaskBlueprint = {
  id: "refraction-direction",
  skill: "Направление преломлённого луча",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: { caseId: { min: 1, max: 4, step: 1, unit: "сценарий" } },
  formula: "\\alpha,\\gamma\\text{ — от нормали}",
  answerUnit: "",
  answerKind: "positive",
  solver: answerFor,
  distractors: [otherAnswer(1), otherAnswer(2), otherAnswer(3)],
  optionText: (value, params) => optionLabels[params.caseId]?.[value - 1] ?? String(value),
  textTemplate: params => prompts[params.caseId - 1] ?? prompts[0],
  explanationTemplate: params => explanation(params),
  trap: "Сначала определи, в какую среду входит свет. Оба угла отсчитывай от нормали; при падении по нормали луч не поворачивает.",
  coachLines: {
    correct: params => params.caseId === 3
      ? "Верно. Нулевой угол падения — особый случай без поворота луча."
      : params.caseId === 4
        ? "Верно. Обратимость возвращает луч по тому же пути."
        : "Верно. Направление поворота согласовано с переходом между воздухом и водой.",
    wrong: params => `Сначала отметь нормаль и направление перехода между средами. ${explanation(params)}`,
  },
};
