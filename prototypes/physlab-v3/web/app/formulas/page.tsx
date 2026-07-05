import { FormulasBrowser } from "../../components/formulas/FormulasBrowser";
import { formulaReference } from "../../lib/physics/formula-reference";

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
          Справочник по всем разделам. Найди формулу по названию или разверни
          нужную строку — обозначения и область применения внутри.
        </p>
      </section>

      <FormulasBrowser groups={[...formulaReference]} />
    </div>
  );
}
