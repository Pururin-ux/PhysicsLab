import { planeMirrorSeparationDistractors } from "../distractors.ts";
import { planeMirrorSeparation, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

const objects = ["свеча", "настольная лампа", "карандаш"];

function objectFor(p: Params): string {
  return objects[variantIndex(p, objects.length)];
}

export const planeMirrorSeparationBlueprint: TaskBlueprint = {
  id: "plane-mirror-separation",
  skill: "Плоское зеркало",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: {
    d: { min: 20, max: 80, step: 5, unit: "см" },
  },
  formula: "L=2d",
  answerUnit: "см",
  answerKind: "positive",
  answerFormat: "numeric_input",
  diagram: (p) => ({
    kind: "optics",
    spec: {
      scene: "plane_mirror",
      objectDistance: p.d,
      imageDistance: p.d,
      unit: "см",
    },
  }),
  solver: planeMirrorSeparation,
  distractors: planeMirrorSeparationDistractors,
  textTemplate: (p) =>
    `Перед плоским зеркалом на расстоянии ${p.d} см стоит ${objectFor(p)}. Найдите расстояние между предметом и его изображением в зеркале.`,
  explanationTemplate: (p, answer) =>
    `Мнимое изображение в плоском зеркале находится на таком же расстоянии за зеркалом, как предмет перед ним. Расстояние между предметом и изображением: $L=2d=2\\cdot${p.d}=${formatAnswerValue(answer)}$ см.`,
  trap: "Спрашивают расстояние между предметом и изображением — это удвоенное расстояние до зеркала.",
  coachLines: {
    correct: () => "Верно. Предмет и изображение симметричны относительно зеркала, поэтому расстояние между ними — 2d.",
    wrong: (p, selected, correct) =>
      `Изображение лежит за зеркалом на том же расстоянии ${p.d} см. Между предметом и изображением ${formatAnswerValue(correct)} см, а не ${formatAnswerValue(selected)} см.`,
  },
  variantCount: objects.length,
};
