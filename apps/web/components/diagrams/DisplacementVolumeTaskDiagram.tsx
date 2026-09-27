import {
  DISPLACEMENT_VOLUME_SCALE_MAX_ML,
  displacementVolumeY,
  isDisplacementVolumeDiagramSpec,
  type DisplacementVolumeDiagramSpec,
} from "../../lib/physics/displacement-volume-diagram";
import styles from "./DisplacementVolumeTaskDiagram.module.css";

function meniscusPath(y: number): string {
  // A quadratic curve's midpoint is exactly y: the reading meets its tick.
  return `M95 ${y - 6} Q133 ${y + 6} 171 ${y - 6}`;
}

export function DisplacementVolumeTaskDiagram({
  spec,
  showSolution,
}: {
  spec: DisplacementVolumeDiagramSpec;
  showSolution: boolean;
}) {
  if (!isDisplacementVolumeDiagramSpec(spec)) return null;

  const { initialReadingMl, finalReadingMl, divisionMl } = spec;
  const initialY = displacementVolumeY(initialReadingMl);
  const finalY = displacementVolumeY(finalReadingMl);
  const differenceMl = finalReadingMl - initialReadingMl;
  const intervalCount = Math.round(DISPLACEMENT_VOLUME_SCALE_MAX_ML / divisionMl);
  const ticks = Array.from({ length: intervalCount + 1 }, (_, index) => {
    const value = index === intervalCount ? DISPLACEMENT_VOLUME_SCALE_MAX_ML : index * divisionMl;
    return { value, y: displacementVolumeY(value) };
  });
  const stoneBottomY = 278;
  const stoneHeight = Math.min(28, Math.max(1, stoneBottomY - finalY));
  const stoneTopY = stoneBottomY - stoneHeight;
  const accessibleDescription =
    `Мензурка со шкалой от 0 до 60 миллилитров, цена деления ${divisionMl} мл. ` +
    `До погружения камешка ${initialReadingMl} мл, после полного погружения ${finalReadingMl} мл. ` +
    `Штриховая линия показывает прежний уровень.` +
    (showSolution ? ` Разность отсчётов ${differenceMl} мл, или ${differenceMl} см³.` : "");

  return <figure className={styles.figure} data-testid="displacement-volume-diagram">
    <svg className={styles.diagram} viewBox="0 0 300 300" role="img" aria-label={accessibleDescription}>
      <text className={styles.apparatusLabel} x="87" y="22">МЕНЗУРКА</text>
      <text className={styles.unitLabel} x="206" y="22">мл</text>

      <path className={styles.water} d={`${meniscusPath(finalY)} L171 279 H95 Z`} />
      <path
        className={styles.rise}
        d={`${meniscusPath(finalY)} L171 ${initialY - 6} Q133 ${initialY + 6} 95 ${initialY - 6} Z`}
      />
      <path
        className={styles.stone}
        d={`M112 ${stoneTopY + stoneHeight * 0.35} L124 ${stoneTopY + stoneHeight * 0.08} L143 ${stoneTopY} L159 ${stoneTopY + stoneHeight * 0.4} L164 ${stoneTopY + stoneHeight * 0.8} Q141 ${stoneBottomY + 2} 116 ${stoneBottomY} Z`}
      />
      <path className={styles.stoneDetail} d={`M126 ${stoneTopY + stoneHeight * 0.42} L139 ${stoneTopY + stoneHeight * 0.3} M148 ${stoneTopY + stoneHeight * 0.58} L156 ${stoneTopY + stoneHeight * 0.7}`} />
      <path className={styles.previousLevel} d={meniscusPath(initialY)} />
      <path className={styles.meniscus} d={meniscusPath(finalY)} />
      <circle className={styles.readingPoint} cx="133" cy={finalY} r="2.5" />
      <path className={styles.glass} d="M89 34 V269 Q89 281 101 281 H165 Q177 281 177 269 V34" />
      <path className={styles.rim} d="M84 34 Q133 29 177 34 H184 L190 29" />
      <path className={styles.glassHighlight} d="M97 47 V105 M168 47 V82" />
      <path className={styles.base} d="M117 282 V290 H150 V282 M108 295 H159" />
      <path className={styles.bracket} d={`M75 ${finalY} H59 V${initialY} H75`} />
      <path className={styles.rail} d="M199 40 V280" />

      {ticks.map(({ value, y }, index) => {
        const major = index === 0 || index === intervalCount ||
          Math.abs(value / 10 - Math.round(value / 10)) < 1e-9;
        return <g key={index}>
          <path className={major ? styles.majorTick : styles.minorTick} d={`M177 ${y} H${major ? 198 : 191}`} />
          {major && <text className={styles.tickLabel} x="207" y={y + 5}>{Math.round(value)}</text>}
        </g>;
      })}
    </svg>

    <figcaption className={styles.caption}>
      <div className={styles.reading}>
        <span className={styles.previousKey} aria-hidden="true" />
        <span>До погружения · V₁</span>
        <strong>{initialReadingMl} мл</strong>
      </div>
      <div className={styles.reading}>
        <span className={styles.finalKey} aria-hidden="true" />
        <span>После погружения · V₂</span>
        <strong>{finalReadingMl} мл</strong>
      </div>
      <p className={styles.difference}>
        {showSolution
          ? `ΔV = ${differenceMl} мл = ${differenceMl} см³`
          : "ΔV = ?"}
      </p>
    </figcaption>
  </figure>;
}
