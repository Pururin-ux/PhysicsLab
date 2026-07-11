"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

// Route-level error boundary: спокойный fallback без stack и internals.
// reset() перезапускает сегмент — «Попробовать снова» без reload страницы.
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[route-error]", error);
    }
  }, [error]);

  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col gap-4 py-10">
      <Card
        data-testid="route-error-card"
        role="alert"
        className="flex flex-col gap-4 border-l-2 border-l-nova-gold/60"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-[800] leading-tight text-white">
            Страница не открылась
          </h1>
          <p className="text-[14px] leading-[1.7] text-white/70">
            Произошла внутренняя ошибка. Твой сохранённый прогресс не пострадал —
            попробуй открыть страницу ещё раз.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" data-testid="route-error-retry" onClick={reset} className="w-full sm:w-auto">
            Попробовать снова
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href="/topics">К темам</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
