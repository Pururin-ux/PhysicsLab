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
import type {
  HelpReason,
  HelpSectionId,
  TopicHelpSection,
} from "../../lib/learning/topic-help";
import { cn } from "../../lib/utils";
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
  presentation?: "responsive" | "inline" | "aside";
}

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
  open = false,
  onOpenChange,
  activeSectionId,
  highlightReason,
  presentation = "responsive",
}: TopicTheoryDrawerProps) {
  const headingId = useId();
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
  const visibleChildren = hasCompactActiveContent
    ? []
    : hasSectionedChildren && effectiveSectionId
      ? childList.filter((child) => getChildSectionIds(child).includes(effectiveSectionId))
      : childList;
  const reasonLabel =
    highlightReason === "mistake"
      ? "Раздел выбран по ошибке в ответе."
      : highlightReason === "task"
        ? "Раздел выбран для текущей задачи."
        : null;

  return (
    <aside
      id="theory"
      hidden={!open}
      data-testid="topic-theory-drawer"
      data-state={open ? "open" : "closed"}
      data-active-section={effectiveSectionId}
      data-presentation={presentation}
      aria-labelledby={headingId}
      className={cn(
        "min-w-0 scroll-mt-24 rounded-card border border-white/[.09] bg-space-900/92 p-4 shadow-card backdrop-blur-md sm:p-5",
        presentation === "aside"
          ? "sticky top-6"
          : presentation === "responsive"
            ? "min-[1180px]:sticky min-[1180px]:top-6"
            : null,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-[20px] font-[800] leading-tight text-white">
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-white/58">
            {description}
          </p>
        </div>

        <button
          type="button"
          data-testid="close-topic-help"
          onClick={() => onOpenChange?.(false)}
          aria-label="Закрыть справку"
          title="Закрыть справку"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-option border border-white/[.09] bg-white/[.025] text-white/62 transition-colors hover:border-white/[.18] hover:bg-white/[.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {reasonLabel ? (
        <p className="mt-3 text-[12px] leading-[1.5] text-white/48">{reasonLabel}</p>
      ) : null}

      {normalizedSubtopics.length > 1 ? (
        <label className="mt-4 flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-white/58">
          Другой раздел
          <select
            data-testid="help-section-selector"
            value={effectiveSectionId}
            onChange={(event) => setSelectedSectionId(event.target.value as HelpSectionId)}
            className="min-h-10 w-full rounded-option border border-white/[.11] bg-space-950/70 px-3 text-[13px] font-semibold normal-case tracking-normal text-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          >
            {normalizedSubtopics.map((subtopic) => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div
        className={cn(
          "mt-5",
          hasCompactActiveContent || hasSectionedChildren
            ? "flex flex-col gap-5"
            : layout === "stack"
              ? "flex flex-col gap-6"
              : "grid gap-5",
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
          <div className="border-l-2 border-white/[.12] pl-4">
            <h3 className="text-[17px] font-bold text-white/82">
              {activeSubtopic?.label ?? "Разбор темы"}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.65] text-white/62">
              {activeSubtopic?.shortHint ??
                "Открой подробное решение задачи — там будет нужный шаг."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
