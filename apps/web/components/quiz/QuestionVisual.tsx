import dynamic from "next/dynamic";
import { MathText } from "../ui/MathText";
import { ModelVisual } from "../theory/ModelVisual";
import { VectorDiagram } from "../diagrams/VectorDiagram";
import { CircuitDiagram } from "../diagrams/CircuitDiagram";
import { OpticsDiagram } from "../diagrams/OpticsDiagram";
import { GraduatedScaleTaskDiagram } from "../diagrams/GraduatedScaleTaskDiagram";
import type { TaskFocus } from "../../lib/learning/task-focus";
import type { GraduatedScaleTaskSpec } from "../../lib/physics/graduated-scale-task";
import type { QuizDiagram, QuizGraph } from "./quiz-session-store";

const DisplacementVolumeTaskDiagram = dynamic(
  () => import("../diagrams/DisplacementVolumeTaskDiagram").then(module => module.DisplacementVolumeTaskDiagram),
);

type QuestionVisualProps = {
  scale: GraduatedScaleTaskSpec | null;
  text: string;
  diagram?: QuizDiagram | null;
  graph?: QuizGraph | null;
  focus?: TaskFocus;
  showSolutionContent: boolean;
};

export function QuestionVisual({ scale, text, diagram, graph, focus, showSolutionContent }: QuestionVisualProps) {
  const graphConfig = graph
    ? {
        ...graph,
        color: graph.color ?? "cyan",
      }
    : null;
  const graphTitle =
    graph?.type === "vt"
      ? "График v(t)"
      : graph?.type === "xt"
        ? graph.yLabel.trim().toLowerCase().startsWith("s")
          ? "График s(t)"
          : "График x(t)"
        : "График a(t)";
  const showArea = graph?.showArea ?? (graph?.type === "vt" && graph.series.length > 2);
  const visualActivityLabel = diagram
    ? "Работа с диаграммой"
    : graphConfig
      ? "Работа с графиком"
      : null;

  return <>
    {scale ? (
      <div className="physics-stage">
        <GraduatedScaleTaskDiagram scale={scale} />
      </div>
    ) : null}
    {scale ? (
      <details className="text-[13px] leading-[1.6] text-[var(--text-secondary)]">
        <summary className="w-fit cursor-pointer py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--action-primary)]">
          Прочитать условие словами
        </summary>
        <p className="mt-2">{text}</p>
      </details>
    ) : null}

    {/* Остальные виды задач сохраняют свои визуальные представления. */}
    {diagram?.kind === "vector" ? (
      <div className="physics-stage">
        <VectorDiagram spec={diagram.spec} />
      </div>
    ) : null}
    {diagram?.kind === "circuit" ? (
      <div className="physics-stage">
        <CircuitDiagram spec={diagram.spec} />
      </div>
    ) : null}
    {diagram?.kind === "optics" ? (
      <div className="physics-stage">
        {/* Решение (отражённый луч, изображение) появляется только после
            ответа — до этого его нет ни в DOM, ни в accessibility tree. */}
        <OpticsDiagram spec={diagram.spec} showSolution={showSolutionContent} />
      </div>
    ) : null}
    {diagram?.kind === "displacement-volume" ? (
      <div className="physics-stage">
        <DisplacementVolumeTaskDiagram spec={diagram.spec} showSolution={showSolutionContent} />
      </div>
    ) : null}

    {graphConfig ? (
      <div className="physics-stage">
        <ModelVisual
          config={graphConfig}
          title={graphTitle}
          framed={false}
          compact
          showArea={showArea}
        />
      </div>
    ) : null}

    {/* Подсказка к визуализации — тихая строка с тёплой кромкой, без
        капслочного ярлыка: он дублировал то, что и так видно на сцене. */}
    {visualActivityLabel && focus?.visualPrompt && !showSolutionContent ? (
      <p className="border-l-2 border-[var(--ambient-warm)]/40 pl-3.5 text-[13px] leading-[1.65] text-[var(--text-secondary)]">
        <MathText text={focus.visualPrompt} />
      </p>
    ) : null}
  </>;
}
