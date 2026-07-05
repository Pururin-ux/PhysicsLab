export type CircuitTone = "cyan" | "gold" | "blue" | "ember";

// Фиксированные семейства схем — без общего движка компоновки графов,
// как и договорились в generator-gap-analysis.md: каждая топология рисуется
// по своим координатам, но делит общий визуальный язык и оверлеи.
export type CircuitTopology = "single" | "series" | "parallel" | "source-internal";

export type CircuitSwitchSpec = {
  state: "open" | "closed";
  label?: string;
};

export type CircuitMeterSpec = {
  kind: "ammeter" | "voltmeter";
  label?: string;
};

export type CircuitDiagramSpec = {
  id?: string;
  topology: CircuitTopology;
  sourceLabel?: string;
  internalResistanceLabel?: string;
  resistorLabels: string[];
  switch?: CircuitSwitchSpec;
  meter?: CircuitMeterSpec;
  tone?: CircuitTone;
};
