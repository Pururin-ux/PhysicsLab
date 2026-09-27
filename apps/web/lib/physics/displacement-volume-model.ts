export type DisplacementVolumeInput = {
  initialReadingMl: number;
  finalReadingMl: number;
  divisionMl: number;
  fullySubmerged: boolean;
  noSpill: boolean;
  /** Assume each reading is within half a division of the water level. */
  assumeHalfDivisionReadingBound?: boolean;
};

export type DisplacementVolumeResult =
  | {
      valid: true;
      /** Arithmetic difference between the two recorded readings. */
      volumeMl: number;
      /** Numerically equal to volumeMl because 1 ml = 1 cm³. */
      volumeCm3: number;
      uncertainty: null | {
        basis: "half-division-per-reading";
        perReadingBoundMl: number;
        /** Worst-case sum of the two reading bounds, not a measured instrument error. */
        conservativeDifferenceBoundMl: number;
      };
    }
  | {
      valid: false;
      reason: "not-fully-submerged" | "spill" | "non-positive-displacement";
    };

/**
 * Finds a solid body's volume from the rise of liquid in a measuring cylinder.
 * The optional uncertainty is a conditional school estimate, not a claim about
 * the accuracy of a real experiment.
 */
export function calculateDisplacementVolume(input: DisplacementVolumeInput): DisplacementVolumeResult {
  const { initialReadingMl, finalReadingMl, divisionMl } = input;

  if (!Number.isFinite(initialReadingMl) || initialReadingMl < 0
      || !Number.isFinite(finalReadingMl) || finalReadingMl < 0) {
    throw new RangeError("Readings must be finite, non-negative values in ml");
  }
  if (!Number.isFinite(divisionMl) || divisionMl <= 0) {
    throw new RangeError("Division value must be a finite, positive value in ml");
  }

  if (!input.fullySubmerged) return { valid: false, reason: "not-fully-submerged" };
  if (!input.noSpill) return { valid: false, reason: "spill" };

  const volumeMl = finalReadingMl - initialReadingMl;
  if (volumeMl <= 0) return { valid: false, reason: "non-positive-displacement" };

  const perReadingBoundMl = divisionMl / 2;
  return {
    valid: true,
    volumeMl,
    volumeCm3: volumeMl,
    uncertainty: input.assumeHalfDivisionReadingBound
      ? {
          basis: "half-division-per-reading",
          perReadingBoundMl,
          conservativeDifferenceBoundMl: 2 * perReadingBoundMl,
        }
      : null,
  };
}
