import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TopicTheoryDrawerProps {
  title: string;
  description: string;
  children: ReactNode;
  layout?: "grid" | "stack";
  accent?: "cyan" | "gold" | "blue" | "ember";
  className?: string;
  subtopics?: string[];
}

const accentClasses: Record<NonNullable<TopicTheoryDrawerProps["accent"]>, string> = {
  cyan: "border-nova-cyan/24 bg-nova-cyan/[.035] text-nova-cyan",
  gold: "border-nova-gold/24 bg-nova-gold/[.04] text-nova-gold",
  blue: "border-nova-blue/24 bg-nova-blue/[.04] text-nova-blue",
  ember: "border-nova-ember/24 bg-nova-ember/[.04] text-nova-ember",
};

export function TopicTheoryDrawer({
  title,
  description,
  children,
  layout = "grid",
  accent = "cyan",
  className,
  subtopics = [],
}: TopicTheoryDrawerProps) {
  return (
    <section id="theory" className={cn("scroll-mt-24", className)}>
      <details className="group rounded-card border border-white/[.09] bg-space-900/72 shadow-card backdrop-blur-sm">
        <summary className="flex cursor-pointer list-none flex-col gap-4 rounded-card p-4 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950 sm:flex-row sm:items-center sm:justify-between sm:p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="text-[22px] font-[800] leading-tight text-white sm:text-[26px]">
              {title}
            </h2>
            <p className="max-w-[680px] text-[13px] leading-[1.65] text-white/62">
              {description}
            </p>
            {subtopics.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Подтемы разбора">
                {subtopics.map((subtopic) => (
                  <li
                    key={subtopic}
                    className="rounded-badge border border-white/[.08] bg-white/[.035] px-2 py-1 text-[11px] font-semibold leading-none text-white/58"
                  >
                    {subtopic}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <span
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-option border px-3 text-[12px] font-bold transition-colors",
              accentClasses[accent],
            )}
          >
            Справка по теме
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-white/[.08] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
          <div
            className={cn(
              layout === "stack"
                ? "mx-auto flex w-full max-w-[820px] flex-col gap-6 md:gap-8"
                : "grid gap-5 lg:grid-cols-2",
            )}
          >
            {children}
          </div>
        </div>
      </details>
    </section>
  );
}
