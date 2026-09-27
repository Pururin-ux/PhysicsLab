import {
  GRADUATED_SCALE_ACTUAL_VOLUME_ML,
  GRADUATED_SCALE_BOTTOM_Y,
  GRADUATED_SCALE_MAX_ML,
  GRADUATED_SCALE_MIN_ML,
  GRADUATED_SCALE_TOP_Y,
  graduatedScaleY,
} from "./graduated-scale-model.ts";

// Side section of one fixed cylinder: the graduation is on the near wall,
// while the meniscus point being sighted is inside the vessel.
export const PARALLAX_MENISCUS_X = 110;
export const PARALLAX_SCALE_X = 170;
export const PARALLAX_EYE_X = 250;
export const PARALLAX_MENISCUS_Y = graduatedScaleY(GRADUATED_SCALE_ACTUAL_VOLUME_ML);
export const PARALLAX_TOP_EYE_Y = 30;

export function sightLineAtScale(eyeY: number): number {
  const fraction = (PARALLAX_EYE_X - PARALLAX_SCALE_X) / (PARALLAX_EYE_X - PARALLAX_MENISCUS_X);
  return eyeY + (PARALLAX_MENISCUS_Y - eyeY) * fraction;
}

export function scaleValueAtY(y: number): number {
  const fraction = (GRADUATED_SCALE_BOTTOM_Y - y) / (GRADUATED_SCALE_BOTTOM_Y - GRADUATED_SCALE_TOP_Y);
  return GRADUATED_SCALE_MIN_ML + fraction * (GRADUATED_SCALE_MAX_ML - GRADUATED_SCALE_MIN_ML);
}

export const PARALLAX_TOP_READING_ML = scaleValueAtY(sightLineAtScale(PARALLAX_TOP_EYE_Y));
