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
      {/* Ширина как у карточки задачи (640), иначе заголовок и задача стоят по
          разным левым краям. */}
      <section className="mx-auto flex w-full max-w-[640px] flex-col gap-2">
        <Link
          href={`/tasks/${entry.slug}`}
          className="mb-1 w-fit rounded-option text-[12px] font-semibold text-nova-cyan/80 hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          К типу задачи
        </Link>
        {/* Пока ученик решает, на экране нужны только название типа и сама
            задача: описание типа он уже прочитал на предыдущей странице, а
            «Задание 1 из 5» стоит прямо над карточкой. */}
        <h1 className="text-[28px] font-[800] leading-tight text-white sm:text-[34px]">
          {entry.title}
        </h1>
      </section>

      <FocusedFamilyPractice entry={entry} />
    </div>
  );
}
