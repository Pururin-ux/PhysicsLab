import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { ModelVisual } from "../theory/ModelVisual";
import { VectorDiagram } from "../diagrams/VectorDiagram";
import { CircuitDiagram } from "../diagrams/CircuitDiagram";
import { OpticsDiagram } from "../diagrams/OpticsDiagram";
import { cn } from "../../lib/utils";
import type { TaskFocus } from "../../lib/learning/task-focus";
import type { QuizDiagram, QuizGraph } from "./quiz-session-store";

interface QuestionCardProps {
  // Оставлено в контракте: формат ответа и так виден по интерфейсу
  // (варианты или поле ввода), отдельным чипом его не помечаем.
  type: string;
  difficulty: 1 | 2 | 3;
  text: string;
  graph?: QuizGraph | null;
  diagram?: QuizDiagram | null;
  focus?: TaskFocus;
  showSolutionContent?: boolean;
  showMetadata?: boolean;
  className?: string;
}

const difficultyLabels: Record<QuestionCardProps["difficulty"], string> = {
  1: "Сложность 1",
  2: "Сложность 2",
  3: "Сложность 3",
};

export function QuestionCard({
  difficulty,
  text,
  graph,
  diagram,
  focus,
  showSolutionContent = false,
  showMetadata = true,
  className,
}: QuestionCardProps) {
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
        ? "График x(t)"
        : "График a(t)";
  const showArea = graph?.type === "vt" && graph.series.length > 2;
  const visualActivityLabel = diagram
    ? "Работа с диаграммой"
    : graphConfig
      ? "Работа с графиком"
      : null;

  return (
    <Card
      data-testid="question-card"
      variant="raised"
      padding="none"
      className={cn("flex flex-col gap-4 p-4 md:gap-5 md:p-6", className)}
    >
      {showMetadata ? (
        <Badge size="sm" tone="blue">
          {difficultyLabels[difficulty]}
        </Badge>
      ) : null}

      {/* Условие приходит с $...$-формулами, поэтому текст идёт через MathText:
          иначе ученик видит исходник разметки вместо формулы. */}
      <p className="text-[15px] leading-[1.8] text-white/90 md:text-[16px]">
        <MathText text={text} />
      </p>

      {diagram?.kind === "vector" ? (
        <div className="rounded-option border border-nova-cyan/[.10] bg-space-950/50 p-2">
          <VectorDiagram spec={diagram.spec} />
        </div>
      ) : null}
      {diagram?.kind === "circuit" ? (
        <div className="rounded-option border border-nova-cyan/[.10] bg-space-950/50 p-2">
          <CircuitDiagram spec={diagram.spec} />
        </div>
      ) : null}
      {diagram?.kind === "optics" ? (
        <div className="rounded-option border border-nova-cyan/[.10] bg-space-950/50 p-2">
          {/* Решение (отражённый луч, изображение) появляется только после
              ответа — до этого его нет ни в DOM, ни в accessibility tree. */}
          <OpticsDiagram spec={diagram.spec} showSolution={showSolutionContent} />
        </div>
      ) : null}

      {graphConfig ? (
        <ModelVisual
          config={graphConfig}
          title={graphTitle}
          framed={false}
          compact
          showArea={showArea}
        />
      ) : null}

      {visualActivityLabel && focus?.visualPrompt && !showSolutionContent ? (
        <div className="border-l-2 border-nova-cyan/30 pl-3.5 text-[13px] leading-[1.6] text-white/68">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.13em] text-white/45">
            {visualActivityLabel}
          </p>
          <MathText text={focus.visualPrompt} />
        </div>
      ) : null}

    </Card>
  );
}
