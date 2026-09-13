// Both distance tapes use the same fixed scale, including after slider changes.
export const speedTapeScale = 80;

export function speedTapes(slowSeconds: number) {
  return [{ speed: 2, seconds: slowSeconds }, { speed: 8, seconds: 10 - slowSeconds }].map(segment => ({
    ...segment,
    distance: segment.speed * segment.seconds,
    widthPercent: segment.speed * segment.seconds / speedTapeScale * 100,
  }));
}
