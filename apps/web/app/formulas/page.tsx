import { Suspense } from "react";
import { FormulasBrowser } from "../../components/formulas/FormulasBrowser";
import { getFormulaReferenceView } from "../../lib/learning/learning-links";

export const metadata = {
  title: "Формулы | PhysicsLab",
};

export default function FormulasPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1220px] min-w-0 flex-col gap-8">
      <section className="flex max-w-[760px] flex-col gap-2 pt-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-nova-pink">Связи между величинами</p>
        <h1 className="text-[38px] font-[800] leading-tight tracking-[-.04em] text-white sm:text-[48px]">Проводник по формулам</h1>
        <p className="text-[15px] leading-[1.7] text-white/62">Открой карточку, чтобы проверить обозначения, условия применения и перейти к задачам.</p>
      </section>

      <Suspense
        fallback={<p className="text-[13px] font-semibold text-white/50">Загружаем справочник…</p>}
      >
        <FormulasBrowser groups={getFormulaReferenceView()} />
      </Suspense>
    </div>
  );
}
