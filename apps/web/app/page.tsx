import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { topics } from "../lib/topics";

export const metadata = {
  title: "PhysicsLab — интерактивная физика для ЦЭ и ЦТ",
  description: "Уроки, задачи и справочник формул по школьной физике.",
};

// Квадратный арт 1254×1254 показываем целиком: контейнер aspect-square,
// никакого object-position — коты и приборы не режутся рамкой.
const courses = [
  {
    title: "Механика",
    text: "Движение, силы, импульс и графики.",
    image: "/art/production/topic-kinematics-cozy.webp",
    href: "/topics#kinematics",
    meta: `${topics[0].skillsCount + topics[1].skillsCount} навыков`,
    accent: "border-t-[#ef8a78]",
    accentText: "text-[#f29a88]",
  },
  {
    title: "Электричество",
    text: "Цепи, заряд, ток и закон Ома.",
    image: "/art/production/topic-electricity-cozy.webp",
    href: "/topics#electrodynamics",
    meta: `${topics[2].skillsCount} навыков`,
    accent: "border-t-[#73d6eb]",
    accentText: "text-[#8ce5f5]",
  },
  {
    title: "Оптика",
    text: "Лучи, зеркала, линзы и преломление.",
    image: "/art/production/topic-optics-cozy.webp",
    href: "/topics#optics",
    meta: `${topics[4].skillsCount} навыков`,
    accent: "border-t-[#e079c7]",
    accentText: "text-[#ed9bd8]",
  },
  {
    title: "Термодинамика",
    text: "Газы, теплота и состояние вещества.",
    image: "/art/production/topic-thermodynamics-cozy.webp",
    href: "/topics#thermodynamics",
    meta: `${topics[3].skillsCount} навыков`,
    accent: "border-t-[#e8b66d]",
    accentText: "text-[#f0c98d]",
  },
] as const;

const totalSkills = topics.reduce((sum, topic) => sum + topic.skillsCount, 0);

export default function Home() {
  return (
    <div className="relative left-1/2 -my-5 flex w-screen min-w-0 -translate-x-1/2 flex-col sm:-my-7 lg:-my-8">
      <section data-theme-preserve="dark" className="relative isolate overflow-hidden border-b border-white/[.08] bg-space-950" aria-labelledby="home-title">
        {/* Арт 1909×824 — контейнер держит тот же aspect, картинка не режется. */}
        <div className="relative hidden aspect-[1909/824] min-h-[560px] md:block">
          <Image
            src="/art/production/hero-desktop-cozy.webp"
            alt="Участница школьного кружка настраивает фотодатчики, пока рядом устроились два кота"
            fill
            priority
            // На телефоне этот блок скрыт (hidden md:block), но priority всё
            // равно предзагружает файл — просим для мобилы крошечный вариант.
            sizes="(max-width: 767px) 1px, 100vw"
            className="-z-30 object-cover"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(7,8,30,.96)_0%,rgba(7,8,30,.82)_34%,rgba(7,8,30,.28)_66%,rgba(7,8,30,.04)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 mx-auto flex w-full max-w-[1300px] items-center px-8 lg:px-10">
            <div className="max-w-[600px]">
              <h1 id="home-title" className="max-w-[590px] text-[50px] font-[800] leading-[1.08] tracking-[-.045em] text-white lg:text-[60px]">
                Школьная физика.
                <span className="mt-2 block text-nova-pink">Вся, что нужна на ЦТ и ЦЭ.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[18px] font-medium leading-[1.72] text-white/78">
                Механика, электричество, оптика и теплота: {totalSkills} навыков, уроки и справочник формул.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button asChild size="lg" className="w-auto gap-2 px-7">
                  <Link href="/topics">Выбрать тему <ArrowRight size={18} weight="bold" aria-hidden="true" /></Link>
                </Button>
              </div>
              <div className="mt-7 max-w-[510px] border-l border-white/[.18] pl-4">
                <Link href="/practice/exam-demo" className="inline-flex min-h-11 items-center gap-2 rounded-option text-[15px] font-bold text-nova-cyan/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70">
                  Подготовиться к ЦТ/ЦЭ <ArrowRight size={17} weight="bold" aria-hidden="true" />
                </Link>
                <p className="text-[12px] leading-[1.55] text-white/50">Без таймера — начинай, когда готов.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="px-5 pb-8 pt-8">
            <h1 className="text-[37px] font-[800] leading-[1.08] tracking-[-.045em] text-white">
              Школьная физика.
              <span className="mt-2 block text-nova-pink">Вся, что нужна на ЦТ и ЦЭ.</span>
            </h1>
            <p className="mt-5 text-[15px] font-medium leading-[1.65] text-white/72">
              Механика, электричество, оптика и теплота: {totalSkills} навыков, уроки и формулы.
            </p>
            <div className="mt-7">
              <Button asChild size="lg" className="w-full gap-2 px-6">
                <Link href="/topics">Выбрать тему <ArrowRight size={18} weight="bold" aria-hidden="true" /></Link>
              </Button>
            </div>
            <div className="mt-5 border-l border-white/[.18] pl-4">
              <Link href="/practice/exam-demo" className="inline-flex min-h-11 items-center gap-2 rounded-option text-[14px] font-bold text-nova-cyan/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70">
                Подготовиться к ЦТ/ЦЭ <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <p className="text-[12px] leading-[1.5] text-white/48">Без таймера — начинай, когда готов.</p>
            </div>
          </div>
          {/* Арт 1086×1448 (ровно 3:4) — блок повторяет пропорцию, кадр целиком. */}
          <div className="relative aspect-[3/4] border-t border-white/[.08]">
            <Image
              src="/art/production/hero-mobile-cozy.webp"
              alt="Участница школьного кружка настраивает фотодатчики, а рядом на книгах спит кот"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 1px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-space-950/40 to-transparent" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="courses-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 id="courses-title" className="text-[28px] font-[800] tracking-[-.03em] text-white sm:text-[34px]">Маршрут по школьной физике</h2>
          <Link href="/topics" className="inline-flex min-h-10 items-center gap-2 rounded-option px-2 text-[13px] font-bold text-nova-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70">
            Все темы <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course, index) => (
            <Link
              key={course.title}
              href={course.href}
              className={`group overflow-hidden rounded-card border border-t-2 border-white/[.12] bg-space-900 shadow-[0_20px_48px_rgba(0,0,0,.26)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-nova-blue/55 hover:shadow-[0_24px_60px_rgba(0,0,0,.34),0_0_26px_rgba(101,88,216,.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 ${course.accent}`}
            >
              <div className="relative aspect-square overflow-hidden bg-space-950">
                <Image src={course.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-[1.07]" />
                {index === 0 ? <span className="absolute left-4 top-4 rounded-full border border-nova-pink/40 bg-space-950/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-nova-pink backdrop-blur-sm">Начни здесь</span> : null}
              </div>
              <div className="bg-space-900 p-5">
                <h3 className={`text-[20px] font-[800] ${course.accentText}`}>{course.title}</h3>
                <p className="mt-1.5 min-h-[40px] text-[13px] leading-[1.55] text-white/66">{course.text}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/[.1] pt-3 text-[12px] font-bold text-white/62">
                  <span>{course.meta}</span>
                  <span className="grid size-9 place-items-center rounded-full border border-nova-blue/38 bg-nova-indigo/[.12] text-nova-blue transition-transform group-hover:translate-x-1"><ArrowRight size={16} weight="bold" aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[.08] bg-space-925/78">
        <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-7 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-[20px] font-[800] text-white">Physics<span className="text-nova-pink">Lab</span></p>
            <p className="mt-2 text-[12px] font-semibold text-white/42">Школьная физика · ЦЭ / ЦТ</p>
          </div>
          <nav aria-label="Ссылки в подвале" className="flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-bold text-white/54">
            <Link href="/topics" className="hover:text-white">Темы</Link>
            <Link href="/formulas" className="hover:text-white">Формулы</Link>
            <Link href="/tasks" className="hover:text-white">Задачи</Link>
            <Link href="/profile" className="hover:text-white">Прогресс</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
