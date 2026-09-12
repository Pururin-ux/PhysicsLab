import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ExamDemo } from "../../../components/exam/ExamDemo";

export const metadata = {
  title: "Подготовка к ЦТ/ЦЭ | PhysicsLab",
  description:
    "Выбери тему для повторения или проверь себя на десяти задачах с разбором.",
};

export default function ExamDemoPage() {

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
          Физика
        </p>
        <h1 className="text-[30px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[42px]">
          Подготовка к ЦТ/ЦЭ
        </h1>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-[1.65] text-white/64">
          Повторяй темы и разбирай задачи шаг за шагом.
        </p>
      </header>

      <ExamDemo />
    </div>
  );
}
