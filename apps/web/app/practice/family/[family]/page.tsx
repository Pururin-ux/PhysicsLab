import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FocusedFamilyPractice } from "../../../../components/tasks/FocusedFamilyPractice";
import { getTaskCatalog, getTaskCatalogEntry } from "../../../../lib/server/task-catalog";

type FocusedPracticePageProps = {
  params: Promise<{ family: string }>;
};

export function generateStaticParams() {
  return getTaskCatalog().map((entry) => ({ family: entry.slug }));
}

export async function generateMetadata({ params }: FocusedPracticePageProps): Promise<Metadata> {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  return entry
    ? { title: `${entry.title} · 5 похожих | PhysicsLab` }
    : { title: "Тренировка не найдена | PhysicsLab" };
}

export default async function FocusedPracticePage({ params }: FocusedPracticePageProps) {
  const { family } = await params;
  const entry = getTaskCatalogEntry(family);
  if (!entry) notFound();

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
        <Link
          href={`/tasks/${entry.slug}`}
          className="mb-1 w-fit rounded-option text-[12px] font-semibold text-nova-cyan/80 hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          К типу задачи
        </Link>
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/58">
          Пять похожих задач
        </p>
        <h1 className="text-[32px] font-[800] leading-tight text-white sm:text-[40px]">
          {entry.title}
        </h1>
        <p className="text-[14px] leading-[1.65] text-white/62">
          {entry.shortDescription}
        </p>
      </section>

      <FocusedFamilyPractice entry={entry} />
    </div>
  );
}
