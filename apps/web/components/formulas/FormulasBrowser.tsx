"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { FormulaReferenceViewEntry, FormulaReferenceViewGroup } from "../../lib/learning/learning-links";
import { formulaCuratorByGroup } from "../../lib/topic-curators";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { FormulaAccordionItem } from "./FormulaAccordionItem";
import { Card } from "../ui/Card";

interface FormulasBrowserProps {
  groups: readonly FormulaReferenceViewGroup[];
}

const dotClassByTone: Record<FormulaReferenceViewGroup["badgeTone"], string> = {
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  pink: "bg-topic-optics",
  ember: "bg-nova-ember",
  neutral: "bg-white/30",
};

const headerClassByTone: Record<FormulaReferenceViewGroup["badgeTone"], string> = {
  cyan: "formula-section-cyan",
  gold: "formula-section-gold",
  blue: "formula-section-blue",
  pink: "formula-section-pink",
  ember: "formula-section-ember",
  neutral: "formula-section-neutral",
};

const compactGroupTitle: Record<string, string> = {
  kinematics: "Кинематика",
  dynamics: "Динамика",
  electrodynamics: "Ток и цепи",
  thermodynamics: "Теплота",
  optics: "Оптика",
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

function FormulaObservationStage({ entry }: { entry: FormulaReferenceViewEntry | null }) {
  if (!entry) {
    return null;
  }

  return (
    <section className="formula-observation-stage" aria-labelledby="formula-observation-title">
      <div className="formula-observation-copy">
        <p className="formula-observation-eyebrow">Разобрать на движении</p>
        <h2 id="formula-observation-title">Ускорение — это то, как быстро меняется скорость.</h2>
        <p>
          У троллейбуса скорость растёт на 2 м/с каждую секунду. Наклон линии на графике — не абстракция: это и есть его разгон.
        </p>
        <div className="formula-observation-actions">
          <Link href="/practice/acceleration-focus" className="formula-observation-primary">
            Увидеть на движении
          </Link>
          {entry.relatedTasks[0] ? (
            <Link href={entry.relatedTasks[0].practiceHref} className="formula-observation-secondary">
              Попробовать задачу
            </Link>
          ) : null}
        </div>
      </div>

      <div className="formula-observation-visual" aria-label="Скорость троллейбуса равномерно растёт со временем">
        <div className="formula-observation-route" aria-hidden="true">
          <span className="formula-observation-stop">остановка</span>
          <span className="formula-observation-tram">▰</span>
          <span className="formula-observation-lamp" />
          <span className="formula-observation-rail" />
        </div>
        <svg viewBox="0 0 330 150" role="img" aria-label="Линия скорости от 2 до 8 метров в секунду за 3 секунды">
          <defs>
            <linearGradient id="formula-graph-line" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ffbd77" />
              <stop offset="1" stopColor="#78e0f3" />
            </linearGradient>
          </defs>
          <path className="formula-graph-grid" d="M36 18V122H308M36 88H308M36 54H308M104 18V122M172 18V122M240 18V122" />
          <path className="formula-graph-area" d="M36 104 L308 28 L308 122 L36 122 Z" />
          <path className="formula-graph-line" d="M36 104 L308 28" />
          {[ [36,104,"2"], [127,79,"4"], [217,53,"6"], [308,28,"8"] ].map(([x, y, label]) => (
            <g key={label as string}>
              <circle cx={x as number} cy={y as number} r="4" className="formula-graph-point" />
              <text x={x as number} y={(y as number) - 11} className="formula-graph-label">{label}</text>
            </g>
          ))}
          <text x="9" y="18" className="formula-graph-unit">v, м/с</text>
          <text x="279" y="144" className="formula-graph-unit">t, с</text>
        </svg>
        <div className="formula-observation-equation" dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(entry.formula) }} />
      </div>
    </section>
  );
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
  const featuredFormula = groups
    .find((group) => group.id === "kinematics")
    ?.entries.find((entry) => entry.id === "vt-slope") ?? null;

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
    // Переход из задачи в справочник должен доезжать до формулы плавно, а не
    // подменять экран рывком.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
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
      {!isFiltering && !selectedEntry ? <FormulaObservationStage entry={featuredFormula} /> : null}
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Поиск по формулам</span>
          <MagnifyingGlass
            aria-hidden="true"
            size={17}
            weight="bold"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Найти формулу: «трение», «Ома»"
            className="formula-library-search h-12 w-full pl-10 pr-4 text-[14px] font-medium text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65"
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
              className="rounded-option px-1 text-[12px] font-semibold text-nova-blue transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65"
            >
              Показать все формулы
            </button>
          </div>
        ) : null}

        {isFiltering && hasResults ? (
          <p aria-live="polite" className="text-[12px] font-semibold text-white/58">
            Найдено: <span className="physics-number text-white/72">{resultCount}</span>
          </p>
        ) : null}

      </div>

      {!isFiltering && !selectedEntry ? (
        // Липкая полоса разделов: живёт на верхнем уровне компонента, поэтому
        // «прилипает» на всю высоту справочника — до любой группы один клик.
        <nav
          aria-label="Разделы справочника"
          className="formula-library-nav sticky top-[64px] z-20 -mx-2 -my-4 flex flex-wrap gap-2 px-2 py-2 md:top-[68px]"
        >
          {groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              aria-label={group.title}
              className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950 ${
                group.status === "soon"
                  ? "border-white/[.11] bg-white/[.025] text-white/68 hover:border-white/24 hover:text-white"
                  : "border-white/[.12] bg-white/[.03] text-white/75 hover:border-nova-blue/50 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dotClassByTone[group.badgeTone]}`} />
              {compactGroupTitle[group.id] ?? group.title}
            </a>
          ))}
        </nav>
      ) : null}

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
            className="mt-4 min-h-10 rounded-option border border-white/[.12] px-4 text-[13px] font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          >
            Показать все формулы
          </button>
        </Card>
      ) : null}

      {displayedGroups.map((group, groupIndex) => {
        const curator = formulaCuratorByGroup[group.id as keyof typeof formulaCuratorByGroup];

        return (
          <section
            key={group.id}
            id={!isFiltering && !selectedEntry ? group.id : undefined}
            className="flex scroll-mt-24 flex-col gap-4"
            aria-label={`Формулы: ${group.title}`}
          >
            <div className={`formula-section-header ${headerClassByTone[group.badgeTone]}`}>
              <div className="formula-curator-portrait relative size-[124px] shrink-0 overflow-hidden rounded-[19px] sm:size-[168px]">
                {curator ? (
                  <Image
                    src={curator.src}
                    alt={curator.alt}
                    fill
                    priority={groupIndex < 2}
                    sizes="(max-width: 639px) 124px, 168px"
                    className={`object-cover ${curator.imageClassName}`}
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className="max-w-full text-[21px] font-[800] tracking-[-.02em] text-white [overflow-wrap:anywhere] sm:text-[24px]">{group.title}</h2>
                  <span className="text-[11px] font-semibold text-white/58 sm:text-[12px]">
                    <span className="physics-number">{group.entries.length}</span> формул
                  </span>
                </div>
                {!isFiltering && !selectedEntry ? (
                  <p className="mt-1 text-[13px] leading-[1.5] text-white/58">{group.intro}</p>
                ) : null}
                {curator ? (
                  <p className="formula-curator-note mt-3 text-[12px] font-semibold leading-[1.5] text-white/76">
                    {curator.note}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Строки справочника — в две колонки максимум: они компактные и
                читаются как список, а не как плитка. */}
            <div className="grid items-start gap-2.5 xl:grid-cols-2">
              {group.entries.map((entry) => (
                <FormulaAccordionItem
                  key={entry.id}
                  entry={entry}
                  badgeTone={group.badgeTone}
                  forceOpen={isFiltering || entry.id === selectedFormulaId}
                />
              ))}
            </div>
          </section>
        );
      })}

    </div>
  );
}
