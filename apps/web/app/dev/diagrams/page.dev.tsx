import { VectorDiagram } from "../../../components/diagrams/VectorDiagram";
import { CircuitDiagram } from "../../../components/diagrams/CircuitDiagram";
import { Card } from "../../../components/ui/Card";
import { vectorDiagramExamples } from "../../../lib/physics/vector-diagram-examples";
import { circuitDiagramExamples } from "../../../lib/physics/circuit-diagram-examples";

export const metadata = {
  title: "Diagram primitives dev | PhysicsLab",
};

const vectorCaptions: Record<string, string> = {
  "resultant-force-example": "Concurrent · равнодействующая двух сил под углом",
  "relative-velocity-example": "Chain · сложение скоростей пловца и течения",
};

const circuitCaptions: Record<string, string> = {
  "single-resistor-example": "single · источник + один резистор",
  "series-resistors-example": "series · два резистора и ключ",
  "parallel-resistors-example": "parallel · две параллельные ветви + амперметр",
  "source-internal-resistance-example": "source-internal · ε, r и внешний R + вольтметр",
};

export default function DiagramsDevPage() {
  return (
    <main className="mx-auto flex max-w-[1120px] flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <header className="flex max-w-[720px] flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          Внутренняя проверка примитивов
        </p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          VectorDiagram и CircuitDiagram
        </h1>
        <p className="text-[14px] leading-[1.7] text-white/65">
          Переиспользуемые SVG-примитивы для будущих шаблонов генератора.
          Страница не добавлена в основную навигацию.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
          VectorDiagram
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {vectorDiagramExamples.map((spec) => (
            <Card key={spec.id} className="flex min-w-0 flex-col gap-3 p-4 md:p-5">
              <p className="text-[12px] font-semibold text-white/70">
                {vectorCaptions[spec.id ?? ""]}
              </p>
              <VectorDiagram spec={spec} />
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
          CircuitDiagram
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {circuitDiagramExamples.map((spec) => (
            <Card key={spec.id} className="flex min-w-0 flex-col gap-3 p-4 md:p-5">
              <p className="text-[12px] font-semibold text-white/70">
                {circuitCaptions[spec.id ?? ""]}
              </p>
              <CircuitDiagram spec={spec} />
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
