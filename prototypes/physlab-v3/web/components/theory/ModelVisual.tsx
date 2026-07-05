import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import { graphConfigToPhysicsGraphSpec } from "../../lib/physics/physics-graph-adapter";
import type { GraphConfig } from "../../lib/physics/graph-data";

interface ModelVisualProps {
  config: GraphConfig;
  title: string;
  caption?: string;
  className?: string;
  framed?: boolean;
  showArea?: boolean;
  compact?: boolean;
}

export function ModelVisual({
  config,
  title,
  caption,
  className,
  framed = true,
  showArea = false,
  compact = false,
}: ModelVisualProps) {
  const physicsGraphSpec = graphConfigToPhysicsGraphSpec(config, { showArea, title });

  const figure = (
    <figure
      data-testid="model-visual"
      className={cn(
        "flex flex-col",
        compact ? "gap-2 p-3 md:p-4" : "gap-4 p-4 md:p-5",
        framed ? null : "rounded-option border border-nova-cyan/[.10] bg-space-950/50",
        framed ? null : className,
      )}
    >
        <figcaption className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            График
          </span>
          <span className={compact ? "text-[15px] font-bold text-white" : "text-xl font-bold text-white"}>
            {title}
          </span>
          {caption ? (
            <span className="text-[13px] font-normal leading-[1.6] text-white/60">
              <MathText text={caption} />
            </span>
          ) : null}
        </figcaption>

        <div className={cn("w-full px-1 pb-1 pt-2 md:px-2", compact ? "pt-1" : null)}>
          <PhysicsGraph
            spec={physicsGraphSpec}
            compact={compact}
            ariaLabel={`${title}: ${config.yLabel} от ${config.xLabel}`}
          />
        </div>
      </figure>
  );

  return framed ? <Card className={cn("p-0", className)}>{figure}</Card> : figure;
}
