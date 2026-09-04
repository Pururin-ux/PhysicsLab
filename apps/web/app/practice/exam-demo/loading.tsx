export default function ExamDemoLoading() {
  return (
    <section
      className="mx-auto flex min-h-[48vh] w-full max-w-[1080px] items-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-[620px] border-l-2 border-nova-cyan/55 py-3 pl-5 sm:pl-7">
        <p className="text-[12px] font-[800] uppercase tracking-[.14em] text-nova-cyan/78">
          Диагностика по открытым темам
        </p>
        <h1 className="mt-2 text-[26px] font-[800] leading-tight tracking-[-.03em] text-white sm:text-[34px]">
          Подбираем десять задач…
        </h1>
        <p className="mt-3 text-[13px] leading-[1.6] text-white/56">
          Пять открытых тем, без таймера. Это не полный вариант ЦТ/ЦЭ.
        </p>
      </div>
    </section>
  );
}
