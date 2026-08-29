import { Suspense } from "react";
import { FormulasBrowser } from "../../components/formulas/FormulasBrowser";
import {
  filterFormulaReferenceViewByTopic,
  getFormulaReferenceView,
} from "../../lib/learning/learning-links";
import { topics } from "../../lib/topics";

export const metadata = {
  title: "Формулы | PhysicsLab",
  description:
    "Справочник формул по физике для ЦЭ/ЦТ: обозначения, условия применения и ограничения по каждому разделу.",
};

type FormulasPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function FormulasPage({ searchParams }: FormulasPageProps) {
  const { topic } = await searchParams;
  const allGroups = getFormulaReferenceView();
  const activeTopic = topics.find((entry) => entry.id === topic) ?? null;
  const groups = activeTopic
    ? filterFormulaReferenceViewByTopic(allGroups, activeTopic.id)
    : allGroups;

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section className="flex max-w-[680px] flex-col gap-2">
        <h1 className="pl-h1">{activeTopic ? `Формулы: ${activeTopic.title}` : "Формулы"}</h1>
        <p className="pl-body pl-measure">
          Справочник по доступным формулам: открытые темы и оптика. Разверни строку — внутри
          обозначения, условия применения и ограничения.
        </p>
      </section>

      <Suspense
        fallback={<p className="text-[13px] font-semibold text-white/50">Загружаем справочник…</p>}
      >
        <FormulasBrowser
          groups={groups}
          activeTopic={activeTopic ? { id: activeTopic.id, title: activeTopic.title } : null}
          totalGroupCount={allGroups.length}
        />
      </Suspense>
    </div>
  );
}
