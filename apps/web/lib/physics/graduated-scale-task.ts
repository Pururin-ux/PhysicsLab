const TASK_SCALE_TOP_Y = 20;
const TASK_SCALE_BOTTOM_Y = 220;

export interface GraduatedScaleTaskTick {
  value: number;
  y: number;
}

export interface GraduatedScaleTaskSpec {
  lowerMark: number;
  upperMark: number;
  markCount: number;
  positionFromLower: number;
  intervalCount: number;
  divisionValue: number;
  meniscusY: number;
  ticks: readonly GraduatedScaleTaskTick[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Project a generated scale-reading task onto the 20…220 vertical scale span. */
export function getGraduatedScaleTask(params: unknown): GraduatedScaleTaskSpec | null {
  if (!isRecord(params)) return null;

  const { lowerMark, markRange, markCount, positionFromLower } = params;
  if (
    typeof lowerMark !== "number" || !Number.isInteger(lowerMark) ||
    typeof markRange !== "number" || !Number.isInteger(markRange) ||
    typeof markCount !== "number" || !Number.isInteger(markCount) ||
    typeof positionFromLower !== "number" || !Number.isInteger(positionFromLower)
  ) return null;

  if (
    ![10, 20, 30].includes(lowerMark) ||
    ![20, 30, 40].includes(markRange) ||
    ![5, 7, 9, 11].includes(markCount)
  ) return null;

  const intervalCount = markCount - 1;
  if (
    markRange % intervalCount !== 0 ||
    positionFromLower < 1 ||
    positionFromLower > 9 ||
    positionFromLower >= intervalCount
  ) return null;

  const divisionValue = markRange / intervalCount;
  const spanY = TASK_SCALE_BOTTOM_Y - TASK_SCALE_TOP_Y;
  const ticks = Array.from({ length: markCount }, (_, index) => ({
    value: lowerMark + index * divisionValue,
    y: TASK_SCALE_BOTTOM_Y - (index * spanY) / intervalCount,
  }));

  return {
    lowerMark,
    upperMark: lowerMark + markRange,
    markCount,
    positionFromLower,
    intervalCount,
    divisionValue,
    meniscusY: ticks[positionFromLower].y,
    ticks,
  };
}
