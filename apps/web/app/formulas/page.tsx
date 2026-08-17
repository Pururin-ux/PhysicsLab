import { Suspense } from "react";
import { FormulasBrowser } from "../../components/formulas/FormulasBrowser";
import { getFormulaReferenceView } from "../../lib/learning/learning-links";

export const metadata = {
  title: "Формулы | PhysicsLab",
};

export default function FormulasPage() {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section className="flex max-w-[680px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Формулы
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Справочник по доступным формулам: открытые темы и оптика. Разверни
          строку — внутри обозначения и условия применения.
        </p>
      </section>

      <Suspense
        fallback={<p className="text-[13px] font-semibold text-white/50">Загружаем справочник…</p>}
      >
        <FormulasBrowser groups={getFormulaReferenceView()} />
      </Suspense>
    </div>
  );
}
