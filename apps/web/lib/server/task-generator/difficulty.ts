import type { Difficulty, Params } from "./types.ts";

export function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const normalized = Math.abs(value).toFixed(10).replace(/0+$/, "");
  const point = normalized.indexOf(".");
  return point === -1 ? 0 : normalized.length - point - 1;
}

export function difficultyForSteps(
  steps: 1 | 2 | 3,
  options: { unitConversion?: boolean; signDecision?: boolean; diagramReading?: boolean } = {},
): Difficulty {
  const extra = Number(Boolean(options.unitConversion)) +
    Number(Boolean(options.signDecision)) + Number(Boolean(options.diagramReading));
  if (steps >= 3 || extra >= 2) return 3;
  if (steps === 2 || extra === 1) return 2;
  return 1;
}

export function precisionFitsDifficulty(value: number, difficulty: Difficulty): boolean {
  return decimalPlaces(value) <= difficulty;
}

export function calibratedVariantDifficulty(
  templateId: string,
  params: Params,
  answer: number,
  fallback: Difficulty,
): Difficulty {
  switch (templateId) {
    case "average-speed-segments": {
      const precision = decimalPlaces(answer);
      if (precision === 0 && params.t1 === params.t2) return 1;
      return precision <= 1 ? 2 : 3;
    }
    case "work-force-distance":
      return answer < 0 ? 2 : 1;
    case "electric-power":
      return decimalPlaces(answer) === 0 ? 1 : 2;
    case "heat-balance-simple":
      return decimalPlaces(answer) <= 1 ? 2 : 3;
    case "refractive-index-speed":
      return decimalPlaces(answer) <= 1 ? 1 : 2;
    case "thin-lens-image-distance":
      return decimalPlaces(answer) <= 1 && params.dObj >= 2 * params.F ? 2 : 3;
    case "lens-optical-power":
      return Number.isInteger(answer) ? 1 : 2;
    default:
      return fallback;
  }
}
