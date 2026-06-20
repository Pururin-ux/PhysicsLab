import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";
import type { GraphConfig, GraphPoint, GraphType } from "../../lib/physics/graph-data";

interface ModelVisualProps {
  config: GraphConfig;
  title: string;
  caption?: string;
  className?: string;
}

const chart = {
  width: 360,
  height: 238,
  left: 52,
  right: 18,
  top: 36,
  bottom: 42,
};

function readYValue(point: GraphPoint, type: GraphType) {
  if (type === "vt") return point.v ?? 0;
  if (type === "xt") return point.x ?? 0;
  return point.a ?? 0;
}

function makeTicks(range: [number, number], count: number) {
  const [min, max] = range;
  const step = (max - min) / count;

  return Array.from({ length: count + 1 }, (_, index) => min + step * index);
}

export function ModelVisual({
  config,
  title,
  caption,
  className,
}: ModelVisualProps) {
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const xTicks = makeTicks(config.xRange, 5);
  const yTicks = makeTicks(config.yRange, 5);
  const accentClass = config.color === "gold" ? "text-nova-gold" : "text-nova-cyan";

  function mapX(t: number) {
    const [min, max] = config.xRange;
    return chart.left + ((t - min) / (max - min)) * plotWidth;
  }

  function mapY(value: number) {
    const [min, max] = config.yRange;
    return chart.top + (1 - (value - min) / (max - min)) * plotHeight;
  }

  const points = config.series.map((point) => ({
    x: mapX(point.t),
    y: mapY(readYValue(point, config.type)),
  }));
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <Card className={cn("p-0", className)}>
      <figure className="flex flex-col gap-4 p-4 md:p-5">
        <figcaption className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Модель движения
          </span>
          <span className="text-xl font-bold text-white">{title}</span>
          {caption ? (
            <span className="text-[13px] font-normal leading-[1.6] text-white/60">
              {caption}
            </span>
          ) : null}
        </figcaption>

        <div className="w-full px-1 pb-1 pt-2 md:px-2">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label={`${title}: ${config.yLabel} от ${config.xLabel}`}
            className="h-auto w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x={chart.left - 14}
              y="16"
              textAnchor="middle"
              className="fill-white/60 text-[11px] font-semibold"
            >
              {config.yLabel}
            </text>
            <text
              x={chart.width - chart.right}
              y={chart.height - 6}
              textAnchor="end"
              className="fill-white/60 text-[11px] font-semibold"
            >
              {config.xLabel}
            </text>

            <g>
            {yTicks.map((tick) => {
              const y = mapY(tick);

              return (
                <g key={`y-${tick}`}>
                  <line
                    x1={chart.left}
                    x2={chart.width - chart.right}
                    y1={y}
                    y2={y}
                    className="stroke-white/10"
                    strokeWidth="1"
                  />
                  <text
                    x={chart.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-white/50 text-[10px]"
                  >
                    {Number.isInteger(tick) ? tick : tick.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {xTicks.map((tick) => {
              const x = mapX(tick);

              return (
                <g key={`x-${tick}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={chart.top}
                    y2={chart.height - chart.bottom}
                    className="stroke-white/10"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={chart.height - chart.bottom + 20}
                    textAnchor="middle"
                    className="fill-white/50 text-[10px]"
                  >
                    {Number.isInteger(tick) ? tick : tick.toFixed(1)}
                  </text>
                </g>
              );
            })}
            </g>

            <line
              x1={chart.left}
              x2={chart.width - chart.right}
              y1={chart.height - chart.bottom}
              y2={chart.height - chart.bottom}
              className="stroke-white/30"
              strokeWidth="1.5"
            />
            <line
              x1={chart.left}
              x2={chart.left}
              y1={chart.top}
              y2={chart.height - chart.bottom}
              className="stroke-white/30"
              strokeWidth="1.5"
            />

            <g className={accentClass}>
              <path
                d={linePath}
                className="fill-none stroke-current drop-shadow-sm"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point, index) => (
                <circle
                  key={`${point.x}-${point.y}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  className="fill-current"
                />
              ))}
            </g>
          </svg>
        </div>
      </figure>
    </Card>
  );
}
