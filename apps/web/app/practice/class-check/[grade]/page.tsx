import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizSession } from "../../../../components/quiz/QuizSession";
import {
  getSchoolCheckByGrade,
  schoolChecks,
} from "../../../../lib/learning/school-checks";

type Props = { params: Promise<{ grade: string }> };

export function generateStaticParams() {
  return schoolChecks.map((check) => ({ grade: String(check.grade) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const check = getSchoolCheckByGrade((await params).grade);
  return check
    ? {
        title: `Проверка по темам ${check.grade} класса | PhysicsLab`,
        description: `Пять задач по доступным материалам ${check.grade} класса с разбором ответа.`,
      }
    : { title: "Проверка не найдена | PhysicsLab" };
}

export default async function ClassCheckPage({ params }: Props) {
  const check = getSchoolCheckByGrade((await params).grade);
  if (!check) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[920px] min-w-0 flex-col gap-6">
      <header className="border-b border-white/[.1] pb-5 pt-1">
        <Link
          href="/learn"
          className="inline-flex min-h-10 items-center text-[13px] font-semibold text-nova-cyan/85 hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          К учебнику
        </Link>
        <p className="mt-3 text-[11px] font-[850] uppercase tracking-[.16em] text-[var(--physics-cyan)]">
          {check.grade} класс · короткая проверка
        </p>
        <h1 className="mt-2 max-w-[760px] text-[30px] font-[820] leading-[1.04] tracking-[-.035em] text-white sm:text-[42px]">
          Что осталось в памяти?
        </h1>
        <p className="mt-3 max-w-[66ch] text-[14px] leading-[1.65] text-white/68">
          Пять задач по темам, которые уже можно изучить в PhysicsLab:
          {" "}{check.skills.join(", ")}.
        </p>
        <p className="mt-2 max-w-[66ch] text-[12px] leading-[1.6] text-white/52">
          Это проверка доступных материалов, а не контрольная за весь класс.
          Таймера и отметки нет; после ответа будет разбор.
        </p>
      </header>

      <section aria-label={`Проверка по темам ${check.grade} класса`}>
        <QuizSession
          generatedTemplate={check.template}
          generatedTopic={`${check.grade} класс`}
          generatedTitle="Задача из изученных тем"
          generatedCount={5}
          sessionKind="diagnostic"
          summaryVariant="diagnostic"
          preAnswerGuidance="unlabelled"
          restartLabel="Другой набор"
          nextHref="/learn"
          nextLabel="Вернуться к учебнику"
        />
      </section>
    </div>
  );
}
