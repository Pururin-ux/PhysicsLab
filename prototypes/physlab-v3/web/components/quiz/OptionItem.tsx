"use client";

import { cn } from "../../lib/utils";

export type OptionState = "idle" | "correct" | "wrong" | "dimmed";

interface OptionItemProps {
  id: string;
  text: string;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
}

const stateClasses: Record<OptionState, string> = {
  idle:
    "border-white/[.08] bg-white/[.025] text-white/80 hover:border-nova-blue/45 hover:bg-space-800",
  correct:
    "border-nova-cyan/50 bg-nova-cyan-10 text-white shadow-cyan-glow",
  wrong: "border-nova-gold/35 bg-nova-gold-10 text-white",
  dimmed: "border-white/[.06] bg-white/[.015] text-white/45 opacity-50",
};

export function OptionItem({
  id,
  text,
  state,
  disabled,
  onClick,
}: OptionItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-option border px-3 py-3 text-left transition-colors md:px-[18px] md:py-[14px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
        "disabled:cursor-default",
        stateClasses[state],
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-badge border text-[13px] font-bold uppercase",
          state === "correct"
            ? "border-nova-cyan/50 bg-nova-cyan-20 text-white"
            : state === "wrong"
              ? "border-nova-gold/35 bg-nova-gold-20 text-white"
              : "border-white/[.10] bg-white/[.03] text-white/60",
        )}
      >
        {id}
      </span>
      <span className="min-w-0 flex-1 break-words text-[13px] font-normal leading-[1.55] md:text-[14px]">
        {text}
      </span>
    </button>
  );
}
