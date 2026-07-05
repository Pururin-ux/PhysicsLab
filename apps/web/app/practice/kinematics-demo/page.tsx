import { ConceptReveal } from "../../../components/theory/ConceptReveal";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { KinematicsPracticeModes } from "../../../components/quiz/KinematicsPracticeModes";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import {
  ACCELERATED_MOTION_XT,
  UNIFORM_MOTION_VT,
} from "../../../lib/physics/graph-data";
import { FORMULAS } from "../../../lib/physics/formulas";

export const metadata = {
  title: "Кинематика | PhysicsLab",
};

export default function KinematicsDemoPage() {
  return (
    <div className="relative flex min-w-0 flex-col gap-10 sm:gap-12">
      <TopicAmbientGlow accent="cyan" />

      <TheoryBlock
        eyebrow="Кинематика"
        title="Движение и графики"
        description="Сначала посмотри, как меняется движение. Потом переходи к задачам."
      >
        <a
          href="#practice"
          className="mx-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-option border border-nova-cyan/25 bg-nova-cyan/[.06] px-4 text-[13px] font-semibold text-nova-cyan transition-colors hover:border-nova-cyan/45 hover:bg-nova-cyan-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/60 sm:hidden"
        >
          Сразу к практике
          <span aria-hidden="true">↓</span>
        </a>

        <ConceptReveal
          graph={UNIFORM_MOTION_VT}
          title="Равномерное движение"
          modelText="Горизонтальная линия скорости говорит: за ==равные промежутки времени== тело проходит ==равные отрезки пути==."
          meaningText="Скорость **сохраняется**. Если направление не меняется, перемещение растёт линейно, а ==площадь под графиком v(t)== равна перемещению."
          trap="Частая ошибка: брать одно значение скорости вместо площади под графиком за весь интервал."
          formula={FORMULAS.uniform_motion}
          formulaCaption="путь при постоянной скорости вдоль одной прямой"
          symbols={[
            "s — путь или модуль перемещения, м",
            "v — постоянная скорость, м/с",
            "t — время движения, с",
          ]}
          limitation="Применимо, когда скорость постоянна и направление не меняется."
        />

        <ConceptReveal
          graph={ACCELERATED_MOTION_XT}
          title="Равноускоренное движение"
          modelText="Парабола координаты показывает: чем дольше движется тело, тем **быстрее** растёт пройденное расстояние."
          meaningText="Скорость меняется ==равномерно==: за каждую секунду добавляется одинаковая прибавка. Координата растёт **не одинаковыми шагами**."
          trap="Частая ошибка: перемещение за n-ю секунду путают с перемещением за n секунд."
          formula={FORMULAS.accelerated_motion}
          formulaCaption="координата при постоянном ускорении"
          symbols={[
            "x — координата тела, м",
            "x₀ — начальная координата, м",
            "v₀ — начальная скорость, м/с",
            "a — постоянное ускорение, м/с²",
            "t — время движения, с",
          ]}
          limitation="Применимо для прямолинейного движения с постоянным ускорением."
        />
      </TheoryBlock>

      <section id="practice" className="scroll-mt-24 flex flex-col gap-5">
        <div className="mx-auto flex max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Задачи
          </p>
          <h2 className="text-xl font-bold text-white">10 задач по кинематике</h2>
        </div>
        <KinematicsPracticeModes />
      </section>
    </div>
  );
}
