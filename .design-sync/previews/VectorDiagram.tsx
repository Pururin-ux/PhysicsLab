import { VectorDiagram } from "web";

export const ResultantForce = () => (
  <div style={{ width: 380 }}>
    <VectorDiagram
      spec={{
        id: "preview-resultant",
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
      }}
    />
  </div>
);

export const RelativeVelocity = () => (
  <div style={{ width: 380 }}>
    <VectorDiagram
      spec={{
        id: "preview-velocity",
        gridRange: 5,
        layout: "chain",
        vectors: [
          { id: "boat", dx: 0, dy: 4, label: "v₁", tone: "blue" },
          { id: "current", dx: 3, dy: 0, label: "v₂", tone: "gold" },
        ],
        showResultant: true,
        resultantLabel: "v",
        resultantTone: "ember",
      }}
    />
  </div>
);
