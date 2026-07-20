"use client";

import { useId, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { FormulaDetails } from "../theory/FormulaDisplay";
import { MathText } from "../ui/MathText";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { cn } from "../../lib/utils";
import type {
  FormulaReferenceGroup,
} from "../../lib/physics/formula-reference";
import type { FormulaReferenceViewEntry } from "../../lib/learning/learning-links";

const dotClassByTone: Record<FormulaReferenceGroup["badgeTone"], string> = {
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  pink: "bg-nova-pink",
  ember: "bg-nova-ember",
  neutral: "bg-white/30",
};

interface FormulaAccordionItemProps {
  entry: FormulaReferenceViewEntry;
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
    <article
      className="formula-row overflow-hidden rounded-card border border-white/[.11] bg-space-900 shadow-[0_16px_40px_rgba(0,0,0,.24)] transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-nova-blue/50 hover:shadow-[0_20px_48px_rgba(0,0,0,.3),0_0_20px_rgba(101,88,216,.1)]"
      data-open={isOpen}
      data-tone={badgeTone}
    >
      <button
        type="button"
        data-formula-id={entry.id}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="grid min-h-[168px] w-full grid-cols-[auto_minmax(0,1fr)_auto] content-between items-start gap-x-3 gap-y-3.5 px-4 py-4 text-left transition-colors hover:bg-white/[.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-blue/65 sm:px-5 sm:py-5"
      >
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassByTone[badgeTone])}
        />
        <span className="min-w-0 text-[15px] font-[800] leading-[1.35] text-white/90">
          {entry.title}
        </span>
        <span
          aria-hidden="true"
          className="formula-paper col-[1/4] row-start-2 min-w-0 overflow-x-auto rounded-[13px] px-3 py-4 text-center text-[20px] [scrollbar-width:none] sm:px-4 sm:text-[23px] [&::-webkit-scrollbar]:hidden [&_.katex]:text-[1em]"
          dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(entry.formula) }}
        />
        <span className="col-[1/4] row-start-3 text-[11px] font-medium leading-[1.5] text-white/52 sm:text-[12px]">
          <MathText text={entry.caption} />
        </span>
        <CaretRight
          aria-hidden="true"
          size={17}
          weight="bold"
          className="formula-row-chevron col-start-3 row-start-1 shrink-0 text-nova-blue"
        />
      </button>

      {isOpen ? (
        <div id={panelId} className="flex flex-col gap-3 border-t border-white/[.08] px-5 pb-5 pt-4 sm:px-6">
          <FormulaDetails symbols={entry.symbols} limitation={entry.limitation} />
          {entry.relatedTasks.length > 0 ? (
            <section className="border-t border-white/[.08] pt-3" aria-labelledby={`${panelId}-tasks`}>
              <h3 id={`${panelId}-tasks`} className="text-[13px] font-bold text-white/82">
                Задачи по этой формуле
              </h3>
              <ul className="mt-2 flex flex-col gap-2">
                {entry.relatedTasks.map((task) => (
                  <li
                    key={task.familyId}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-option border border-white/[.08] bg-white/[.02] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/88">{task.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/48">{task.topicLabel}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold">
                      <Link
                        href={task.taskHref}
                        className="rounded-option text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
                      >
                        Открыть тип
                      </Link>
                      <Link
                        href={task.practiceHref}
                        className="rounded-option text-nova-blue transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65"
                      >
                        Решить 5 похожих
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
