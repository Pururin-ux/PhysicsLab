import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "cyan" | "gold" | "blue" | "ember";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-white/[.12] bg-space-850 text-white/72",
  cyan: "border-nova-cyan/38 bg-nova-cyan-10 text-nova-cyan",
  gold: "border-nova-gold/42 bg-nova-gold-10 text-nova-gold",
  blue: "border-nova-blue/34 bg-space-850 text-white/82",
  ember: "border-nova-ember/38 bg-nova-ember-10 text-white/88",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-badge border px-2.5 text-[13px] font-semibold leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
