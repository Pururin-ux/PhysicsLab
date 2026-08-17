import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardVariant = "default" | "elevated" | "formula";
type CardGlow = "cyan" | "gold" | null;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  glow?: CardGlow;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-space-900 border-nova-cyan/[.13]",
  elevated: "bg-space-800 border-nova-cyan/[.10]",
  formula: "bg-nova-cyan-05 border-nova-cyan/[.14]",
};

const glowClasses: Record<Exclude<CardGlow, null>, string> = {
  cyan: "shadow-cyan-glow",
  gold: "shadow-gold-glow",
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
        "rounded-card border p-6 shadow-card backdrop-blur-sm",
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
