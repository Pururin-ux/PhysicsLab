import { CircuitVisual } from "../../../components/theory/CircuitVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicTheoryDrawer } from "../../../components/theory/TopicTheoryDrawer";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { PracticeQuickBar } from "../../../components/quiz/PracticeQuickBar";
import { QuizSession } from "../../../components/quiz/QuizSession";

export const metadata = {
  title: "Электродинамика | PhysicsLab",
};

export default function ElectroDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="blue" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Электродинамика"
        description="10 задач: ток, напряжение, сопротивление и заряд. Справка не мешает решению."
        accent="blue"
      />

      <section id="practice" className="scroll-mt-24">
        <div className="flex flex-col gap-5">
          <PracticeQuickBar />
          <QuizSession
            mode="generated"
            generatedTemplate="electro-mixed"
            generatedTopic="Электродинамика"
            generatedTitle="Задачи по электродинамике"
            topicId="electrodynamics"
          />
        </div>
      </section>

      <TopicTheoryDrawer
        title="Как думать о цепи"
        description="Что означает ток, напряжение и сопротивление до подстановки в формулу."
        layout="stack"
        accent="blue"
        subtopics={[
          "Закон Ома",
          "Полная цепь",
          "Деление заряда",
          "Конденсатор",
        ]}
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
