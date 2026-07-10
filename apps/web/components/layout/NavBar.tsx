"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { $quizSession } from "../quiz/quiz-session-store";
import { ProgressDots } from "../ui/ProgressDots";
import { XPBadge } from "./XPBadge";

export function NavBar() {
  const session = useStore($quizSession);
  const pathname = usePathname();
  const sectionLabels: [prefix: string, label: string][] = [
    ["/practice/dynamics", "Динамика"],
    ["/practice/kinematics", "Кинематика"],
    ["/practice/electro", "Электродинамика"],
    ["/practice/thermo", "Термодинамика"],
    ["/practice/exam", "Смешанная"],
    ["/mistakes", "Ошибки"],
    ["/formulas", "Формулы"],
    ["/profile", "Профиль"],
  ];
  const topic =
    sectionLabels.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    "Темы";
  const showProgress = pathname.startsWith("/practice/");
  const total = Math.max(session.total, 1);
  const currentStep =
    session.phase === "completed"
      ? total
      : Math.min(session.currentIndex + 1, total);
  const completed =
    session.phase === "completed"
      ? total
      : session.phase === "answered"
        ? Math.min(session.currentIndex + 1, total)
        : Math.min(session.currentIndex, total);

  return (
    <header className="sticky top-0 z-20 border-b border-nova-cyan/[.07] bg-space-950/85 backdrop-blur-[14px]">
      <nav
        className="mx-auto flex max-w-[960px] items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4"
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

        {showProgress ? (
          <div className="flex min-w-0 items-center justify-center md:gap-3">
            <span
              className="whitespace-nowrap text-[12px] font-semibold text-white/55 md:hidden"
              aria-label={`Прогресс задач: ${currentStep} из ${total}`}
            >
              {currentStep} / {total}
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[.12em] text-white/60 md:inline">
              Прогресс
            </span>
            <ProgressDots
              className="hidden md:flex"
              total={total}
              currentStep={currentStep}
              completed={completed}
            />
          </div>
        ) : null}

        <XPBadge />
      </nav>
    </header>
  );
}
