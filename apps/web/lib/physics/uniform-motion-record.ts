export type MotionRecordId = "steady" | "changing";

export type MotionRecord = {
  id: MotionRecordId;
  // Simulated positions on a straight 0..9 m track, with no reversal between marks.
  positionsM: readonly [number, number, number, number];
  stepSeconds: 1;
};

/** Positions are recorded at t = 0, 1, 2, 3 s in two explicit simulations. */
export const motionRecords = [
  { id: "steady", positionsM: [0, 3, 6, 9], stepSeconds: 1 },
  { id: "changing", positionsM: [0, 2, 5, 9], stepSeconds: 1 },
] as const satisfies readonly MotionRecord[];

export type MotionRecordSummary = {
  intervalsM: number[];
  totalPathM: number;
  totalTimeS: number;
  meanSpeedMPerS: number;
  // Equality concerns only the three observed one-second intervals.
  equalSampledIntervals: boolean;
};

/**
 * Summarizes these no-reversal simulated records. Equal sampled intervals are
 * evidence within this model, not proof of uniform motion at every instant.
 */
export function summarizeMotionRecord(record: MotionRecord): MotionRecordSummary {
  const intervalsM = record.positionsM.slice(1).map((position, index) =>
    position - record.positionsM[index],
  );
  const totalPathM = intervalsM.reduce((sum, interval) => sum + interval, 0);
  const totalTimeS = intervalsM.length * record.stepSeconds;

  return {
    intervalsM,
    totalPathM,
    totalTimeS,
    meanSpeedMPerS: totalPathM / totalTimeS,
    equalSampledIntervals: intervalsM.every((interval) => interval === intervalsM[0]),
  };
}
