import Link from "next/link";
import { OpticsDiagram } from "../diagrams/OpticsDiagram";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";
import type {
  ReferenceMathExpression,
  ReferenceSolution as ReferenceSolutionContent,
} from "../../lib/learning/reference-solutions";

function MathExpression({ expression }: { expression: ReferenceMathExpression }) {
  return (
    <div
      data-testid="reference-math"
      role="math"
      aria-label={expression.accessibleText}
      tabIndex={0}
      className="formula-white max-w-full overflow-x-auto py-1 text-[18px] text-white md:text-[21px] [&_.katex-mathml]:sr-only"
    >
      <MathText text={`$${expression.latex}$`} />
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-b border-white/[.07] py-5 last:border-b-0">
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-full border border-nova-cyan/35 bg-nova-cyan/[.07] text-[12px] font-bold text-nova-cyan"
      >
        {number}
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold text-white">{title}</h3>
        <div className="mt-2 space-y-2 text-[13px] leading-[1.7] text-white/68">{children}</div>
      </div>
    </li>
  );
}

export function ReferenceSolution({ solution }: { solution: ReferenceSolutionContent }) {
  return (
    <section
      id="reference-example"
      data-testid="reference-solution"
      aria-labelledby="reference-solution-title"
      className="overflow-hidden rounded-card border border-white/[.10] bg-space-900/72"
    >
      <div className="border-b border-white/[.08] px-4 py-5 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-nova-cyan">
          {solution.label}
        </p>
        <h2 id="reference-solution-title" className="mt-2 text-[22px] font-[800] text-white">
          Пример с разбором
        </h2>
        <p className="mt-2 text-[13px] leading-[1.65] text-white/58">
          Посмотрите ход решения, затем закрепите тот же метод на новых числах.
        </p>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <p className="text-[15px] leading-[1.75] text-white/82">{solution.statement}</p>
        <p className="mt-2 text-[15px] font-semibold leading-[1.7] text-white">{solution.question}</p>

        <dl className="mt-5 grid gap-x-6 gap-y-3 border-y border-white/[.07] py-4 sm:grid-cols-2">
          {solution.givens.map((given) => (
            <div key={`${given.symbol}-${given.name}`} className="grid grid-cols-[minmax(72px,max-content)_1fr] gap-3 text-[13px]">
              <dt className="font-semibold text-white/52">
                <MathText text={`$${given.symbol}$`} />
                <span className="sr-only">, {given.name}</span>
              </dt>
              <dd className="text-white/78">
                {given.displayValue}{given.unit ? ` ${given.unit}` : ""}
              </dd>
            </div>
          ))}
        </dl>

        {solution.visual?.kind === "graph" ? (
          <figure className="mt-5">
            <PhysicsGraph
              spec={solution.visual.spec}
              ariaLabel={solution.visual.description}
              compact
              className="[&_.graph-fade-in]:animate-none [&_.graph-path-draw]:animate-none [&_.graph-point-pop]:animate-none"
            />
            <figcaption className="sr-only">{solution.visual.description}</figcaption>
          </figure>
        ) : null}
        {solution.visual?.kind === "optics" ? (
          <figure className="mt-5">
            <OpticsDiagram spec={solution.visual.spec} showSolution />
            <figcaption className="sr-only">{solution.visual.description}</figcaption>
          </figure>
        ) : null}
      </div>

      <details className="group border-t border-white/[.08]">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[14px] font-bold text-white marker:hidden hover:bg-white/[.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-blue/55 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span>Показать решение</span>
          <span aria-hidden="true" className="text-xl font-normal leading-none text-nova-cyan transition-transform group-open:rotate-45">+</span>
        </summary>

        <div data-testid="reference-solution-steps" className="border-t border-white/[.08] px-4 sm:px-6">
          <ol>
            <Step number={1} title="Модель">
              <p>{solution.model.explanation}</p>
            </Step>
            <Step number={2} title="Закон">
              <p>{solution.law.explanation}</p>
              {solution.law.formulas.map((formula) => (
                <MathExpression key={formula.latex} expression={formula} />
              ))}
            </Step>
            <Step number={3} title="Подстановка">
              {solution.substitution.explanation ? <p>{solution.substitution.explanation}</p> : null}
              {solution.substitution.equations.map((equation) => (
                <MathExpression key={equation.latex} expression={equation} />
              ))}
            </Step>
            <Step number={4} title="Ответ">
              <MathExpression expression={solution.answer.expression} />
              <p>{solution.answer.sentence}</p>
            </Step>
          </ol>

          {solution.check ? (
            <div className="border-t border-white/[.07] py-5">
              <h3 className="text-[13px] font-bold text-white">Проверка</h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-white/64">{solution.check.explanation}</p>
              {solution.check.expression ? <MathExpression expression={solution.check.expression} /> : null}
            </div>
          ) : null}

          <aside className="border-t border-white/[.07] py-5" aria-labelledby={`mistake-${solution.familyId}`}>
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-amber-300">Типичная ошибка</p>
            <h3 id={`mistake-${solution.familyId}`} className="mt-2 text-[14px] font-bold text-white/88">
              {solution.typicalMistake.title}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.7] text-white/62">{solution.typicalMistake.explanation}</p>
          </aside>

          <div className="border-t border-white/[.07] py-5">
            <Button asChild size="lg">
              <Link href={`/practice/family/${solution.familyId}`}>Решить 5 похожих</Link>
            </Button>
          </div>
        </div>
      </details>
    </section>
  );
}
