import { ConceptReveal } from "../../../components/theory/ConceptReveal";
import { TopicTheoryDrawer } from "../../../components/theory/TopicTheoryDrawer";
import { KinematicsPracticeModes } from "../../../components/quiz/KinematicsPracticeModes";
import { TopicAmbientGlow } from "../../../components/layout/TopicAmbientGlow";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
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
    <div className="relative flex min-w-0 flex-col gap-8 sm:gap-10">
      <TopicAmbientGlow accent="cyan" />

      <TopicPageHeader
        eyebrow="Кинематика"
        title="Движение и графики"
        description="Начни с задач. Если график или формула стопорят, открой короткий разбор ниже."
        accent="cyan"
      />

      <section id="practice" className="scroll-mt-24 flex flex-col gap-5">
        <div className="mx-auto flex max-w-[580px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Тренировка
          </p>
          <h2 className="text-xl font-bold text-white">10 задач по кинематике</h2>
        </div>
        <KinematicsPracticeModes />
      </section>

      <TopicTheoryDrawer
        eyebrow="Короткий разбор"
        title="Как читать движение"
        description="Две опоры для задач: что показывает график и когда работает формула."
        accent="cyan"
      >
        <ConceptReveal
          graph={UNIFORM_MOTION_VT}
          title="Равномерное движение"
          modelText="Линия скорости горизонтальна: за ==равные промежутки времени== тело проходит ==равные пути==."
          meaningText="Скорость постоянна, поэтому ==площадь под графиком v(t)== и есть перемещение."
          trap="Ошибка: взять одно значение скорости вместо площади под графиком."
          formula={FORMULAS.uniform_motion}
          formulaCaption="путь при постоянной скорости"
          symbols={[
            "s — путь или модуль перемещения, м",
            "v — постоянная скорость, м/с",
            "t — время движения, с",
          ]}
          limitation="Пока скорость постоянна и направление не меняется."
        />

        <ConceptReveal
          graph={ACCELERATED_MOTION_XT}
          title="Равноускоренное движение"
          modelText="Парабола координаты: чем дольше едет тело, тем **быстрее** растёт путь."
          meaningText="Скорость растёт ==равномерно==, а координата — **неравными шагами**."
          trap="Ошибка: путать путь за n-ю секунду и путь за n секунд."
          formula={FORMULAS.accelerated_motion}
          formulaCaption="координата при постоянном ускорении"
          symbols={[
            "x — координата тела, м",
            "x₀ — начальная координата, м",
            "v₀ — начальная скорость, м/с",
            "a — постоянное ускорение, м/с²",
            "t — время движения, с",
          ]}
          limitation="Пока движение прямолинейное с постоянным ускорением."
        />
      </TopicTheoryDrawer>
    </div>
  );
}
