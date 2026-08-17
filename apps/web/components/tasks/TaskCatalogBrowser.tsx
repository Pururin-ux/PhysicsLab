"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  filterTaskCatalog,
  type TaskCatalogTopicFilter,
  type TaskTypeCatalogEntry,
} from "../../lib/learning/task-catalog";
import type { CoverageSection } from "../../lib/learning/coverage";
import type { TopicId } from "../../lib/learning/taxonomy";
import { topics } from "../../lib/topics";

interface TaskCatalogBrowserProps {
  entries: readonly TaskTypeCatalogEntry[];
  coverage: readonly CoverageSection[];
}

function isTopicFilter(value: string | null): value is TopicId {
  return topics.some((topic) => topic.id === value);
}

function answerFormatLabel(format: TaskTypeCatalogEntry["answerFormat"]) {
  return format === "numeric_input" ? "Числовой ответ" : "Один ответ";
}

function difficultyLabel(entry: TaskTypeCatalogEntry) {
  const { min, max } = entry.difficultyRange;
  return min === max ? `Сложность ${min}` : `Сложность ${min}–${max}`;
}

function visualLabel(kind: TaskTypeCatalogEntry["visualKinds"][number]) {
  return kind === "graph" ? "График" : "Схема";
}

function taskTypeCountLabel(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "типов";
  if (mod10 === 1) return "тип";
  if (mod10 >= 2 && mod10 <= 4) return "типа";
  return "типов";
}

function coverageStatusLabel(status: CoverageSection["status"]) {
  return status === "partial" ? "Частично" : "Пока нет задач";
}

export function TaskCatalogBrowser({ entries, coverage }: TaskCatalogBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const topicFromUrl = searchParams.get("topic");
  const activeTopic: TaskCatalogTopicFilter = isTopicFilter(topicFromUrl)
    ? topicFromUrl
    : "all";
  const [query, setQuery] = useState(queryFromUrl);
  const [coverageOpen, setCoverageOpen] = useState(false);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const syncCoverageHash = () => setCoverageOpen(window.location.hash === "#coverage");
    syncCoverageHash();
    window.addEventListener("hashchange", syncCoverageHash);
    return () => window.removeEventListener("hashchange", syncCoverageHash);
  }, []);

  const filteredEntries = useMemo(
    () => filterTaskCatalog(entries, query, activeTopic),
    [activeTopic, entries, query],
  );

  const groups = useMemo(
    () =>
      topics
        .map((topic) => ({
          topic,
          entries: filteredEntries.filter((entry) => entry.topicId === topic.id),
        }))
        .filter((group) => group.entries.length > 0),
    [filteredEntries],
  );

  function navigate(
    nextQuery: string,
    nextTopic: TaskCatalogTopicFilter,
    history: "push" | "replace" = "push",
  ) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextTopic !== "all") params.set("topic", nextTopic);
    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => router[history](href, { scroll: false }));
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    navigate(value, activeTopic, "replace");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4" aria-label="Фильтры каталога">
        <div className="relative" role="search">
          <label htmlFor="task-catalog-search" className="sr-only">
            Поиск по типам задач
          </label>
          <input
            id="task-catalog-search"
            type="text"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Например: закон Ома, I=U/R или v(t)"
            className="h-12 w-full rounded-option border border-white/[.12] bg-white/[.03] px-4 pr-24 text-[14px] font-medium text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          />
          {query ? (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="absolute right-2 top-1/2 min-h-9 -translate-y-1/2 rounded-option px-3 text-[12px] font-semibold text-white/55 transition-colors hover:bg-white/[.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
            >
              Очистить
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по теме">
          <button
            type="button"
            aria-pressed={activeTopic === "all"}
            onClick={() => navigate(query, "all")}
            className={`min-h-10 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 ${
              activeTopic === "all"
                ? "border-nova-cyan/55 bg-nova-cyan/[.12] text-white"
                : "border-white/[.09] bg-white/[.02] text-white/60 hover:text-white"
            }`}
          >
            Все
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={activeTopic === topic.id}
              onClick={() => navigate(query, topic.id)}
              className={`min-h-10 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 ${
                activeTopic === topic.id
                  ? "border-nova-cyan/55 bg-nova-cyan/[.12] text-white"
                  : "border-white/[.09] bg-white/[.02] text-white/60 hover:text-white"
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-[13px] font-semibold text-white/55">
            Найдено типов: <span className="physics-number text-white/80">{filteredEntries.length}</span>
          </p>
          <Link
            href="/topics"
            className="rounded-option text-[13px] font-semibold text-nova-cyan/80 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            Тренировки по крупным темам
          </Link>
        </div>
      </section>

      <details
        id="coverage"
        open={coverageOpen}
        onToggle={(event) => setCoverageOpen(event.currentTarget.open)}
        data-testid="program-coverage"
        className="group rounded-card border border-white/[.09] bg-space-900/45"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[15px] font-[800] text-white marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-cyan/55 sm:px-5">
          <span>Покрытие программы</span>
          <span className="text-[12px] font-semibold text-nova-cyan/80 transition-transform group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="border-t border-white/[.08] px-4 pb-5 pt-4 sm:px-5">
          <h2 className="text-lg font-[800] text-white">Что уже покрывает PhysicsLab</h2>
          <p className="mt-1 max-w-3xl text-[13px] leading-[1.6] text-white/58">
            Сейчас доступны 35 типов задач в четырёх разделах. Все четыре раздела покрыты частично.
          </p>
          <p className="mt-2 text-[12px] font-semibold text-white/50">
            4 раздела с задачами · 2 раздела без задач
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-white/45">
            Количество типов относится ко всему каталогу, а не к текущему фильтру.
          </p>

          <ul className="mt-4 grid gap-3 lg:grid-cols-2" aria-label="Покрытие разделов физики">
            {coverage.map((section) => (
              <li key={section.id} className="border-l-2 border-white/[.13] pl-3.5">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-[14px] font-[800] text-white">{section.title}</h3>
                  <span className="text-[11px] font-bold text-white/55">{coverageStatusLabel(section.status)}</span>
                  <span className="text-[11px] font-semibold text-nova-cyan/75">
                    {section.familyCount} {taskTypeCountLabel(section.familyCount)}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-[1.55] text-white/55">{section.summary}</p>
                <ul className="mt-2 space-y-1 text-[12px] leading-[1.5] text-white/45">
                  {section.knownGaps.map((gap) => (
                    <li key={gap}>Не покрыто: {gap}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-7" data-testid="task-catalog-results">
          {groups.map(({ topic, entries: topicEntries }) => (
            <section key={topic.id} aria-labelledby={`catalog-group-${topic.id}`}>
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h2 id={`catalog-group-${topic.id}`} className="text-xl font-[800] text-white">
                  {topic.title}
                </h2>
                <span className="text-[12px] font-semibold text-white/60">
                  {topicEntries.length} {taskTypeCountLabel(topicEntries.length)}
                </span>
              </div>

              <div className="overflow-hidden rounded-card border border-white/[.08] bg-space-900/55">
                {topicEntries.map((entry) => (
                  <article
                    key={entry.id}
                    data-testid="task-catalog-item"
                    data-family={entry.slug}
                    data-topic={entry.topicId}
                    data-answer-format={entry.answerFormat}
                    className="grid gap-3 border-b border-white/[.07] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                  >
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-[800] leading-snug text-white">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-[1.55] text-white/58">
                        {entry.shortDescription}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-white/60">
                        <span>{answerFormatLabel(entry.answerFormat)}</span>
                        <span>{difficultyLabel(entry)}</span>
                        {entry.visualKinds.map((kind) => (
                          <span key={kind}>{visualLabel(kind)}</span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/tasks/${entry.slug}`}
                      aria-label={`Открыть тип задачи: ${entry.title}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-option border border-white/[.12] bg-white/[.035] px-4 text-[13px] font-bold text-white/72 transition-colors hover:border-nova-cyan/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                    >
                      Открыть тип
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section
          className="rounded-card border border-white/[.08] bg-space-900/55 px-5 py-8 text-center"
          data-testid="task-catalog-empty"
        >
          <h2 className="text-lg font-bold text-white">Ничего не найдено</h2>
          <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-white/55">
            Попробуй название закона, формулу или другую тему.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              navigate("", "all", "replace");
            }}
            className="mt-4 min-h-10 rounded-option border border-white/[.12] px-4 text-[13px] font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            Сбросить фильтры
          </button>
        </section>
      )}
    </div>
  );
}
