export const VACUUM_PERMITTIVITY_F_PER_M = 8.85e-12;
export const DISCONNECTED_CHARGE_NC = 1;

export type PlateCapacitor = {
  overlapCm2: number;
  gapMm: number;
  relativePermittivity: number;
};

export function capacitancePf({ overlapCm2, gapMm, relativePermittivity }: PlateCapacitor): number {
  if (overlapCm2 <= 0 || gapMm <= 0 || relativePermittivity < 1) {
    throw new RangeError("Plate area, gap and relative permittivity must describe a physical capacitor");
  }
  const overlapM2 = overlapCm2 * 1e-4;
  const gapM = gapMm * 1e-3;
  return VACUUM_PERMITTIVITY_F_PER_M * relativePermittivity * overlapM2 / gapM * 1e12;
}

export function disconnectedVoltageV(capacitancePicoFarads: number, chargeNanoCoulombs = DISCONNECTED_CHARGE_NC): number {
  if (capacitancePicoFarads <= 0) {
    throw new RangeError("Capacitance must be positive");
  }
  return chargeNanoCoulombs * 1e3 / capacitancePicoFarads;
}
