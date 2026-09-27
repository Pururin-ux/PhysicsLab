export type LcOscillatorInput = {
  capacitanceMicrofarads: number;
  inductanceHenrys: number;
  initialVoltageVolts: number;
  phaseFraction: number;
};

export type LcOscillatorReading = {
  periodSeconds: number;
  chargeCoulombs: number;
  currentAmperes: number;
  electricEnergyJoules: number;
  magneticEnergyJoules: number;
  initialEnergyJoules: number;
};

/** Ideal lossless LC circuit, initially charged and carrying no current. */
export function calculateLcOscillator(input: LcOscillatorInput): LcOscillatorReading {
  const { capacitanceMicrofarads, inductanceHenrys, initialVoltageVolts, phaseFraction } = input;
  if (
    ![capacitanceMicrofarads, inductanceHenrys, initialVoltageVolts, phaseFraction].every(Number.isFinite) ||
    capacitanceMicrofarads <= 0 ||
    inductanceHenrys <= 0 ||
    initialVoltageVolts <= 0 ||
    phaseFraction < 0 ||
    phaseFraction > 1
  ) {
    throw new RangeError("LC circuit requires positive finite C, L, U₀ and a phase from 0 to 1.");
  }

  const capacitanceFarads = capacitanceMicrofarads * 1e-6;
  const periodSeconds = 2 * Math.PI * Math.sqrt(inductanceHenrys * capacitanceFarads);
  const initialChargeCoulombs = capacitanceFarads * initialVoltageVolts;
  const maximumCurrentAmperes = initialVoltageVolts * Math.sqrt(capacitanceFarads / inductanceHenrys);
  const initialEnergyJoules = 0.5 * capacitanceFarads * initialVoltageVolts ** 2;
  const angle = 2 * Math.PI * phaseFraction;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return {
    periodSeconds,
    chargeCoulombs: initialChargeCoulombs * cosine,
    // Positive current follows the initial discharge, so i = -dq/dt.
    currentAmperes: maximumCurrentAmperes * sine,
    electricEnergyJoules: initialEnergyJoules * cosine ** 2,
    magneticEnergyJoules: initialEnergyJoules * sine ** 2,
    initialEnergyJoules,
  };
}
