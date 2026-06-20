import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "cyan" | "gold" | "blue";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-white/[.08] bg-white/[.03] text-white/70",
  cyan: "border-nova-cyan/40 bg-nova-cyan-10 text-white",
  gold: "border-nova-gold/35 bg-nova-gold-10 text-white",
  blue: "border-nova-blue/30 bg-white/[.025] text-white/80",
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
