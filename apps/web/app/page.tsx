import Link from "next/link";
import { NovaStage } from "../components/coach/NovaStage";
import { InteractivePreview } from "../components/landing/InteractivePreview";
import { Reveal } from "../components/landing/Reveal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export const metadata = {
  title: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
  description:
    "Тренажёр по физике для ЦЭ/ЦТ: короткие тренировки, разбор типичных ошибок и честный прогресс.",
};

export default function Home() {
  return (
    <div className="flex min-w-0 flex-col gap-8 sm:gap-10">
      <section className="grid items-center gap-6 lg:min-h-[330px] lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
        <div className="flex flex-col gap-5">
          <Badge tone="cyan" className="w-fit">
            ЦЭ/ЦТ · физика
          </Badge>
          <h1 className="text-[34px] font-[800] leading-[1.08] tracking-tight text-white sm:text-[48px]">
            Готовься к ЦЭ/ЦТ так, чтобы{" "}
            <span className="text-nova-cyan">
              понимать
            </span>
            ,<br className="hidden sm:block" /> а не зубрить
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/70">
            Механика, электродинамика и молекулярная физика: тренировки по
            10 задач, разбор каждой ошибки и честный прогресс.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild className="px-8">
              <Link href="/topics">К задачам</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/formulas">Справочник формул</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto hidden flex-col items-center sm:flex">
          <NovaStage
            state="calm"
            size={180}
            showBubble={false}
            showOrbit={false}
            priority
          />
        </div>
      </section>

      <Reveal>
        <section className="flex flex-col gap-4">
          <div className="flex max-w-[620px] flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Задача на разогрев
            </p>
            <h2 className="text-2xl font-[800] text-white">
              Проверь себя на графике скорости
            </h2>
          </div>
          <InteractivePreview />
        </section>
      </Reveal>
    </div>
  );
}
