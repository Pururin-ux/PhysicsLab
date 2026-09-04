"use client";

import {
  ArrowLeft,
  Atom,
  Books,
  ChartLineUp,
  DotsThree,
  GraduationCap,
  House,
  MoonStars,
  Sun,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  getActiveProductDestination,
  getProductDestination,
  isExamDestination,
  CONTEXTUAL_TOOLS,
  PRODUCT_DESTINATIONS,
} from "../../lib/product-routes";
import { cn } from "../../lib/utils";
import { SmoothAnchorScroll } from "./SmoothAnchorScroll";
import { StarField } from "./StarField";
import styles from "./AppShell.module.css";

const mobileIcons = {
  today: House,
  learn: Books,
  exam: GraduationCap,
  progress: ChartLineUp,
} as const;

function Brand() {
  return (
    <Link
      href="/"
      aria-label="PhysicsLab — на главную"
      className="physicslab-brand"
    >
      <span className="physicslab-brand__mark">
        <Atom size={22} weight="bold" aria-hidden="true" />
      </span>
      <span className="physicslab-brand__wordmark">
        Physics<span>Lab</span>
      </span>
    </Link>
  );
}

function UtilityMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div
      className={cn(styles.toolsMenu, "ml-auto md:ml-0")}
      data-open={open || undefined}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.toolsSummary}
        aria-label="Быстрый доступ"
        aria-expanded={open}
        aria-controls="shell-tools-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <DotsThree size={20} weight="bold" aria-hidden="true" />
      </button>
      {open ? (
        <nav
          id="shell-tools-panel"
          className={styles.toolsPanel}
          aria-label="Формулы, задачи и ошибки"
        >
          {CONTEXTUAL_TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.href} onClick={() => setOpen(false)}>
              <strong>{tool.label}</strong>
              <span>{tool.description}</span>
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

type Theme = "dark" | "light";

function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeDestination = getActiveProductDestination(pathname);

  return (
    <header className={cn(
      "site-header top-0 z-40",
      isHome ? "site-header--home absolute inset-x-0" : "site-header--inner sticky",
    )}>
      <div className={cn("mx-auto flex min-h-[64px] w-full items-center gap-4 px-4 sm:px-6 md:min-h-[76px] lg:px-8", isHome ? "max-w-none lg:px-12" : "max-w-[1300px]")}>
        <Brand />

        <div data-testid="desktop-sidebar-nav" className="ml-auto hidden items-center gap-2 md:flex">
          <nav data-testid="tablet-quick-actions" aria-label="Основная навигация" className="flex items-center gap-1">
            {PRODUCT_DESTINATIONS.map((item) => {
              const active = activeDestination?.id === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "site-nav-link",
                    active && "site-nav-link--active",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <UtilityMenu />
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          aria-pressed={theme === "light"}
          title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          className="shell-icon-button shell-theme-toggle"
        >
          {theme === "dark" ? <Sun size={18} weight="bold" /> : <MoonStars size={18} weight="bold" />}
        </button>
      </div>
    </header>
  );
}

function MobileNavigation() {
  const pathname = usePathname();
  const isFocusScene = pathname === "/practice/acceleration-focus";
  const activeDestination = getActiveProductDestination(pathname);

  return (
    <nav
      data-testid="mobile-bottom-nav"
      aria-label="Основная навигация"
      className={cn(
        "mobile-shell-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 px-1.5 pb-[calc(.24rem+env(safe-area-inset-bottom))] pt-1 md:hidden",
        isFocusScene && "mobile-shell-nav--focus pb-[calc(.2rem+env(safe-area-inset-bottom))] pt-0.5",
      )}
    >
      {PRODUCT_DESTINATIONS.map((item) => {
        const active = activeDestination?.id === item.id;
        const Icon = mobileIcons[item.id];

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "mobile-shell-nav__item",
              isFocusScene && "mobile-shell-nav__item--focus",
              active && "mobile-shell-nav__item--active",
            )}
          >
            <Icon
              size={20}
              weight={active ? "fill" : "regular"}
              aria-hidden="true"
            />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function ContextBack() {
  const pathname = usePathname();
  const show =
    pathname.startsWith("/tasks/") ||
    (pathname.startsWith("/practice/") && !isExamDestination(pathname));
  if (!show) return null;
  const href = pathname.startsWith("/tasks/")
    ? "/tasks"
    : getProductDestination("learn").href;
  // Кнопка «Назад» остаётся под липкой шапкой при прокрутке. z-30 держит её
  // под самой шапкой (z-40), но над содержимым страницы.
  return (
    <div className="sticky top-[86px] z-30 mb-5 hidden w-fit md:block">
      <Link
        href={href}
        className="context-back-link"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        Назад
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    // Чтение тоже в try: в приватном режиме и при запрете хранилища сам доступ
    // к localStorage бросает исключение, и незакрытый вызов ронял всё
    // приложение в экран «Приложение не запустилось».
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem("physicslab-theme");
    } catch {
      saved = null;
    }
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
  }, [theme, themeReady]);

  // Пишем только по нажатию переключателя. Простой просмотр страницы не должен
  // оставлять следов в хранилище — на это смотрит reference-solutions.spec.ts.
  const toggleTheme = () => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem("physicslab-theme", next);
      } catch {
        // Тема продолжает работать в памяти, даже если хранилище недоступно.
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "app-shell relative z-10 min-h-screen pb-[calc(4.1rem+env(safe-area-inset-bottom))] md:pb-0",
        pathname === "/" ? "app-shell--home" : "app-shell--inner",
      )}
    >
      {theme === "dark" ? <StarField /> : null}
      <SmoothAnchorScroll />
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <MobileNavigation />
      <main
        id="main-content"
        tabIndex={-1}
        style={pathname === "/" ? { maxWidth: "none" } : undefined}
        className={cn("app-shell-main relative z-10 min-w-0", pathname === "/" ? "app-shell-main--home p-0" : "px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8")}
      >
        <ContextBack />
        {children}
      </main>
    </div>
  );
}
