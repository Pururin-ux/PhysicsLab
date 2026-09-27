export const HYDROGEN_LEVEL_ENERGY_COEFFICIENT_EV = 13.6;
export const PLANCK_CONSTANT_EV_SECONDS = 4.135667696e-15;
export const SPEED_OF_LIGHT_METERS_PER_SECOND = 299_792_458;
export const HC_EV_NANOMETERS =
  PLANCK_CONSTANT_EV_SECONDS * SPEED_OF_LIGHT_METERS_PER_SECOND * 1e9;

export type BohrTransitionDirection = "emission" | "absorption";

export function hydrogenLevelEnergyEv(n: number): number {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError("The principal quantum number must be a positive integer.");
  }

  return -HYDROGEN_LEVEL_ENERGY_COEFFICIENT_EV / (n * n);
}

export function getBohrTransition(initialN: number, finalN: number) {
  if (!Number.isInteger(initialN) || initialN < 1 || !Number.isInteger(finalN) || finalN < 1) {
    throw new RangeError("Both principal quantum numbers must be positive integers.");
  }
  if (initialN === finalN) {
    throw new RangeError("A transition must connect two different energy states.");
  }

  const initialEnergyEv = hydrogenLevelEnergyEv(initialN);
  const finalEnergyEv = hydrogenLevelEnergyEv(finalN);
  const photonEnergyEv = Math.abs(finalEnergyEv - initialEnergyEv);
  const frequencyHz = photonEnergyEv / PLANCK_CONSTANT_EV_SECONDS;

  return {
    initialN,
    finalN,
    initialEnergyEv,
    finalEnergyEv,
    photonEnergyEv,
    frequencyHz,
    frequency14: frequencyHz / 1e14,
    wavelengthNm: SPEED_OF_LIGHT_METERS_PER_SECOND / frequencyHz * 1e9,
    direction: finalN > initialN ? "absorption" as const : "emission" as const,
  };
}
