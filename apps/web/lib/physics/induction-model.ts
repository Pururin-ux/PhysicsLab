export type InductionState = {
  /** Magnitude of a uniform magnetic field. Its direction is set by normalAngleRadians. */
  magneticFieldTeslas: number;
  /** Angle between the field and the same chosen loop normal in both states, from 0 to pi. */
  normalAngleRadians: number;
};

export type InductionChangeInput = {
  initial: InductionState;
  final: InductionState;
  loopAreaSquareMetres: number;
  turnCount: number;
  durationSeconds: number;
};

export type InductionDirection = "along-normal" | "opposite-normal" | "none";
export type ClosedLoopCurrentSense = "counterclockwise" | "clockwise" | "none";

export type InductionChangeReading = {
  initialFluxWebers: number;
  finalFluxWebers: number;
  fluxChangeWebers: number;
  averageEmfVolts: number;
  averageEmfMagnitudeVolts: number;
  inducedFieldDirection: InductionDirection;
  closedLoopCurrentSense: ClosedLoopCurrentSense;
};

function validState(state: InductionState): boolean {
  return Number.isFinite(state.magneticFieldTeslas) && state.magneticFieldTeslas >= 0 &&
    Number.isFinite(state.normalAngleRadians) &&
    state.normalAngleRadians >= 0 && state.normalAngleRadians <= Math.PI;
}

/** Signed flux through one turn, with the loop normal held fixed between states. */
export function orientedMagneticFluxWebers(state: InductionState, loopAreaSquareMetres: number): number {
  if (!validState(state) || !Number.isFinite(loopAreaSquareMetres) || loopAreaSquareMetres <= 0) {
    throw new RangeError("Flux needs finite B >= 0, area > 0, and an angle from 0 to pi.");
  }

  const cosine = state.normalAngleRadians === Math.PI / 2 ? 0 : Math.cos(state.normalAngleRadians);
  const fluxWebers = state.magneticFieldTeslas * loopAreaSquareMetres * cosine;
  if (!Number.isFinite(fluxWebers)) throw new RangeError("Flux is outside the finite numeric range.");
  return fluxWebers === 0 ? 0 : fluxWebers;
}

/**
 * Average Faraday EMF over a stated interval: E = -N(Φfinal - Φinitial)/Δt.
 * Positive circulation is counterclockwise when viewed from the +normal side.
 * The current sense applies only if this ideal loop is closed; no current size,
 * instantaneous EMF, resistance or self-induction is calculated here.
 */
export function calculateInductionChange(input: InductionChangeInput): InductionChangeReading {
  const { initial, final, loopAreaSquareMetres, turnCount, durationSeconds } = input;
  if (!Number.isInteger(turnCount) || turnCount <= 0 ||
      !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new RangeError("Induction needs a positive integer turn count and positive finite duration.");
  }

  const initialFluxWebers = orientedMagneticFluxWebers(initial, loopAreaSquareMetres);
  const finalFluxWebers = orientedMagneticFluxWebers(final, loopAreaSquareMetres);
  const rawChange = finalFluxWebers - initialFluxWebers;
  // Ignore cancellation at machine precision, without imposing a physical cutoff.
  const roundoff = 32 * Number.EPSILON * Math.max(Math.abs(initialFluxWebers), Math.abs(finalFluxWebers));
  const fluxChangeWebers = Math.abs(rawChange) <= roundoff ? 0 : rawChange;
  const averageEmfVolts = fluxChangeWebers === 0 ? 0 : -turnCount * fluxChangeWebers / durationSeconds;
  if (!Number.isFinite(averageEmfVolts)) throw new RangeError("EMF is outside the finite numeric range.");

  return {
    initialFluxWebers,
    finalFluxWebers,
    fluxChangeWebers,
    averageEmfVolts,
    averageEmfMagnitudeVolts: Math.abs(averageEmfVolts),
    inducedFieldDirection: averageEmfVolts > 0 ? "along-normal" :
      averageEmfVolts < 0 ? "opposite-normal" : "none",
    closedLoopCurrentSense: averageEmfVolts > 0 ? "counterclockwise" :
      averageEmfVolts < 0 ? "clockwise" : "none",
  };
}
