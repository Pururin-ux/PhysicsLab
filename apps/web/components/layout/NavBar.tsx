"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { findActiveNavItem } from "./nav-config";
import { XPBadge } from "./XPBadge";

// Верхняя панель теперь общая для всех брейкпоинтов: навигация по разделам
// живёт в сайдбаре (desktop) и нижней панели (mobile), а здесь — контекст,
// поиск и XP.
export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeItem = findActiveNavItem(pathname);
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/tasks?q=${encodeURIComponent(trimmed)}` : "/tasks");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line-subtle bg-space-950/88 backdrop-blur-[16px]">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5 md:px-6">
        <Link
          href="/"
          className="pl-focus flex shrink-0 items-center gap-2 rounded-option"
          aria-label="PhysicsLab — на главную"
        >
          <span className="grid h-7 w-7 place-items-center rounded-[9px] border border-nova-cyan/35 bg-nova-cyan-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-nova-cyan" aria-hidden="true">
              <path d="M5 19V5m0 14h9m-9 0 6-9 5 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden text-[15px] font-[800] leading-none tracking-tight text-white sm:block">
            Physics<span className="text-nova-cyan">Lab</span>
          </span>
        </Link>

        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-soft md:hidden">
          {activeItem?.label ?? "ЦЭ/ЦТ · физика"}
        </p>

        {/* Поиск по каталогу типов задач: тот же запрос, что и на /tasks. */}
        <form
          role="search"
          onSubmit={handleSubmit}
          className="ml-auto hidden min-w-0 max-w-[340px] flex-1 items-center lg:flex"
        >
          <label htmlFor="shell-search" className="sr-only">
            Поиск по типам задач
          </label>
          <div className="relative w-full">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M20 20l-4.8-4.8" />
            </svg>
            <input
              id="shell-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти тип задачи: закон Ома, линза, v(t)…"
              className="h-9 w-full rounded-option border border-line bg-surface-1 pl-9 pr-3 text-[13px] font-medium text-white placeholder:text-white/35 focus-visible:border-nova-cyan/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/45"
            />
          </div>
        </form>

        {/* XP показываем с планшета: на телефоне в шапке место занимает
            название раздела, а прогресс доступен в нижней навигации. */}
        <div className="ml-auto hidden items-center gap-3 md:ml-0 md:flex">
          <XPBadge />
        </div>
      </div>
    </header>
  );
}
