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
      <section className="mx-auto flex w-full max-w-[620px] flex-col gap-3">
        <Link
          href={`/tasks/${entry.slug}`}
          className="pl-link mb-1 w-fit text-[12px]"
        >
          ← К типу задачи
        </Link>
        <p className="pl-eyebrow">Пять похожих задач</p>
        <h1 className="pl-h1 max-w-[24ch]">{entry.title}</h1>
        <p className="pl-body pl-measure">{entry.shortDescription}</p>
      </section>

      <FocusedFamilyPractice entry={entry} />
    </div>
  );
}
