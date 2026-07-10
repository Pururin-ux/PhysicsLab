import { PracticeWithHelp } from "../../../components/quiz/PracticeWithHelp";
import { CompactHelpCard } from "../../../components/theory/CompactHelpCard";
import { ForceModel } from "../../../components/theory/ForceModel";
import { FormulaDisplay } from "../../../components/theory/FormulaDisplay";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { Card } from "../../../components/ui/Card";
import { MathText } from "../../../components/ui/MathText";
import { topicHelpSections } from "../../../lib/learning/topic-help";

export const metadata = {
  title: "Динамика | PhysicsLab",
};

export default function DynamicsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="gold" />

      <TopicPageHeader
        eyebrow="Тренировка"
        title="Динамика"
        description="10 задач: силы, ускорение и второй закон Ньютона. Разбор темы доступен рядом."
        accent="gold"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="dynamics"
          generatedTemplate="dynamics-mixed"
          generatedTopic="Динамика"
          generatedTitle="Задачи по динамике"
          accent="gold"
          drawerTitle="Справка по задаче"
          drawerDescription="Открыт раздел, который нужен для текущего вопроса."
          drawerLayout="stack"
          subtopics={topicHelpSections.dynamics}
        >
          <article data-help-section-id="newton-second-law" className="flex min-w-0 flex-col gap-4">
            <ForceModel
              variant="resultant"
              title="Равнодействующая задаёт ускорение"
              caption="Силы в одну сторону складываются, встречные — вычитаются с учётом выбранной оси."
            />

            <Card
              variant="elevated"
              className="flex flex-col gap-3 border-l-2 border-l-nova-gold/55"
            >
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
                Главное
              </p>
              <p className="text-[14px] font-normal leading-[1.7] text-white/80">
                <MathText text="Ускорение создаёт ==сумма всех сил==, а не одна из них. Знак проекции — это направление, а не ошибка." />
              </p>
              <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-nova-gold/70 bg-nova-gold/[.04] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
                <span className="shrink-0 text-nova-gold" aria-hidden="true">
                  ⚠
                </span>
                <p>Ошибка: складывать силы, не проверив направления.</p>
              </div>
            </Card>

            <FormulaDisplay
              formula={"\\sum F_x=ma_x"}
              caption="второй закон Ньютона в проекции на выбранную ось"
              symbols={[
                "ΣFₓ — сумма проекций всех сил, Н",
                "m — масса тела, кг",
                "aₓ — проекция ускорения, м/с²",
              ]}
              limitation="Сначала выбери положительное направление оси, потом знаки проекций."
            />
          </article>

          <div data-help-section-id="resultant-force">
            <CompactHelpCard
              accent="gold"
              title="Равнодействующая"
              body="Если силы направлены вдоль одной оси, выбери положительное направление и складывай проекции со знаками. Если силы перпендикулярны, используй теорему Пифагора."
              formula={"F_{res}=\\sum F_x,\\quad F=\\sqrt{F_1^2+F_2^2}"}
              trap="Ошибка — сложить модули сил, не проверив направления."
            />
          </div>

          <div data-help-section-id="friction">
            <CompactHelpCard
              accent="gold"
              title="Трение"
              body="Сила трения зависит от реакции опоры: сначала найди $N$, потом умножай на коэффициент $\\mu$."
              formula={"F_{fr}=\\mu N"}
              trap="На горизонтали часто $N=mg$, но на наклонной плоскости это уже $mg\\cos\\alpha$."
            />
          </div>

          <div data-help-section-id="incline">
            <CompactHelpCard
              accent="gold"
              title="Наклонная плоскость"
              body="Силу тяжести раскладывают на две проекции: вдоль плоскости тело тянет $mg\\sin\\alpha$, к плоскости прижимает $mg\\cos\\alpha$."
              formula={"F_{\\parallel}=mg\\sin\\alpha,\\quad N=mg\\cos\\alpha"}
              trap="Не меняй sin и cos местами: проверь, какая проекция лежит вдоль плоскости."
            />
          </div>

          <article data-help-section-id="weight-lift" className="flex min-w-0 flex-col gap-4">
            <ForceModel
              variant="lift"
              title="Вес в ускоряющемся лифте"
              caption="Вес — это сила реакции опоры N; ускорение вверх или вниз его меняет."
            />

            <Card
              variant="elevated"
              className="flex flex-col gap-3 border-l-2 border-l-nova-gold/55"
            >
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
                Главное
              </p>
              <p className="text-[14px] font-normal leading-[1.7] text-white/80">
                <MathText text="Ускорение вверх — опора давит сильнее (==N больше mg==), вниз — вес **меньше**. Масса при этом не меняется." />
              </p>
              <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-nova-gold/70 bg-nova-gold/[.04] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
                <span className="shrink-0 text-nova-gold" aria-hidden="true">
                  ⚠
                </span>
                <p>Ошибка: выбирать знак по скорости лифта, а не по ускорению.</p>
              </div>
            </Card>

            <FormulaDisplay
              formula={"N=m(g\\pm a)"}
              caption="кажущийся вес при вертикальном ускорении лифта"
              symbols={[
                "N — сила реакции опоры, Н",
                "m — масса тела, кг",
                "g — ускорение свободного падения, м/с²",
                "a — модуль ускорения лифта, м/с²",
              ]}
              limitation="Знак «плюс» соответствует ускорению вверх, знак «минус» — ускорению вниз."
            />
          </article>

          <div data-help-section-id="momentum">
            <CompactHelpCard
              accent="gold"
              title="Импульс"
              body="В столкновениях смотри на всю систему. До и после взаимодействия суммарный импульс сохраняется, если внешними силами можно пренебречь."
              formula={"m_1v_1+m_2v_2=(m_1+m_2)v"}
              trap="После сцепления тележек дели общий импульс на общую массу."
            />
          </div>
        </PracticeWithHelp>
      </section>
    </div>
  );
}
