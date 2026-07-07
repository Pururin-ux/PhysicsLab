"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { NavBar } from "./NavBar";
import { XPBadge } from "./XPBadge";

type NavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
  mobile?: boolean;
  icon?: ReactNode;
  helper?: string;
  match?: (pathname: string) => boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
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
  motion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M4 15.5c3.6-5.8 7.3-7.3 11.1-4.4" />
      <path d="M14.5 6.5h5v5" />
      <path d="M14.6 6.7 20 12.1" />
      <circle cx="5" cy="16" r="1.5" />
    </svg>
  ),
  forces: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M12 4v16" />
      <path d="m8 8 4-4 4 4" />
      <path d="m8 16 4 4 4-4" />
      <path d="M4 12h16" />
    </svg>
  ),
  electro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M13 2 5 13h6l-1 9 9-13h-6l0-7Z" />
    </svg>
  ),
  thermo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M14 14.8V5.5a2 2 0 0 0-4 0v9.3a4 4 0 1 0 4 0Z" />
      <path d="M12 7.5v8" />
    </svg>
  ),
  optics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M3 12s3.3-5 9-5 9 5 9 5-3.3 5-9 5-9-5-9-5Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  quantum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <circle cx="12" cy="12" r="1.7" />
      <path d="M4.5 12c2-4.2 5-6.3 9-6.3 2.3 0 4.2.7 5.8 2" />
      <path d="M19.5 12c-2 4.2-5 6.3-9 6.3-2.3 0-4.2-.7-5.8-2" />
      <path d="M7.3 5.2c4.6.4 7.8 2.5 9.7 6.4 1.1 2.2 1.2 4.2.4 6.1" />
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
    title: "Темы",
    items: [
      {
        label: "Все темы",
        href: "/topics",
        icon: navIcons.topics,
        match: (pathname) => pathname.startsWith("/topics"),
      },
      {
        label: "Кинематика",
        href: "/practice/kinematics-demo",
        icon: navIcons.motion,
        match: (pathname) => pathname.startsWith("/practice/kinematics"),
      },
      {
        label: "Динамика",
        href: "/practice/dynamics-demo",
        icon: navIcons.forces,
        match: (pathname) => pathname.startsWith("/practice/dynamics"),
      },
      {
        label: "Электродинамика",
        href: "/practice/electro-demo",
        icon: navIcons.electro,
        match: (pathname) => pathname.startsWith("/practice/electro"),
      },
      {
        label: "Термодинамика",
        href: "/practice/thermo-demo",
        icon: navIcons.thermo,
        match: (pathname) => pathname.startsWith("/practice/thermo"),
      },
      {
        label: "Оптика",
        disabled: true,
        icon: navIcons.optics,
        helper: "скоро",
      },
      {
        label: "Квантовая физика",
        disabled: true,
        icon: navIcons.quantum,
        helper: "скоро",
      },
    ],
  },
  {
    title: "Практика",
    items: [
      {
        label: "Пробный вариант",
        href: "/practice/exam-demo",
        icon: navIcons.exam,
        match: (pathname) => pathname.startsWith("/practice/exam"),
      },
      {
        label: "Ошибки",
        href: "/mistakes",
        icon: navIcons.mistakes,
        mobile: true,
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
        mobile: true,
        match: (pathname) => pathname.startsWith("/formulas"),
      },
      {
        label: "Профиль",
        href: "/profile",
        icon: navIcons.profile,
        mobile: true,
        match: (pathname) => pathname.startsWith("/profile"),
      },
    ],
  },
];

const mobileNavItems: NavItem[] = [
  {
    label: "Темы",
    href: "/topics",
    mobile: true,
    icon: navIcons.topics,
    match: (pathname) => pathname.startsWith("/topics") || pathname.startsWith("/practice/"),
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

const quickActions: NavItem[] = [
  {
    label: "Темы",
    href: "/topics",
    match: (pathname) => pathname.startsWith("/topics"),
  },
  {
    label: "Пробный",
    href: "/practice/exam-demo",
    match: (pathname) => pathname.startsWith("/practice/exam"),
  },
  {
    label: "Ошибки",
    href: "/mistakes",
    match: (pathname) => pathname.startsWith("/mistakes"),
  },
  {
    label: "Формулы",
    href: "/formulas",
    match: (pathname) => pathname.startsWith("/formulas"),
  },
  {
    label: "Профиль",
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
  const stateClass = item.disabled
    ? "cursor-not-allowed border-transparent text-white/30"
    : active
      ? "border-nova-cyan/50 bg-nova-cyan/[.12] text-white shadow-[inset_2px_0_0_rgba(0,224,255,.85),0_0_22px_rgba(0,224,255,.08)]"
      : "border-transparent text-white/62 hover:border-white/[.08] hover:bg-white/[.035] hover:text-white/88";

  const content = (
    <>
      {item.icon ? (
        <span className={cn("text-white/58 transition-colors group-hover:text-current", active ? "text-nova-cyan" : null)}>
          {item.icon}
        </span>
      ) : null}
      <span className={cn("min-w-0 flex-1", mobile ? "leading-none" : "truncate")}>
        {item.label}
      </span>
      {!mobile && item.helper ? (
        <span className="text-[10px] font-bold uppercase tracking-[.1em] text-white/30">
          {item.helper}
        </span>
      ) : null}
      {!mobile && active ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-nova-cyan shadow-cyan-glow" />
      ) : null}
    </>
  );

  if (item.disabled || !item.href) {
    return (
      <span aria-disabled="true" className={cn(baseClass, stateClass)}>
        {content}
      </span>
    );
  }

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
    <nav className="flex flex-col gap-5" aria-label="Разделы PhysicsLab">
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
    <aside className="sticky top-6 hidden h-[calc(100vh-48px)] flex-col rounded-card border border-white/[.08] bg-space-900/82 p-4 shadow-card backdrop-blur-md lg:flex">
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

      {/* Список разделов прокручивается сам, если не влезает в высоту экрана;
          логотип сверху и XP снизу закреплены. Отрицательный отступ прячет
          дорожку скролла, чтобы контент не обрезался у края. */}
      <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
        <SidebarNav />
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-between gap-2 rounded-option border border-white/[.07] bg-white/[.025] px-3 py-3">
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

  const fallbackHref = pathname.startsWith("/practice/") ? "/topics" : "/";

  return (
    <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
      <BackButton fallbackHref={fallbackHref} />

      {/* Быстрые ссылки нужны только на планшете (md–lg), где боковая
          панель скрыта. На desktop (lg+) их дублирует sidebar, поэтому
          прячем — иначе одни и те же разделы висят дважды на экране. */}
      <nav
        className="hidden min-w-0 items-center gap-1 rounded-card border border-white/[.08] bg-space-900/62 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-md md:flex lg:hidden"
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
          "mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-7 lg:px-6 lg:pb-10 2xl:grid-cols-[292px_minmax(0,1fr)]",
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
