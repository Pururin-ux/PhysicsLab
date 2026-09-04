"use client";

import { useId, useState } from "react";
import type { HelpTarget } from "../../lib/learning/topic-help";
import { cn } from "../../lib/utils";
import { MathText } from "../ui/MathText";

interface SolutionDisclosureProps {
  explanation: string;
  helpTarget?: HelpTarget;
  onOpenHelp?: () => void;
}

export function SolutionDisclosure({
  explanation,
  helpTarget,
  onOpenHelp,
}: SolutionDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="flex flex-col gap-3" data-testid="secondary-answer-actions">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="solution-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex min-h-10 items-center gap-2 rounded-option border border-[var(--border-muted)] bg-[var(--surface-hover)] px-3 text-[12px] font-semibold text-[var(--text-default)] transition-colors hover:border-[var(--border-emphasis)] hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          {open ? "Свернуть решение" : "Показать решение"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : null)}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {helpTarget && onOpenHelp ? (
          <button
            type="button"
            data-testid="help-target-button"
            onClick={onOpenHelp}
            className="inline-flex min-h-10 items-center rounded-option px-3 text-left text-[12px] font-semibold text-[var(--text-quiet)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--math-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {/* Кнопка называет, что откроется, а не сама себя. */}
            Разобрать тему: {helpTarget.label}
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          id={panelId}
          data-testid="solution-content"
          className="border-l border-white/[.10] py-1 pl-4 text-[14px] leading-[1.75] text-white/78"
        >
          <MathText text={explanation} />
        </div>
      ) : null}
    </div>
  );
}
