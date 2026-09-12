import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { GasVesselVisual } from "../../../components/theory/GasVesselVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";

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
        learnHref="/practice/density-lesson"
        learnLabel="Начать с основы: плотность"
        accent="ember"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="thermodynamics"
          generatedTemplate="thermo-mixed"
          generatedTopic="Термодинамика"
          generatedTitle="Задачи по термодинамике"
          preAnswerGuidance="unlabelled"
          accent="ember"
          drawerTitle="Справка"
          drawerLayout="stack"
          subtopics={topicHelpSections.thermodynamics}
        >
          <div data-help-section-id="ideal-gas gas-equation">
            <TextConceptReveal
              accentClass="border-l-nova-ember/55"
              visual={
                <GasVesselVisual
                  title="Газ в герметичном жёстком сосуде"
                  caption="Количество газа и объём не меняются. При ==росте абсолютной температуры== молекулы в среднем движутся быстрее, поэтому давление растёт."
                />
              }
              meaningText="Давление, объём и абсолютная температура **T** связаны одним уравнением. В расчёте T выражают в кельвинах; температуру по Цельсию обозначим **t**."
              trap="Ошибка: подставить °C, не переведя в кельвины."
              formula={"pV=\\nu RT"}
              formulaCaption="уравнение состояния идеального газа"
              symbols={[
                { latex: "p", description: "давление газа, кПа (при V в литрах)" },
                { latex: "V", description: "объём газа, л" },
                { latex: "\\nu", description: "количество вещества, моль" },
                { latex: "R", description: "универсальная газовая постоянная, 8,31 Дж/(моль·К)" },
                { latex: "T", description: "абсолютная температура, К" },
              ]}
              limitation="Численно: T[К] = t[°C] + 273. Рост давления при нагревании здесь относится к герметичному жёсткому сосуду: количество газа и V постоянны."
            />
          </div>

          <div data-help-section-id="heat-amount">
            <CompactHelpCard
              accent="ember"
              title="Количество теплоты"
              body="Q = cmΔT — теплота, полученная телом, пока удельная теплоёмкость постоянна и агрегатное состояние не меняется. Энергия нагревателя совпадает с Q только без потерь и нагрева посуды."
              formula={"Q=cm\\Delta T"}
              trap="Бери изменение температуры и проверь условие о потерях. Если масса дана в граммах, переведи её в килограммы."
            />
          </div>

          <div data-help-section-id="heating-melting">
            <CompactHelpCard
              accent="ember"
              title="Плавление / нагревание"
              body="Если вещество сначала нагревается до температуры плавления, а потом плавится, это две разные стадии. Посчитай каждую и сложи теплоты."
              formula={"Q=cm\\Delta T+\\lambda m"}
              trap="Во время плавления температура не растёт: теплота идёт на изменение состояния."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
