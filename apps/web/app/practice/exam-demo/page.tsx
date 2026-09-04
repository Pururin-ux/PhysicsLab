import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ExamDemo } from "../../../components/exam/ExamDemo";
import { buildCoverageSections } from "../../../lib/learning/coverage";
import { getTaskCatalog } from "../../../lib/server/task-catalog";

export const metadata = {
  title: "Диагностика по открытым темам | PhysicsLab",
  description:
    "Десять задач по пяти открытым темам с явной картой покрытия программы ЦТ/ЦЭ.",
};

export default function ExamDemoPage() {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));

  return (
    <div className="mx-auto flex w-full max-w-[1080px] min-w-0 flex-col gap-6">
      <nav aria-label="Путь к тренировкам" className="sm:hidden">
        <Link
          href="/tasks"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-option pr-2 text-[13px] font-semibold text-white/62 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Все тренировки
        </Link>
      </nav>

      <header className="max-w-[760px] pt-1">
        <p className="mb-2 text-[11px] font-[800] uppercase tracking-[.14em] text-[var(--mode-exam-accent)]">
          ЦТ/ЦЭ · открытая часть
        </p>
        <h1 className="text-[30px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[42px]">
          Диагностика: 10 задач по 5 открытым темам
        </h1>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-[1.65] text-white/64">
          Короткая проверка открытой части каталога. Это не полный вариант
          ЦТ/ЦЭ: до старта ниже видны все покрытые и отсутствующие разделы.
        </p>
      </header>

      <ExamDemo coverage={coverage} />
    </div>
  );
}
