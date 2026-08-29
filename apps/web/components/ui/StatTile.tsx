import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type StatTone = "neutral" | "cyan" | "gold" | "ember";

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatTone;
  children?: ReactNode;
  className?: string;
}

const valueTone: Record<StatTone, string> = {
  neutral: "text-white",
  cyan: "text-nova-cyan",
  gold: "text-nova-gold",
  ember: "text-nova-ember",
};

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  children,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-option border border-line bg-surface-1 px-4 py-3.5",
        className,
      )}
    >
      <p className="pl-eyebrow">{label}</p>
      <p className={cn("physics-number text-[26px] font-bold leading-none", valueTone[tone])}>
        {value}
      </p>
      {hint ? <p className="text-caption font-semibold text-ink-soft">{hint}</p> : null}
      {children}
    </div>
  );
}
