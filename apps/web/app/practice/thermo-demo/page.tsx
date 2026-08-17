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
        accent="ember"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="thermodynamics"
          generatedTemplate="thermo-mixed"
          generatedTopic="Термодинамика"
          generatedTitle="Задачи по термодинамике"
          accent="ember"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.thermodynamics}
        >
          <div data-help-section-id="ideal-gas gas-equation">
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
                { latex: "p", description: "давление газа, кПа (при V в литрах)" },
                { latex: "V", description: "объём газа, л" },
                { latex: "n", description: "количество вещества, моль" },
                { latex: "R", description: "универсальная газовая постоянная, 8,31 Дж/(моль·К)" },
                { latex: "T", description: "абсолютная температура, К" },
              ]}
              limitation="Температура обязательно в кельвинах: T = t°C + 273."
            />
          </div>

          <div data-help-section-id="heat-amount">
            <CompactHelpCard
              accent="ember"
              title="Количество теплоты"
              body="При нагревании теплота пропорциональна массе, удельной теплоёмкости и изменению температуры. Важно брать именно изменение температуры, а не конечное значение."
              formula={"Q=cm\\Delta T"}
              trap="Если масса дана в граммах, переведи её в килограммы перед подстановкой."
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
