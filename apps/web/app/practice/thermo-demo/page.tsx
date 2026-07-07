import { GasVesselVisual } from "../../../components/theory/GasVesselVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicTheoryDrawer } from "../../../components/theory/TopicTheoryDrawer";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { PracticeQuickBar } from "../../../components/quiz/PracticeQuickBar";
import { QuizSession } from "../../../components/quiz/QuizSession";

export const metadata = {
  title: "Термодинамика | PhysicsLab",
};

export default function ThermoDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="ember" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Термодинамика"
        description="10 задач: газ, температура, давление и теплота. Теорию можно открыть отдельно."
        accent="ember"
      />

      <section id="practice" className="scroll-mt-24">
        <div className="flex flex-col gap-5">
          <PracticeQuickBar />
          <QuizSession
            mode="generated"
            generatedTemplate="thermo-mixed"
            generatedTopic="Термодинамика"
            generatedTitle="Задачи по термодинамике"
            topicId="thermodynamics"
          />
        </div>
      </section>

      <TopicTheoryDrawer
        title="Что держать в голове"
        description="Идеальный газ, температура в кельвинах и главная ловушка с единицами."
        layout="stack"
        accent="ember"
        subtopics={[
          "Идеальный газ",
          "Уравнение состояния",
          "Количество теплоты",
          "Плавление / нагревание",
        ]}
      >
        <TextConceptReveal
          accentClass="border-l-nova-ember/55"
          visual={
            <GasVesselVisual
              title="Молекулы газа в закрытом сосуде"
              caption="Молекулы бьются о стенки сосуда. Чем ==выше температура==, тем быстрее они и тем сильнее давление."
            />
          }
          meaningText="Давление, объём и температура связаны одним уравнением — но только с температурой в **кельвинах**, не в °C."
          trap="Ошибка: подставить °C, не переведя в кельвины."
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
      </TopicTheoryDrawer>
    </div>
  );
}
