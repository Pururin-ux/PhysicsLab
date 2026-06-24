import { DynamicsPracticeModes } from "../../../components/quiz/DynamicsPracticeModes";
import { ForceModel } from "../../../components/theory/ForceModel";
import { FormulaDisplay } from "../../../components/theory/FormulaDisplay";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { Card } from "../../../components/ui/Card";

export const metadata = {
  title: "Динамика | PhysicsLab V3",
};

export default function DynamicsDemoPage() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <TheoryBlock
        eyebrow="Динамика"
        title="Сначала силы, затем уравнение"
        description="До подстановки чисел отметь каждую силу, выбери положительное направление и только потом запиши второй закон Ньютона в проекциях."
      >
        <article className="flex min-w-0 flex-col gap-4">
          <ForceModel
            variant="resultant"
            title="Равнодействующая задаёт ускорение"
            caption="Сонаправленные силы складываются, встречные — вычитаются с учётом выбранной оси."
          />

          <Card variant="elevated" className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Смысл
            </p>
            <p className="text-[14px] font-normal leading-[1.7] text-white/80">
              Ускорение создаёт не отдельная сила, а векторная сумма всех сил. Знак проекции
              показывает направление, а не «плохой» отрицательный ответ.
            </p>
            <div className="rounded-option border border-nova-gold/25 bg-nova-gold-10 px-4 py-3 text-[13px] leading-[1.6] text-white/75">
              Ловушка ЦТ: складывать модули сил, не проверив их направления.
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

        <article className="flex min-w-0 flex-col gap-4">
          <ForceModel
            variant="lift"
            title="Вес в ускоряющемся лифте"
            caption="Вес равен силе реакции опоры N и меняется, когда ускорение направлено вверх или вниз."
          />

          <Card variant="elevated" className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Смысл
            </p>
            <p className="text-[14px] font-normal leading-[1.7] text-white/80">
              При ускорении вверх опора действует сильнее: N больше mg. При ускорении вниз
              кажущийся вес уменьшается, хотя масса тела не меняется.
            </p>
            <div className="rounded-option border border-nova-gold/25 bg-nova-gold-10 px-4 py-3 text-[13px] leading-[1.6] text-white/75">
              Ловушка ЦТ: выбирать знак по направлению скорости лифта вместо направления ускорения.
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

      <section className="flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Практика
          </p>
          <h2 className="text-xl font-bold text-white">10 задач по динамике</h2>
        </div>
        <DynamicsPracticeModes />
      </section>
    </div>
  );
}
