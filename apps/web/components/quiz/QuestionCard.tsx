import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { FormulaBox } from "../ui/FormulaBox";
import { MathText } from "../ui/MathText";
import { ModelVisual } from "../theory/ModelVisual";
import { VectorDiagram } from "../diagrams/VectorDiagram";
import { CircuitDiagram } from "../diagrams/CircuitDiagram";
import { cn } from "../../lib/utils";
import type { TaskFocus } from "../../lib/learning/task-focus";
import type { QuizDiagram, QuizGraph } from "./quiz-session-store";

interface QuestionCardProps {
  type: string;
  difficulty: 1 | 2 | 3;
  text: string;
  formula?: string;
  graph?: QuizGraph | null;
  diagram?: QuizDiagram | null;
  focus?: TaskFocus;
  showSolutionContent?: boolean;
  className?: string;
}

const difficultyLabels: Record<QuestionCardProps["difficulty"], string> = {
  1: "Сложность 1",
  2: "Сложность 2",
  3: "Сложность 3",
};

const typeLabels: Record<string, string> = {
  single_choice: "Один ответ",
};

export function QuestionCard({
  type,
  difficulty,
  text,
  formula,
  graph,
  diagram,
  focus,
  showSolutionContent = false,
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
      className={cn("flex flex-col gap-4 p-4 md:gap-5 md:p-6", className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{typeLabels[type] ?? type}</Badge>
        <Badge tone="blue">{difficultyLabels[difficulty]}</Badge>
      </div>

      {focus && !showSolutionContent ? (
        <div className="rounded-option border border-nova-cyan/[.16] bg-nova-cyan/[.045] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.035)]">
          <p className="text-[11px] font-bold uppercase tracking-[.13em] text-nova-cyan/80">
            Сейчас тренируем
          </p>
          <p className="mt-1 text-[14px] font-[800] leading-tight text-white">
            {focus.title}
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-white/62">
            <MathText text={focus.check} />
          </p>
        </div>
      ) : null}

      <p className="text-[14px] font-normal leading-[1.8] text-white/80 md:text-[15px]">
        {text}
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
        <div className="rounded-option border border-white/[.08] bg-white/[.025] px-3.5 py-3 text-[13px] leading-[1.6] text-white/68">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[.13em] text-white/45">
            {visualActivityLabel}
          </p>
          <MathText text={focus.visualPrompt} />
        </div>
      ) : null}

      {formula && showSolutionContent ? (
        <div data-testid="question-formula">
          <FormulaBox formula={formula} />
        </div>
      ) : null}
    </Card>
  );
}
