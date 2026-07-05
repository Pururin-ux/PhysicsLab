"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { NavBar } from "./NavBar";
import { XPBadge } from "./XPBadge";

type NavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
  // Мобильный таб-бар вмещает 4 пункта; практика доступна через "Темы".
  mobile?: boolean;
  icon?: ReactNode;
  match?: (pathname: string) => boolean;
};

const navIconClass = "h-[18px] w-[18px] shrink-0";

const navIcons = {
  topics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={navIconClass} aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  ),
  mistakes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={navIconClass} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  formulas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" className={navIconClass} aria-hidden="true">
      <path d="M17 5H7.5l5.5 7-5.5 7H17" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={navIconClass} aria-hidden="true">
      <circle cx="12" cy="8.4" r="3.6" />
      <path d="M5.2 19.6c1.6-3.3 4-4.9 6.8-4.9s5.2 1.6 6.8 4.9" />
    </svg>
  ),
} as const;

const navItems: NavItem[] = [
  {
    label: "Темы",
    href: "/topics",
    mobile: true,
    icon: navIcons.topics,
    match: (pathname) => pathname.startsWith("/topics"),
  },
  {
    label: "Кинематика",
    href: "/practice/kinematics-demo",
    match: (pathname) => pathname.startsWith("/practice/kinematics"),
  },
  {
    label: "Динамика",
    href: "/practice/dynamics-demo",
    match: (pathname) => pathname.startsWith("/practice/dynamics"),
  },
  {
    label: "Электродинамика",
    href: "/practice/electro-demo",
    match: (pathname) => pathname.startsWith("/practice/electro"),
  },
  {
    label: "Термодинамика",
    href: "/practice/thermo-demo",
    match: (pathname) => pathname.startsWith("/practice/thermo"),
  },
  {
    label: "Пробный вариант",
    href: "/practice/exam-demo",
    match: (pathname) => pathname.startsWith("/practice/exam"),
  },
  {
    label: "Ошибки",
    href: "/mistakes",
    mobile: true,
    icon: navIcons.mistakes,
    match: (pathname) => pathname.startsWith("/mistakes"),
  },
  {
    label: "Формулы",
    href: "/formulas",
    mobile: true,
    icon: navIcons.formulas,
    match: (pathname) => pathname.startsWith("/formulas"),
  },
  {
    label: "Профиль",
    href: "/profile",
    mobile: true,
    icon: navIcons.profile,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

function SidebarNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        mobile ? "grid grid-cols-4 gap-1" : "flex flex-col gap-1.5",
      )}
      aria-label={mobile ? "Мобильная навигация" : "Разделы PhysicsLab"}
    >
      {navItems
        .filter((item) => (mobile ? item.mobile && !item.disabled : true))
        .map((item) => {
          const active = item.match?.(pathname) ?? false;
          const baseClass = cn(
            "group flex items-center rounded-option border font-semibold transition-colors",
            mobile
              ? "min-h-[52px] flex-col justify-center gap-1 px-1 py-1.5 text-[10px]"
              : "min-h-11 justify-between gap-3 px-3 text-[13px]",
          );
          const stateClass = item.disabled
            ? "cursor-not-allowed border-transparent text-white/28"
            : active
              ? "border-nova-cyan/35 bg-nova-cyan/[.10] text-white shadow-[inset_2px_0_0_rgba(0,224,255,.75)]"
              : "border-transparent text-white/62 hover:border-white/[.08] hover:bg-white/[.035] hover:text-white/88";

          if (item.disabled || !item.href) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className={cn(baseClass, stateClass)}
              >
                <span>{item.label}</span>
                {!mobile ? (
                  <span className="text-[11px] font-semibold text-white/25">
                    позже
                  </span>
                ) : null}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(baseClass, stateClass)}
            >
              {mobile ? item.icon : null}
              <span className={mobile ? "leading-none" : undefined}>
                {item.label}
              </span>
              {!mobile && active ? (
                <span className="h-1.5 w-1.5 rounded-full bg-nova-cyan shadow-cyan-glow" />
              ) : null}
            </Link>
          );
        })}
    </nav>
  );
}

function AppSidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-48px)] min-h-[560px] flex-col rounded-card border border-white/[.08] bg-space-900/78 p-4 shadow-card backdrop-blur-md lg:flex">
      <Link
        href="/"
        className="mb-7 rounded-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
        aria-label="PhysicsLab — на главную"
      >
        <span className="block text-[18px] font-black leading-none tracking-tight text-white">
          Physics<span className="text-nova-cyan">Lab</span>
        </span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] text-white/42">
          тренажёр
        </span>
      </Link>

      <SidebarNav />

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[.06] pt-4">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-white/48">
          Опыт
        </span>
        <XPBadge />
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[.08] bg-space-950/92 px-3 py-2 backdrop-blur-xl lg:hidden">
      <SidebarNav mobile />
    </div>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell-v1 relative z-10 min-h-screen">
      <div className="lg:hidden">
        <NavBar />
      </div>

      <div
        className={cn(
          "mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-5 px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:grid-cols-[216px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:pb-10 2xl:grid-cols-[230px_minmax(0,1fr)]",
        )}
      >
        <AppSidebar />

        <main className="app-shell-main min-w-0">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
