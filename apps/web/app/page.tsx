import Link from "next/link";
import { NovaStage } from "../components/coach/NovaStage";
import { TodayDashboard } from "../components/home/TodayDashboard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export const metadata = {
  title: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
  description:
    "Тренажёр по физике для ЦЭ/ЦТ: уроки по темам, короткие тренировки, разбор каждой ошибки и честный прогресс без выдуманных процентов готовности.",
};

export default function Home() {
  return (
    <div className="flex min-w-0 flex-col gap-9">
      <section className="grid items-center gap-6 lg:min-h-[300px] lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-10">
        <div className="flex flex-col gap-5">
          <Badge tone="cyan" className="w-fit">
            ЦЭ/ЦТ · физика
          </Badge>
          <h1 className="text-[34px] font-[800] leading-[1.08] tracking-tight text-white sm:text-[48px]">
            Готовься к ЦЭ/ЦТ так, чтобы{" "}
            <span className="text-nova-cyan">понимать</span>, а не зубрить
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/70">
            Пять тем с уроками, тренировки по 10 задач, разбор каждой ошибки и план повторения,
            который собирается сам. Без регистрации и без обещаний «гарантированного балла».
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild className="px-8">
              <Link href="/topics">К задачам</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/exam">Пройти диагностику</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto hidden flex-col items-center sm:flex">
          <NovaStage state="calm" size={180} showBubble={false} showOrbit={false} priority />
        </div>
      </section>

      <TodayDashboard />
    </div>
  );
}
