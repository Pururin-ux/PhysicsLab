export type SelfInductionInput = {
  inductanceHenries: number;
  initialCurrentAmperes: number;
  finalCurrentAmperes: number;
  durationSeconds: number;
};

export type SelfInductionReading = {
  currentChangeAmperes: number;
  currentRateAmperesPerSecond: number;
  averageSelfEmfVolts: number;
  initialMagneticEnergyJoules: number;
  finalMagneticEnergyJoules: number;
  magneticEnergyChangeJoules: number;
};

/**
 * A prescribed, uniform current change in a coil of constant inductance.
 * This calculates average self-EMF and endpoint field energies, not the
 * time evolution of a real RL circuit or a current from its resistance.
 */
export function calculateSelfInduction(input: SelfInductionInput): SelfInductionReading {
  const { inductanceHenries, initialCurrentAmperes, finalCurrentAmperes, durationSeconds } = input;
  if (!Number.isFinite(inductanceHenries) || inductanceHenries <= 0 ||
      !Number.isFinite(initialCurrentAmperes) || initialCurrentAmperes < 0 ||
      !Number.isFinite(finalCurrentAmperes) || finalCurrentAmperes < 0 ||
      !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new RangeError("Self-induction requires finite L > 0, currents >= 0, and duration > 0.");
  }

  const currentChangeAmperes = finalCurrentAmperes - initialCurrentAmperes;
  const currentRateAmperesPerSecond = currentChangeAmperes / durationSeconds;
  const averageSelfEmfVolts = currentChangeAmperes === 0 ? 0 : -inductanceHenries * currentRateAmperesPerSecond;
  const initialMagneticEnergyJoules = inductanceHenries * initialCurrentAmperes ** 2 / 2;
  const finalMagneticEnergyJoules = inductanceHenries * finalCurrentAmperes ** 2 / 2;
  const magneticEnergyChangeJoules = finalMagneticEnergyJoules - initialMagneticEnergyJoules;
  if (![currentRateAmperesPerSecond, averageSelfEmfVolts, initialMagneticEnergyJoules,
    finalMagneticEnergyJoules, magneticEnergyChangeJoules].every(Number.isFinite)) {
    throw new RangeError("Self-induction result is outside the finite numeric range.");
  }

  return {
    currentChangeAmperes,
    currentRateAmperesPerSecond,
    averageSelfEmfVolts,
    initialMagneticEnergyJoules,
    finalMagneticEnergyJoules,
    magneticEnergyChangeJoules,
  };
}
