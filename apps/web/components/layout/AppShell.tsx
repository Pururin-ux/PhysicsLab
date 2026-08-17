"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { NavBar } from "./NavBar";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  match?: (pathname: string) => boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navIconClass = "h-[18px] w-[18px] shrink-0";

const navIcons = {
  tasks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={navIconClass} aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  ),
  exam: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M8 4h8l2 2v14H6V6l2-2Z" />
      <path d="M9 10h6M9 14h6M9 18h4" />
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

const sidebarGroups: NavGroup[] = [
  {
    title: "Практика",
    items: [
      {
        label: "Задачи",
        href: "/tasks",
        icon: navIcons.tasks,
        match: (pathname) =>
          pathname.startsWith("/tasks") || pathname.startsWith("/practice/family"),
      },
      {
        label: "Смешанная тренировка",
        href: "/practice/exam-demo",
        icon: navIcons.exam,
        match: (pathname) => pathname.startsWith("/practice/exam"),
      },
      {
        label: "Ошибки",
        href: "/mistakes",
        icon: navIcons.mistakes,
        match: (pathname) => pathname.startsWith("/mistakes"),
      },
    ],
  },
  {
    title: "Справка",
    items: [
      {
        label: "Формулы",
        href: "/formulas",
        icon: navIcons.formulas,
        match: (pathname) => pathname.startsWith("/formulas"),
      },
      {
        label: "Прогресс",
        href: "/profile",
        icon: navIcons.profile,
        match: (pathname) => pathname.startsWith("/profile"),
      },
    ],
  },
];

const mobileNavItems: NavItem[] = [
  {
    label: "Задачи",
    href: "/tasks",
    icon: navIcons.tasks,
    match: (pathname) =>
      pathname.startsWith("/tasks") ||
      pathname.startsWith("/topics") ||
      pathname.startsWith("/practice/"),
  },
  {
    label: "Ошибки",
    href: "/mistakes",
    icon: navIcons.mistakes,
    match: (pathname) => pathname.startsWith("/mistakes"),
  },
  {
    label: "Формулы",
    href: "/formulas",
    icon: navIcons.formulas,
    match: (pathname) => pathname.startsWith("/formulas"),
  },
  {
    label: "Прогресс",
    href: "/profile",
    icon: navIcons.profile,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

const quickActions: NavItem[] = [
  {
    label: "Задачи",
    href: "/tasks",
    match: (pathname) =>
      pathname.startsWith("/tasks") ||
      pathname.startsWith("/topics") ||
      (pathname.startsWith("/practice/") && !pathname.startsWith("/practice/exam")),
  },
  {
    label: "Смешанная",
    href: "/practice/exam-demo",
    match: (pathname) => pathname.startsWith("/practice/exam"),
  },
  {
    label: "Ошибки",
    href: "/mistakes",
    match: (pathname) => pathname.startsWith("/mistakes"),
  },
  {
    label: "Прогресс",
    href: "/profile",
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

function SidebarItem({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  const pathname = usePathname();
  const active = item.match?.(pathname) ?? false;
  const baseClass = cn(
    "group flex items-center rounded-option border font-semibold transition-colors",
    mobile
      ? "min-h-[52px] flex-col justify-center gap-1 px-1 py-1.5 text-[10px]"
      : "min-h-11 gap-3 px-3 text-[13px]",
  );
  const stateClass = active
    ? "border-nova-cyan/50 bg-nova-cyan/[.12] text-white shadow-[inset_2px_0_0_rgba(0,224,255,.85),0_0_22px_rgba(0,224,255,.08)]"
    : "border-transparent text-white/62 hover:border-white/[.08] hover:bg-white/[.035] hover:text-white/88";

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
          mobile ? "leading-none" : "break-words leading-[1.35]",
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
          <p className="px-3 text-[10px] font-bold uppercase tracking-[.16em] text-white/42">
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
      className="grid grid-cols-4 gap-1"
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
    <aside data-testid="app-sidebar" className="sticky top-6 hidden self-start flex-col rounded-card border border-white/[.08] bg-space-900/82 p-4 shadow-card backdrop-blur-md lg:flex">
      <Link
        href="/"
        className="mb-5 shrink-0 rounded-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
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
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[.08] bg-space-950/92 px-3 py-2 backdrop-blur-xl md:hidden">
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
    : pathname.startsWith("/practice/")
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
        {quickActions.map((item) => {
          const active = item.match?.(pathname) ?? false;

          return (
            <Link
              key={item.label}
              href={item.href ?? "/"}
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
      <div className="lg:hidden">
        <NavBar />
      </div>

      <div
        className={cn(
          "mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 pb-28 pt-5 sm:px-6 sm:pt-6 md:pb-10 lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-5 lg:px-4 lg:pb-10 2xl:grid-cols-[232px_minmax(0,1fr)]",
        )}
      >
        <AppSidebar />

        <main className="app-shell-main min-w-0">
          <ShellTopBar />
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
