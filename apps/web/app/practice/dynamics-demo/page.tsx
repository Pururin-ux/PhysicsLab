import { DynamicsPracticeModes } from "../../../components/quiz/DynamicsPracticeModes";
import { ForceModel } from "../../../components/theory/ForceModel";
import { FormulaDisplay } from "../../../components/theory/FormulaDisplay";
import { TopicTheoryDrawer } from "../../../components/theory/TopicTheoryDrawer";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { Card } from "../../../components/ui/Card";
import { MathText } from "../../../components/ui/MathText";

export const metadata = {
  title: "Динамика | PhysicsLab",
};

export default function DynamicsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="gold" />

      <TopicPageHeader
        eyebrow="Динамика"
        title="Силы и движение"
        description="Решай сразу. Если путаются силы, знаки или вес, открой разбор после тренировки."
        accent="gold"
      />

      <section id="practice" className="scroll-mt-24 flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Тренировка
          </p>
          <h2 className="text-xl font-bold text-white">10 задач по динамике</h2>
        </div>
        <DynamicsPracticeModes />
      </section>

      <TopicTheoryDrawer
        title="Силы, оси и вес"
        description="Минимум перед повторением: сумма сил, выбранная ось и вес в лифте."
        layout="stack"
        accent="gold"
      >
        <article className="flex min-w-0 flex-col gap-4">
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

        <div className="flex items-center gap-4 px-1" aria-hidden="true">
          <span className="h-px flex-1 bg-white/[.08]" />
          <span className="text-[10px] font-bold uppercase tracking-[.16em] text-white/45">
            Та же логика по вертикали
          </span>
          <span className="h-px flex-1 bg-white/[.08]" />
        </div>

        <article className="flex min-w-0 flex-col gap-4">
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
      </TopicTheoryDrawer>
    </div>
  );
}
