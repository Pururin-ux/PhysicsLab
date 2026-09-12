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
    "border-[var(--border-muted)] bg-[var(--surface-hover)] text-[var(--text-strong)] hover:-translate-y-px hover:border-[var(--focus-ring)] hover:bg-[var(--surface-panel-raised)] hover:shadow-[0_8px_26px_rgba(0,0,0,.22)]",
  correct:
    "border-feedback-success/55 bg-feedback-success/[.07] text-white shadow-[inset_3px_0_0_var(--feedback-success)]",
  wrong:
    "border-feedback-danger/45 bg-feedback-danger/[.07] text-white shadow-[inset_3px_0_0_var(--feedback-danger)]",
  dimmed: "border-[var(--border-muted)] bg-[var(--surface-hover)] text-[var(--text-quiet)]",
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
        "disabled:cursor-default",
        stateClasses[state],
      )}
    >
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-badge border text-[11px] font-bold uppercase",
          state === "correct"
            ? "border-feedback-success/35 bg-feedback-success/[.12] text-white"
            : state === "wrong"
              ? "border-feedback-danger/35 bg-feedback-danger/[.12] text-white"
              : "border-white/[.10] bg-white/[.03] text-white/60",
        )}
      >
        {id}
      </span>
      <span className="min-w-0 flex-1 break-words text-[14px] font-medium leading-[1.55] md:text-[15px]">
        {text}
      </span>
      {state === "correct" ? (
        <span className="shrink-0 rounded-badge border border-feedback-success/25 bg-feedback-success/[.08] px-2 py-1 text-[11px] font-semibold leading-none text-feedback-success">
          верно
        </span>
      ) : state === "wrong" ? (
        <span className="shrink-0 rounded-badge border border-feedback-danger/25 bg-feedback-danger/[.08] px-2 py-1 text-[11px] font-semibold leading-none text-feedback-danger">
          выбрано
        </span>
      ) : null}
    </button>
  );
}
