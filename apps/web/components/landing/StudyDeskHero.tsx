"use client";

import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  GraduationCap,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const HERO_ART = "/art/production/hero-night-study-ultrawide-v3.webp";

export function StudyDeskHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !finePointer) return;

    let frame = 0;
    const update = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty("--scene-x", `${(x * 9).toFixed(2)}px`);
        hero.style.setProperty("--scene-y", `${(y * 6).toFixed(2)}px`);
      });
    };
    const reset = () => {
      hero.style.setProperty("--scene-x", "0px");
      hero.style.setProperty("--scene-y", "0px");
    };

    hero.addEventListener("pointermove", update, { passive: true });
    hero.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", update);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      data-theme-preserve="dark"
      className="home-study-hero relative isolate flex min-h-[100svh] overflow-hidden bg-[#060719]"
      aria-labelledby="home-title"
    >
      <div
        className="home-study-scene absolute -inset-[1.5%] -z-10"
        data-testid="home-study-scene"
        data-art-id="home-night-study"
        data-art-source={HERO_ART}
        data-art-viewport-policy="single-source-crop"
        aria-hidden="true"
      >
        <Image
          src={HERO_ART}
          alt=""
          fill
          priority
          quality={92}
          sizes="(max-width: 767px) 1056px, 100vw"
          className="home-study-art"
        />
        <div className="home-window-light absolute inset-0 hidden md:block" />
        <div className="home-desk-light absolute inset-0 hidden md:block" />
        {/* The source scene has an impossible prism beam along its lower edge.
            This photographic vignette removes only that fragment; it does not
            regenerate or repaint Nova, the cat, or the trolleybus. */}
        <div
          data-testid="home-scene-logic-guard"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[34%] md:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,7,25,0) 0%, rgba(6,7,25,.16) 12%, rgba(6,7,25,.86) 54%, #060719 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-none items-start px-5 pb-12 pt-[118px] sm:px-8 md:items-center md:px-10 md:pb-16 md:pt-[104px] lg:px-12">
        <div className="home-study-copy w-full max-w-[560px] md:-translate-y-6">
          <p className="home-copy-kicker mb-5 text-[12px] font-[800] uppercase tracking-[.18em] text-white/52 md:hidden">
            Школьная физика
          </p>
          <h1
            id="home-title"
            className="home-copy-title max-w-[560px] text-[43px] font-[800] leading-[1.04] tracking-[-.052em] text-white sm:text-[52px] md:text-[62px] lg:text-[76px]"
          >
            <span className="block">Физика,</span>
            <span className="block">которую</span>
            <span className="mt-1 block text-nova-cyan">можно увидеть</span>
          </h1>

          {/* Одно очевидное основное действие. «Учиться» — сплошная action-кнопка,
              «ЦТ/ЦЭ» уходит на второй план тихой ссылкой, а не второй крупной
              кнопкой равного веса. */}
          <div className="home-copy-actions mt-9 flex max-w-[570px] flex-col items-start gap-4 sm:flex-row sm:items-center md:mt-14">
            <Link
              href="/topics"
              className="home-primary-action group inline-flex min-h-[60px] w-full items-center justify-between rounded-[14px] bg-nova-indigo px-6 text-[17px] font-[800] text-white shadow-[0_8px_22px_rgba(124,92,255,.34)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-nova-blue hover:shadow-[0_12px_28px_rgba(124,92,255,.44)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#080e1a] active:translate-y-0 sm:w-auto md:min-h-[68px] md:px-8 md:text-[18px]"
            >
              <span className="flex items-center gap-3">
                <BookOpenText size={24} weight="duotone" className="md:size-7" aria-hidden="true" />
                Учиться
              </span>
              <ArrowRight className="ml-6 transition-transform duration-200 group-hover:translate-x-1 md:size-6" size={20} weight="bold" aria-hidden="true" />
            </Link>
            <Link
              href="/practice/exam-demo"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-[12px] px-2 text-[15px] font-bold text-white/78 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/70 md:text-[16px]"
            >
              <GraduationCap size={22} weight="duotone" className="text-nova-cyan" aria-hidden="true" />
              Готовиться к ЦТ/ЦЭ
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={17} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <a
          href="#home-sections"
          className="home-scroll-prompt absolute bottom-[160px] left-10 hidden min-h-11 w-fit items-center gap-2 rounded-[10px] text-[12px] font-semibold text-white/60 transition-colors hover:text-white/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 md:inline-flex lg:left-12"
        >
          Листайте вниз <ArrowDown className="home-scroll-arrow" size={15} weight="bold" aria-hidden="true" />
        </a>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[.09]" aria-hidden="true" />
    </section>
  );
}
