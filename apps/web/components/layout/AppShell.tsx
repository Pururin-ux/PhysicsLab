"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { NavBar } from "./NavBar";
import { SiteFooter } from "./SiteFooter";

import { sidebarGroups, mobileNavItems, tabletQuickActions, type NavItem } from "./nav-config";

function SidebarItem({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  const pathname = usePathname();
  const active = item.match?.(pathname) ?? false;
  const baseClass = cn(
    "pl-focus group flex items-center rounded-option border font-semibold transition-colors",
    mobile
      ? "min-h-[52px] flex-col justify-center gap-1 px-1 py-1.5 text-[10px]"
      : "min-h-11 gap-3 px-3 text-[13px]",
  );
  const stateClass = active
    ? "border-nova-cyan/45 bg-nova-cyan/[.10] text-white pl-accent-cyan"
    : "border-transparent text-ink-muted hover:border-line hover:bg-surface-1 hover:text-white";

  const content = (
    <>
      {item.icon ? (
        <span className={cn("text-white/58 transition-colors group-hover:text-current", active ? "text-nova-cyan" : null)}>
          {item.icon}
        </span>
      ) : null}
      <span
        className={cn(
          "min-w-0 flex-1",
          mobile ? "text-center leading-none" : "break-words leading-[1.35]",
        )}
      >
        {item.label}
      </span>
      {!mobile && active ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-nova-cyan shadow-cyan-glow" />
      ) : null}
    </>
  );

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(baseClass, stateClass)}
    >
      {content}
    </Link>
  );
}

function SidebarNav() {
  return (
    <nav
      data-testid="desktop-sidebar-nav"
      className="flex flex-col gap-5"
      aria-label="Разделы PhysicsLab"
    >
      {sidebarGroups.map((group) => (
        <section key={group.title} className="flex flex-col gap-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[.16em] text-ink-faint">
            {group.title}
          </p>
          <div className="flex flex-col gap-1.5">
            {group.items.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}

function MobileSidebarNav() {
  return (
    <nav
      className="grid grid-cols-5 gap-1"
      data-testid="mobile-bottom-nav"
      aria-label="Мобильная навигация"
    >
      {mobileNavItems.map((item) => (
        <SidebarItem key={item.label} item={item} mobile />
      ))}
    </nav>
  );
}

function AppSidebar() {
  return (
    <aside
      data-testid="app-sidebar"
      className="pl-panel sticky top-[76px] hidden self-start flex-col rounded-card p-4 backdrop-blur-md lg:flex"
    >
      <div className="mb-5 flex shrink-0 flex-col">
        <p className="text-[18px] font-black leading-none tracking-tight text-white">
          Physics<span className="text-nova-cyan">Lab</span>
        </p>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-ink-faint">
          ЦЭ/ЦТ · физика
        </p>
      </div>

      <SidebarNav />

      <div className="mt-6 flex flex-col gap-2 border-t border-line-subtle pt-4">
        <Link
          href="/about"
          className="pl-focus rounded-option px-3 text-[12px] font-semibold text-ink-soft transition-colors hover:text-white"
        >
          О проекте
        </Link>
        <p className="px-3 text-[11px] leading-[1.55] text-white/45">
          Прогресс хранится только в этом браузере.
        </p>
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[.08] bg-space-950/92 px-2 py-2 backdrop-blur-xl md:hidden">
      <MobileSidebarNav />
    </div>
  );
}

function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex min-h-10 items-center gap-2 rounded-option border border-white/[.08] bg-white/[.025] px-3 text-[13px] font-semibold text-white/68 transition-colors hover:border-white/[.16] hover:bg-white/[.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Назад
    </button>
  );
}

function ShellTopBar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const fallbackHref = pathname.startsWith("/practice/family")
    ? "/tasks"
    : pathname.startsWith("/practice")
      ? "/topics"
      : "/";

  return (
    <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
      <BackButton fallbackHref={fallbackHref} />

      {/* Быстрые ссылки нужны только на планшете (md–lg), где боковая
          панель скрыта. На desktop (lg+) их дублирует sidebar, поэтому
          прячем — иначе одни и те же разделы висят дважды на экране. */}
      <nav
        className="hidden min-w-0 items-center gap-1 rounded-card border border-white/[.08] bg-space-900/62 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-md md:flex lg:hidden"
        data-testid="tablet-quick-actions"
        aria-label="Быстрые разделы"
      >
        {tabletQuickActions.map((item) => {
          const active = item.match?.(pathname) ?? false;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-9 items-center rounded-option px-3 text-[12px] font-bold transition-colors",
                active
                  ? "bg-nova-cyan text-space-950 shadow-cyan-glow"
                  : "text-white/58 hover:bg-white/[.045] hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell-v1 relative z-10 min-h-screen">
      <a
        href="#main"
        className="pl-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-option focus:border focus:border-nova-cyan/50 focus:bg-space-900 focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-white"
      >
        Перейти к содержанию
      </a>

      <NavBar />

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 pb-28 pt-6 sm:px-6 md:pb-12 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-7 lg:px-6 2xl:grid-cols-[244px_minmax(0,1fr)]">
        <AppSidebar />

        <main id="main" className="app-shell-main min-w-0 scroll-mt-24">
          <ShellTopBar />
          {children}
        </main>

        <SiteFooter />
      </div>

      <MobileBottomNav />
    </div>
  );
}
