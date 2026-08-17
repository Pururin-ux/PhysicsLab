import { useId } from "react";
import type {
  GraphAnnotationSpec,
  PhysicsGraphSpec,
} from "../../lib/physics/physics-graph-spec";
import { cn } from "../../lib/utils";
import {
  buildPolylinePath,
  buildSegmentArrow,
  buildShadedAreaUnderPath,
  buildShadedPolygonPath,
  collectPointLabels,
} from "./graph-paths";
import {
  DEFAULT_GRAPH_FRAME,
  createGraphScale,
  makeAutoTicks,
} from "./graph-scale";
import { SvgMathLabel, getAccessibleMathLabel } from "./SvgMathLabel";

type PhysicsGraphProps = {
  spec: PhysicsGraphSpec;
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
};

const graphColors = {
  axis: "rgba(226, 232, 240, 0.58)",
  grid: "rgba(226, 232, 240, 0.07)",
  zeroGrid: "rgba(226, 232, 240, 0.24)",
  text: "rgba(248, 250, 252, 0.82)",
  mutedText: "rgba(226, 232, 240, 0.58)",
  guide: "rgba(226, 232, 240, 0.30)",
  cyan: "#34CFE2",
  gold: "#C7A842",
  fillCyan: "rgba(52, 207, 226, 0.08)",
  fillGold: "rgba(199, 168, 66, 0.07)",
  graphSurface: "rgba(8, 13, 22, 0.62)",
  plotSurface: "rgba(13, 20, 33, 0.42)",
  plotBorder: "rgba(226, 232, 240, 0.08)",
  arrowCutout: "rgba(8, 13, 22, 0.88)",
};

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function annotationKey(annotation: GraphAnnotationSpec, index: number) {
  return `${annotation.type}-${index}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function PhysicsGraph({ spec, className, compact = false, ariaLabel }: PhysicsGraphProps) {
  const reactId = sanitizeId(useId());
  const markerBaseId = sanitizeId(spec.id ?? reactId);
  const axisMarkerId = `${markerBaseId}-axis-arrow`;
  const segmentMarkerId = `${markerBaseId}-segment-arrow`;
  const areaPatternId = `${markerBaseId}-area-hatch`;
  const scale = createGraphScale(spec, DEFAULT_GRAPH_FRAME);
  const { frame } = scale;
  const xTicks = makeAutoTicks(spec.axes.x, compact ? 4 : 5);
  const yTicks = makeAutoTicks(spec.axes.y, compact ? 4 : 5);
  const accentColor = spec.style?.accent === "gold" ? graphColors.gold : graphColors.cyan;
  const areaFillColor = spec.style?.accent === "gold" ? graphColors.fillGold : graphColors.fillCyan;
  const plotRight = frame.width - frame.right;
  const plotBottom = frame.height - frame.bottom;
  const hasSignedYAxis = spec.axes.y.range[0] < 0 && spec.axes.y.range[1] > 0;
  const yAxisLabelX = Math.max(24, scale.yAxisX - 12);

  return (
    <div
      data-testid="physics-graph"
      data-graph-kind={spec.kind}
      className={cn("w-full min-w-0 overflow-hidden rounded-option", className)}
    >
      <svg
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        role="img"
        aria-label={
          ariaLabel ??
          `${getAccessibleMathLabel(spec.axes.y.label, spec.axes.y.unit)} от ${getAccessibleMathLabel(
            spec.axes.x.label,
            spec.axes.x.unit,
          )}`
        }
        className="h-auto w-full max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id={axisMarkerId}
            viewBox="0 0 8 8"
            refX="6.4"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill={graphColors.axis} />
          </marker>
          <marker
            id={segmentMarkerId}
            viewBox="0 0 8 8"
            refX="6.4"
            refY="4"
            markerWidth="6.6"
            markerHeight="6.6"
            orient="auto"
          >
            <path
              d="M 0.5 0.7 L 7.4 4 L 0.5 7.3 z"
              fill={accentColor}
              stroke={graphColors.arrowCutout}
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
          </marker>
          <pattern
            id={areaPatternId}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke={accentColor} strokeOpacity="0.18" strokeWidth="1" />
          </pattern>
        </defs>

        <rect
          x="0"
          y="0"
          width={frame.width}
          height={frame.height}
          rx="14"
          fill={graphColors.graphSurface}
        />
        <rect
          x={frame.left}
          y={frame.top}
          width={scale.plotWidth}
          height={scale.plotHeight}
          rx="4"
          fill={graphColors.plotSurface}
          stroke={graphColors.plotBorder}
          strokeWidth="1"
        />

        <g aria-hidden="true">
          {yTicks.map((tick) => {
            const y = scale.mapY(tick.value);

            return (
              <g key={`y-grid-${tick.value}`}>
                <line
                  x1={frame.left}
                  x2={plotRight}
                  y1={y}
                  y2={y}
                  stroke={tick.value === 0 && hasSignedYAxis ? graphColors.zeroGrid : graphColors.grid}
                  strokeWidth="1"
                />
                <SvgMathLabel
                  label={tick.label ?? String(Number.isInteger(tick.value) ? tick.value : tick.value.toFixed(1))}
                  x={frame.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  size={10.4}
                  fill={graphColors.mutedText}
                />
              </g>
            );
          })}

          {xTicks.map((tick) => {
            const x = scale.mapX(tick.value);

            return (
              <g key={`x-grid-${tick.value}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={frame.top}
                  y2={plotBottom}
                  stroke={graphColors.grid}
                  strokeWidth="1"
                />
                <SvgMathLabel
                  label={tick.label ?? String(Number.isInteger(tick.value) ? tick.value : tick.value.toFixed(1))}
                  x={x}
                  y={plotBottom + 20}
                  textAnchor="middle"
                  size={10.4}
                  fill={graphColors.mutedText}
                />
              </g>
            );
          })}
        </g>

        {spec.annotations?.map((annotation, index) => {
          if (annotation.type === "vertical-band") {
            const x1 = scale.mapX(Math.min(annotation.fromX, annotation.toX));
            const x2 = scale.mapX(Math.max(annotation.fromX, annotation.toX));

            return (
              <g key={annotationKey(annotation, index)}>
                <line
                  x1={x1}
                  y1={frame.top}
                  x2={x1}
                  y2={plotBottom}
                  stroke={graphColors.guide}
                  strokeDasharray="4 5"
                  strokeWidth="1"
                />
                <line
                  x1={x2}
                  y1={frame.top}
                  x2={x2}
                  y2={plotBottom}
                  stroke={graphColors.guide}
                  strokeDasharray="4 5"
                  strokeWidth="1"
                />
                {spec.series.flatMap((series) => {
                  const fromPoint = series.points.find((point) => point.x === annotation.fromX);
                  const toPoint = series.points.find((point) => point.x === annotation.toX);

                  if (!fromPoint || !toPoint || fromPoint.y !== toPoint.y) {
                    return [];
                  }

                  const from = scale.mapPoint(fromPoint);
                  const to = scale.mapPoint(toPoint);

                  return (
                    <line
                      key={`${annotationKey(annotation, index)}-${series.id ?? "series"}-segment`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={accentColor}
                      strokeOpacity="0.38"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  );
                })}
                {annotation.label ? (
                  <text
                    x={(x1 + x2) / 2}
                    y={frame.top + 15}
                    textAnchor="middle"
                    fill={graphColors.mutedText}
                    className="text-[10px] font-medium italic"
                    style={{ fontFamily: "var(--font-physics-ui)" }}
                  >
                    {annotation.label}
                  </text>
                ) : null}
              </g>
            );
          }

          if (annotation.type === "shaded-area-under") {
            const path = buildShadedAreaUnderPath(spec, annotation, scale);

            return path ? (
              <path
                key={annotationKey(annotation, index)}
                d={path}
                fill={areaFillColor}
                className="graph-fade-in"
              />
            ) : null;
          }

          if (annotation.type === "shaded-polygon") {
            const path = buildShadedPolygonPath(annotation.points, scale);

            return path ? (
              <g key={annotationKey(annotation, index)} className="graph-fade-in">
                <path d={path} fill={areaFillColor} />
                <path d={path} fill={`url(#${areaPatternId})`} opacity="0.75" />
              </g>
            ) : null;
          }

          return null;
        })}

        <g aria-hidden="true">
          {spec.annotations?.map((annotation, index) => {
            if (annotation.type !== "dashed-guide") {
              return null;
            }

            if (annotation.from && annotation.to) {
              const from = scale.mapPoint(annotation.from);
              const to = scale.mapPoint(annotation.to);

              return (
                <line
                  key={annotationKey(annotation, index)}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={graphColors.guide}
                  strokeDasharray="5 5"
                  strokeWidth="1"
                />
              );
            }

            const verticalX = typeof annotation.x === "number" ? scale.mapX(annotation.x) : null;
            const horizontalY = typeof annotation.y === "number" ? scale.mapY(annotation.y) : null;

            return (
              <g key={annotationKey(annotation, index)}>
                {verticalX !== null ? (
                  <line
                    x1={verticalX}
                    y1={frame.top}
                    x2={verticalX}
                    y2={plotBottom}
                    stroke={graphColors.guide}
                    strokeDasharray="5 5"
                    strokeWidth="1"
                  />
                ) : null}
                {horizontalY !== null ? (
                  <line
                    x1={frame.left}
                    y1={horizontalY}
                    x2={plotRight}
                    y2={horizontalY}
                    stroke={graphColors.guide}
                    strokeDasharray="5 5"
                    strokeWidth="1"
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <line
          x1={frame.left}
          x2={plotRight}
          y1={scale.xAxisY}
          y2={scale.xAxisY}
          stroke={graphColors.axis}
          strokeWidth="1.35"
          markerEnd={spec.axes.x.arrow === false ? undefined : `url(#${axisMarkerId})`}
        />
        <line
          x1={scale.yAxisX}
          x2={scale.yAxisX}
          y1={plotBottom}
          y2={frame.top}
          stroke={graphColors.axis}
          strokeWidth="1.35"
          markerEnd={spec.axes.y.arrow === false ? undefined : `url(#${axisMarkerId})`}
        />

        <SvgMathLabel
          label={spec.axes.y.label}
          unit={spec.axes.y.unit}
          x={yAxisLabelX}
          y={16}
          textAnchor="middle"
          size={11.4}
          fill={graphColors.text}
        />
        <SvgMathLabel
          label={spec.axes.x.label}
          unit={spec.axes.x.unit}
          x={plotRight}
          y={frame.height - 10}
          textAnchor="end"
          size={11.4}
          fill={graphColors.text}
        />

        <g>
          {spec.series.map((series, index) => (
            <g key={series.id ?? `series-${index}`}>
              <path
                d={buildPolylinePath(series.points, scale, series.closed)}
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className="graph-path-draw"
              />
              {series.points.map((point, pointIndex) => {
                const mapped = scale.mapPoint(point);
                const popDelay = `${0.75 + pointIndex * 0.08}s`;

                return (
                  <g
                    key={`${series.id ?? index}-${point.x}-${point.y}-${pointIndex}`}
                    className="graph-point-pop"
                    style={{ animationDelay: popDelay }}
                  >
                    <circle
                      cx={mapped.x}
                      cy={mapped.y}
                      r="5.25"
                      fill={accentColor}
                      fillOpacity="0.08"
                      stroke={accentColor}
                      strokeOpacity="0.28"
                      strokeWidth="1"
                    />
                    <circle
                      cx={mapped.x}
                      cy={mapped.y}
                      r="3"
                      fill={accentColor}
                    />
                  </g>
                );
              })}
            </g>
          ))}

          {spec.annotations?.map((annotation, index) => {
            if (annotation.type !== "segment-arrow") {
              return null;
            }

            const { start, end } = buildSegmentArrow(annotation.from, annotation.to, scale);

            return (
              <g key={annotationKey(annotation, index)}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={graphColors.arrowCutout}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd={`url(#${segmentMarkerId})`}
                />
              </g>
            );
          })}
        </g>

        <g>
          {collectPointLabels(spec).map((point, index) => {
            const mapped = scale.mapPoint(point);
            const offsetX = mapped.x >= plotRight - 10 ? -8 : 8;
            const offsetY = mapped.y <= frame.top + 12 ? 14 : -8;
            const labelX = clamp(mapped.x + offsetX, frame.left + 8, plotRight - 8);
            const labelY = clamp(mapped.y + offsetY, frame.top + 13, plotBottom - 8);
            const textAnchor = mapped.x >= plotRight - 10 ? "end" : "start";

            return (
              <text
                key={`${point.label}-${point.x}-${point.y}-${index}`}
                x={labelX}
                y={labelY}
                textAnchor={textAnchor}
                fill={graphColors.text}
                className="graph-point-pop text-[11px] font-semibold"
                style={{
                  fontFamily: "var(--font-physics-ui)",
                  animationDelay: `${0.8 + index * 0.08}s`,
                }}
              >
                {point.label}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
