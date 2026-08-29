"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findActiveNavItem } from "./nav-config";
import { XPBadge } from "./XPBadge";

export function NavBar() {
  const pathname = usePathname();
  const activeItem = findActiveNavItem(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-nova-cyan/[.07] bg-space-950/85 backdrop-blur-[14px]">
      <nav
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4"
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
            {activeItem?.label ?? "ЦЭ/ЦТ · физика"}
          </span>
        </Link>

        {/* XP в шапке только с планшета: на телефоне место занимает
            подпись раздела, а нижняя навигация и так ведёт в прогресс. */}
        <div className="hidden items-center gap-2 md:flex">
          <XPBadge />
        </div>
      </nav>
    </header>
  );
}
