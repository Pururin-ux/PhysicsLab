"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import type { HelpReason, HelpSectionId, TopicHelpSection } from "../../lib/learning/topic-help";
import { CompactHelpCard } from "./CompactHelpCard";

export type TopicTheorySubtopic = TopicHelpSection | string;

interface TopicTheoryDrawerProps {
  title: string;
  description: string;
  children: ReactNode;
  layout?: "grid" | "stack";
  accent?: "cyan" | "gold" | "blue" | "ember";
  className?: string;
  subtopics?: TopicTheorySubtopic[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeSectionId?: HelpSectionId;
  highlightReason?: HelpReason;
}

const accentClasses: Record<NonNullable<TopicTheoryDrawerProps["accent"]>, string> = {
  cyan: "border-nova-cyan/24 bg-nova-cyan/[.035] text-nova-cyan",
  gold: "border-nova-gold/24 bg-nova-gold/[.04] text-nova-gold",
  blue: "border-nova-blue/24 bg-nova-blue/[.04] text-nova-blue",
  ember: "border-nova-ember/24 bg-nova-ember/[.04] text-nova-ember",
};

const activeChipClasses: Record<NonNullable<TopicTheoryDrawerProps["accent"]>, string> = {
  cyan: "border-nova-cyan/40 bg-nova-cyan/[.12] text-nova-cyan",
  gold: "border-nova-gold/40 bg-nova-gold/[.13] text-nova-gold",
  blue: "border-nova-blue/40 bg-nova-blue/[.13] text-nova-blue",
  ember: "border-nova-ember/40 bg-nova-ember/[.13] text-nova-ember",
};

type SectionChildProps = {
  "data-help-section-id"?: string;
};

function normalizeSubtopic(subtopic: TopicTheorySubtopic): TopicHelpSection {
  if (typeof subtopic !== "string") {
    return subtopic;
  }

  return {
    id: subtopic as HelpSectionId,
    label: subtopic,
    shortHint: "Короткая справка по этому разделу.",
  };
}

function getChildSectionIds(child: ReactNode) {
  if (!isValidElement(child)) {
    return [];
  }

  const props = child.props as SectionChildProps;
  return (props["data-help-section-id"] ?? "")
    .split(/\s+/)
    .map((id) => id.trim())
    .filter(Boolean);
}

export function TopicTheoryDrawer({
  title,
  description,
  children,
  layout = "grid",
  accent = "cyan",
  className,
  subtopics = [],
  open,
  onOpenChange,
  activeSectionId,
  highlightReason,
}: TopicTheoryDrawerProps) {
  const panelId = useId();
  const normalizedSubtopics = useMemo(
    () => subtopics.map(normalizeSubtopic),
    [subtopics],
  );
  const firstSectionId = normalizedSubtopics[0]?.id;
  const [selectedSectionId, setSelectedSectionId] = useState<HelpSectionId | undefined>(
    activeSectionId ?? firstSectionId,
  );

  useEffect(() => {
    if (activeSectionId) {
      setSelectedSectionId(activeSectionId);
    }
  }, [activeSectionId]);

  const effectiveSectionId = selectedSectionId ?? activeSectionId ?? firstSectionId;
  const activeSubtopic = normalizedSubtopics.find(
    (subtopic) => subtopic.id === effectiveSectionId,
  );
  const hasCompactActiveContent = Boolean(
    activeSubtopic?.formula || activeSubtopic?.mistake,
  );
  const childList = Children.toArray(children);
  const hasSectionedChildren = childList.some(
    (child) => getChildSectionIds(child).length > 0,
  );
  const visibleChildren =
    hasCompactActiveContent
      ? []
      : hasSectionedChildren && effectiveSectionId
      ? childList.filter((child) => getChildSectionIds(child).includes(effectiveSectionId))
      : childList;
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : false;
  const reasonLabel =
    highlightReason === "mistake"
      ? "по ошибке"
      : highlightReason === "task"
        ? "к задаче"
        : null;

  return (
    <section id="theory" className={cn("scroll-mt-24", className)}>
      <details
        data-testid="topic-theory-drawer"
        data-active-section={effectiveSectionId}
        open={isControlled ? open : undefined}
        onToggle={(event) => {
          const nextOpen = event.currentTarget.open;
          if (!isControlled || nextOpen !== open) {
            onOpenChange?.(nextOpen);
          }
        }}
        className="group rounded-card border border-white/[.09] bg-space-900/72 shadow-card backdrop-blur-sm"
      >
        <summary
          aria-controls={panelId}
          className="flex cursor-pointer list-none flex-col gap-4 rounded-card p-4 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950 sm:flex-row sm:items-center sm:justify-between sm:p-5 [&::-webkit-details-marker]:hidden"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="text-[22px] font-[800] leading-tight text-white sm:text-[26px]">
              {title}
            </h2>
            <p className="max-w-[680px] text-[13px] leading-[1.65] text-white/62">
              {description}
            </p>
          </div>

          <span
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-option border px-3 text-[12px] font-bold transition-colors",
              accentClasses[accent],
            )}
          >
            {isOpen ? "Свернуть" : "Справка"}
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

        <div
          id={panelId}
          className="border-t border-white/[.08] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5"
        >
          {normalizedSubtopics.length > 0 ? (
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2" aria-label="Разделы справки">
                {normalizedSubtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    type="button"
                    data-testid={`help-section-button-${subtopic.id}`}
                    aria-pressed={subtopic.id === effectiveSectionId}
                    onClick={() => setSelectedSectionId(subtopic.id)}
                    className={cn(
                      "rounded-option border px-3 py-2 text-left text-[12px] font-bold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50",
                      subtopic.id === effectiveSectionId
                        ? activeChipClasses[accent]
                        : "border-white/[.08] bg-white/[.035] text-white/62 hover:border-white/[.14] hover:text-white/80",
                    )}
                  >
                    {subtopic.label}
                  </button>
                ))}
              </div>

              {activeSubtopic && !hasCompactActiveContent ? (
                <p className="text-[13px] leading-[1.6] text-white/62">
                  {reasonLabel ? (
                    <span
                      className={cn(
                        "mr-2 rounded-badge border px-2 py-0.5 text-[11px] font-bold",
                        accentClasses[accent],
                      )}
                    >
                      {reasonLabel}
                    </span>
                  ) : null}
                  {activeSubtopic.shortHint}
                </p>
              ) : null}
            </div>
          ) : null}

          <div
            className={cn(
              hasCompactActiveContent || hasSectionedChildren
                ? "mx-auto flex w-full max-w-[860px] flex-col gap-5"
                : layout === "stack"
                  ? "mx-auto flex w-full max-w-[820px] flex-col gap-6 md:gap-8"
                  : "grid gap-5 lg:grid-cols-2",
            )}
          >
            {activeSubtopic && hasCompactActiveContent ? (
              <CompactHelpCard
                accent={accent}
                sectionId={activeSubtopic.id}
                title={activeSubtopic.label}
                body={activeSubtopic.shortHint}
                formula={activeSubtopic.formula}
                trap={activeSubtopic.mistake}
              />
            ) : visibleChildren.length > 0 ? (
              visibleChildren
            ) : (
              <div className="rounded-card border border-white/[.08] bg-white/[.035] p-4">
                <p className="text-[15px] font-bold text-white/82">
                  {activeSubtopic?.label ?? "Разбор темы"}
                </p>
                <p className="mt-2 text-[13px] leading-[1.65] text-white/62">
                  {activeSubtopic?.shortHint ??
                    "Открой подробное решение задачи — там будет нужный шаг."}
                </p>
              </div>
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
