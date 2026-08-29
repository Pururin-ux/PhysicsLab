import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { TextConceptReveal } from "../../../components/theory/TextConceptReveal";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { topicHelpSections } from "../../../lib/learning/topic-help";

export const metadata = {
  title: "Квантовая и атомная физика | PhysicsLab",
};

// Упрощённая схема фотоэффекта: фотон выбивает электрон с поверхности металла.
function PhotoelectricVisual() {
  return (
    <div className="flex flex-col gap-2 rounded-option border border-line bg-surface-1 p-4">
      <svg
        viewBox="0 0 320 130"
        role="img"
        aria-label="Фотон выбивает электрон из металла, часть энергии уходит на работу выхода"
        className="h-28 w-full text-nova-gold"
      >
        <rect x="12" y="96" width="150" height="26" rx="3" fill="rgba(226,232,240,0.08)" />
        <text x="87" y="113" fill="rgba(226,232,240,0.55)" fontSize="12" textAnchor="middle">
          металл
        </text>
        <line
          x1="60"
          y1="18"
          x2="96"
          y2="84"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <polygon points="96,84 88,74 100,72" fill="currentColor" />
        <text x="40" y="26" fill="currentColor" fontSize="13">
          hν
        </text>
        <circle cx="150" cy="44" r="7" fill="currentColor" fillOpacity="0.85" />
        <path d="M150 52 C170 66 200 70 232 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M228 54 L236 60 L226 64" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="196" y="46" fill="currentColor" fontSize="12">
          Eк = hν − A
        </text>
        <text x="196" y="96" fill="rgba(226,232,240,0.55)" fontSize="12">
          A — работа выхода
        </text>
      </svg>
      <p className="text-[13px] leading-[1.6] text-ink-soft">
        Энергия фотона расходуется на отрыв электрона и на его кинетическую энергию.
      </p>
    </div>
  );
}

export default function QuantumDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="gold" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Квантовая и атомная физика"
        description="10 задач: энергия фотона, фотоэффект, радиоактивный распад и состав ядра."
        accent="gold"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="quantum"
          generatedTemplate="quantum-mixed"
          generatedTopic="Квантовая физика"
          generatedTitle="Задачи по квантовой и атомной физике"
          accent="gold"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.quantum}
        >
          <div data-help-section-id="photon">
            <TextConceptReveal
              accentClass="border-l-nova-gold/55"
              visual={
                <div className="flex flex-col gap-2 rounded-option border border-line bg-surface-1 p-4">
                  <svg
                    viewBox="0 0 320 110"
                    role="img"
                    aria-label="Чем выше частота, тем короче длина волны и больше энергия фотона"
                    className="h-24 w-full text-nova-gold"
                  >
                    <path
                      d="M8 30 q14 -16 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 78 q26 -16 52 0 t52 0 t52 0 t52 0 t52 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.55"
                    />
                    <text x="300" y="26" fill="currentColor" fontSize="12" textAnchor="end">
                      ν выше → E больше
                    </text>
                    <text x="300" y="96" fill="currentColor" fontSize="12" textAnchor="end">
                      λ длиннее → E меньше
                    </text>
                  </svg>
                  <p className="text-[13px] leading-[1.6] text-ink-soft">
                    Энергия фотона зависит только от частоты: выше частота — больше энергия.
                  </p>
                </div>
              }
              meaningText="Энергия фотона растёт с частотой: ==$E = h\\nu$==. Степени десятки перемножай отдельно от мантисс: $10^{-34}\\cdot 10^{14} = 10^{-20}$."
              trap="Ошибка: потерять порядок величины или подставить частоту в герцах, не сократив $10^{14}$."
              formula="E=h\\nu"
              formulaCaption="энергия фотона"
              symbols={[
                { latex: "E", description: "энергия фотона, Дж" },
                { latex: "h", description: "постоянная Планка, 6,6·10⁻³⁴ Дж·с" },
                { latex: "\\nu", description: "частота света, Гц" },
              ]}
              limitation="Энергию часто выражают в электронвольтах: 1 эВ = 1,6·10⁻¹⁹ Дж."
            />
          </div>

          <div data-help-section-id="photoelectric">
            <TextConceptReveal
              accentClass="border-l-nova-gold/55"
              visual={<PhotoelectricVisual />}
              meaningText="Баланс энергии фотоэффекта: ==$h\\nu = A + E_{\\text{к}}$==. Работа выхода вычитается из энергии фотона, а не прибавляется к ней."
              trap="Ошибка: сложить энергии или назвать энергию фотона кинетической энергией электрона."
              formula="h\\nu=A+E_{\\text{к}}"
              formulaCaption="уравнение Эйнштейна для фотоэффекта"
              symbols={[
                { latex: "h\\nu", description: "энергия поглощённого фотона, эВ" },
                { latex: "A", description: "работа выхода электрона, эВ" },
                { latex: "E_{\\text{к}}", description: "максимальная кинетическая энергия, эВ" },
              ]}
              limitation="Фотоэффект возможен только при $h\\nu \\ge A$."
            />
          </div>

          <div data-help-section-id="radioactivity">
            <CompactHelpCard
              accent="gold"
              title="Радиоактивный распад"
              body="Сначала посчитай число периодов полураспада: время наблюдения делим на период. Затем делим остаток пополам столько раз, сколько периодов прошло."
              formula={"N=\\frac{N_0}{2^{t/T}}"}
              trap="Не дели начальное число ядер на удвоенное число периодов: каждый период отнимает половину остатка."
            />
          </div>

          <div data-help-section-id="nucleus">
            <CompactHelpCard
              accent="gold"
              title="Состав ядра"
              body="Массовое число равно сумме протонов и нейтронов, зарядовое число — числу протонов. Значит число нейтронов равно разности A − Z."
              formula={"N=A-Z"}
              trap="Не называй массовое число числом нейтронов: в него входят и протоны."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
