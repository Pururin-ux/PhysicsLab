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
    "border-white/[.09] bg-white/[.025] text-white/85 hover:-translate-y-px hover:border-nova-blue/55 hover:bg-space-800 hover:shadow-[0_8px_26px_rgba(0,0,0,.22)]",
  correct:
    "border-nova-cyan/55 bg-nova-cyan-10 text-white shadow-[inset_3px_0_0_#79D9EE]",
  wrong:
    "border-nova-pink/45 bg-nova-pink/[.07] text-white shadow-[inset_3px_0_0_#E079C7]",
  dimmed: "border-white/[.06] bg-white/[.015] text-white/55",
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
      data-state={state}
      aria-pressed={state === "correct" || state === "wrong"}
      onClick={onClick}
      className={cn(
        "quiz-option flex min-h-14 w-full items-center gap-3 rounded-option border px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow,transform] md:px-[18px] md:py-[15px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
        "disabled:cursor-default",
        stateClasses[state],
      )}
    >
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-badge border text-[11px] font-bold uppercase",
          state === "correct"
            ? "border-nova-cyan/50 bg-nova-cyan-20 text-white"
            : state === "wrong"
              ? "border-nova-pink/35 bg-nova-pink-20 text-white"
              : "border-white/[.10] bg-white/[.03] text-white/60",
        )}
      >
        {id}
      </span>
      <span className="min-w-0 flex-1 break-words text-[14px] font-medium leading-[1.55] md:text-[15px]">
        {text}
      </span>
      {state === "correct" ? (
        <span className="shrink-0 rounded-badge border border-nova-cyan/25 bg-nova-cyan/[.08] px-2 py-1 text-[11px] font-semibold leading-none text-nova-cyan">
          верно
        </span>
      ) : state === "wrong" ? (
        <span className="shrink-0 rounded-badge border border-nova-pink/25 bg-nova-pink/[.08] px-2 py-1 text-[11px] font-semibold leading-none text-nova-pink">
          выбрано
        </span>
      ) : null}
    </button>
  );
}
