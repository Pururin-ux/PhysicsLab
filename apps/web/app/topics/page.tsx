import Link from "next/link";
import { TopicCards } from "../../components/topics/TopicCards";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";

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
      <section className="flex max-w-[720px] flex-col gap-4">
        <p className="pl-eyebrow text-nova-cyan/80">Учиться</p>
        <h1 className="pl-h1 max-w-[24ch]">
          Пять тем ЦЭ/ЦТ — от идеи до устойчивого навыка
        </h1>
        <p className="pl-body pl-measure">
          Каждая тема открывается уроком: зачем она нужна, что в ней спрашивают, как решать и где
          ошибаются. Дальше — короткая тренировка, и ошибки сами собирают план повторения.
        </p>
      </section>

      <section aria-labelledby="how-title" className="flex flex-col gap-5">
        <SectionHeading
          id="how-title"
          eyebrow="Методика"
          title="Как здесь учат"
          description="Один и тот же цикл для каждой темы: разобрать, закрепить, проверить, вернуться к слабому."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} padding="sm" interactive className="flex flex-col gap-2">
              <span className="physics-number text-[12px] font-bold text-nova-cyan/85">
                Шаг {index + 1}
              </span>
              <h3 className="pl-h3">{step.title}</h3>
              <p className="text-[13px] leading-[1.6] text-ink-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <TopicCards />

      <section className="flex flex-col gap-3 border-t border-white/[.08] pt-6">
        <p className="text-[13px] leading-[1.7] text-ink-soft">
          Тренажёр покрывает не всю программу: квантовая и атомная физика, колебания и волны,
          магнитное поле пока без задач. Текущее покрытие и известные пробелы —{" "}
          <Link
            href="/about"
            className="pl-link"
          >
            на странице «О проекте»
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
