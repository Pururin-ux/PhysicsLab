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
  /** A voltmeter measures across the source terminals or the external load. */
  across?: "source" | "load";
};

export type CircuitDiagramSpec = {
  id?: string;
  topology: CircuitTopology;
  sourceLabel?: string;
  internalResistanceLabel?: string;
  resistorLabels: string[];
  switch?: CircuitSwitchSpec;
  meters?: CircuitMeterSpec[];
  /** @deprecated Prefer meters when a schematic needs more than one instrument. */
  meter?: CircuitMeterSpec;
  tone?: CircuitTone;
};
