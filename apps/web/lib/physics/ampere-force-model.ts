export type AmpereForceInput = {
  magneticInductionTeslas: number;
  currentAmperes: number;
  conductorLengthMetres: number;
  angleDegrees: number;
};

export type AmpereForceReading = {
  forceNewtons: number;
  maximumForceNewtons: number;
  sineFactor: number;
};

/** A straight segment fully inside a prescribed uniform external magnetic field. */
export function calculateAmpereForce(input: AmpereForceInput): AmpereForceReading {
  const { magneticInductionTeslas: B, currentAmperes: I, conductorLengthMetres: length, angleDegrees } = input;
  if (![B, I, length, angleDegrees].every(Number.isFinite) ||
      B < 0 || I < 0 || length < 0 || angleDegrees < 0 || angleDegrees > 180) {
    throw new RangeError("Ampere force requires finite nonnegative B, I, length and an angle from 0 to 180 degrees.");
  }
  const maximumForceNewtons = B * I * length;
  const sineFactor = angleDegrees === 0 || angleDegrees === 180 ? 0 : Math.sin(angleDegrees * Math.PI / 180);
  const forceNewtons = maximumForceNewtons * sineFactor;
  if (![maximumForceNewtons, forceNewtons].every(Number.isFinite)) {
    throw new RangeError("Ampere force result is outside the finite numeric range.");
  }
  return { forceNewtons, maximumForceNewtons, sineFactor };
}
