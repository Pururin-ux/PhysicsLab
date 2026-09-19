import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const prompts = [
  "Небольшой источник можно считать точечным. Что появится на экране за непрозрачным телом?",
  "Протяжённая лампа освещает непрозрачный шар. Что можно увидеть на экране?",
  "Размер протяжённого источника увеличили, не меняя положение тела и экрана. Как изменится полутень?",
  "Почему за непрозрачным телом образуется тень в однородном воздухе?",
] as const;

const optionLabels = [
  "Тень с резкой границей",
  "Тень и полутень",
  "Полутень станет шире",
  "Свет распространяется прямолинейно",
] as const;

function answerFor(params: Params): number {
  return Math.max(1, Math.min(4, params.caseId));
}

function otherAnswer(offset: number): DistractorRule {
  return {
    label: `другая модель тени ${offset}`,
    compute: params => ((answerFor(params) - 1 + offset) % 4) + 1,
  };
}

function explanation(params: Params): string {
  if (params.caseId === 1) return "От точечного источника граничные лучи выходят из одной точки. За непрозрачным телом получается полная тень с резкой границей.";
  if (params.caseId === 2) return "Разные части протяжённого источника освещают края экрана по-разному. Поэтому рядом с полной тенью возникает полутень.";
  if (params.caseId === 3) return "Чем больше видимый размер источника, тем больше область, которая получает свет только от части источника, — полутень расширяется.";
  return "В однородной прозрачной среде свет идёт по прямым линиям. Непрозрачное тело перекрывает часть этих направлений.";
}

export const shadowAndPenumbraBlueprint: TaskBlueprint = {
  id: "shadow-and-penumbra",
  skill: "Тень и полутень",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: { caseId: { min: 1, max: 4, step: 1, unit: "сценарий" } },
  formula: "\\text{источник}\\;\\to\\;\\text{препятствие}\\;\\to\\;\\text{экран}",
  answerUnit: "",
  answerKind: "signed",
  solver: answerFor,
  distractors: [otherAnswer(1), otherAnswer(2), otherAnswer(3)],
  optionText: value => optionLabels[value - 1] ?? String(value),
  textTemplate: params => prompts[params.caseId - 1] ?? prompts[0],
  explanationTemplate: params => explanation(params),
  trap: "Сначала определи размер источника в условиях задачи. Точечный источник даёт резкую границу, протяжённый — полутень.",
  coachLines: {
    correct: params => `Верно. ${explanation(params)}`,
    wrong: params => `Проследи граничные лучи от краёв источника через края препятствия. ${explanation(params)}`,
  },
};
