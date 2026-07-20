"use client";

import { ArrowLeft, Atom, ChartLineUp, MoonStars, Sun } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

const navigation = [
  { label: "Главная", href: "/", match: (path: string) => path === "/" },
  { label: "Темы", href: "/topics", match: (path: string) => path.startsWith("/topics") || path === "/practice/kinematics-demo" },
  { label: "Формулы", href: "/formulas", match: (path: string) => path.startsWith("/formulas") },
  { label: "Задачи", href: "/tasks", match: (path: string) => path.startsWith("/tasks") || (path.startsWith("/practice/") && path !== "/practice/kinematics-demo") },
] as const;

const mobilePrimaryNavigation = [
  { label: "Главная", href: "/", match: (path: string) => path === "/" },
  { label: "Учиться", href: "/practice/kinematics-demo", match: (path: string) => path === "/practice/kinematics-demo" },
  { label: "ЦТ/ЦЭ", href: "/practice/exam-demo", match: (path: string) => path === "/practice/exam-demo" },
] as const;

const mobileMoreNavigation = [
  { label: "Все темы", href: "/topics", match: (path: string) => path.startsWith("/topics") },
  { label: "Формулы", href: "/formulas", match: (path: string) => path.startsWith("/formulas") },
  { label: "Задачи", href: "/tasks", match: (path: string) => path.startsWith("/tasks") || (path.startsWith("/practice/") && path !== "/practice/kinematics-demo" && path !== "/practice/exam-demo") },
  { label: "Прогресс", href: "/profile", match: (path: string) => path.startsWith("/profile") },
] as const;

function Brand() {
  return (
    <Link
      href="/"
      aria-label="PhysicsLab — на главную"
      className="group flex shrink-0 items-center gap-2.5 rounded-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70"
    >
      <span className="grid size-10 place-items-center rounded-full border border-nova-pink/55 bg-nova-pink/[.08] text-nova-pink shadow-[0_0_22px_rgba(224,121,199,.12)] transition-transform group-hover:-rotate-6">
        <Atom size={24} weight="duotone" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[20px] font-[800] leading-none tracking-[-.04em] text-white">
          Physics<span className="text-nova-pink">Lab</span>
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.15em] text-white/64">
          физика в действии
        </span>
      </span>
    </Link>
  );
}

type Theme = "dark" | "light";

function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[.075] bg-space-950/92 shadow-[0_12px_35px_rgba(0,0,0,.24)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1300px] items-center gap-4 px-4 sm:px-6 md:min-h-[76px] lg:px-8">
        <Brand />

        <div data-testid="desktop-sidebar-nav" className="ml-auto hidden items-center gap-2 md:flex">
          <nav data-testid="tablet-quick-actions" aria-label="Основная навигация" className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center rounded-option px-4 text-[12px] font-[800] uppercase tracking-[.055em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70",
                    active ? "text-white" : "text-white/62 hover:text-white",
                  )}
                >
                  {item.label}
                  {active ? <span className="absolute inset-x-4 -bottom-0.5 h-px bg-nova-pink shadow-[0_0_10px_rgba(224,121,199,.7)]" /> : null}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/profile"
            className="inline-flex min-h-10 items-center gap-2 rounded-option border border-white/[.11] bg-white/[.035] px-4 text-[13px] font-bold text-white/84 transition-colors hover:border-nova-blue/55 hover:bg-nova-indigo/[.1]"
          >
            <ChartLineUp size={17} weight="duotone" aria-hidden="true" />
            Прогресс
          </Link>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          aria-pressed={theme === "light"}
          title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          className="grid size-10 shrink-0 place-items-center rounded-option border border-white/[.1] bg-white/[.035] text-nova-blue transition-[border-color,background-color,transform] hover:-translate-y-px hover:border-nova-blue/55 hover:bg-nova-indigo/[.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70"
        >
          {theme === "dark" ? <Sun size={18} weight="duotone" /> : <MoonStars size={18} weight="duotone" />}
        </button>
      </div>

      <nav data-testid="mobile-bottom-nav" aria-label="Мобильная навигация" className="mx-auto grid w-full max-w-[520px] grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-1 px-3 pb-2 md:hidden">
        {mobilePrimaryNavigation.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 min-w-0 items-center justify-center rounded-option border px-2 text-[11px] font-bold transition-colors",
                active
                  ? "border-nova-pink/45 bg-nova-pink/[.11] text-white"
                  : "border-transparent text-white/58 hover:bg-white/[.04] hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <details className="group relative">
          <summary
            className={cn(
              "flex min-h-10 cursor-pointer list-none items-center justify-center gap-1 rounded-option border px-2 text-[11px] font-bold text-white/60 marker:hidden hover:bg-white/[.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden",
              mobileMoreNavigation.some((item) => item.match(pathname)) && "border-nova-pink/45 bg-nova-pink/[.11] text-white",
            )}
          >
            Ещё <span aria-hidden="true" className="text-[10px] transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <div className="absolute right-0 top-[calc(100%+.4rem)] z-50 w-[190px] overflow-hidden rounded-[16px] border border-white/[.14] bg-space-900 p-1.5 shadow-[0_20px_48px_rgba(0,0,0,.45)]">
            {mobileMoreNavigation.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-option px-3 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-blue/70",
                    active ? "bg-nova-pink/[.11] text-white" : "text-white/68 hover:bg-white/[.05] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </details>
      </nav>
    </header>
  );
}

function ContextBack() {
  const pathname = usePathname();
  const show = pathname.startsWith("/tasks/") || pathname.startsWith("/practice/");
  if (!show) return null;
  const href = pathname.startsWith("/tasks/") ? "/tasks" : "/topics";
  return (
    <Link href={href} className="mb-5 hidden min-h-10 items-center gap-2 rounded-option border border-white/[.11] bg-white/[.025] px-3.5 text-[13px] font-bold text-white/70 hover:border-nova-cyan/40 hover:text-white sm:inline-flex">
      <ArrowLeft size={16} weight="bold" aria-hidden="true" />
      Назад
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("physicslab-theme");
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("physicslab-theme", theme);
    } catch {
      // Тема продолжает работать в памяти, даже если хранилище недоступно.
    }
  }, [theme, themeReady]);

  return (
    <div className={cn("app-shell relative z-10 min-h-screen", theme === "light" && "content-light")}>
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <Header theme={theme} onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")} />
      <main id="main-content" tabIndex={-1} className="app-shell-main min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <ContextBack />
        {children}
      </main>
    </div>
  );
}
