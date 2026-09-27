export type ScaleMode = "coarse" | "fine";

export const GRADUATED_SCALE_UNIT = "мл" as const;
export const GRADUATED_SCALE_MIN_ML = 20;
export const GRADUATED_SCALE_MAX_ML = 40;
export const GRADUATED_SCALE_ACTUAL_VOLUME_ML = 32;

// Coordinates for a 160 × 240 SVG viewBox. Both scales use the same vessel
// and the same physical water level; only the graduation changes.
export const GRADUATED_SCALE_VIEWBOX_WIDTH = 160;
export const GRADUATED_SCALE_VIEWBOX_HEIGHT = 240;
export const GRADUATED_SCALE_TOP_Y = 20;
export const GRADUATED_SCALE_BOTTOM_Y = 220;

const SCALE_STEPS_ML: Record<ScaleMode, number> = {
  coarse: 10,
  fine: 2,
};

/** Affine map from a volume on the scale to its SVG y coordinate. */
export function graduatedScaleY(valueMl: number): number {
  if (!Number.isFinite(valueMl) || valueMl < GRADUATED_SCALE_MIN_ML || valueMl > GRADUATED_SCALE_MAX_ML) {
    throw new RangeError("Volume must be within the graduated scale");
  }

  const fraction = (valueMl - GRADUATED_SCALE_MIN_ML) / (GRADUATED_SCALE_MAX_ML - GRADUATED_SCALE_MIN_ML);
  return GRADUATED_SCALE_BOTTOM_Y - fraction * (GRADUATED_SCALE_BOTTOM_Y - GRADUATED_SCALE_TOP_Y);
}

export function getGraduatedScale(mode: ScaleMode) {
  const step = SCALE_STEPS_ML[mode];
  const intervals = (GRADUATED_SCALE_MAX_ML - GRADUATED_SCALE_MIN_ML) / step;
  const ticks = Array.from({ length: intervals + 1 }, (_, index) => {
    const value = GRADUATED_SCALE_MIN_ML + index * step;
    return {
      value,
      y: graduatedScaleY(value),
      label: value % 10 === 0,
    };
  });

  // This school model records the nearest marked value with half a division
  // as its reading uncertainty. It is not a full real-instrument error model.
  const reading = GRADUATED_SCALE_MIN_ML
    + Math.round((GRADUATED_SCALE_ACTUAL_VOLUME_ML - GRADUATED_SCALE_MIN_ML) / step) * step;

  return {
    ticks,
    meniscusY: graduatedScaleY(GRADUATED_SCALE_ACTUAL_VOLUME_ML),
    reading,
    uncertainty: step / 2,
    step,
    intervals,
  };
}
