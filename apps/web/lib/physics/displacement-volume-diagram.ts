export interface DisplacementVolumeDiagramSpec {
  initialReadingMl: number;
  finalReadingMl: number;
  divisionMl: number;
}

export const DISPLACEMENT_VOLUME_SCALE_MIN_ML = 0;
export const DISPLACEMENT_VOLUME_SCALE_MAX_ML = 60;
export const DISPLACEMENT_VOLUME_SCALE_TOP_Y = 40;
export const DISPLACEMENT_VOLUME_SCALE_BOTTOM_Y = 280;

const MAX_DRAWABLE_INTERVALS = 120;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAlignedWithDivision(value: number, divisionMl: number): boolean {
  const divisions = value / divisionMl;
  return Math.abs(divisions - Math.round(divisions)) < 1e-9;
}

/** Check the drawable 0–60 ml scale, independently of any generator's ranges. */
export function isDisplacementVolumeDiagramSpec(value: unknown): value is DisplacementVolumeDiagramSpec {
  if (!isRecord(value)) return false;

  const { initialReadingMl, finalReadingMl, divisionMl } = value;
  if (
    typeof initialReadingMl !== "number" || !Number.isInteger(initialReadingMl) ||
    typeof finalReadingMl !== "number" || !Number.isInteger(finalReadingMl) ||
    typeof divisionMl !== "number" || !Number.isFinite(divisionMl) || divisionMl <= 0
  ) return false;

  return initialReadingMl >= DISPLACEMENT_VOLUME_SCALE_MIN_ML &&
    finalReadingMl <= DISPLACEMENT_VOLUME_SCALE_MAX_ML &&
    finalReadingMl > initialReadingMl &&
    isAlignedWithDivision(initialReadingMl, divisionMl) &&
    isAlignedWithDivision(finalReadingMl, divisionMl) &&
    isAlignedWithDivision(DISPLACEMENT_VOLUME_SCALE_MAX_ML, divisionMl) &&
    DISPLACEMENT_VOLUME_SCALE_MAX_ML / divisionMl <= MAX_DRAWABLE_INTERVALS;
}

/** Shared vertical coordinate for tick marks and the lower point of the meniscus. */
export function displacementVolumeY(valueMl: number): number {
  if (
    !Number.isFinite(valueMl) ||
    valueMl < DISPLACEMENT_VOLUME_SCALE_MIN_ML ||
    valueMl > DISPLACEMENT_VOLUME_SCALE_MAX_ML
  ) {
    throw new RangeError("Volume reading must be within the 0–60 ml scale");
  }

  return DISPLACEMENT_VOLUME_SCALE_BOTTOM_Y -
    (valueMl / DISPLACEMENT_VOLUME_SCALE_MAX_ML) *
      (DISPLACEMENT_VOLUME_SCALE_BOTTOM_Y - DISPLACEMENT_VOLUME_SCALE_TOP_Y);
}
