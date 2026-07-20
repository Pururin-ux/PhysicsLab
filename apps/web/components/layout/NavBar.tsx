"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();
  const sectionLabels: [prefix: string, label: string][] = [
    ["/practice/family", "Похожие задачи"],
    ["/practice/dynamics", "Динамика"],
    ["/practice/kinematics", "Кинематика"],
    ["/practice/electro", "Электродинамика"],
    ["/practice/thermo", "Термодинамика"],
    ["/practice/optics", "Оптика"],
    ["/practice/exam", "Смешанная"],
    ["/mistakes", "Ошибки"],
    ["/formulas", "Формулы"],
    ["/profile", "Прогресс"],
    ["/tasks", "Задачи"],
  ];
  const topic =
    sectionLabels.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    "Тренажёр";

  return (
    <header className="sticky top-0 z-20 border-b border-white/[.11] bg-space-925 shadow-[0_14px_32px_rgba(0,0,0,.18)]">
      <nav
        className="mx-auto flex max-w-[960px] items-center px-4 pb-3 pt-[calc(.75rem+env(safe-area-inset-top))] md:px-8 md:pb-4 md:pt-[calc(1rem+env(safe-area-inset-top))]"
        aria-label="Главная навигация"
      >
        <Link
          href="/"
          className="flex min-w-0 shrink-0 flex-col rounded-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
          aria-label="PhysicsLab — на главную"
        >
          <span className="font-display text-[14px] font-[800] leading-none tracking-[-.04em] text-white md:text-[15px]">
            Physics<span className="text-nova-pink">Lab</span>
          </span>
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-white/60">
            {topic}
          </span>
        </Link>
      </nav>
    </header>
  );
}
