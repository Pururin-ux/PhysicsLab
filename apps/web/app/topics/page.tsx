import Link from "next/link";
import { TopicCards } from "../../components/topics/TopicCards";
import { Card } from "../../components/ui/Card";

export const metadata = {
  title: "Учиться | PhysicsLab",
  description:
    "Пять тем физики для подготовки к ЦЭ/ЦТ: опорные идеи, типы задач, тренировки и честный прогресс.",
};

const steps = [
  {
    title: "Разбери идею",
    body: "Короткий урок темы: формула, смысл и ловушка, на которой чаще всего ошибаются.",
  },
  {
    title: "Закрепи на 5 задачах",
    body: "Один навык, пять похожих задач, разбор после каждого ответа.",
  },
  {
    title: "Проверь вперемешку",
    body: "Диагностика из 10 задач по всем темам показывает, что действительно держится.",
  },
  {
    title: "Вернись к слабому",
    body: "Ошибки превращаются в план повторения: что повторить и когда.",
  },
];

export default function TopicsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section className="flex max-w-[680px] flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-cyan/75">
          Учиться
        </p>
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Пять тем ЦЭ/ЦТ — от идеи до устойчивого навыка
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Каждая тема открывается уроком: зачем она нужна, что в ней спрашивают, как решать и
          где ошибаются. Дальше — короткая тренировка, и ошибки сами собирают план повторения.
        </p>
      </section>

      <section aria-labelledby="how-title" className="flex flex-col gap-3">
        <h2 id="how-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
          Как здесь учат
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex flex-col gap-2 border-white/[.08] !p-4">
              <span className="physics-number text-[12px] font-bold text-nova-cyan/80">
                Шаг {index + 1}
              </span>
              <h3 className="text-[15px] font-[800] leading-snug text-white">{step.title}</h3>
              <p className="text-[13px] leading-[1.6] text-white/60">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <TopicCards />

      <section className="flex flex-col gap-3 border-t border-white/[.08] pt-6">
        <p className="text-[13px] leading-[1.7] text-white/55">
          Тренажёр покрывает не всю программу: квантовая и атомная физика, колебания и волны,
          магнитное поле пока без задач. Текущее покрытие и известные пробелы —{" "}
          <Link
            href="/about"
            className="rounded-option font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            на странице «О проекте»
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
