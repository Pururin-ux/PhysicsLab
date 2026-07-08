import type { CircuitDiagramSpec } from "./circuit-diagram-spec";

export const singleResistorExample: CircuitDiagramSpec = {
  id: "single-resistor-example",
  topology: "single",
  sourceLabel: "U",
  resistorLabels: ["R"],
  tone: "gold",
};

export const seriesResistorsExample: CircuitDiagramSpec = {
  id: "series-resistors-example",
  topology: "series",
  sourceLabel: "ε",
  resistorLabels: ["R₁", "R₂"],
  tone: "cyan",
  switch: { state: "closed" },
};

export const parallelResistorsExample: CircuitDiagramSpec = {
  id: "parallel-resistors-example",
  topology: "parallel",
  sourceLabel: "U",
  resistorLabels: ["R₁", "R₂"],
  tone: "blue",
  meter: { kind: "ammeter" },
};

export const sourceInternalResistanceExample: CircuitDiagramSpec = {
  id: "source-internal-resistance-example",
  topology: "source-internal",
  sourceLabel: "ε",
  internalResistanceLabel: "r",
  resistorLabels: ["R"],
  tone: "gold",
  meter: { kind: "voltmeter" },
};

export const circuitDiagramExamples: CircuitDiagramSpec[] = [
  singleResistorExample,
  seriesResistorsExample,
  parallelResistorsExample,
  sourceInternalResistanceExample,
];
