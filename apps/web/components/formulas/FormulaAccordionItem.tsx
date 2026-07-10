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
      className="formula-row border-b border-white/[.07] transition-colors last:border-b-0"
      data-open={isOpen}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="grid min-h-[72px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-1 py-3 text-left transition-colors hover:bg-white/[.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50 sm:min-h-14 sm:grid-cols-[auto_minmax(160px,1fr)_minmax(180px,.8fr)_auto] sm:py-2.5"
      >
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassByTone[badgeTone])}
        />
        <span className="min-w-0 text-[14px] font-semibold leading-[1.35] text-white/88 sm:truncate">
          {entry.title}
        </span>
        <span
          aria-hidden="true"
          className="formula-white col-[2/4] row-start-2 min-w-0 overflow-x-auto text-[15px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:col-auto sm:row-auto sm:text-right sm:text-[15px] [&_.katex]:text-[0.94em]"
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
          className="formula-row-chevron col-start-3 row-start-1 h-4 w-4 shrink-0 text-white/40 sm:col-auto sm:row-auto"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {isOpen ? (
        <div id={panelId} className="flex flex-col gap-3 px-5 pb-5 pt-1 sm:px-6">
          <p className="max-w-[760px] text-[12px] leading-[1.6] text-white/55">
            <MathText text={entry.caption} />
          </p>
          <FormulaDetails symbols={entry.symbols} limitation={entry.limitation} />
        </div>
      ) : null}
    </div>
  );
}
