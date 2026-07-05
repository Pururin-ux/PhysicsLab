"use client";

import { useId, useState } from "react";
import { FormulaDetails } from "../theory/FormulaDisplay";
import { MathText } from "../ui/MathText";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { cn } from "../../lib/utils";
import type {
  FormulaReferenceEntry,
  FormulaReferenceGroup,
} from "../../lib/physics/formula-reference";

const dotClassByTone: Record<FormulaReferenceGroup["badgeTone"], string> = {
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  ember: "bg-nova-ember",
  neutral: "bg-white/30",
};

interface FormulaAccordionItemProps {
  entry: FormulaReferenceEntry;
  badgeTone: FormulaReferenceGroup["badgeTone"];
  forceOpen?: boolean;
}

// Свёрнутая строка показывает формулу целиком (её узнают по форме быстрее,
// чем читают название) — разворот открывает обозначения и область применения.
export function FormulaAccordionItem({
  entry,
  badgeTone,
  forceOpen = false,
}: FormulaAccordionItemProps) {
  const [open, setOpen] = useState(false);
  const isOpen = open || forceOpen;
  const panelId = useId();

  return (
    <div
      className="formula-row border-b border-white/[.07] last:border-b-0"
      data-open={isOpen}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-14 w-full flex-wrap items-center gap-3 py-2.5 text-left transition-colors hover:bg-white/[.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50 sm:flex-nowrap"
      >
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassByTone[badgeTone])}
        />
        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-white/88">
          {entry.title}
        </span>
        <span
          aria-hidden="true"
          className="formula-white order-3 ml-4 min-w-0 max-w-[calc(100%-1rem)] overflow-x-auto text-[14px] sm:order-none sm:ml-0 sm:max-w-[45%] sm:shrink-0 sm:text-[15px] [&_.katex]:text-[0.92em]"
          dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(entry.formula) }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="formula-row-chevron h-4 w-4 shrink-0 text-white/40"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {isOpen ? (
        <div id={panelId} className="flex flex-col gap-2 pb-4 pl-4">
          <p className="text-[12px] leading-[1.6] text-white/50">
            <MathText text={entry.caption} />
          </p>
          <FormulaDetails symbols={entry.symbols} limitation={entry.limitation} />
        </div>
      ) : null}
    </div>
  );
}
