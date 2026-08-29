import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";

export const metadata = {
  title: "Колебания и волны | PhysicsLab",
};

// Волна в разрезе времени: одна полная волна между двумя гребнями.
function WaveVisual() {
  return (
    <div className="flex flex-col gap-2 rounded-option border border-line bg-surface-1 p-4">
      <svg
        viewBox="0 0 320 120"
        role="img"
        aria-label="Синусоида: одна длина волны между соседними гребнями"
        className="h-28 w-full text-nova-blue"
      >
        <line x1="8" y1="60" x2="312" y2="60" stroke="rgba(226,232,240,0.18)" strokeWidth="1" />
        <path
          d="M8 60 q26 -42 52 0 t52 0 t52 0 t52 0 t52 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line x1="34" y1="60" x2="34" y2="96" stroke="rgba(226,232,240,0.35)" strokeWidth="1" />
        <line x1="138" y1="60" x2="138" y2="96" stroke="rgba(226,232,240,0.35)" strokeWidth="1" />
        <line x1="34" y1="88" x2="138" y2="88" stroke="currentColor" strokeWidth="1.5" />
        <text x="76" y="112" fill="currentColor" fontSize="13" textAnchor="middle">
          λ
        </text>
        <circle cx="34" cy="18" r="4" fill="currentColor" />
        <circle cx="138" cy="18" r="4" fill="currentColor" />
      </svg>
      <p className="text-[13px] leading-[1.6] text-ink-soft">
        Между соседними гребнями — ровно одна длина волны. За один период волна уходит
        на это расстояние.
      </p>
    </div>
  );
}

export default function OscillationsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="blue" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Колебания и волны"
        description="10 задач: период, частота, длина волны и эхо. Справку по разделу можно открыть в любой момент."
        accent="blue"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="oscillations"
          generatedTemplate="oscillations-mixed"
          generatedTopic="Колебания и волны"
          generatedTitle="Задачи по колебаниям и волнам"
          accent="blue"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.oscillations}
        >
          <div data-help-section-id="oscillations-basics">
            <TextConceptReveal
              accentClass="border-l-nova-blue/55"
              visual={
                <div className="flex flex-col gap-2 rounded-option border border-line bg-surface-1 p-4">
                  <svg
                    viewBox="0 0 320 110"
                    role="img"
                    aria-label="График колебаний: период отмечен между соседними maxima"
                    className="h-24 w-full text-nova-blue"
                  >
                    <line
                      x1="8"
                      y1="55"
                      x2="312"
                      y2="55"
                      stroke="rgba(226,232,240,0.18)"
                      strokeWidth="1"
                    />
                    <path
                      d="M8 55 q26 -38 52 0 t52 0 t52 0 t52 0 t52 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <line
                      x1="34"
                      y1="55"
                      x2="34"
                      y2="92"
                      stroke="rgba(226,232,240,0.35)"
                      strokeWidth="1"
                    />
                    <line
                      x1="138"
                      y1="55"
                      x2="138"
                      y2="92"
                      stroke="rgba(226,232,240,0.35)"
                      strokeWidth="1"
                    />
                    <line x1="34" y1="84" x2="138" y2="84" stroke="currentColor" strokeWidth="1.5" />
                    <text x="86" y="104" fill="currentColor" fontSize="13" textAnchor="middle">
                      T
                    </text>
                  </svg>
                  <p className="text-[13px] leading-[1.6] text-ink-soft">
                    От гребня до гребня — одно полное колебание. Время на него и есть период.
                  </p>
                </div>
              }
              meaningText="Период и частота — **взаимно обратные** величины: $T = \\frac{t}{N}$ и $\\nu = \\frac{N}{t}$. Ошибка почти всегда в том, что на что делить."
              trap="Ошибка: посчитать частоту как $t/N$ — это период, а не частота."
              formula="T=\\frac{t}{N},\\qquad \\nu=\\frac{N}{t}"
              formulaCaption="период и частота по числу колебаний"
              symbols={[
                { latex: "T", description: "период, с" },
                { latex: "\\nu", description: "частота, Гц" },
                { latex: "N", description: "число колебаний" },
                { latex: "t", description: "время наблюдения, с" },
              ]}
              limitation="Для равномерных колебаний: период от колебания к колебанию не меняется."
            />
          </div>

          <div data-help-section-id="wave-relation">
            <TextConceptReveal
              accentClass="border-l-nova-blue/55"
              visual={<WaveVisual />}
              meaningText="За один период волна уходит на одну длину волны: ==$v = \\lambda\\nu$==. Частоту задаёт источник, а скорость — среда."
              trap="Ошибка: сложить длину волны и частоту или перемножить скорость с частотой."
              formula="v=\\lambda\\nu"
              formulaCaption="связь скорости, длины волны и частоты"
              symbols={[
                { latex: "v", description: "скорость волны, м/с" },
                { latex: "\\lambda", description: "длина волны, м" },
                { latex: "\\nu", description: "частота, Гц" },
              ]}
              limitation="При переходе в другую среду частота сохраняется, а скорость и длина волны меняются."
            />
          </div>

          <div data-help-section-id="sound-echo">
            <CompactHelpCard
              accent="blue"
              title="Эхо и эхолот"
              body="Сигнал идёт до препятствия и возвращается: измеренное время соответствует удвоенному расстоянию. Сначала найди весь путь vt, потом раздели его пополам."
              formula={"s=\\frac{vt}{2}"}
              trap="Не забудь половину: путь звука в два раза больше искомого расстояния."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
