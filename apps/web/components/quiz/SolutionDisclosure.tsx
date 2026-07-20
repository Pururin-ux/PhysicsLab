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
          className="inline-flex min-h-10 items-center gap-2 rounded-option border border-white/[.10] bg-white/[.025] px-3 text-[12px] font-semibold text-white/68 transition-colors hover:border-white/[.20] hover:bg-white/[.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
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
            className="inline-flex min-h-10 items-center rounded-option px-3 text-left text-[12px] font-semibold text-white/58 transition-colors hover:bg-white/[.035] hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          >
            Справка: {helpTarget.label}
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
