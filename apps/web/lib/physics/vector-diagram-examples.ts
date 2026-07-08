import type { VectorDiagramSpec } from "./vector-diagram-spec";

// Две силы под прямым углом, приложенные к одной точке — классическая
// картинка для задачи на равнодействующую (ЦЭ, В4).
export const resultantForceExample: VectorDiagramSpec = {
  id: "resultant-force-example",
  gridRange: 5,
  layout: "concurrent",
  vectors: [
    { id: "f1", dx: 4, dy: 0, label: "F₁", tone: "gold" },
    { id: "f2", dx: 0, dy: 3, label: "F₂", tone: "cyan" },
  ],
  angleMarks: [{ between: ["f1", "f2"] }],
  showResultant: true,
  resultantLabel: "F",
  resultantTone: "ember",
};

// Сложение скоростей «конец к началу»: пловец плывёт поперёк реки,
// течение сносит вбок — итоговая скорость относительно берега.
export const relativeVelocityExample: VectorDiagramSpec = {
  id: "relative-velocity-example",
  gridRange: 5,
  layout: "chain",
  vectors: [
    { id: "swimmer", dx: 0, dy: 4, label: "v₁", tone: "blue" },
    { id: "current", dx: 3, dy: 0, label: "v₂", tone: "gold" },
  ],
  showResultant: true,
  resultantLabel: "v",
  resultantTone: "ember",
};

export const vectorDiagramExamples: VectorDiagramSpec[] = [
  resultantForceExample,
  relativeVelocityExample,
];
