export default function ProfileLoading() {
  return (
    <section
      className="mx-auto flex min-h-[48vh] w-full max-w-[1120px] items-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-[620px] border-l-2 border-[var(--mode-learn-accent)] py-3 pl-5 sm:pl-7">
        <p className="text-[12px] font-[800] uppercase tracking-[.14em] text-[var(--mode-learn-accent)]">
          Твоя физика
        </p>
        <h1 className="mt-2 text-[26px] font-[800] leading-tight tracking-[-.03em] text-[var(--text-strong)] sm:text-[34px]">
          Находим, откуда продолжить…
        </h1>
        <div className="mt-5 flex max-w-[420px] flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full animate-pulse rounded-full bg-[var(--border-emphasis)] motion-reduce:animate-none" />
          <span className="h-2 w-4/5 animate-pulse rounded-full bg-[var(--border-muted)] [animation-delay:120ms] motion-reduce:animate-none" />
          <span className="h-2 w-2/3 animate-pulse rounded-full bg-[var(--surface-hover)] [animation-delay:240ms] motion-reduce:animate-none" />
        </div>
      </div>
    </section>
  );
}
