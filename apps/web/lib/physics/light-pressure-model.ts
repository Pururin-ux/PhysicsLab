export type LightPressureSurface = "absorbed" | "reflected";

export type LightPressureState = {
  surface: LightPressureSurface;
  outgoingLightMomentumUnits: number;
  lightMomentumChangeUnits: number;
  plateImpulseUnits: number;
  relativePressure: number;
};

/**
 * Compares one normally incident photon in normalized momentum units p.
 * The pressure ratio assumes the same photon flux, illuminated area,
 * complete absorption, and ideal specular reflection.
 */
export function getLightPressureState(surface: LightPressureSurface): LightPressureState {
  const incomingLightMomentumUnits = 1;
  const outgoingLightMomentumUnits = surface === "absorbed" ? 0 : -incomingLightMomentumUnits;
  const lightMomentumChangeUnits = outgoingLightMomentumUnits - incomingLightMomentumUnits;
  const plateImpulseUnits = -lightMomentumChangeUnits;

  return {
    surface,
    outgoingLightMomentumUnits,
    lightMomentumChangeUnits,
    plateImpulseUnits,
    relativePressure: plateImpulseUnits,
  };
}
