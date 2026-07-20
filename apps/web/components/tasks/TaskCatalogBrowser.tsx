"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
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

const topicArt: Record<TopicId, string> = {
  kinematics: "/art/production/topic-kinematics-cozy.webp",
  dynamics: "/art/production/topic-dynamics-cozy.webp",
  electrodynamics: "/art/production/topic-electricity-cozy.webp",
  thermodynamics: "/art/production/topic-thermodynamics-cozy.webp",
  optics: "/art/production/topic-optics-cozy.webp",
};

const topicVisual: Record<TopicId, { dot: string; edge: string }> = {
  kinematics: { dot: "bg-nova-ember", edge: "border-l-nova-ember" },
  dynamics: { dot: "bg-nova-blue", edge: "border-l-nova-blue" },
  electrodynamics: { dot: "bg-nova-cyan", edge: "border-l-nova-cyan" },
  thermodynamics: { dot: "bg-nova-gold", edge: "border-l-nova-gold" },
  optics: { dot: "bg-nova-pink", edge: "border-l-nova-pink" },
};

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
    <div className="flex flex-col gap-8">
      <section
        className="flex flex-col gap-4 rounded-card border border-white/[.11] bg-space-900/85 p-3.5 shadow-[0_18px_48px_rgba(0,0,0,.28)] sm:p-5"
        aria-label="Фильтры каталога"
      >
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
            className="h-12 w-full rounded-option border border-white/[.14] bg-space-950/85 px-4 pr-24 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.035)] placeholder:text-white/42 transition-colors hover:border-white/[.2] focus-visible:border-nova-blue/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65"
          />
          {query ? (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="absolute right-2 top-1/2 min-h-9 -translate-y-1/2 rounded-option px-3 text-[12px] font-semibold text-white/62 transition-colors hover:bg-white/[.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
            >
              Очистить
            </button>
          ) : null}
        </div>

        <div
          className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Фильтр по теме"
        >
          <button
            type="button"
            aria-pressed={activeTopic === "all"}
            onClick={() => navigate(query, "all")}
            className={`min-h-10 shrink-0 snap-start rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 ${
              activeTopic === "all"
                ? "border-nova-blue/65 bg-nova-indigo/[.14] text-nova-blue shadow-[0_0_20px_rgba(101,88,216,.12)]"
                : "border-white/[.12] bg-space-800/80 text-white/68 hover:border-white/[.2] hover:text-white"
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
              className={`inline-flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 ${
                activeTopic === topic.id
                  ? "border-nova-blue/65 bg-nova-indigo/[.14] text-nova-blue shadow-[0_0_20px_rgba(101,88,216,.12)]"
                  : "border-white/[.12] bg-space-800/80 text-white/68 hover:border-white/[.2] hover:text-white"
              }`}
            >
              <span className={`size-1.5 rounded-full ${topicVisual[topic.id].dot}`} aria-hidden="true" />
              {topic.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 border-t border-white/[.08] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p aria-live="polite" className="text-[13px] font-semibold text-white/62">
            Найдено типов: <span className="physics-number text-white/80">{filteredEntries.length}</span>
          </p>
          <Link
            href="/topics"
            className="rounded-option text-[13px] font-semibold text-nova-blue transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65"
          >
            Тренировки по крупным темам
          </Link>
        </div>
      </section>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-9" data-testid="task-catalog-results">
          {groups.map(({ topic, entries: topicEntries }) => (
            <section key={topic.id} aria-labelledby={`catalog-group-${topic.id}`}>
              <div className="mb-4 grid overflow-hidden rounded-card border border-white/[.1] bg-space-900 sm:grid-cols-[150px_minmax(0,1fr)]">
                <div className="relative h-28 bg-space-950 sm:h-full">
                  <Image
                    src={topicArt[topic.id]}
                    alt=""
                    fill
                    sizes="150px"
                    className="object-cover object-[center_62%]"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
                  <div>
                    <h2 id={`catalog-group-${topic.id}`} className="flex items-center gap-2.5 text-[22px] font-[800] tracking-[-0.02em] text-white">
                      <span className={`size-2 rounded-full ${topicVisual[topic.id].dot}`} aria-hidden="true" />{topic.title}
                    </h2>
                    <p className="mt-1 text-[12px] leading-[1.55] text-white/52">{topic.description}</p>
                  </div>
                  <span className="rounded-full border border-nova-pink/28 bg-nova-pink/[.07] px-3 py-1.5 text-[11px] font-bold text-nova-pink">
                    {topicEntries.length} {taskTypeCountLabel(topicEntries.length)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {topicEntries.map((entry) => (
                  <article
                    key={entry.id}
                    data-testid="task-catalog-item"
                    data-family={entry.slug}
                    data-topic={entry.topicId}
                    data-answer-format={entry.answerFormat}
                    className={`group flex flex-col overflow-hidden rounded-card border border-l-2 border-white/[.12] bg-space-900 p-4 shadow-[0_14px_34px_rgba(0,0,0,.22),inset_0_1px_0_rgba(255,255,255,.035)] transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-nova-blue/52 hover:shadow-[0_18px_42px_rgba(0,0,0,.26),0_0_24px_rgba(101,88,216,.1)] focus-within:border-nova-blue/68 sm:p-5 ${topicVisual[entry.topicId].edge}`}
                  >
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-[800] leading-[1.3] tracking-[-0.012em] text-white">
                        {entry.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 max-w-[62ch] text-pretty text-[13px] leading-[1.58] text-white/68">
                        {entry.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] font-semibold leading-[1.4] text-white/58">
                        <span>{answerFormatLabel(entry.answerFormat)}</span>
                        <span>{difficultyLabel(entry)}</span>
                        {entry.visualKinds.map((kind) => (
                          <span key={kind}>{visualLabel(kind)}</span>
                        ))}
                      </div>
                      <Link
                        href={`/tasks/${entry.slug}`}
                        aria-label={`Открыть тип задачи: ${entry.title}`}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-option border border-nova-blue/48 bg-nova-indigo/[.1] px-3.5 text-[13px] font-bold text-nova-blue transition-[color,background-color,border-color,box-shadow,transform] hover:-translate-y-px hover:border-nova-blue hover:bg-nova-indigo/[.2] hover:text-nova-blue hover:shadow-indigo-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 focus-visible:ring-offset-2 focus-visible:ring-offset-space-800"
                      >
                        Открыть <ArrowRight size={15} weight="bold" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section
          className="rounded-card border border-white/[.11] bg-space-900 px-5 py-9 text-center shadow-[0_16px_44px_rgba(0,0,0,.28)]"
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
            className="mt-4 min-h-10 rounded-option border border-white/[.12] px-4 text-[13px] font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          >
            Сбросить фильтры
          </button>
        </section>
      )}

      {/* Мета-информация о покрытии — после самих задач: на телефоне первые
          карточки должны быть видны без прокрутки мимо справочных блоков. */}
      <details
        id="coverage"
        open={coverageOpen}
        onToggle={(event) => setCoverageOpen(event.currentTarget.open)}
        data-testid="program-coverage"
        className="group scroll-mt-24 rounded-card border border-white/[.11] bg-space-900/90 shadow-[0_16px_44px_rgba(0,0,0,.24)]"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[15px] font-[800] text-white transition-colors marker:content-none hover:bg-white/[.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-blue/55 sm:px-5">
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
    </div>
  );
}
