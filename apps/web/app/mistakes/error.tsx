"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../../components/ui/Button";

export default function MistakesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      className="mx-auto flex min-h-[48vh] w-full max-w-[1120px] items-center"
      role="alert"
    >
      <div className="w-full max-w-[660px] border-l-2 border-feedback-danger/65 py-3 pl-5 sm:pl-7">
        <p className="text-[12px] font-[800] uppercase tracking-[.14em] text-feedback-danger/85">
          Ответы сохранены
        </p>
        <h1 className="mt-2 text-[28px] font-[800] leading-tight tracking-[-.03em] text-white sm:text-[38px]">
          Трудные места пока не открылись
        </h1>
        <p className="mt-3 max-w-[56ch] text-[14px] leading-[1.7] text-white/66">
          Попробуй загрузить их ещё раз или возьми короткую тренировку по
          знакомой теме.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button className="w-full sm:w-auto" onClick={reset}>
            Попробовать ещё раз
          </Button>
          <Button asChild variant="ghost" className="w-full gap-2 sm:w-auto">
            <Link href="/tasks">
              Выбрать тренировку
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
