"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Эффект «печатает…». Фрагменты $...$ раскрываются целиком, а не по символу,
// чтобы KaTeX всегда получал корректную формулу и текст не мигал сырым LaTeX.
export function useTypewriter(text: string, speedMs = 22) {
  const units = useMemo(() => text.match(/\$[^$]+\$|[\s\S]/gu) ?? [], [text]);
  const [count, setCount] = useState(units.length);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (units.length === 0 || prefersReducedMotion()) {
      setCount(units.length);
      return;
    }

    setCount(0);
    intervalRef.current = setInterval(() => {
      setCount((current) => {
        const next = current + 1;
        if (next >= units.length && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, speedMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [units, speedMs]);

  return {
    output: units.slice(0, count).join(""),
    done: count >= units.length,
  };
}
