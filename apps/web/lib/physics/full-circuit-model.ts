export type FullCircuitInput = {
  emfV: number;
  internalResistanceOhm: number;
  loadResistanceOhm: number;
  closed: boolean;
};

export type FullCircuitReading = {
  currentA: number;
  terminalVoltageV: number;
  internalDropV: number;
  efficiency: number | null;
  estimatedInternalResistanceOhm: number | null;
};

export type InternalResistanceEstimate = {
  valueOhm: number;
  minimumOhm: number;
  maximumOhm: number;
};

export type FullCircuitPowerEstimate = {
  loadPowerW: number;
  sourcePowerW: number;
  efficiency: number;
};

/** Uses the open-circuit reading as an estimate of EMF for a recorded load reading. */
export function estimatePowerBalanceFromReadings(input: {
  emfV: number;
  terminalVoltageV: number;
  currentA: number;
}): FullCircuitPowerEstimate | null {
  const { emfV, terminalVoltageV, currentA } = input;
  if (
    ![emfV, terminalVoltageV, currentA].every(Number.isFinite) ||
    emfV < 0 ||
    terminalVoltageV < 0 ||
    currentA < 0
  ) {
    throw new RangeError("Оценка мощности требует конечных неотрицательных показаний.");
  }

  if (emfV === 0 || currentA === 0 || terminalVoltageV > emfV) return null;

  const sourcePowerW = emfV * currentA;
  const loadPowerW = terminalVoltageV * currentA;
  return {
    loadPowerW,
    sourcePowerW,
    efficiency: loadPowerW / sourcePowerW,
  };
}

/**
 * Estimates r from rounded instrument readings. The interval only reflects
 * rounding to the stated display step; it is not a real instrument tolerance.
 */
export function estimateInternalResistanceFromReadings(input: {
  emfV: number;
  terminalVoltageV: number;
  currentA: number;
  displayStep: number;
}): InternalResistanceEstimate | null {
  const { emfV, terminalVoltageV, currentA, displayStep } = input;
  if (
    ![emfV, terminalVoltageV, currentA, displayStep].every(Number.isFinite) ||
    emfV < 0 ||
    terminalVoltageV < 0 ||
    currentA < 0 ||
    displayStep <= 0
  ) {
    throw new RangeError("Оценка r требует конечных показаний и положительного шага шкалы.");
  }

  const halfStep = displayStep / 2;
  if (currentA <= halfStep || emfV <= terminalVoltageV) return null;

  const valueOhm = (emfV - terminalVoltageV) / currentA;
  const minimumOhm = (emfV - halfStep - (terminalVoltageV + halfStep)) / (currentA + halfStep);
  const maximumOhm = (emfV + halfStep - (terminalVoltageV - halfStep)) / (currentA - halfStep);

  return { valueOhm, minimumOhm, maximumOhm };
}

export function calculateFullCircuit(input: FullCircuitInput): FullCircuitReading {
  const { emfV, internalResistanceOhm, loadResistanceOhm, closed } = input;
  if (
    ![emfV, internalResistanceOhm, loadResistanceOhm].every(Number.isFinite) ||
    emfV < 0 ||
    internalResistanceOhm <= 0 ||
    loadResistanceOhm < 0
  ) {
    throw new RangeError("Полная цепь требует конечных значений, ε ≥ 0, r > 0 и R ≥ 0.");
  }

  const currentA = closed ? emfV / (loadResistanceOhm + internalResistanceOhm) : 0;
  const terminalVoltageV = closed ? currentA * loadResistanceOhm : emfV;
  const internalDropV = currentA * internalResistanceOhm;
  const efficiency = closed && emfV > 0 ? terminalVoltageV / emfV : null;

  return {
    currentA,
    terminalVoltageV,
    internalDropV,
    efficiency,
    estimatedInternalResistanceOhm: currentA > 0
      ? (emfV - terminalVoltageV) / currentA
      : null,
  };
}
