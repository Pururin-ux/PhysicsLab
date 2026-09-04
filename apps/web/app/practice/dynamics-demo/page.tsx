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
        learnHref="/practice/dynamics-lesson"
        accent="gold"
      />

      <section id="practice" className="scroll-mt-24">
        <PracticeWithHelp
          topicId="dynamics"
          generatedTemplate="dynamics-mixed"
          generatedTopic="Динамика"
          generatedTitle="Задачи по динамике"
          preAnswerGuidance="unlabelled"
          accent="gold"
          drawerTitle="Справка"
          drawerLayout="stack"
          subtopics={topicHelpSections.dynamics}
        >
          <article data-help-section-id="newton-second-law" className="flex min-w-0 flex-col gap-4">
            <ForceModel
              variant="resultant"
              title="Встречные силы: что остаётся"
              caption="Силы в одну сторону складываются, а встречная сила гасит такую же часть тяги."
            />

            <Card
              variant="elevated"
              className="flex flex-col gap-3 border-l-2 border-l-feedback-warning/60"
            >
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
                Главное
              </p>
              <p className="text-[14px] font-normal leading-[1.7] text-white/80">
                <MathText text="Ускорение задаёт ==сила, которая остаётся после сравнения всех сил==, а не одна выбранная сила." />
              </p>
              <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-feedback-warning/75 bg-feedback-warning/[.05] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
                <span className="shrink-0 text-feedback-warning" aria-hidden="true">
                  ⚠
                </span>
                <p>Ошибка: складывать силы, не проверив направления.</p>
              </div>
            </Card>

            <FormulaDisplay
              formula={"F_{\\text{рез}}=ma"}
              caption="второй закон Ньютона для итоговой силы"
              symbols={[
                { latex: "F_{\\text{рез}}", description: "результирующая сила после сложения и взаимного погашения, Н" },
                { latex: "m", description: "масса тела, кг" },
                { latex: "a", description: "ускорение тела, м/с²" },
              ]}
              limitation="Сначала сравни направления сил на рисунке. Оси и знаки проекций понадобятся в следующем уровне задач."
            />
          </article>

          <div data-help-section-id="resultant-force">
            <CompactHelpCard
              accent="gold"
              title="Равнодействующая"
              body="Равнодействующая — сила, которая остаётся после сложения и взаимного погашения всех сил. Встречные силы сначала сравни, а не складывай модулями."
              formula={"F_{\\text{рез}}=F_{\\rightarrow}-F_{\\leftarrow}"}
              trap="Ошибка — сложить модули встречных сил, не проверив направления."
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
              caption="Вес P действует на опору, реакция N — на тело. Пока контакт сохраняется, их модули равны."
            />

            <Card
              variant="elevated"
              className="flex flex-col gap-3 border-l-2 border-l-feedback-warning/60"
            >
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
                Главное
              </p>
              <p className="text-[14px] font-normal leading-[1.7] text-white/80">
                <MathText text="При ускорении вверх реакция опоры ==N больше mg== и равный ей по модулю вес P тоже больше. При ускорении вниз оба модуля меньше. Масса не меняется." />
              </p>
              <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-feedback-warning/75 bg-feedback-warning/[.05] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
                <span className="shrink-0 text-feedback-warning" aria-hidden="true">
                  ⚠
                </span>
                <p>Ошибка: выбирать знак по скорости лифта, а не по ускорению.</p>
              </div>
            </Card>

            <FormulaDisplay
              formula={"P=N=m(g\\pm a)"}
              caption="модули веса и реакции опоры при сохранённом контакте"
              symbols={[
                { latex: "P", description: "вес: сила, с которой тело действует на опору, Н" },
                { latex: "N", description: "реакция опоры: сила, действующая на тело, Н" },
                { latex: "m", description: "масса тела, кг" },
                { latex: "g", description: "ускорение свободного падения, м/с²" },
                { latex: "a", description: "модуль ускорения лифта, м/с²" },
              ]}
              limitation="Считаем, что по вертикали действуют только тяжесть и опора. Знак «плюс» — ускорение вверх, «минус» — вниз."
            />
          </article>

          <div data-help-section-id="impulse-force">
            <CompactHelpCard
              accent="gold"
              title="Импульс силы"
              body="Изменение импульса тела равно импульсу равнодействующей всех сил. Если равнодействующая постоянна, её модуль умножают на время действия."
              formula={"\\Delta\\vec p=\\vec F_{\\text{рез}}\\Delta t"}
              trap="Не подставляй одну выбранную силу, если в задаче есть другие силы: сначала найди равнодействующую."
            />
          </div>

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
