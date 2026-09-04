"use client";

import { useEffect } from "react";

/**
 * Плавная прокрутка по внутренним якорям.
 *
 * Глобальный `scroll-behavior: smooth` ставить нельзя: он ломает сброс
 * прокрутки Next.js при переходе между страницами. Поэтому перехватываем
 * только клики по ссылкам вида `#section` — «Листайте вниз», «Покрытие
 * программы», переходы к справке и формулам. Всё остальное поведение браузера
 * сохраняется: адрес обновляется, фокус уезжает на цель, а при
 * `prefers-reduced-motion` прокрутка снова мгновенная.
 */
export function SmoothAnchorScroll() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      event.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", href);

      // Фокус должен уехать вместе с экраном, иначе клавиатура останется наверху.
      const restoreTabIndex = !target.hasAttribute("tabindex");
      if (restoreTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (restoreTabIndex) {
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
          once: true,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
