import { reflectionAngleDistractors } from "../distractors.ts";
import { reflectionAngle, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue } from "../validator.ts";

const surfaces = ["плоское зеркало", "горизонтальное плоское зеркало", "зеркальную пластину"];

function surfaceFor(p: Params): string {
  return surfaces[variantIndex(p, surfaces.length)];
}

export const reflectionAngleBlueprint: TaskBlueprint = {
  id: "reflection-angle",
  skill: "Закон отражения света",
  topic: "Оптика",
  group: "optics",
  difficulty: 1,
  params: {
    // θ=30 сам отфильтруется: там 2θ совпадает с 90−θ и валидатор
    // отбрасывает кандидата из-за дубликата дистракторов.
    angle: { min: 10, max: 40, step: 2, unit: "°" },
  },
  // Обозначения белорусских учебников: α — угол падения, β — угол отражения.
  formula: "\\beta=\\alpha",
  answerUnit: "°",
  answerKind: "positive",
  diagram: (p) => ({
    kind: "optics",
    spec: {
      scene: "reflection",
      incidenceAngleDeg: p.angle,
      reflectionAngleDeg: p.angle,
    },
  }),
  solver: reflectionAngle,
  distractors: reflectionAngleDistractors,
  textTemplate: (p) =>
    `Луч света падает на ${surfaceFor(p)}. Угол падения, отсчитанный от нормали (перпендикуляра к зеркалу), равен ${p.angle}°. Найдите угол отражения, отсчитанный от той же нормали.`,
  explanationTemplate: (p, answer) =>
    `По закону отражения угол отражения равен углу падения, оба отсчитываются от нормали: $\\beta=\\alpha=${p.angle}^\\circ$. Ответ: ${formatAnswerValue(answer)}°.`,
  trap: "Оба угла отсчитываются от нормали, а не от поверхности зеркала.",
  coachLines: {
    correct: () => "Верно. Угол отражения равен углу падения — оба от нормали.",
    wrong: (p, selected, correct) =>
      `Проверь, от чего отсчитан угол: от нормали правильный ответ ${formatAnswerValue(correct)}°, а не ${formatAnswerValue(selected)}°.`,
  },
  variantCount: surfaces.length,
};
