import type { CircuitDiagramSpec, CircuitTone } from "../../lib/physics/circuit-diagram-spec";
import { cn } from "../../lib/utils";
import {
  AMMETER_SLOT,
  CIRCUIT_LAYOUTS,
  SWITCH_SLOT,
  VOLTMETER_SLOT,
} from "./circuit-diagram-layouts";

type CircuitDiagramProps = {
  spec: CircuitDiagramSpec;
  className?: string;
  ariaLabel?: string;
};

const TONE_COLOR: Record<CircuitTone, { stroke: string; fill: string }> = {
  cyan: { stroke: "rgba(0, 224, 255, 0.75)", fill: "rgba(0, 224, 255, 0.12)" },
  gold: { stroke: "rgba(212, 175, 55, 0.75)", fill: "rgba(212, 175, 55, 0.12)" },
  blue: { stroke: "rgba(45, 156, 255, 0.75)", fill: "rgba(45, 156, 255, 0.12)" },
  ember: { stroke: "rgba(255, 122, 69, 0.75)", fill: "rgba(255, 122, 69, 0.12)" },
};

const SURFACE = "rgba(8, 13, 22, 0.62)";
const WIRE_COLOR = "rgba(226, 232, 240, 0.45)";
const PLATE_COLOR = "rgba(226, 232, 240, 0.85)";
const LABEL_COLOR = "rgba(226, 232, 240, 0.65)";

export function CircuitDiagram({ spec, className, ariaLabel }: CircuitDiagramProps) {
  const layout = CIRCUIT_LAYOUTS[spec.topology];
  const tone = TONE_COLOR[spec.tone ?? "gold"];
  const [longX1, longY1, longX2, longY2] = layout.sourcePlates.long;
  const [shortX1, shortY1, shortX2, shortY2] = layout.sourcePlates.short;
  const firstResistor = layout.resistors[0];

  return (
    <div
      data-testid="circuit-diagram"
      className={cn("w-full min-w-0 overflow-hidden rounded-option", className)}
    >
      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-label={ariaLabel ?? "Электрическая схема"}
        className="mx-auto w-full max-w-[380px]"
      >
        <rect x="0" y="0" width="320" height="180" rx="14" fill={SURFACE} />

        <path
          d={layout.wireDrawPath}
          fill="none"
          stroke={WIRE_COLOR}
          strokeWidth="2"
          pathLength={1}
          className="graph-path-draw"
        />
        {layout.extraWires?.map((wire, index) => (
          <path
            key={`extra-${index}`}
            d={wire}
            fill="none"
            stroke={WIRE_COLOR}
            strokeWidth="2"
            pathLength={1}
            className="graph-path-draw"
          />
        ))}

        <g stroke={PLATE_COLOR} strokeWidth="3" strokeLinecap="round">
          <line x1={longX1} y1={longY1} x2={longX2} y2={longY2} />
          <line x1={shortX1} y1={shortY1} x2={shortX2} y2={shortY2} />
        </g>
        <text
          x={layout.sourceLabelPos.x}
          y={layout.sourceLabelPos.y}
          fill={LABEL_COLOR}
          fontSize="12"
          textAnchor="middle"
          className="physics-math"
        >
          {spec.sourceLabel ?? "ε"}
        </text>

        {layout.internalResistor ? (
          <g className="graph-fade-in">
            {/* Непрозрачная подложка: r стоит прямо на проводе, и без неё
                линия провода просвечивает сквозь полупрозрачную заливку. */}
            <rect
              x={layout.internalResistor.x}
              y={layout.internalResistor.y}
              width={layout.internalResistor.width}
              height={layout.internalResistor.height}
              rx="3"
              fill="#0B111C"
            />
            <rect
              x={layout.internalResistor.x}
              y={layout.internalResistor.y}
              width={layout.internalResistor.width}
              height={layout.internalResistor.height}
              rx="3"
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth="2"
            />
            <text
              x={layout.internalResistor.labelX}
              y={layout.internalResistor.labelY}
              fill={LABEL_COLOR}
              fontSize="12"
              textAnchor="middle"
              className="physics-math"
            >
              {spec.internalResistanceLabel ?? "r"}
            </text>
          </g>
        ) : null}

        {layout.resistors.map((rect, index) => (
          <g key={`resistor-${index}`} className="graph-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              rx="4"
              fill="#0B111C"
            />
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              rx="4"
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth="2"
            />
            <text
              x={rect.labelX}
              y={rect.labelY}
              fill={LABEL_COLOR}
              fontSize="12"
              textAnchor="middle"
              className="physics-math"
            >
              {spec.resistorLabels[index] ?? "R"}
            </text>
          </g>
        ))}

        {spec.switch ? (
          <g>
            <circle cx={SWITCH_SLOT.xLeft} cy={SWITCH_SLOT.y} r="2.5" fill={WIRE_COLOR} />
            <circle cx={SWITCH_SLOT.xRight} cy={SWITCH_SLOT.y} r="2.5" fill={WIRE_COLOR} />
            {spec.switch.state === "closed" ? (
              <line
                x1={SWITCH_SLOT.xLeft}
                y1={SWITCH_SLOT.y}
                x2={SWITCH_SLOT.xRight}
                y2={SWITCH_SLOT.y}
                stroke={PLATE_COLOR}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : (
              <line
                x1={SWITCH_SLOT.xLeft}
                y1={SWITCH_SLOT.y}
                x2={SWITCH_SLOT.xRight - 6}
                y2={SWITCH_SLOT.y - 16}
                stroke={PLATE_COLOR}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
            <text
              x={SWITCH_SLOT.labelX}
              y={SWITCH_SLOT.labelY}
              fill={LABEL_COLOR}
              fontSize="11"
              textAnchor="middle"
              className="physics-math"
            >
              {spec.switch.label ?? "K"}
            </text>
          </g>
        ) : null}

        {spec.meter?.kind === "ammeter" ? (
          <g>
            <circle
              cx={AMMETER_SLOT.x}
              cy={AMMETER_SLOT.y}
              r={AMMETER_SLOT.r}
              fill={SURFACE}
              stroke={tone.stroke}
              strokeWidth="2"
            />
            <text
              x={AMMETER_SLOT.x}
              y={AMMETER_SLOT.y + 4}
              fill={LABEL_COLOR}
              fontSize="11"
              textAnchor="middle"
              className="physics-math"
            >
              {spec.meter.label ?? "A"}
            </text>
          </g>
        ) : null}

        {/* Отводы вольтметра рассчитаны на резистор R у правого края контура
            (топологии "single" и "source-internal"): у "series"/"parallel"
            первый резистор стоит в другом месте, и отводы разъедутся. */}
        {spec.meter?.kind === "voltmeter" &&
        firstResistor &&
        (spec.topology === "single" || spec.topology === "source-internal") ? (
          <g>
            {/* Два пунктирных отвода от вольтметра к выводам резистора —
                к точкам, где провод входит в резистор сверху и снизу. */}
            <line
              x1={VOLTMETER_SLOT.x - 6}
              y1={VOLTMETER_SLOT.y + VOLTMETER_SLOT.r - 3}
              x2={firstResistor.x + firstResistor.width / 2 - 6}
              y2={firstResistor.y - 2}
              stroke={tone.stroke}
              strokeWidth="1.25"
              strokeDasharray="3 3"
            />
            <line
              x1={VOLTMETER_SLOT.x + 8}
              y1={VOLTMETER_SLOT.y + VOLTMETER_SLOT.r - 2}
              x2={firstResistor.x + firstResistor.width + 6}
              y2={firstResistor.y + firstResistor.height + 2}
              stroke={tone.stroke}
              strokeWidth="1.25"
              strokeDasharray="3 3"
            />
            <circle
              cx={VOLTMETER_SLOT.x}
              cy={VOLTMETER_SLOT.y}
              r={VOLTMETER_SLOT.r}
              fill={SURFACE}
              stroke={tone.stroke}
              strokeWidth="2"
            />
            <text
              x={VOLTMETER_SLOT.x}
              y={VOLTMETER_SLOT.y + 4}
              fill={LABEL_COLOR}
              fontSize="11"
              textAnchor="middle"
              className="physics-math"
            >
              {spec.meter.label ?? "V"}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
