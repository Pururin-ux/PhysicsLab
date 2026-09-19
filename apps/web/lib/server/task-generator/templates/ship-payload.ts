import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";
import { variantIndex } from "../solver.ts";

function payload(p: Params): number {
  return p.payload;
}

function emptyShipMass(p: Params): number {
  return p.displacement - p.payload;
}

const vessels = ["учебного катера", "речного парома", "грузового судна", "исследовательского судна", "спасательного катера"] as const;

const distractors: DistractorRule[] = [
  { label: "принял водоизмещение за грузоподъёмность", compute: (p) => p.displacement },
  { label: "указал массу пустого судна", compute: (p) => emptyShipMass(p) },
  { label: "сложил массы вместо вычитания", compute: (p) => p.displacement + emptyShipMass(p) },
];

export const shipPayloadBlueprint: TaskBlueprint = {
  id: "ship-payload",
  skill: "Грузоподъёмность судна",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    displacement: { min: 120, max: 1000, step: 40, unit: "т" },
    payload: { min: 20, max: 100, step: 20, unit: "т" },
  },
  formula: "m_{\\text{гр}}=m_{\\text{в}}-m",
  answerUnit: "т",
  answerKind: "positive",
  solver: payload,
  distractors,
  textTemplate: (p) =>
    `Водоизмещение ${vessels[variantIndex(p, vessels.length)]} при предельной осадке равно ${p.displacement} т, а масса судна без груза — ${emptyShipMass(p)} т. Найдите его максимально допустимую грузоподъёмность.`,
  explanationTemplate: (p, answer) =>
    `Грузоподъёмность равна разности между водоизмещением и массой судна без груза: $m_{\\text{гр}}=m_{\\text{в}}-m=${p.displacement}-${emptyShipMass(p)}=${formatAnswerValue(answer)}$ т.`,
  trap: "Принимает всё водоизмещение за массу груза и забывает вычесть массу самого судна.",
  coachLines: {
    correct: () => "Да. Из предельной массы судна с грузом вычитаем массу самого судна.",
    wrong: (p, selected, correct) =>
      `Водоизмещение включает и судно, и груз. Вычти массу пустого судна: ответ ${formatAnswerValue(correct)} т, а не ${formatAnswerValue(selected)} т.`,
  },
  variantCount: vessels.length,
};
