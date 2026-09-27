export const PHOTOELECTRIC_METALS = [
  { id: "cesium", name: "Цезий", symbol: "Cs", roundedWorkFunctionEv: 1.9, thresholdFrequency14: 4.6 },
  { id: "sodium", name: "Натрий", symbol: "Na", roundedWorkFunctionEv: 2.3, thresholdFrequency14: 5.6 },
  { id: "zinc", name: "Цинк", symbol: "Zn", roundedWorkFunctionEv: 3.7, thresholdFrequency14: 8.9 },
] as const;

export type PhotoelectricMetalId = (typeof PHOTOELECTRIC_METALS)[number]["id"];
export type RelativeIntensity = 1 | 2 | 3;

const PLANCK_CONSTANT = 6.63e-34;
const ELEMENTARY_CHARGE = 1.60e-19;
const PLANCK_EV_SECONDS = PLANCK_CONSTANT / ELEMENTARY_CHARGE;
export const PHOTON_ENERGY_EV_PER_1E14_HZ = PLANCK_EV_SECONDS * 1e14;

export function getPhotoelectricMetal(id: PhotoelectricMetalId) {
  const metal = PHOTOELECTRIC_METALS.find((item) => item.id === id) ?? PHOTOELECTRIC_METALS[1];
  return {
    ...metal,
    workFunctionEv: PHOTON_ENERGY_EV_PER_1E14_HZ * metal.thresholdFrequency14,
  };
}

export function getPhotoelectricResult(
  metalId: PhotoelectricMetalId,
  frequency14: number,
  intensity: RelativeIntensity,
) {
  const metal = getPhotoelectricMetal(metalId);
  const photonEnergyEv = PLANCK_EV_SECONDS * frequency14 * 1e14;
  const emissionPossible = frequency14 >= metal.thresholdFrequency14;
  const maximumKineticEnergyEv = emissionPossible
    ? Math.max(0, photonEnergyEv - metal.workFunctionEv)
    : 0;

  return {
    metal,
    frequency14,
    intensity,
    photonEnergyEv,
    emissionPossible,
    maximumKineticEnergyEv,
    stoppingPotentialV: maximumKineticEnergyEv,
    relativeSaturationCurrent: emissionPossible ? intensity : 0,
  };
}
