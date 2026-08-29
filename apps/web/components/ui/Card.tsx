import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

// "default"/"elevated" — исторические имена, оставлены как алиасы, чтобы не
// переписывать все существующие вызовы разом.
type CardVariant = "panel" | "raised" | "formula" | "plain" | "default" | "elevated";
type CardPadding = "none" | "sm" | "md" | "lg";
type CardGlow = "cyan" | "gold" | null;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  glow?: CardGlow;
  interactive?: boolean;
  children: ReactNode;
}

// padding по умолчанию — md, а не фиксированный p-6: раньше почти каждый
// вызов перебивал отступ через !p-4, и это была война важности.
const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-7",
};

const variantClasses: Record<CardVariant, string> = {
  default: "pl-panel",
  elevated: "pl-panel-raised",
  panel: "pl-panel",
  raised: "pl-panel-raised",
  formula: "bg-nova-cyan-05 border border-nova-cyan/[.14]",
  plain: "bg-transparent border border-line",
};

const glowClasses: Record<Exclude<CardGlow, null>, string> = {
  cyan: "shadow-cyan-glow",
  gold: "shadow-gold-glow",
};

export function Card({
  variant = "panel",
  padding = "md",
  glow = null,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        variantClasses[variant],
        paddingClasses[padding],
        glow ? glowClasses[glow] : null,
        interactive
          ? "transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-line-strong"
          : null,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
