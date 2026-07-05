import type { SVGProps } from "react";
import type { MathLabelSpec } from "../../lib/physics/physics-graph-spec";
import {
  getAccessibleMathLabel,
  getMathLabelParts,
  type MathLabelPart,
} from "./svg-math-label-parts";

type SvgMathLabelProps = {
  label: MathLabelSpec;
  unit?: string;
  x: number;
  y: number;
  className?: string;
  textAnchor?: SVGProps<SVGTextElement>["textAnchor"];
  dominantBaseline?: SVGProps<SVGTextElement>["dominantBaseline"];
  size?: number;
  fill?: string;
};

function partStyle(part: MathLabelPart): SVGProps<SVGTSpanElement>["style"] {
  if (part.kind === "symbol") {
    return {
      fontFamily: "var(--font-physics-math)",
      fontStyle: "italic",
      fontWeight: 500,
    };
  }

  if (part.kind === "number") {
    return {
      fontFamily: "var(--font-physics-numeric)",
      fontStyle: "normal",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 500,
    };
  }

  return {
    fontFamily: "var(--font-physics-ui)",
    fontStyle: "normal",
    fontWeight: 500,
  };
}

export function SvgMathLabel({
  label,
  unit,
  x,
  y,
  className,
  textAnchor = "middle",
  dominantBaseline,
  size = 11,
  fill,
}: SvgMathLabelProps) {
  const parts = getMathLabelParts(label, unit);

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      className={className}
      style={{ fontSize: size, fill }}
    >
      {parts.map((part, index) => (
        <tspan
          key={`${part.kind}-${part.text}-${index}`}
          baselineShift={
            part.kind === "subscript" ? "sub" : part.kind === "superscript" ? "super" : undefined
          }
          fontSize={part.kind === "subscript" || part.kind === "superscript" ? "72%" : undefined}
          style={partStyle(part)}
        >
          {part.text}
        </tspan>
      ))}
    </text>
  );
}

export { getAccessibleMathLabel, getMathLabelParts };
