"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import type {
  FormulaReferenceViewEntry,
  FormulaReferenceViewGroup,
} from "../../lib/learning/learning-links";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import styles from "./formulas.module.css";

interface FormulasEditorialBrowserProps {
  groups: readonly FormulaReferenceViewGroup[];
}

const shortGroupTitle: Record<string, string> = {
  kinematics: "Движение",
  dynamics: "Силы",
  electrodynamics: "Электричество",
  thermodynamics: "Тепло",
  optics: "Свет",
};

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function searchableText(entry: FormulaReferenceViewEntry) {
  return [
    entry.title,
    entry.formula,
    entry.caption,
    entry.limitation,
    ...entry.symbols.flatMap((symbol) => [symbol.latex, symbol.description]),
  ].join(" ");
}

function matchesQuery(entry: FormulaReferenceViewEntry, query: string) {
  const haystack = normalize(searchableText(entry));
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  // Ученик обычно ищет начальную форму слова («трение»), а в названии
  // справочника встречается склонение («трения»). Проверяем короткий стем,
  // чтобы поиск не ломался на естественной русской грамматике.
  return words.every((word) => haystack.includes(word) || (word.length > 4 && haystack.includes(word.slice(0, -1))));
}

function filterGroups(
  groups: readonly FormulaReferenceViewGroup[],
  query: string,
): readonly FormulaReferenceViewGroup[] {
  const needle = normalize(query.trim());
  if (!needle) return groups;

  return groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => matchesQuery(entry, needle)),
    }))
    .filter((group) => group.entries.length > 0);
}

function selectFormula(
  groups: readonly FormulaReferenceViewGroup[],
  formulaId: string | null,
): readonly FormulaReferenceViewGroup[] {
  if (!formulaId) return [];

  return groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => entry.id === formulaId),
    }))
    .filter((group) => group.entries.length > 0);
}

function FormulaEntry({
  entry,
  selected,
}: {
  entry: FormulaReferenceViewEntry;
  selected: boolean;
}) {
  return (
    <article
      className={styles.formulaEntry}
      data-selected={selected ? "true" : undefined}
      data-formula-id={entry.id}
    >
      <div
        className={styles.formula}
        role="img"
        tabIndex={0}
        aria-label={`Формула: ${entry.title}`}
        dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(entry.formula) }}
      />
      <div className={styles.meaning}>
        <h3>{entry.title}</h3>
        <p><span>Что говорит</span>{entry.caption}</p>
      </div>
      <div className={styles.applicability}>
        <p><span>Где работает</span>{entry.limitation}</p>
        <details className={styles.symbols}>
          <summary>Разобрать обозначения</summary>
          <dl>
            {entry.symbols.map((symbol) => (
              <div key={`${entry.id}-${symbol.latex}`}>
                <dt dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(symbol.latex) }} />
                <dd>{symbol.description}</dd>
              </div>
            ))}
          </dl>
        </details>
        {entry.relatedTasks.length > 0 ? (
          <div className={styles.taskLinks}>
            {entry.relatedTasks.map((task) => (
              <span key={task.familyId}>
                <Link href={task.practiceHref}>Потренироваться</Link>
                <Link href={task.taskHref}>Разобрать тип</Link>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function FormulasEditorialBrowser({ groups }: FormulasEditorialBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const formulaFromUrl = searchParams.get("formula");
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => setQuery(queryFromUrl), [queryFromUrl]);

  const selectedGroups = useMemo(
    () => selectFormula(groups, formulaFromUrl),
    [formulaFromUrl, groups],
  );
  const selectedEntry = selectedGroups.flatMap((group) => group.entries)[0] ?? null;
  const filteredGroups = useMemo(() => filterGroups(groups, query), [groups, query]);
  const displayedGroups = selectedEntry ? selectedGroups : filteredGroups;
  const isFiltering = query.trim().length > 0;
  const resultCount = displayedGroups.reduce((sum, group) => sum + group.entries.length, 0);
  const hasResults = resultCount > 0;

  useEffect(() => {
    if (!selectedEntry) return;
    const target = document.querySelector<HTMLElement>(`[data-formula-id="${CSS.escape(selectedEntry.id)}"]`);
    if (!target) return;
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }, [selectedEntry]);

  function navigate(params: URLSearchParams, mode: "push" | "replace" = "push") {
    const href = params.size ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router[mode](href, { scroll: false }));
  }

  function handleQuery(value: string) {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("formula");
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    navigate(params, "replace");
  }

  function showAll() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("formula");
    params.delete("q");
    navigate(params);
  }

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introMain}>
          <p className={styles.kicker}>Справочник / школьная физика</p>
          <h1>Найди нужную связь.</h1>
          <p className={styles.introText}>
            Выбери формулу, пойми её смысл и сразу проверь, где она работает.
          </p>
        </div>
        <div className={styles.introAside}>
          <section className={styles.finder} aria-labelledby="formula-search-title">
            <label htmlFor="formula-search" id="formula-search-title">Найти формулу</label>
            <div className={styles.searchLine}>
              <input
                id="formula-search"
                type="search"
                value={query}
                onChange={(event) => handleQuery(event.target.value)}
                placeholder="Например: трение, линза или ток"
              />
              {query || formulaFromUrl ? (
                <button type="button" onClick={showAll}>Показать всё</button>
              ) : null}
            </div>
            <p className={styles.resultLine} aria-live="polite">
              {selectedEntry
                ? `Открыта формула «${selectedEntry.title}»`
                : isFiltering
                  ? `Совпадений: ${resultCount}`
                  : `${resultCount} формул в пяти разделах`}
            </p>
          </section>
        </div>
      </header>

      {!isFiltering && !selectedEntry ? (
        <nav className={styles.sectionNav} aria-label="Разделы формул">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {shortGroupTitle[group.id] ?? group.title}
            </a>
          ))}
        </nav>
      ) : null}

      {!hasResults ? (
        <div className={styles.empty}>
          <p>Такой связи пока не нашлось. Попробуй назвать величину или явление иначе.</p>
          <button type="button" onClick={showAll}>Вернуться ко всем формулам</button>
        </div>
      ) : null}

      <div className={styles.groups}>
        {displayedGroups.map((group) => (
          <section
            key={group.id}
            id={!isFiltering && !selectedEntry ? group.id : undefined}
            className={styles.group}
            data-topic={group.id}
            aria-labelledby={`group-${group.id}`}
          >
            <header className={styles.groupHeader}>
              <div>
                <h2 id={`group-${group.id}`}>{group.title}</h2>
                <p>{group.intro}</p>
              </div>
              <strong>{group.entries.length}</strong>
            </header>
            <div className={styles.formulaList}>
              {group.entries.map((entry) => (
                <FormulaEntry
                  key={entry.id}
                  entry={entry}
                  selected={entry.id === selectedEntry?.id}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
