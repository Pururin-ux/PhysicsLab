"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  filterTaskCatalog,
  type TaskCatalogTopicFilter,
  type TaskTypeCatalogEntry,
} from "../../lib/learning/task-catalog";
import type { TopicId } from "../../lib/learning/taxonomy";
import { topics } from "../../lib/topics";
import { cn } from "../../lib/utils";

interface TaskCatalogBrowserProps {
  entries: readonly TaskTypeCatalogEntry[];
}

const topicVisual: Record<TopicId, { dot: string }> = {
  kinematics: { dot: "bg-[var(--topic-kinematics-accent)]" },
  dynamics: { dot: "bg-[var(--topic-dynamics-accent)]" },
  electrodynamics: { dot: "bg-[var(--topic-electrodynamics-accent)]" },
  thermodynamics: { dot: "bg-[var(--topic-thermodynamics-accent)]" },
  optics: { dot: "bg-[var(--topic-optics-accent)]" },
};

const compactTopicTitle: Record<TopicId, string> = {
  kinematics: "Кинематика",
  dynamics: "Динамика",
  electrodynamics: "Ток и цепи",
  thermodynamics: "Теплота",
  optics: "Оптика",
};

function isTopicFilter(value: string | null): value is TopicId {
  return topics.some((topic) => topic.id === value);
}

function visualLabel(kind: TaskTypeCatalogEntry["visualKinds"][number]) {
  return kind === "graph" ? "С графиком" : "Со схемой";
}

function taskTypeCountLabel(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "типов";
  if (mod10 === 1) return "тип";
  if (mod10 >= 2 && mod10 <= 4) return "типа";
  return "типов";
}

export function TaskCatalogBrowser({ entries }: TaskCatalogBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const topicFromUrl = searchParams.get("topic");
  const activeTopic: TaskCatalogTopicFilter = isTopicFilter(topicFromUrl)
    ? topicFromUrl
    : "all";
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

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
        className="flex flex-col gap-4 rounded-card border border-[var(--border-muted)] bg-[var(--surface-panel)] p-3.5 shadow-[0_18px_48px_rgba(0,0,0,.28)] sm:p-5"
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
            placeholder="Например: закон Ома или v(t)"
            className={cn(
              "h-12 w-full rounded-option border border-[var(--border-muted)] bg-[var(--surface-canvas)] px-4 text-[14px] font-medium text-[var(--text-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,.035)] placeholder:text-[var(--text-quiet)] transition-colors hover:border-[var(--border-emphasis)] focus-visible:border-[var(--focus-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              // Место под «Очистить» занимаем только когда кнопка есть: иначе
              // на 360 px подсказка обрывается на полуслове.
              query ? "pr-24" : "pr-4",
            )}
          />
          {query ? (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="absolute right-2 top-1/2 min-h-9 -translate-y-1/2 rounded-option px-3 text-[12px] font-semibold text-[var(--text-quiet)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Очистить
            </button>
          ) : null}
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Фильтр по теме"
        >
          <button
            type="button"
            aria-pressed={activeTopic === "all"}
            onClick={() => navigate(query, "all")}
            className={`min-h-10 shrink-0 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
              activeTopic === "all"
                ? "border-[var(--mode-learn-accent)] bg-[var(--mode-learn-soft)] text-[var(--mode-learn-accent)]"
                : "border-[var(--border-muted)] bg-[var(--surface-panel-raised)] text-[var(--text-default)] hover:border-[var(--border-emphasis)] hover:text-[var(--text-strong)]"
            }`}
          >
            Все
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-label={topic.title}
              aria-pressed={activeTopic === topic.id}
              onClick={() => navigate(query, topic.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-option border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                activeTopic === topic.id
                  ? "border-[var(--mode-learn-accent)] bg-[var(--mode-learn-soft)] text-[var(--mode-learn-accent)]"
                  : "border-[var(--border-muted)] bg-[var(--surface-panel-raised)] text-[var(--text-default)] hover:border-[var(--border-emphasis)] hover:text-[var(--text-strong)]"
              }`}
            >
              <span className={`size-1.5 rounded-full ${topicVisual[topic.id].dot}`} aria-hidden="true" />
              {compactTopicTitle[topic.id]}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 border-t border-[var(--border-muted)] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p aria-live="polite" className="text-[13px] font-semibold text-[var(--text-quiet)]">
            Найдено типов: <span className="physics-number text-[var(--text-strong)]">{filteredEntries.length}</span>
          </p>
          <Link
            href="/topics"
            className="rounded-option text-[13px] font-semibold text-[var(--mode-learn-accent)] transition-colors hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Тренировки по крупным темам
          </Link>
        </div>
      </section>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-9" data-testid="task-catalog-results">
          {groups.map(({ topic, entries: topicEntries }) => (
            <section key={topic.id} aria-labelledby={`catalog-group-${topic.id}`}>
              {/* Заголовок раздела — типографикой, без карточки с картинкой:
                  внутри каталога важны сами типы задач, а не повторный арт. */}
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border-muted)] pb-2.5">
                <h2 id={`catalog-group-${topic.id}`} className="type-h2 flex items-center gap-2.5 text-[var(--text-strong)]">
                  <span className={`size-2 rounded-full ${topicVisual[topic.id].dot}`} aria-hidden="true" />
                  {topic.title}
                </h2>
                <span className="type-meta">
                  {topicEntries.length} {taskTypeCountLabel(topicEntries.length)}
                </span>
              </div>

              {/* Читаемый список, а не сетка крупных карточек: строка = тип
                  задачи, вся строка кликабельна. */}
              <ul>
                {topicEntries.map((entry) => (
                  <li
                    key={entry.id}
                    data-testid="task-catalog-item"
                    data-family={entry.slug}
                    data-topic={entry.topicId}
                    data-answer-format={entry.answerFormat}
                    className="border-b border-[var(--border-muted)] last:border-b-0"
                  >
                    <Link
                      href={`/tasks/${entry.slug}`}
                      aria-label={`Открыть тип задачи: ${entry.title}`}
                      className="group flex min-h-[62px] items-center gap-4 rounded-[10px] px-3 py-3 transition-colors duration-200 hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="type-title block text-[var(--text-strong)]">{entry.title}</span>
                        <span className="type-helper mt-0.5 line-clamp-1 block">{entry.shortDescription}</span>
                      </span>
                      {entry.visualKinds.length > 0 ? (
                        <span className="type-meta hidden shrink-0 sm:block">
                          {entry.visualKinds.map((kind) => visualLabel(kind)).join(" · ")}
                        </span>
                      ) : null}
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className="shrink-0 text-[var(--text-quiet)] transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--text-default)]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <section
          className="rounded-card border border-[var(--border-muted)] bg-[var(--surface-panel)] px-5 py-9 text-center shadow-[0_16px_44px_rgba(0,0,0,.28)]"
          data-testid="task-catalog-empty"
        >
          <h2 className="text-lg font-bold text-[var(--text-strong)]">Ничего не найдено</h2>
          <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-[var(--text-quiet)]">
            Попробуй название закона, формулу или другую тему.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              navigate("", "all", "replace");
            }}
            className="mt-4 min-h-10 rounded-option border border-[var(--border-muted)] px-4 text-[13px] font-semibold text-[var(--text-default)] hover:border-[var(--border-emphasis)] hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Сбросить фильтры
          </button>
        </section>
      )}

    </div>
  );
}
