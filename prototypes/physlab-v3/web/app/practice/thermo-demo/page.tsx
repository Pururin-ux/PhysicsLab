import { GasVesselVisual } from "../../../components/theory/GasVesselVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { QuizSession } from "../../../components/quiz/QuizSession";

export const metadata = {
  title: "Термодинамика | PhysicsLab",
};

export default function ThermoDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-10 sm:gap-12">
      <TopicAmbientGlow accent="ember" />

      <TheoryBlock
        eyebrow="Термодинамика"
        title="Газ, давление и температура"
        description="Сначала посмотри на молекулы газа. Формула появится в конце."
        layout="stack"
      >
        <TextConceptReveal
          accentClass="border-l-nova-ember/55"
          visual={
            <GasVesselVisual
              title="Молекулы газа в закрытом сосуде"
              caption="Молекулы газа хаотично движутся и сталкиваются со стенками сосуда — чем ==выше температура==, тем быстрее это движение и тем сильнее давление."
            />
          }
          meaningText="Давление, объём и температура газа связаны одним уравнением. Но формула работает только с **абсолютной температурой** — той, что в кельвинах, а не в градусах Цельсия."
          trap="Частая ошибка: подставлять температуру в °C прямо в уравнение состояния, не переведя её в кельвины."
          formula="pV=nRT"
          formulaCaption="уравнение состояния идеального газа"
          symbols={[
            "p — давление газа, кПа (при V в литрах)",
            "V — объём газа, л",
            "n — количество вещества, моль",
            "R — универсальная газовая постоянная, 8,31 Дж/(моль·К)",
            "T — абсолютная температура, К",
          ]}
          limitation="Температура обязательно в кельвинах: T = t°C + 273."
        />
      </TheoryBlock>

      <section className="flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Задачи
          </p>
          <h2 className="text-xl font-bold text-white">
            10 задач по термодинамике
          </h2>
          <p className="text-[13px] leading-[1.6] text-white/55">
            Уравнение состояния газа и количество теплоты при нагревании
            вперемешку.
          </p>
        </div>
        <QuizSession
          mode="generated"
          generatedTemplate="thermo-mixed"
          generatedTopic="Термодинамика"
          generatedTitle="Задачи по термодинамике"
          topicId="thermodynamics"
        />
      </section>
    </div>
  );
}
