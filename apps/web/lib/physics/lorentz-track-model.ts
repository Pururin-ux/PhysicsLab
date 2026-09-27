export type FieldPageDirection = "into-page" | "out-of-page";

export type LorentzTrackInput = {
  magneticInductionTeslas: number;
  speedMetresPerSecond: number;
  chargeCoulombs: number;
  massKilograms: number;
  fieldDirection: FieldPageDirection;
};

export type LorentzTrackReading = {
  forceMagnitudeNewtons: number;
  radiusMetres: number | null;
  periodSeconds: number | null;
  bend: "up" | "down" | "straight";
};

/** Nonrelativistic charged particle entering a uniform B perpendicular to v. */
export function calculateLorentzTrack(input: LorentzTrackInput): LorentzTrackReading {
  const { magneticInductionTeslas: B, speedMetresPerSecond: v, chargeCoulombs: q, massKilograms: m, fieldDirection } = input;
  if (![B, v, q, m].every(Number.isFinite) || B < 0 || v <= 0 || q === 0 || m <= 0 ||
      (fieldDirection !== "into-page" && fieldDirection !== "out-of-page")) {
    throw new RangeError("Track requires finite B >= 0, speed > 0, nonzero charge, mass > 0 and a page direction.");
  }
  if (B === 0) return { forceMagnitudeNewtons: 0, radiusMetres: null, periodSeconds: null, bend: "straight" };

  const magnitude = Math.abs(q);
  const forceMagnitudeNewtons = magnitude * v * B;
  const radiusMetres = m * v / (magnitude * B);
  const periodSeconds = 2 * Math.PI * m / (magnitude * B);
  if (![forceMagnitudeNewtons, radiusMetres, periodSeconds].every(Number.isFinite) ||
      forceMagnitudeNewtons <= 0 || radiusMetres <= 0 || periodSeconds <= 0) {
    throw new RangeError("Lorentz track result is outside the finite numeric range.");
  }
  // The particle enters to the right. For B into the page, v × B points up
  // for a positive charge and down for a negative one.
  const bend = (q < 0) === (fieldDirection === "into-page") ? "down" : "up";
  return { forceMagnitudeNewtons, radiusMetres, periodSeconds, bend };
}
