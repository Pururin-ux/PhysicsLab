export const walkInitial = { stage: 0, summaryText: "", summarySaved: false };
export const roundTripInitial = { stage: 0, seconds: 20, stop: false, summaryText: "", summarySaved: false };

export function roundTripReading(seconds: number, stop: boolean) {
  const movingTime = [10, 20, 40].includes(seconds) ? seconds : 20;
  const elapsed = movingTime + (stop ? 10 : 0);
  return { movingTime, elapsed, distance: 40, displacement: 0, pathSpeed: 40 / elapsed, displacementSpeed: 0 };
}
