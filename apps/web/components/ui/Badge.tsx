import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "cyan" | "gold" | "blue" | "ember";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line bg-surface-1 text-ink-muted",
  cyan: "border-nova-cyan/40 bg-nova-cyan-10 text-white",
  gold: "border-nova-gold/35 bg-nova-gold-10 text-white",
  blue: "border-nova-blue/35 bg-white/[.025] text-white/85",
  ember: "border-nova-ember/35 bg-nova-ember-10 text-white",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-white/40",
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  ember: "bg-nova-ember",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-6 px-2 text-[11px]",
  md: "h-7 px-2.5 text-[13px]",
};

export function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-badge border font-semibold leading-none",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
      ) : null}
      {children}
    </span>
  );
}
