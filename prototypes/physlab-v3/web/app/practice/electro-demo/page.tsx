import { CircuitVisual } from "../../../components/theory/CircuitVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { QuizSession } from "../../../components/quiz/QuizSession";

export const metadata = {
  title: "Электродинамика | PhysicsLab",
};

export default function ElectroDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-10 sm:gap-12">
      <TopicAmbientGlow accent="blue" />

      <TheoryBlock
        eyebrow="Электродинамика"
        title="Ток, напряжение и сопротивление"
        description="Сначала посмотри, что происходит в цепи. Формула появится в конце."
        layout="stack"
      >
        <TextConceptReveal
          accentClass="border-l-nova-blue/55"
          visual={
            <CircuitVisual
              title="Что течёт по проводу"
              caption="В металле всегда есть свободные заряды, но пока цепь разомкнута, они движутся хаотично. Источник создаёт ==общий дрейф== — это и есть электрический ток."
            />
          }
          meaningText="**Напряжение** — «напор», который источник создаёт на участке цепи. **Сопротивление** — то, насколько участок мешает движению зарядов. Ток получается из их противоборства: ==больше напор — больше ток==, ==больше помех — меньше ток==."
          trap="Частая ошибка: перемножать или делить данные наугад. Сначала запиши закон, потом вырази из него нужную величину."
          formula="I=\frac{U}{R}"
          formulaCaption="закон Ома для участка цепи"
          symbols={[
            "I — сила тока в участке, А",
            "U — напряжение на участке, В",
            "R — сопротивление участка, Ом",
          ]}
          limitation="Для участка цепи без источника внутри; сопротивление считаем постоянным."
        />
      </TheoryBlock>

      <section className="flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Задачи
          </p>
          <h2 className="text-xl font-bold text-white">
            10 задач по электродинамике
          </h2>
          <p className="text-[13px] leading-[1.6] text-white/55">
            Закон Ома и деление заряда между одинаковыми проводниками
            вперемешку.
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
    </div>
  );
}
