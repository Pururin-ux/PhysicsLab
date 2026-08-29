import type { ReactNode } from "react";

// Единая информационная архитектура продукта. Семь разделов, сгруппированных
// по смыслу: сначала учимся, потом проверяемся, справочник и прогресс —
// отдельно. Порядок и состав разделов — контракт навигационных тестов.
export type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  match?: (pathname: string) => boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

const navIconClass = "h-[18px] w-[18px] shrink-0";

const navIcons = {
  today: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M12 3.6 14.1 6l3.1.3 1.6 2.6-.9 3 .9 3-1.6 2.6-3.1.3L12 20.8 9.9 17.8l-3.1-.3L5.2 14.9l.9-3-.9-3L6.8 6.2 10 5.9Z" />
      <circle cx="12" cy="11.9" r="2.5" />
    </svg>
  ),
  learn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={navIconClass} aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a1.6 1.6 0 0 0-1.6-1.4H5.5A1.5 1.5 0 0 1 4 16Z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a1.6 1.6 0 0 1 1.6-1.4h4.9A1.5 1.5 0 0 0 20 16Z" />
    </svg>
  ),
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

const isPracticePath = (pathname: string) =>
  pathname.startsWith("/practice") || pathname.startsWith("/tasks");

const isExamPath = (pathname: string) =>
  pathname === "/exam" || pathname.startsWith("/practice/exam");

export const sidebarGroups: NavGroup[] = [
  {
    title: "Учёба",
    items: [
      {
        label: "Сегодня",
        href: "/",
        icon: navIcons.today,
        match: (pathname) => pathname === "/",
      },
      {
        label: "Учиться",
        href: "/topics",
        icon: navIcons.learn,
        match: (pathname) => pathname.startsWith("/topics"),
      },
      {
        label: "Задачи",
        href: "/tasks",
        icon: navIcons.tasks,
        match: (pathname) => isPracticePath(pathname),
      },
    ],
  },
  {
    title: "Контроль",
    items: [
      {
        label: "Диагностика",
        href: "/exam",
        icon: navIcons.exam,
        match: (pathname) => isExamPath(pathname),
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
    title: "Опоры",
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

export const mobileNavItems: NavItem[] = [
  {
    label: "Сегодня",
    href: "/",
    icon: navIcons.today,
    match: (pathname) => pathname === "/",
  },
  {
    label: "Учиться",
    href: "/topics",
    icon: navIcons.learn,
    match: (pathname) => pathname.startsWith("/topics"),
  },
  {
    label: "Задачи",
    href: "/tasks",
    icon: navIcons.tasks,
    match: (pathname) => isPracticePath(pathname),
  },
  {
    label: "Ошибки",
    href: "/mistakes",
    icon: navIcons.mistakes,
    match: (pathname) => pathname.startsWith("/mistakes"),
  },
  {
    label: "Прогресс",
    href: "/profile",
    icon: navIcons.profile,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

// На планшете (md–lg) боковой панели нет, поэтому в верхней строке остаются
// только четыре самых частых перехода: одной строкой и без прокрутки.
export const tabletQuickActions: NavItem[] = [
  {
    label: "Учиться",
    href: "/topics",
    match: (pathname) => pathname.startsWith("/topics"),
  },
  {
    label: "Задачи",
    href: "/tasks",
    match: (pathname) => isPracticePath(pathname),
  },
  {
    label: "Диагностика",
    href: "/exam",
    match: (pathname) => isExamPath(pathname),
  },
  {
    label: "Прогресс",
    href: "/profile",
    match: (pathname) => pathname.startsWith("/profile"),
  },
];

const allNavItems: NavItem[] = [
  ...sidebarGroups.flatMap((group) => group.items),
  ...mobileNavItems,
  ...tabletQuickActions,
];

// Подпись раздела в шапке: самый конкретный совпавший раздел. Порядок групп
// задаёт приоритет: /practice/family/* попадает в «Задачи», а не в «Сегодня».
export function findActiveNavItem(pathname: string): NavItem | null {
  return allNavItems.find((item) => item.match?.(pathname)) ?? null;
}
