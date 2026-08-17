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
    "Темы";

  return (
    <header className="sticky top-0 z-20 border-b border-nova-cyan/[.07] bg-space-950/85 backdrop-blur-[14px]">
      <nav
        className="mx-auto flex max-w-[960px] items-center px-4 py-3 md:px-8 md:py-4"
        aria-label="Главная навигация"
      >
        <Link
          href="/"
          className="flex min-w-0 shrink-0 flex-col rounded-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
          aria-label="PhysicsLab — на главную"
        >
          <span className="text-[15px] font-[800] leading-none tracking-tight text-white">
            Physics<span className="text-nova-cyan">Lab</span>
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-white/50 md:text-[11px]">
            {topic}
          </span>
        </Link>
      </nav>
    </header>
  );
}
