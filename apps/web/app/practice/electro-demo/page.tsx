import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { CircuitVisual } from "../../../components/theory/CircuitVisual";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";

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
        <PracticeWithHelp
          topicId="electrodynamics"
          generatedTemplate="electro-mixed"
          generatedTopic="Электродинамика"
          generatedTitle="Задачи по электродинамике"
          accent="blue"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.electrodynamics}
        >
          <div data-help-section-id="ohms-law">
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
              formula="I=\\frac{U}{R}"
              formulaCaption="закон Ома для участка цепи"
              symbols={[
                { latex: "I", description: "сила тока в участке, А" },
                { latex: "U", description: "напряжение на участке, В" },
                { latex: "R", description: "сопротивление участка, Ом" },
              ]}
              limitation="Для участка цепи без источника внутри; сопротивление считаем постоянным."
            />
          </div>

          <div data-help-section-id="full-circuit">
            <CompactHelpCard
              accent="blue"
              title="Полная цепь"
              body="Источник тоже имеет внутреннее сопротивление. В знаменателе закона Ома для полной цепи стоит сумма внешнего и внутреннего сопротивлений."
              formula={"I=\\frac{\\mathcal{E}}{R+r}"}
              trap="Не забывай $r$: ток ограничивает не только внешний резистор."
            />
          </div>

          <div data-help-section-id="charge-sharing">
            <CompactHelpCard
              accent="blue"
              title="Деление заряда"
              body="У одинаковых проводников после контакта заряд выравнивается. Сначала сложи заряды с учётом знаков, потом раздели поровну."
              formula={"q'=\\frac{q_1+q_2}{2}"}
              trap="Если заряды разных знаков, они частично компенсируют друг друга."
            />
          </div>

          <div data-help-section-id="capacitor-energy">
            <CompactHelpCard
              accent="blue"
              title="Энергия конденсатора"
              body="Энергия поля конденсатора пропорциональна квадрату напряжения. Проверь коэффициент $\\frac12$ и перевод микрофарад в фарады."
              formula={"W=\\frac{CU^2}{2}"}
              trap="Удвоение напряжения увеличивает энергию в четыре раза, не в два."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
