import { CircuitDiagram } from "web";

export const SingleResistor = () => (
  <div style={{ width: 360 }}>
    <CircuitDiagram
      spec={{
        id: "preview-single",
        topology: "single",
        sourceLabel: "U",
        resistorLabels: ["R"],
        tone: "gold",
      }}
    />
  </div>
);

export const SeriesWithSwitch = () => (
  <div style={{ width: 360 }}>
    <CircuitDiagram
      spec={{
        id: "preview-series",
        topology: "series",
        sourceLabel: "ε",
        resistorLabels: ["R₁", "R₂"],
        tone: "cyan",
        switch: { state: "closed" },
      }}
    />
  </div>
);

export const ParallelWithAmmeter = () => (
  <div style={{ width: 360 }}>
    <CircuitDiagram
      spec={{
        id: "preview-parallel",
        topology: "parallel",
        sourceLabel: "U",
        resistorLabels: ["R₁", "R₂"],
        tone: "blue",
        meter: { kind: "ammeter" },
      }}
    />
  </div>
);

export const SourceInternalResistance = () => (
  <div style={{ width: 360 }}>
    <CircuitDiagram
      spec={{
        id: "preview-internal",
        topology: "source-internal",
        sourceLabel: "ε",
        internalResistanceLabel: "r",
        resistorLabels: ["R"],
        tone: "gold",
        meter: { kind: "voltmeter" },
      }}
    />
  </div>
);
