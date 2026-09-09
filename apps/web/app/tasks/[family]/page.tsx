import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
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
import { getFamilyLesson } from "../../../lib/learning/family-lesson";

type TaskTypePageProps = {
  params: Promise<{ family: string }>;
};

export function generateStaticParams() {
  return getTaskCatalog().map((entry) => ({ family: entry.slug }));
}

export async function generateMetadata({ params }: TaskTypePageProps): Promise<Metadata> {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  return entry
    ? {
        title: `${entry.title} | Практика | PhysicsLab`,
        description: entry.shortDescription,
      }
    : { title: "Тренировка не найдена | PhysicsLab" };
}

export default async function TaskTypePage({ params }: TaskTypePageProps) {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  if (!entry) notFound();
  const referenceSolution = getReferenceSolution(entry.id);
  const destination = getLearningDestinationForFamily(entry.id);
  const lesson = getFamilyLesson(entry.id);
  const relatedFormulas = (destination?.formulaIds ?? []).flatMap((formulaId) => {
    const formula = getFormulaEntry(formulaId);
    return formula ? [formula] : [];
  });

  return (
    <div className="mx-auto flex w-full max-w-[760px] min-w-0 flex-col gap-7">
      <nav aria-label="Путь к тренировке" className="sm:hidden">
        <Link
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-option pr-2 text-[13px] font-semibold text-white/62 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          href="/tasks"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Все тренировки
        </Link>
      </nav>

      {/* Страница отвечает на четыре вопроса подряд: что за задача, что решать,
          какая формула, где обычно ошибаются. По одному блоку на вопрос. */}
      <section className="flex flex-col gap-5">
        <div>
          <h1 className="type-h1 text-white">{entry.title}</h1>
          <p className="type-body mt-3 max-w-[620px] text-[var(--text-secondary)]">
            {entry.shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
            <Link href={`/practice/family/${entry.slug}`}>
              Начать: 5 задач
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </Link>
          </Button>
          {referenceSolution ? (
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
              <Link href="#reference-example">Сначала разобрать пример</Link>
            </Button>
          ) : null}
        </div>
        {lesson ? (
          <Link
            href={lesson.href}
            className="inline-flex min-h-10 w-fit items-center gap-2 text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
          >
            {lesson.label}
            <ArrowRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        ) : null}
      </section>

      {relatedFormulas.length > 0 ? (
        <section className="border-t border-white/[.08] pt-6" aria-labelledby="related-formulas-title">
          <h2 id="related-formulas-title" className="type-h2 text-white">
            Что понадобится
          </h2>
          <div className={`mt-4 grid gap-3 ${relatedFormulas.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {relatedFormulas.map((formula) => (
              <FormulaBox
                key={formula.id}
                formula={formula.formula}
                caption={formula.title}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-3">
            {relatedFormulas.map((formula) => (
              <li key={formula.id}>
                <Link
                  href={buildFormulaHref(formula.id)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-option text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
                >
                  {relatedFormulas.length === 1
                    ? "Что означают буквы"
                    : `${formula.title}: что означают буквы`}
                  <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {referenceSolution ? <ReferenceSolution solution={referenceSolution} /> : null}

    </div>
  );
}


