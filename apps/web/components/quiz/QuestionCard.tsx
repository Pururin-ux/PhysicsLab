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

const typeLabels: Record<string, string> = {
  single_choice: "Один ответ",
  numeric_input: "Числовой ответ",
};

export function QuestionCard({
  type,
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
      className={cn("flex flex-col gap-4 p-4 md:gap-5 md:p-6", className)}
    >
      {showMetadata ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{typeLabels[type] ?? type}</Badge>
          <Badge tone="blue">{difficultyLabels[difficulty]}</Badge>
        </div>
      ) : null}

      <p className="text-[15px] font-normal leading-[1.75] text-[var(--text-primary)]/88 md:text-[16px]">
        {text}
      </p>

      {/* «Физика, которую можно увидеть»: визуализация — герой задачи. Она
          лежит на отдельной тёмной поверхности-верстаке с тёплой подсветкой
          снизу, а не втиснута в общий поток текста. */}
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

    </Card>
  );
}
