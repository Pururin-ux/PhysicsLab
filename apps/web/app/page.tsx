import Link from "next/link";
import { NovaStage } from "../components/coach/NovaStage";
import { InteractivePreview } from "../components/landing/InteractivePreview";
import { Reveal } from "../components/landing/Reveal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const metadata = {
  title: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
  description:
    "Тренажёр по физике для ЦЭ/ЦТ: короткие тренировки, разбор типичных ошибок и честный прогресс.",
};

const principles = [
  {
    id: "model-first",
    title: "Модель → смысл → формула",
    text: "Сначала показываем, что происходит с телом, потом — почему. Формула появляется последней, когда уже понятно, откуда она берётся.",
  },
  {
    id: "mistakes",
    title: "Учимся на типичных ошибках",
    text: "Каждый неверный ответ — конкретная ловушка, а не просто минус балл. Тренажёр запоминает её и предлагает потренировать именно это место.",
  },
  {
    id: "honest-progress",
    title: "Честный прогресс без давления",
    text: "Никаких таймеров и выдуманных процентов готовности — только решённые задачи, точность и список слабых мест.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-w-0 flex-col gap-12 sm:gap-16">
      <section className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* мягкое свечение за hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 hidden h-[340px] w-[340px] rounded-full bg-nova-cyan/[.07] blur-[110px] sm:block"
        />

        <div className="relative flex flex-col gap-5">
          <Badge tone="cyan" className="w-fit">
            ЦЭ/ЦТ · физика
          </Badge>
          <h1 className="text-[36px] font-[800] leading-[1.08] tracking-tight text-white sm:text-[48px]">
            Готовься к ЦЭ/ЦТ так, чтобы{" "}
            <span className="bg-gradient-to-r from-nova-cyan to-nova-blue bg-clip-text text-transparent">
              понимать
            </span>
            ,<br className="hidden sm:block" /> а не зубрить
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.7] text-white/70">
            Кинематика, динамика и закон Ома уже открыты: короткие тренировки
            по 10 задач, разбор каждой ошибки и прогресс, которому можно
            верить.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild className="px-8">
              <Link href="/topics">Начать</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/formulas">Справочник формул</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto flex flex-col items-center gap-3">
          <NovaStage
            state="calm"
            size={220}
            showBubble={false}
            showOrbit={false}
            priority
          />
          <p className="max-w-[230px] text-center text-[12px] leading-[1.6] text-white/50">
            Nova разбирает твой ответ после каждой задачи — по делу, без
            мотивационной воды.
          </p>
        </div>
      </section>

      <Reveal>
        <section
          className="grid gap-4 md:grid-cols-3"
          aria-label="Принципы PhysicsLab"
        >
          {principles.map((principle) => (
            <Card
              key={principle.id}
              className="card-lift flex flex-col gap-3 border-white/[.08] !p-5 hover:border-nova-cyan/20"
            >
              <h2 className="text-[16px] font-[800] leading-snug text-white">
                {principle.title}
              </h2>
              <p className="text-[13px] leading-[1.7] text-white/62">
                {principle.text}
              </p>
            </Card>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className="flex flex-col gap-4">
          <div className="flex max-w-[620px] flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Как это работает
            </p>
            <h2 className="text-2xl font-[800] text-white">
              Реши задачу прямо сейчас — Nova разберёт ответ
            </h2>
          </div>
          <InteractivePreview />
        </section>
      </Reveal>

      <Reveal>
        <section>
          <Card
            glow="cyan"
            className="flex flex-col items-center gap-4 border-nova-cyan/25 !p-8 text-center"
          >
            <h2 className="text-xl font-[800] text-white sm:text-2xl">
              Три темы открыты: кинематика, динамика и закон Ома
            </h2>
            <p className="max-w-[480px] text-[14px] leading-[1.7] text-white/65">
              Остальные разделы появятся позже. Начни с того, что уже работает,
              или сразу проверь себя на пробном варианте по механике.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="px-10">
                <Link href="/topics">Начать</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/practice/exam-demo">Пробный вариант</Link>
              </Button>
            </div>
          </Card>
        </section>
      </Reveal>
    </div>
  );
}
