import { ConceptReveal } from "../../../components/theory/ConceptReveal";
import { TheoryBlock } from "../../../components/theory/TheoryBlock";
import { QuizSession } from "../../../components/quiz/QuizSession";
import {
  ACCELERATED_MOTION_XT,
  UNIFORM_MOTION_VT,
} from "../../../lib/physics/graph-data";
import { FORMULAS } from "../../../lib/physics/formulas";

export const metadata = {
  title: "Кинематика | PhysicsLab V3",
};

export default function KinematicsDemoPage() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <TheoryBlock
        eyebrow="Кинематика"
        title="График сначала, формула потом"
        description="Перед задачами разверни две модели: постоянная скорость и движение с постоянным ускорением. Это снижает риск выбрать формулу без физического смысла."
      >
        <ConceptReveal
          graph={UNIFORM_MOTION_VT}
          title="Равномерное движение"
          modelText="Горизонтальная линия скорости говорит: за равные промежутки времени тело проходит равные отрезки пути."
          meaningText="Скорость сохраняется. Если направление не меняется, перемещение растёт линейно, а площадь под графиком v(t) равна перемещению."
          trap="Ловушка ЦТ: берут значение скорости с графика вместо площади под графиком за весь интервал."
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
          modelText="Парабола координаты показывает: чем дольше движется тело, тем быстрее растёт пройденное расстояние."
          meaningText="Скорость меняется равномерно: за каждую секунду добавляется одинаковая прибавка. Координата растёт не одинаковыми шагами."
          trap="Ловушка ЦТ: перемещение за n-ю секунду путают с перемещением за n секунд."
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

      <section className="flex flex-col gap-5">
        <div className="mx-auto flex max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Практика
          </p>
          <h2 className="text-xl font-bold text-white">10 задач в формате ЦТ</h2>
        </div>
        <QuizSession />
      </section>
    </div>
  );
}
