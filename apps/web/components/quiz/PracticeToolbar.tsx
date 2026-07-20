import type { Ref } from "react";

interface PracticeToolbarProps {
  progressLabel: string;
  onOpenHelp?: () => void;
  helpOpen?: boolean;
  helpButtonRef?: Ref<HTMLButtonElement>;
}

export function PracticeToolbar({
  progressLabel,
  onOpenHelp,
  helpOpen = false,
  helpButtonRef,
}: PracticeToolbarProps) {
  return (
    <div
      className="flex min-h-10 items-center justify-between gap-3"
      role="group"
      aria-label="Ход тренировки"
    >
      <p
        data-testid="practice-progress"
        className="text-[13px] font-semibold text-white/62"
      >
        {progressLabel}
      </p>

      {onOpenHelp ? (
        <button
          ref={helpButtonRef}
          type="button"
          data-testid="practice-open-help"
          onClick={onOpenHelp}
          aria-controls="theory"
          aria-expanded={helpOpen}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-option border border-white/[.09] bg-white/[.025] px-3 text-[12px] font-semibold text-white/68 transition-colors hover:border-white/[.18] hover:bg-white/[.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9.8 9a2.4 2.4 0 0 1 4.7.7c0 1.8-2.5 2-2.5 3.8" />
            <path d="M12 17h.01" />
          </svg>
          Справка
        </button>
      ) : null}
    </div>
  );
}
