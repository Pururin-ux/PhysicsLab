import { PhysicsGraph } from "../../../components/physics-graph/PhysicsGraph";
import { Card } from "../../../components/ui/Card";
import { InlinePhysics } from "../../../components/ui/InlinePhysics";
import {
  heatingCurveExample,
  physicsGraphExamples,
  pvCycleExample,
} from "../../../lib/physics/physics-graph-examples";

export const metadata = {
  title: "PhysicsGraph dev | PhysicsLab",
};

const captions: Record<string, { notation: string; text: string }> = {
  "vt-slope-example": { notation: "v(t)", text: "наклон по двум точкам" },
  "xt-negative-line-example": { notation: "x(t)", text: "отрицательный наклон и значения ниже нуля" },
  "pv-cycle-example": { notation: "p(V)", text: "цикл, площадь и направление процесса" },
  "v-t-process-example": { notation: "V(T)", text: "состояния и буквенные деления" },
  "heating-curve-example": { notation: "t(τ)", text: "участок плавления и плато" },
};

export default function GraphDevPage() {
  return (
    <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <header className="flex max-w-[720px] flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          Внутренняя проверка графиков
        </p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">PhysicsGraph v1</h1>
        <p className="text-[14px] leading-[1.7] text-white/65">
          Примеры экзаменационных графиков из декларативного описания. Страница не добавлена в
          основную навигацию.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {physicsGraphExamples.map((spec) => (
          <Card key={spec.id} className="flex min-w-0 flex-col gap-3 p-4 md:p-5">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/45">
                {spec.kind}
              </p>
              <h2 className="text-base font-bold text-white">
                <InlinePhysics>{captions[spec.id ?? ""]?.notation}</InlinePhysics>
                {": "}
                {captions[spec.id ?? ""]?.text}
              </h2>
            </div>
            <PhysicsGraph spec={spec} />
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="flex min-w-0 flex-col gap-3 p-4 md:p-5">
          <h2 className="text-base font-bold text-white">
            Отдельный <InlinePhysics>p(V)</InlinePhysics>
          </h2>
          <PhysicsGraph spec={pvCycleExample} />
        </Card>
        <Card className="flex min-w-0 flex-col gap-3 p-4 md:p-5">
          <h2 className="text-base font-bold text-white">
            Отдельный <InlinePhysics>t(τ)</InlinePhysics>
          </h2>
          <PhysicsGraph spec={heatingCurveExample} />
        </Card>
      </section>
    </main>
  );
}
