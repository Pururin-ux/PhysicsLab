import Link from "next/link";
import { NovaStage } from "../components/coach/NovaStage";
import { TodayDashboard } from "../components/home/TodayDashboard";
import { getTaskCatalog } from "../lib/server/task-catalog";
import { topics } from "../lib/topics";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export const metadata = {
  title: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
  description:
    "Тренажёр по физике для ЦЭ/ЦТ: уроки по темам, короткие тренировки, разбор каждой ошибки и честный прогресс без выдуманных процентов готовности.",
};

export default function Home() {
  const taskTypes = getTaskCatalog().length;

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <section className="relative">
        {/* Мягкое свечение за героем: собирает композицию, не мешает тексту. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/3 h-64 w-[520px] -translate-x-1/2 rounded-full bg-nova-cyan/[0.07] blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
          <div className="flex flex-col gap-6">
            <Badge tone="cyan" size="sm" dot>
              ЦЭ/ЦТ · физика
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="pl-h1">
                Готовься к ЦЭ/ЦТ так, чтобы{" "}
                <span className="bg-gradient-to-r from-nova-cyan to-nova-blue bg-clip-text text-transparent">
                  понимать
                </span>
                , а не зубрить
              </h1>
              <p className="pl-body pl-measure">
                Семь тем с уроками, тренировки по 10 задач, разбор каждой ошибки и план
                повторения, который собирается сам. Без регистрации и без обещаний
                «гарантированного балла».
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/topics">К задачам</Link>
              </Button>
              <Button asChild size="lg" variant="gold">
                <Link href="/exam">Пройти диагностику</Link>
              </Button>
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line-subtle pt-5">
              <div className="flex flex-col gap-0.5">
                <dt className="pl-eyebrow">Тем</dt>
                <dd className="physics-number text-[19px] font-bold leading-none text-white">
                  {topics.length}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="pl-eyebrow">Типов задач</dt>
                <dd className="physics-number text-[19px] font-bold leading-none text-white">
                  {taskTypes}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="pl-eyebrow">В тренировке</dt>
                <dd className="physics-number text-[19px] font-bold leading-none text-white">
                  10
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="pl-eyebrow">Регистрация</dt>
                <dd className="text-[19px] font-bold leading-none text-white">не нужна</dd>
              </div>
            </dl>
          </div>

          <div className="relative hidden justify-self-center lg:block">
            <div className="pl-panel flex flex-col items-center gap-3 rounded-card px-5 py-6">
              <NovaStage state="calm" size={168} showBubble={false} showOrbit={false} priority />
              <p className="text-center text-[12px] leading-[1.5] text-ink-soft">
                Nova — наставник в тренировках. Подскажет, где споткнулся, и не будет хвалить
                просто так.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pl-divider" aria-hidden="true" />

      <TodayDashboard />
    </div>
  );
}
