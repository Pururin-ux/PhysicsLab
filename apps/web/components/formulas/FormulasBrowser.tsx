"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { FormulaReferenceViewEntry, FormulaReferenceViewGroup } from "../../lib/learning/learning-links";
import { FormulaAccordionItem } from "./FormulaAccordionItem";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface FormulasBrowserProps {
  groups: readonly FormulaReferenceViewGroup[];
}

const dotClassByTone: Record<FormulaReferenceViewGroup["badgeTone"], string> = {
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  ember: "bg-nova-ember",
  neutral: "bg-white/30",
};

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function searchableEntryText(entry: FormulaReferenceViewEntry) {
  return [
    entry.title,
    entry.caption,
    entry.formula,
    entry.limitation,
    ...entry.symbols.flatMap((symbol) => [symbol.latex, symbol.description]),
  ].join(" ");
}

function filterGroups(
  groups: readonly FormulaReferenceViewGroup[],
  query: string,
): readonly FormulaReferenceViewGroup[] {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) =>
        normalize(searchableEntryText(entry)).includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.entries.length > 0);
}

function selectFormula(
  groups: readonly FormulaReferenceViewGroup[],
  formulaId: string | null,
): readonly FormulaReferenceViewGroup[] {
  if (!formulaId) {
    return [];
  }

  return groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => entry.id === formulaId),
    }))
    .filter((group) => group.entries.length > 0);
}

export function FormulasBrowser({ groups }: FormulasBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formulaFromUrl = searchParams.get("formula");
  const queryFromUrl = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  const selectedGroups = useMemo(
    () => selectFormula(groups, formulaFromUrl),
    [formulaFromUrl, groups],
  );
  const selectedEntry = selectedGroups.flatMap((group) => group.entries)[0] ?? null;
  const selectedFormulaId = selectedEntry?.id ?? null;
  const filteredGroups = useMemo(() => filterGroups(groups, query), [groups, query]);
  const displayedGroups = selectedFormulaId ? selectedGroups : filteredGroups;
  const isFiltering = query.trim().length > 0;
  const hasResults = displayedGroups.length > 0;
  const resultCount = displayedGroups.reduce(
    (total, group) => total + group.entries.length,
    0,
  );

  useEffect(() => {
    if (!selectedFormulaId) {
      return;
    }

    const target = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-formula-id]"),
    ).find((element) => element.dataset.formulaId === selectedFormulaId);

    if (!target) {
      return;
    }

    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "nearest" });
  }, [selectedFormulaId]);

  function navigate(params: URLSearchParams, history: "push" | "replace" = "push") {
    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router[history](href, { scroll: false }));
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("formula");
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    navigate(params, "replace");
  }

  function showAllFormulas() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("formula");
    params.delete("q");
    setQuery("");
    navigate(params);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Поиск по формулам</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M20 20l-4.8-4.8" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Найти формулу: например, «трение» или «Ома»"
            className="h-12 w-full rounded-option border border-white/[.12] bg-white/[.03] pl-10 pr-4 text-[14px] font-medium text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          />
        </label>

        {selectedEntry ? (
          <div className="flex flex-wrap items-center justify-between gap-3" role="status">
            <p className="text-[12px] font-semibold text-white/58">
              Формула для типа «{selectedEntry.relatedTasks[0]?.title ?? selectedEntry.title}»
            </p>
            <button
              type="button"
              onClick={showAllFormulas}
              className="rounded-option px-1 text-[12px] font-semibold text-nova-cyan/80 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
            >
              Показать все формулы
            </button>
          </div>
        ) : null}

        {isFiltering && hasResults ? (
          <p aria-live="polite" className="text-[12px] font-semibold text-white/48">
            Найдено: <span className="physics-number text-white/72">{resultCount}</span>
          </p>
        ) : null}

        {!isFiltering && !selectedEntry ? (
          <nav aria-label="Разделы справочника" className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className={`inline-flex min-h-9 items-center gap-2 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950 ${
                  group.status === "soon"
                    ? "border-white/[.08] bg-white/[.02] text-white/45 hover:border-white/20 hover:text-white/70"
                    : "border-white/[.12] bg-white/[.03] text-white/75 hover:border-nova-cyan/45 hover:text-white"
                }`}
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dotClassByTone[group.badgeTone]}`} />
                {group.title}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {!hasResults && (isFiltering || formulaFromUrl) ? (
        <Card className="border-white/[.08] !p-6 text-center">
          <p className="text-[14px] text-white/55">
            {formulaFromUrl && !isFiltering
              ? "Такая формула не найдена. Открой весь справочник и выбери нужную строку."
              : `Ничего не нашлось по запросу «${query.trim()}». Проверь написание или очисти поиск.`}
          </p>
          <button
            type="button"
            onClick={showAllFormulas}
            className="mt-4 min-h-10 rounded-option border border-white/[.12] px-4 text-[13px] font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            Показать все формулы
          </button>
        </Card>
      ) : null}

      {displayedGroups.map((group) => (
        <section
          key={group.id}
          id={!isFiltering && !selectedEntry ? group.id : undefined}
          className="flex scroll-mt-24 flex-col gap-3"
          aria-label={`Формулы: ${group.title}`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-[800] text-white">{group.title}</h2>
              <span className="text-[12px] font-semibold text-white/58">
                <span className="physics-number">{group.entries.length}</span> формул
              </span>
              {group.status === "soon" ? <Badge>скоро задачи</Badge> : null}
            </div>
            {!isFiltering && !selectedEntry ? (
              <p className="text-[13px] leading-[1.5] text-white/50">{group.intro}</p>
            ) : null}
          </div>

          <Card className="overflow-hidden border-white/[.08] bg-space-900/72 !p-2 shadow-none md:!p-3">
            {group.entries.map((entry) => (
              <FormulaAccordionItem
                key={entry.id}
                entry={entry}
                badgeTone={group.badgeTone}
                forceOpen={isFiltering || entry.id === selectedFormulaId}
              />
            ))}
          </Card>
        </section>
      ))}

      {!isFiltering && !selectedEntry && groups.some((group) => group.status === "soon") ? (
        <p className="text-[13px] leading-[1.6] text-white/45">
          По разделам с пометкой «скоро задачи» тренировки появятся позже —
          формулы уже проверены и доступны.
        </p>
      ) : null}
    </div>
  );
}
