import { variantIndex } from "../solver.ts";
import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

function pullingForce(p: Params): number {
  return p.P / 2;
}

const contexts = [
  "В школьной лаборатории",
  "На учебном стенде",
  "В мастерской",
  "На макете подъёмника",
  "При проверке грузоподъёмной установки",
] as const;

const distractors: DistractorRule[] = [
  { label: "принял силу равной всему весу", compute: (p) => p.P },
  { label: "умножил вес на два", compute: (p) => p.P * 2 },
  { label: "разделил вес на четыре", compute: (p) => p.P / 4 },
];

export const movablePulleyBlueprint: TaskBlueprint = {
  id: "movable-pulley",
  skill: "Выигрыш в силе подвижного блока",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    P: { min: 40, max: 600, step: 20, unit: "Н" },
  },
  formula: "F\\approx P/2",
  answerUnit: "Н",
  answerKind: "positive",
  solver: pullingForce,
  distractors,
  textTemplate: (p) =>
    `${contexts[variantIndex(p, contexts.length)]} груз весом ${p.P} Н равномерно поднимают одним идеальным подвижным блоком. Весом блока и нити, а также трением пренебрегают. Какую силу нужно приложить к свободному концу нити?`,
  explanationTemplate: (p, answer) =>
    `Подвижный блок вместе с грузом удерживают две ветви одной нити. Натяжение каждой ветви равно приложенной силе: $P=2F$. Поэтому $F=P/2=${p.P}/2=${formatAnswerValue(answer)}$ Н.`,
  trap: "Считает, что любой блок только меняет направление силы, и не учитывает две несущие ветви.",
  coachLines: {
    correct: () => "Да. Две ветви нити делят вес груза поровну, поэтому нужна половина веса.",
    wrong: (p, selected, correct) =>
      `Проследи нить вокруг движущегося блока: его поддерживают две ветви. Поэтому $F=P/2=${formatAnswerValue(correct)}$ Н, а не ${formatAnswerValue(selected)}$ Н.`,
  },
  variantCount: contexts.length,
};
