import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import {
  EXAM_PROGRAM_SOURCE,
  type CoverageSection,
} from "../../lib/learning/coverage";

function statusLabel(section: CoverageSection) {
  return section.status === "partial" ? "Покрыто частично" : "Задач пока нет";
}

function familyLabel(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "типов задач";
  if (mod10 === 1) return "тип задачи";
  if (mod10 >= 2 && mod10 <= 4) return "типа задач";
  return "типов задач";
}

export function ExamProgramCoverage({
  coverage,
}: {
  coverage: readonly CoverageSection[];
}) {
  const availableSections = coverage.filter((section) => section.status === "partial").length;
  const missingSections = coverage.length - availableSections;

  return (
    <div className="mx-auto w-full max-w-[1080px] min-w-0 pb-10">
      <header className="max-w-[780px]">
        <p className="text-[11px] font-[850] uppercase tracking-[.15em] text-[var(--mode-exam-accent)]">
          ЦТ/ЦЭ · карта программы
        </p>
        <h1 className="mt-2 text-[34px] font-[850] leading-[1.05] tracking-[-.04em] text-white sm:text-[48px]">
          Что уже можно тренировать в PhysicsLab
        </h1>
        <p className="mt-4 max-w-[66ch] text-[14px] leading-[1.7] text-white/68 sm:text-[15px]">
          Здесь всегда видны и доступные, и отсутствующие разделы. Количество
          типов описывает каталог PhysicsLab, а не долю официальной программы и
          не готовность к экзамену.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-bold">
          <span className="rounded-full border border-nova-cyan/28 bg-nova-cyan/10 px-3 py-1.5 text-nova-cyan">
            Частично: {availableSections}
          </span>
          <span className="rounded-full border border-[var(--mode-exam-accent)]/30 bg-[color-mix(in_srgb,var(--mode-exam-accent)_10%,transparent)] px-3 py-1.5 text-[var(--mode-exam-accent)]">
            Пока нет: {missingSections}
          </span>
        </div>
      </header>

      <ol className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Разделы программы по физике">
        {coverage.map((section) => (
          <li
            key={section.id}
            className="flex min-w-0 flex-col rounded-card border border-white/[.12] bg-white/[.035] p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="max-w-[28ch] text-[20px] font-[820] leading-[1.2] tracking-[-.025em] text-white">
                {section.title}
              </h2>
              <span
                className={
                  section.status === "partial"
                    ? "text-[10px] font-[850] uppercase tracking-[.08em] text-nova-cyan"
                    : "text-[10px] font-[850] uppercase tracking-[.08em] text-[var(--mode-exam-accent)]"
                }
              >
                {statusLabel(section)}
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-[1.65] text-white/66">
              {section.summary}
            </p>

            {section.familyCount > 0 ? (
              <p className="mt-3 text-[12px] font-bold text-white/82">
                {section.familyCount} {familyLabel(section.familyCount)} в каталоге
              </p>
            ) : null}

            <div className="mt-5 border-t border-white/[.1] pt-4">
              <h3 className="text-[11px] font-[850] uppercase tracking-[.1em] text-white/52">
                Чего пока нет
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-[1.55] text-white/64">
                {section.knownGaps.map((gap) => (
                  <li key={gap} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--mode-exam-accent)]">—</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {section.catalogDestinations.length > 0 ? (
              <div className="mt-auto flex flex-wrap gap-2 pt-5" aria-label={`Доступные тренировки: ${section.title}`}>
                {section.catalogDestinations.map((destination) => (
                  <Link
                    key={destination.topicId}
                    href={destination.href}
                    className="inline-flex min-h-10 items-center gap-2 rounded-option border border-nova-cyan/24 bg-nova-cyan/[.08] px-3 text-[12px] font-bold text-nova-cyan transition-colors hover:border-nova-cyan/46 hover:bg-nova-cyan/[.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                  >
                    {destination.label}
                    <span className="text-white/46">{destination.familyCount}</span>
                    <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-auto pt-5 text-[12px] font-semibold text-white/48">
                Открыть тренировку пока нельзя.
              </p>
            )}
          </li>
        ))}
      </ol>

      <aside className="mt-6 rounded-card border border-white/[.1] bg-black/10 p-5 text-[12px] leading-[1.65] text-white/58">
        <p>
          Основа карты — {EXAM_PROGRAM_SOURCE.organization}. Проверено для
          спецификации 2026 года: {EXAM_PROGRAM_SOURCE.checkedOn}.
        </p>
        <a
          href={EXAM_PROGRAM_SOURCE.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-option font-bold text-[var(--mode-exam-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mode-exam-accent)]"
        >
          Открыть официальный документ
          <ArrowSquareOut size={15} weight="bold" aria-hidden="true" />
        </a>
      </aside>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/practice/exam-demo"
          className="inline-flex min-h-12 items-center justify-center rounded-option bg-[var(--mode-exam-accent)] px-5 text-[14px] font-[800] text-[#15110e] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mode-exam-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e11]"
        >
          Перейти к диагностике из 10 задач
        </Link>
        <Link
          href="/tasks"
          className="inline-flex min-h-12 items-center justify-center rounded-option border border-white/[.14] px-5 text-[14px] font-[750] text-white/78 hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
        >
          Открыть весь каталог
        </Link>
      </div>
    </div>
  );
}
