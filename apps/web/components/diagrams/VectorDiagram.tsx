import { useId } from "react";
import type { VectorDiagramSpec, VectorTone } from "../../lib/physics/vector-diagram-spec";
import { cn } from "../../lib/utils";
import {
  buildAngleArcPath,
  computeResultant,
  computeVectorEndpoints,
  resolveAngleMark,
  type GridPoint,
} from "./vector-diagram-geometry";
import { SvgMathLabel } from "../physics-graph/SvgMathLabel";

type VectorDiagramProps = {
  spec: VectorDiagramSpec;
  className?: string;
  ariaLabel?: string;
};

const TONE_COLOR: Record<VectorTone, string> = {
  cyan: "#00E0FF",
  gold: "#D4AF37",
  blue: "#2D9CFF",
  ember: "#FF7A45",
  muted: "rgba(226, 232, 240, 0.55)",
};

const SURFACE = "rgba(8, 13, 22, 0.62)";
const GRID_LINE = "rgba(226, 232, 240, 0.07)";
const AXIS_LINE = "rgba(226, 232, 240, 0.42)";

const WIDTH = 320;
const HEIGHT = 260;
const MARGIN = 34;

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function VectorDiagram({ spec, className, ariaLabel }: VectorDiagramProps) {
  const reactId = sanitizeId(useId());
  const markerBaseId = sanitizeId(spec.id ?? reactId);

  const endpoints = computeVectorEndpoints(spec);
  const resultant = spec.showResultant ? computeResultant(spec.vectors) : null;
  const resultantTone = spec.resultantTone ?? "gold";

  // Границы подгоняются под реальные векторы (+ начало координат),
  // а не под симметричную сетку: иначе картинка ютится в одной четверти,
  // а три остальные пустуют.
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  for (const { start, end } of endpoints.values()) {
    minX = Math.min(minX, start.x, end.x);
    maxX = Math.max(maxX, start.x, end.x);
    minY = Math.min(minY, start.y, end.y);
    maxY = Math.max(maxY, start.y, end.y);
  }
  if (resultant) {
    minX = Math.min(minX, resultant.dx);
    maxX = Math.max(maxX, resultant.dx);
    minY = Math.min(minY, resultant.dy);
    maxY = Math.max(maxY, resultant.dy);
  }
  // Поле в одну клетку вокруг содержимого — стрелкам и подписям нужен воздух.
  minX -= 1;
  maxX += 1;
  minY -= 1;
  maxY += 1;

  const plotWidth = WIDTH - MARGIN * 2;
  const plotHeight = HEIGHT - MARGIN * 2;
  // Единый масштаб по обеим осям, чтобы клетка оставалась квадратной.
  const scalePx = Math.min(plotWidth / (maxX - minX), plotHeight / (maxY - minY));
  const offsetX = MARGIN + (plotWidth - (maxX - minX) * scalePx) / 2;
  const offsetY = MARGIN + (plotHeight - (maxY - minY) * scalePx) / 2;

  function toPx(point: GridPoint) {
    return {
      x: offsetX + (point.x - minX) * scalePx,
      y: offsetY + (maxY - point.y) * scalePx,
    };
  }
  function dirToPx(dir: GridPoint) {
    return { x: dir.x * scalePx, y: -dir.y * scalePx };
  }

  // При больших значениях сетка каждые 1 ед. превращается в рябь —
  // прореживаем так, чтобы линий было не больше ~9 по каждой оси.
  const gridStep = Math.max(1, Math.ceil(Math.max(maxX - minX, maxY - minY) / 9));
  const gridXs: number[] = [];
  for (let value = Math.ceil(minX / gridStep) * gridStep; value <= Math.floor(maxX); value += gridStep) {
    gridXs.push(value);
  }
  const gridYs: number[] = [];
  for (let value = Math.ceil(minY / gridStep) * gridStep; value <= Math.floor(maxY); value += gridStep) {
    gridYs.push(value);
  }

  const originPx = toPx({ x: 0, y: 0 });
  const tones = Object.keys(TONE_COLOR) as VectorTone[];

  // Подпись ставится у наконечника, снаружи от вектора: середина занята
  // дугами углов и соседними векторами, там подписи сталкиваются.
  function labelPosFor(start: GridPoint, end: GridPoint) {
    const startPx = toPx(start);
    const endPx = toPx(end);
    const dx = endPx.x - startPx.x;
    const dy = endPx.y - startPx.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    // Наружу вдоль вектора + вбок по нормали, от начала координат.
    const nx = -uy;
    const ny = ux;
    const sideSign = nx * (endPx.x - originPx.x) + ny * (endPx.y - originPx.y) >= 0 ? 1 : -1;
    return {
      x: endPx.x + ux * 10 + nx * sideSign * 11,
      y: endPx.y + uy * 10 + ny * sideSign * 11,
    };
  }

  return (
    <div
      data-testid="vector-diagram"
      className={cn("w-full min-w-0 overflow-hidden rounded-option", className)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={ariaLabel ?? "Векторная диаграмма"}
        className="mx-auto h-auto w-full max-w-[360px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {tones.map((tone) => (
            <marker
              key={tone}
              id={`${markerBaseId}-arrow-${tone}`}
              viewBox="0 0 10 10"
              refX="8.6"
              refY="5"
              markerWidth="6.4"
              markerHeight="6.4"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={TONE_COLOR[tone]} />
            </marker>
          ))}
        </defs>

        <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="14" fill={SURFACE} />

        {spec.showGrid === false ? null : (
          <g aria-hidden="true">
            {gridXs.map((value) => {
              const px = toPx({ x: value, y: 0 }).x;
              return (
                <line
                  key={`grid-x-${value}`}
                  x1={px}
                  x2={px}
                  y1={toPx({ x: 0, y: maxY }).y}
                  y2={toPx({ x: 0, y: minY }).y}
                  stroke={GRID_LINE}
                  strokeWidth="1"
                />
              );
            })}
            {gridYs.map((value) => {
              const py = toPx({ x: 0, y: value }).y;
              return (
                <line
                  key={`grid-y-${value}`}
                  x1={toPx({ x: minX, y: 0 }).x}
                  x2={toPx({ x: maxX, y: 0 }).x}
                  y1={py}
                  y2={py}
                  stroke={GRID_LINE}
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Оси рисуются через начало координат только там, где оно попало в кадр. */}
        {minY <= 0 && maxY >= 0 ? (
          <line
            x1={toPx({ x: minX, y: 0 }).x}
            x2={toPx({ x: maxX, y: 0 }).x + 6}
            y1={originPx.y}
            y2={originPx.y}
            stroke={AXIS_LINE}
            strokeWidth="1.25"
            markerEnd={`url(#${markerBaseId}-arrow-muted)`}
          />
        ) : null}
        {minX <= 0 && maxX >= 0 ? (
          <line
            x1={originPx.x}
            x2={originPx.x}
            y1={toPx({ x: 0, y: minY }).y}
            y2={toPx({ x: 0, y: maxY }).y - 6}
            stroke={AXIS_LINE}
            strokeWidth="1.25"
            markerEnd={`url(#${markerBaseId}-arrow-muted)`}
          />
        ) : null}

        {spec.layout === "concurrent" ? (
          <circle cx={originPx.x} cy={originPx.y} r="3.5" fill="rgba(248, 250, 252, 0.7)" />
        ) : null}

        {resultant ? (() => {
          const origin = { x: 0, y: 0 };
          const tip = { x: resultant.dx, y: resultant.dy };
          const startPx = toPx(origin);
          const tipPx = toPx(tip);
          // В chain-режиме наконечник равнодействующей приходит в ту же
          // точку, что и последний вектор цепочки, — укорачиваем линию,
          // чтобы стрелки не сливались в одно пятно.
          const dx = tipPx.x - startPx.x;
          const dy = tipPx.y - startPx.y;
          const length = Math.hypot(dx, dy) || 1;
          const shorten = spec.layout === "chain" ? 10 : 0;
          const endPx = {
            x: tipPx.x - (dx / length) * shorten,
            y: tipPx.y - (dy / length) * shorten,
          };
          // Подпись — сбоку от середины, по нормали в сторону от векторов.
          const nx = -dy / length;
          const ny = dx / length;
          const labelSide = spec.layout === "chain" ? -1 : 1;
          const labelPx = {
            x: (startPx.x + endPx.x) / 2 + nx * labelSide * 14,
            y: (startPx.y + endPx.y) / 2 + ny * labelSide * 14,
          };

          return (
            <g className="graph-fade-in">
              <line
                x1={startPx.x}
                y1={startPx.y}
                x2={endPx.x}
                y2={endPx.y}
                stroke={TONE_COLOR[resultantTone]}
                strokeWidth="2.25"
                strokeDasharray="6 5"
                strokeLinecap="round"
                markerEnd={`url(#${markerBaseId}-arrow-${resultantTone})`}
              />
              <SvgMathLabel
                label={spec.resultantLabel ?? "R"}
                x={labelPx.x}
                y={labelPx.y}
                textAnchor="middle"
                size={13.5}
                fill={TONE_COLOR[resultantTone]}
              />
            </g>
          );
        })() : null}

        {spec.vectors.map((vector, index) => {
          const points = endpoints.get(vector.id);
          if (!points) {
            return null;
          }
          const tone = vector.tone ?? "cyan";
          const start = toPx(points.start);
          const end = toPx(points.end);
          const labelPx = labelPosFor(points.start, points.end);

          return (
            <g key={vector.id} className="graph-fade-in" style={{ animationDelay: `${0.08 * index}s` }}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={TONE_COLOR[tone]}
                strokeWidth="2.75"
                strokeDasharray={vector.dashed ? "6 5" : undefined}
                strokeLinecap="round"
                markerEnd={`url(#${markerBaseId}-arrow-${tone})`}
              />
              {vector.label ? (
                <SvgMathLabel
                  label={vector.label}
                  x={labelPx.x}
                  y={labelPx.y}
                  textAnchor="middle"
                  size={13.5}
                  fill={TONE_COLOR[tone]}
                />
              ) : null}
            </g>
          );
        })}

        {spec.angleMarks?.map((mark, index) => {
          const geometry = resolveAngleMark(mark.between[0], mark.between[1], endpoints);
          if (!geometry) {
            return null;
          }
          const centerPxPoint = toPx(geometry.center);
          const dirAPx = dirToPx(geometry.dirA);
          const dirBPx = dirToPx(geometry.dirB);
          const radiusPx = (mark.radius ?? 0.72) * scalePx;
          const arc = buildAngleArcPath(centerPxPoint, dirAPx, dirBPx, radiusPx);

          return (
            <g key={`angle-${index}`}>
              <path d={arc.path} fill="none" stroke="rgba(248, 250, 252, 0.65)" strokeWidth="1.5" />
              <SvgMathLabel
                label={mark.label ?? `${arc.deltaDeg}°`}
                x={arc.labelPoint.x}
                y={arc.labelPoint.y}
                textAnchor="middle"
                size={11.5}
                fill="rgba(248, 250, 252, 0.78)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
