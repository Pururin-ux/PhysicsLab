import { DynamicsPracticeModes } from "../../../components/quiz/DynamicsPracticeModes";
import { ForceModel } from "../../../components/theory/ForceModel";
import { FormulaDisplay } from "../../../components/theory/FormulaDisplay";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { Card } from "../../../components/ui/Card";
import { MathText } from "../../../components/ui/MathText";

export const metadata = {
  title: "Динамика | PhysicsLab",
};

export default function DynamicsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-10 sm:gap-12">
      <TopicAmbientGlow accent="gold" />

      <TheoryBlock
        eyebrow="Динамика"
        title="Силы и движение"
        description="Перед вычислениями проверь, какие силы действуют и куда направлено ускорение."
        layout="stack"
      >
        <a
          href="#practice"
          className="mx-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-option border border-nova-gold/25 bg-nova-gold/[.06] px-4 text-[13px] font-semibold text-nova-gold transition-colors hover:border-nova-gold/45 hover:bg-nova-gold-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-gold/60 sm:hidden"
        >
          Сразу к практике
          <span aria-hidden="true">↓</span>
        </a>

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
              <MathText text="Ускорение создаёт не отдельная сила, а ==векторная сумма всех сил==. Знак проекции показывает направление и **сам по себе не делает ответ ошибочным**." />
            </p>
            <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-nova-gold/70 bg-nova-gold/[.04] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
              <span className="shrink-0 text-nova-gold" aria-hidden="true">
                ⚠
              </span>
              <p>Частая ошибка: складывать силы, не проверив их направления.</p>
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
            limitation="Сначала задайте положительное направление оси и только затем расставляйте знаки проекций."
          />
        </article>

        <div className="flex items-center gap-4 px-1" aria-hidden="true">
          <span className="h-px flex-1 bg-white/[.08]" />
          <span className="text-[10px] font-bold uppercase tracking-[.16em] text-white/35">
            Та же логика по вертикали
          </span>
          <span className="h-px flex-1 bg-white/[.08]" />
        </div>

        <article className="flex min-w-0 flex-col gap-4">
          <ForceModel
            variant="lift"
            title="Вес в ускоряющемся лифте"
            caption="Вес равен силе реакции опоры N и меняется, когда ускорение направлено вверх или вниз."
          />

          <Card
            variant="elevated"
            className="flex flex-col gap-3 border-l-2 border-l-nova-gold/55"
          >
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Главное
            </p>
            <p className="text-[14px] font-normal leading-[1.7] text-white/80">
              <MathText text="При ускорении вверх опора действует сильнее: ==N больше mg==. При ускорении вниз кажущийся вес **уменьшается**, хотя масса тела не меняется." />
            </p>
            <div className="flex gap-2 rounded-option border border-white/[.09] border-l-2 border-l-nova-gold/70 bg-nova-gold/[.04] px-4 py-3 text-[13px] leading-[1.6] text-white/75">
              <span className="shrink-0 text-nova-gold" aria-hidden="true">
                ⚠
              </span>
              <p>Частая ошибка: выбирать знак по скорости лифта, а не по ускорению.</p>
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
      </TheoryBlock>

      <section id="practice" className="scroll-mt-24 flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Задачи
          </p>
          <h2 className="text-xl font-bold text-white">10 задач по динамике</h2>
        </div>
        <DynamicsPracticeModes />
      </section>
    </div>
  );
}
