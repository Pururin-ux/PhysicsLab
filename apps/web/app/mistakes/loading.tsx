export default function MistakesLoading() {
  return (
    <section
      className="mx-auto flex min-h-[48vh] w-full max-w-[1120px] items-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-[620px] border-l-2 border-mode-learn/55 py-3 pl-5 sm:pl-7">
        <p className="text-[12px] font-[800] uppercase tracking-[.14em] text-mode-learn/80">
          К чему вернуться
        </p>
        <h1 className="mt-2 text-[26px] font-[800] leading-tight tracking-[-.03em] text-white sm:text-[34px]">
          Ищем места, которые стоит закрепить…
        </h1>
        <div className="mt-5 flex max-w-[420px] flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full animate-pulse rounded-full bg-white/[.12] motion-reduce:animate-none" />
          <span className="h-2 w-3/4 animate-pulse rounded-full bg-white/[.08] [animation-delay:120ms] motion-reduce:animate-none" />
          <span className="h-2 w-1/2 animate-pulse rounded-full bg-white/[.06] [animation-delay:240ms] motion-reduce:animate-none" />
        </div>
      </div>
    </section>
  );
}
