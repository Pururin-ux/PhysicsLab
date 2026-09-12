import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardVariant = "default" | "elevated" | "formula" | "semantic" | "semanticElevated";
type CardGlow = "cyan" | "gold" | null;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  glow?: CardGlow;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-space-900 border-white/[.11]",
  elevated: "bg-space-850 border-white/[.14]",
  formula: "bg-space-925 border-nova-cyan/[.18]",
  semantic: "bg-[var(--surface-panel)] border-[var(--border-muted)]",
  semanticElevated: "bg-[var(--surface-panel-raised)] border-[var(--border-muted)]",
};

const glowClasses: Record<Exclude<CardGlow, null>, string> = {
  cyan: "shadow-cyan-glow",
  gold: "shadow-warm-glow",
};

export function Card({
  variant = "default",
  glow = null,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border p-6 shadow-card",
        variantClasses[variant],
        glow ? glowClasses[glow] : null,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
