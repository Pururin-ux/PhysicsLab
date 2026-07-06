import { CircuitVisual } from "../../../components/theory/CircuitVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicTheoryDrawer } from "../../../components/theory/TopicTheoryDrawer";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { QuizSession } from "../../../components/quiz/QuizSession";

export const metadata = {
  title: "Электродинамика | PhysicsLab",
};

export default function ElectroDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="blue" />

      <TopicPageHeader
        eyebrow="Электродинамика"
        title="Ток, напряжение и сопротивление"
        description="Начни с задач по цепям. Если закон Ома путается, разбор лежит ниже."
        accent="blue"
      />

      <section id="practice" className="scroll-mt-24 flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Тренировка
          </p>
          <h2 className="text-xl font-bold text-white">
            10 задач по электродинамике
          </h2>
          <p className="text-[13px] leading-[1.6] text-white/55">
            Закон Ома для участка и полной цепи, деление заряда между
            проводниками — вперемешку.
          </p>
        </div>
        <QuizSession
          mode="generated"
          generatedTemplate="electro-mixed"
          generatedTopic="Электродинамика"
          generatedTitle="Задачи по электродинамике"
          topicId="electrodynamics"
        />
      </section>

      <TopicTheoryDrawer
        eyebrow="Короткий разбор"
        title="Как думать о цепи"
        description="Что означает ток, напряжение и сопротивление до подстановки в формулу."
        layout="stack"
        accent="blue"
      >
        <TextConceptReveal
          accentClass="border-l-nova-blue/55"
          visual={
            <CircuitVisual
              title="Что течёт по проводу"
              caption="Свободные заряды в металле движутся хаотично. Источник задаёт им ==общий дрейф== — это и есть ток."
            />
          }
          meaningText="**Напряжение** — напор источника, **сопротивление** — помеха на пути зарядов. ==Больше напор — больше ток, больше помеха — меньше==."
          trap="Ошибка: делить данные наугад. Сначала запиши закон, потом вырази нужное."
          formula="I=\frac{U}{R}"
          formulaCaption="закон Ома для участка цепи"
          symbols={[
            "I — сила тока в участке, А",
            "U — напряжение на участке, В",
            "R — сопротивление участка, Ом",
          ]}
          limitation="Для участка цепи без источника внутри; сопротивление считаем постоянным."
        />
      </TopicTheoryDrawer>
    </div>
  );
}
