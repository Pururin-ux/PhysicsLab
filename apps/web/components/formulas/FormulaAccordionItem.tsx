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
  pink: "bg-topic-optics",
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
    // Компактная строка справочника: формула — главный объект и стоит слева,
    // название и назначение читаются рядом. Раньше это был высокий бокс, из-за
    // чего справочник превращался в очередную сетку карточек.
    <article
      className="formula-row overflow-hidden border-b border-white/[.08] bg-transparent transition-colors"
      data-open={isOpen}
      data-tone={badgeTone}
    >
      <button
        type="button"
        data-formula-id={entry.id}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="grid min-h-[84px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-1 py-4 text-left transition-colors hover:bg-white/[.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-blue/65 sm:grid-cols-[minmax(0,1fr)_176px_auto] sm:gap-5 sm:px-2"
      >
        <span
          aria-hidden="true"
          className="formula-paper formula-row-formula col-span-2 flex min-h-[54px] w-full items-center justify-center overflow-x-auto px-3 py-2.5 text-[18px] [scrollbar-width:none] sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-[176px] sm:text-[19px] [&::-webkit-scrollbar]:hidden [&_.katex]:text-[1em]"
          dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(entry.formula) }}
        />
        <span className="min-w-0">
          <span className="type-title flex items-center gap-2 text-white">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassByTone[badgeTone])}
            />
            {entry.title}
          </span>
          <span className="type-helper mt-0.5 line-clamp-2 block sm:line-clamp-1">
            <MathText text={entry.caption} />
          </span>
        </span>
        <CaretRight
          aria-hidden="true"
          size={16}
          weight="bold"
          className="formula-row-chevron shrink-0 text-white/40"
        />
      </button>

      {isOpen ? (
        <div id={panelId} className="flex flex-col gap-3 border-t border-white/[.06] px-1 pb-6 pt-4 sm:px-2">
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
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/[.08] py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/88">{task.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/58">{task.topicLabel}</p>
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
                        Решить 5 задач
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
