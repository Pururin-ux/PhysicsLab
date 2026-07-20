import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReferenceSolution } from "../../../components/tasks/ReferenceSolution";
import { Button } from "../../../components/ui/Button";
import { FormulaBox } from "../../../components/ui/FormulaBox";
import { getReferenceSolution } from "../../../lib/learning/reference-solutions";
import {
  buildFormulaHref,
  getFormulaEntry,
  getLearningDestinationForFamily,
} from "../../../lib/learning/learning-links";
import { getTaskCatalog, getTaskCatalogEntry } from "../../../lib/server/task-catalog";

type TaskTypePageProps = {
  params: Promise<{ family: string }>;
};

function answerFormatLabel(format: "single_choice" | "numeric_input") {
  return format === "numeric_input" ? "Числовой ответ" : "Один ответ";
}

export function generateStaticParams() {
  return getTaskCatalog().map((entry) => ({ family: entry.slug }));
}

export async function generateMetadata({ params }: TaskTypePageProps): Promise<Metadata> {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  return entry
    ? { title: `${entry.title} | Типы задач | PhysicsLab` }
    : { title: "Тип задачи не найден | PhysicsLab" };
}

export default async function TaskTypePage({ params }: TaskTypePageProps) {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  if (!entry) notFound();
  const referenceSolution = getReferenceSolution(entry.id);
  const destination = getLearningDestinationForFamily(entry.id);
  const relatedFormulas = (destination?.formulaIds ?? []).flatMap((formulaId) => {
    const formula = getFormulaEntry(formulaId);
    return formula ? [formula] : [];
  });

  const difficulty =
    entry.difficultyRange.min === entry.difficultyRange.max
      ? String(entry.difficultyRange.min)
      : `${entry.difficultyRange.min}–${entry.difficultyRange.max}`;

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-7">
      <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-white/48">
        <Link className="rounded-option hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55" href="/tasks">
          Задачи
        </Link>
        <span aria-hidden="true">/</span>
        <span>{entry.topicLabel}</span>
      </nav>

      <section className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/58">
            {entry.topicLabel}
          </p>
          <h1 className="mt-2 text-[34px] font-[800] leading-tight text-white sm:text-[42px]">
            {entry.title}
          </h1>
          <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-white/68">
            {entry.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-semibold text-white/52">
          <span>{answerFormatLabel(entry.answerFormat)}</span>
          <span>Сложность внутри тренажёра: {difficulty}</span>
          {entry.visualKinds.includes("graph") ? <span>Есть график</span> : null}
          {entry.visualKinds.includes("diagram") ? <span>Есть схема</span> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="sm:w-auto">
            <Link href={`/practice/family/${entry.slug}`}>Решить 5 похожих</Link>
          </Button>
          {referenceSolution ? (
            <Button asChild size="lg" variant="ghost" className="sm:w-auto">
              <Link href="#reference-example">Посмотреть пример</Link>
            </Button>
          ) : null}
        </div>
      </section>

      {relatedFormulas.length > 0 ? (
        <section className="border-t border-white/[.08] pt-6" aria-labelledby="related-formulas-title">
          <h2 id="related-formulas-title" className="text-xl font-[800] text-white">
            Связанные формулы
          </h2>
          {/* Формула видна сразу — страница типа задачи должна отвечать на
              вопрос «что применять» без лишнего перехода. */}
          <div className={`mt-4 grid gap-3 ${relatedFormulas.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {relatedFormulas.map((formula) => (
              <FormulaBox
                key={formula.id}
                formula={formula.formula}
                caption={formula.title}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedFormulas.map((formula) => (
              <li key={formula.id}>
                <Link
                  href={buildFormulaHref(formula.id)}
                  className="inline-flex min-h-10 items-center rounded-option border border-white/[.12] bg-white/[.025] px-3.5 text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:border-nova-cyan/45 hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
                >
                  {relatedFormulas.length === 1
                    ? "Обозначения и условия применения"
                    : `${formula.title}: обозначения и условия`}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {referenceSolution ? <ReferenceSolution solution={referenceSolution} /> : null}

      <section className="border-t border-white/[.08] pt-6" aria-labelledby="training-points-title">
        <h2 id="training-points-title" className="text-xl font-[800] text-white">
          Что тренируется
        </h2>
        <ul className="mt-4 grid gap-3 text-[14px] leading-[1.65] text-white/66">
          {entry.trainingPoints.map((point) => (
            <li key={point} className="grid grid-cols-[auto_1fr] gap-3">
              <span aria-hidden="true" className="text-nova-cyan">—</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
