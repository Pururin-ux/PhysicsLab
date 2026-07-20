"use client";

import { CaretLeft } from "@phosphor-icons/react/CaretLeft";
import { CaretRight } from "@phosphor-icons/react/CaretRight";
import { MoonStars } from "@phosphor-icons/react/MoonStars";
import { Ruler } from "@phosphor-icons/react/Ruler";
import { Triangle } from "@phosphor-icons/react/Triangle";
import { WaveSine } from "@phosphor-icons/react/WaveSine";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";

const notes = [
  {
    id: "dimensions",
    category: "Приём",
    title: "Формулу можно восстановить",
    text: "Если формула не вспоминается, проверь единицы величин: размерности часто подсказывают, как собрать выражение.",
    icon: Ruler,
    accent: "cyan",
  },
  {
    id: "moon-gravity",
    category: "Гравитация",
    title: "Лунная гравитация слабее",
    text: "У поверхности Луны ускорение свободного падения — около 1,62 м/с², примерно в шесть раз меньше земного.",
    icon: MoonStars,
    accent: "gold",
  },
  {
    id: "vacuum-sound",
    category: "Звук",
    title: "В вакууме звук не идёт",
    text: "Звук не распространяется в вакууме: ему нужна среда, частицы которой передают колебание дальше.",
    icon: WaveSine,
    accent: "cyan",
  },
  {
    id: "glass-refraction",
    category: "Оптика",
    title: "Красный и фиолетовый лучи преломляются по-разному",
    text: "В обычном стекле красный свет преломляется слабее фиолетового — поэтому призма разделяет белый свет в спектр.",
    icon: Triangle,
    accent: "gold",
  },
] as const;

const accentStyles = {
  cyan: {
    icon: "border-nova-cyan/30 bg-nova-cyan/[.09] text-nova-cyan",
    eyebrow: "text-nova-cyan",
    rule: "from-nova-cyan/70 via-nova-cyan/20 to-transparent",
  },
  gold: {
    icon: "border-nova-pink/35 bg-nova-pink/[.09] text-nova-pink",
    eyebrow: "text-nova-pink",
    rule: "from-nova-pink/75 via-nova-pink/20 to-transparent",
  },
} as const;

export function StudyCompanion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const note = notes[activeIndex];
  const NoteIcon = note.icon;
  const accent = accentStyles[note.accent];

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + notes.length) % notes.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % notes.length);
  };

  return (
    <section
      data-testid="study-companion"
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden rounded-[22px] border border-white/[.11] bg-[linear-gradient(112deg,rgba(21,31,47,.98)_0%,rgba(13,21,33,.98)_58%,rgba(12,18,28,.98)_100%)] shadow-[0_22px_64px_rgba(0,0,0,.38),inset_0_1px_0_rgba(255,255,255,.045)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-nova-pink/[.055] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-nova-cyan/[.045] blur-3xl"
      />

      <div className="relative grid min-h-[300px] md:grid-cols-[210px_minmax(0,1fr)] lg:grid-cols-[238px_minmax(0,1fr)]">
        <aside className="relative flex min-h-[146px] items-center gap-4 overflow-hidden border-b border-white/[.09] bg-space-950/35 px-5 py-5 md:min-h-full md:flex-col md:items-start md:justify-between md:border-b-0 md:border-r md:px-6 md:py-7">
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] font-[800] uppercase tracking-[.18em] text-nova-pink/80">
              Короткая подсказка
            </p>
            <h2 id={titleId} className="mt-2 text-[18px] font-[800] leading-tight text-white md:text-[20px]">
              Приём на 30 секунд
            </h2>
            <p className="mt-2 max-w-[180px] text-[12px] leading-[1.55] text-white/52">
              Листай перед задачей или проверкой формулы.
            </p>
          </div>

          <div className="relative ml-auto h-[108px] w-[108px] shrink-0 self-end md:-mb-5 md:ml-2 md:h-[154px] md:w-[154px]">
            <div
              aria-hidden="true"
              className="absolute inset-[13%] rounded-full border border-nova-cyan/20 bg-[radial-gradient(circle,rgba(121,217,238,.13),transparent_69%)] shadow-[0_0_36px_rgba(121,217,238,.09)]"
            />
            <Image
              src="/art/production/tutor-calm.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 108px, 154px"
              className="relative z-10 object-contain object-bottom drop-shadow-[0_14px_24px_rgba(0,0,0,.52)]"
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={note.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                  className="max-w-[730px]"
                >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-option border ${accent.icon}`}
                    aria-hidden="true"
                  >
                    <NoteIcon size={21} weight="duotone" />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-[800] uppercase tracking-[.17em] ${accent.eyebrow}`}>
                      {note.category}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-semibold tracking-[.12em] text-white/58">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(notes.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className={`my-5 h-px w-full bg-gradient-to-r ${accent.rule}`} aria-hidden="true" />

                <h3 className="max-w-[640px] text-[21px] font-[800] leading-[1.22] text-white sm:text-[25px]">
                  {note.title}
                </h3>
                <p className="mt-3 max-w-[680px] text-[14px] leading-[1.72] text-white/70 sm:text-[15px]">
                  {note.text}
                </p>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[.08] pt-4" aria-label="Короткие подсказки">
            <div className="flex items-center gap-1">
              {notes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Показать записку ${index + 1}: ${item.title}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                  className="group flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-space-900"
                >
                  <span
                    className={`block rounded-full transition-[width,background-color,box-shadow] duration-200 ${
                      index === activeIndex
                        ? "h-2 w-6 bg-nova-pink shadow-[0_0_12px_rgba(224,121,199,.3)]"
                        : "h-2 w-2 bg-white/20 group-hover:bg-white/48"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Предыдущая записка"
                className="flex size-11 items-center justify-center rounded-full border border-white/[.12] bg-white/[.025] text-white/68 transition-[border-color,background-color,color,transform] hover:-translate-y-px hover:border-nova-cyan/40 hover:bg-nova-cyan/[.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-space-900"
              >
                <CaretLeft size={18} weight="bold" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Следующая записка"
                className="flex size-11 items-center justify-center rounded-full border border-nova-cyan/35 bg-nova-cyan/[.08] text-nova-cyan transition-[border-color,background-color,color,transform,box-shadow] hover:-translate-y-px hover:border-nova-cyan/65 hover:bg-nova-cyan/[.14] hover:shadow-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-space-900"
              >
                <CaretRight size={18} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
