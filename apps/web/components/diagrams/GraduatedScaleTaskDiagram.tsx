import type { GraduatedScaleTaskSpec } from "../../lib/physics/graduated-scale-task";
import styles from "./GraduatedScaleTaskDiagram.module.css";

export function GraduatedScaleTaskDiagram({ scale }: { scale: GraduatedScaleTaskSpec }) {
  const meniscusEdgeY = scale.meniscusY - 6;

  return <figure className={styles.figure}>
    <svg
      className={styles.diagram}
      viewBox="0 0 270 250"
      role="img"
      aria-label={`Фрагмент шкалы мензурки: от ${scale.lowerMark} до ${scale.upperMark} миллилитров, ${scale.markCount} штрихов вместе с крайними. Нижняя точка мениска совпадает с ${scale.positionFromLower}-м штрихом выше нижней отметки.`}
    >
      <path className={styles.water} d={`M43 ${meniscusEdgeY} Q88 ${scale.meniscusY + 6} 133 ${meniscusEdgeY} L133 251 H43 Z`} />
      <path className={styles.glass} d="M37 -2 V251 M139 -2 V251" />
      <path className={styles.meniscus} d={`M43 ${meniscusEdgeY} Q88 ${scale.meniscusY + 6} 133 ${meniscusEdgeY}`} />
      <path className={styles.sightline} d={`M88 ${scale.meniscusY} H167`} />
      <circle className={styles.readingPoint} cx="88" cy={scale.meniscusY} r="2.8" />
      <path className={styles.rail} d={`M169 ${scale.ticks[scale.intervalCount].y} V${scale.ticks[0].y}`} />
      {scale.ticks.map((tick, index) => {
        const endpoint = index === 0 || index === scale.intervalCount;
        return <g key={index}>
          <path className={styles.tick} d={`M${endpoint ? 146 : 155} ${tick.y} H169`} />
          {endpoint && <text className={styles.value} x="187" y={tick.y + 5}>{tick.value}</text>}
        </g>;
      })}
      <text className={styles.unit} x="187" y="12">мл</text>
    </svg>
    <figcaption>Фрагмент шкалы мензурки</figcaption>
  </figure>;
}
