export type AcGeneratorInput = {
  frequencyHz: number;
  phaseFraction: number;
  magneticFieldTeslas: number;
  loopAreaSquareMetres: number;
  turnCount: number;
  resistanceOhms: number;
};

export type AcGeneratorReading = {
  periodSeconds: number;
  angleRadians: number;
  fluxWebers: number;
  fluxLinkageWeberTurns: number;
  emfVolts: number;
  currentAmperes: number;
  peakEmfVolts: number;
  peakCurrentAmperes: number;
};

export const AC_GENERATOR_SETUP = {
  magneticFieldTeslas: 0.5,
  loopAreaSquareMetres: 0.04,
  turnCount: 20,
  resistanceOhms: 10,
} as const;

/** Ideal uniformly rotating coil feeding only a resistive load. */
export function calculateAcGenerator(input: AcGeneratorInput): AcGeneratorReading {
  const { frequencyHz, phaseFraction, magneticFieldTeslas, loopAreaSquareMetres, turnCount, resistanceOhms } = input;
  if (
    ![frequencyHz, phaseFraction, magneticFieldTeslas, loopAreaSquareMetres, turnCount, resistanceOhms].every(Number.isFinite) ||
    frequencyHz <= 0 || phaseFraction < 0 || phaseFraction > 1 ||
    magneticFieldTeslas <= 0 || loopAreaSquareMetres <= 0 || turnCount <= 0 || resistanceOhms <= 0
  ) {
    throw new RangeError("Generator needs positive finite B, S, N, R, f and a phase from 0 to 1.");
  }

  const periodSeconds = 1 / frequencyHz;
  const angleRadians = 2 * Math.PI * phaseFraction;
  const fluxWebers = magneticFieldTeslas * loopAreaSquareMetres * Math.cos(angleRadians);
  const fluxLinkageWeberTurns = turnCount * fluxWebers;
  const peakEmfVolts = turnCount * magneticFieldTeslas * loopAreaSquareMetres * 2 * Math.PI * frequencyHz;
  const emfVolts = peakEmfVolts * Math.sin(angleRadians);
  const peakCurrentAmperes = peakEmfVolts / resistanceOhms;
  const currentAmperes = emfVolts / resistanceOhms;

  return { periodSeconds, angleRadians, fluxWebers, fluxLinkageWeberTurns,
    emfVolts, currentAmperes, peakEmfVolts, peakCurrentAmperes };
}
