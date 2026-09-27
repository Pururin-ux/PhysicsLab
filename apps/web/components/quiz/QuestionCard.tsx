import dynamic from "next/dynamic";
import type { Ref } from "react";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";
import type { TaskFocus } from "../../lib/learning/task-focus";
import { getGraduatedScaleTask } from "../../lib/physics/graduated-scale-task";
import type { QuizDiagram, QuizGraph } from "./quiz-session-store";

const QuestionVisual = dynamic(
  () => import("./QuestionVisual").then(module => module.QuestionVisual),
  { loading: () => <p role="status" className="text-sm leading-relaxed text-[var(--text-secondary)]">Загружаю визуализацию задачи…</p> },
);

interface QuestionCardProps {
  type: string;
  difficulty: 1 | 2 | 3;
  text: string;
  scaleParams?: Record<string, number>;
  graph?: QuizGraph | null;
  diagram?: QuizDiagram | null;
  focus?: TaskFocus;
  showSolutionContent?: boolean;
  showMetadata?: boolean;
  className?: string;
  promptRef?: Ref<HTMLParagraphElement>;
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
  scaleParams,
  graph,
  diagram,
  focus,
  showSolutionContent = false,
  showMetadata = true,
  className,
  promptRef,
}: QuestionCardProps) {
  const scale = scaleParams ? getGraduatedScaleTask(scaleParams) : null;

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

      <p ref={promptRef} tabIndex={-1} className="text-[15px] font-normal leading-[1.75] text-[var(--text-primary)]/88 md:text-[16px]">
        {scale ? "Какой объём воды показывает мензурка? Ответ дай в миллилитрах." : text}
      </p>

      {(scale || diagram || graph) && (
        <QuestionVisual
          scale={scale}
          text={text}
          diagram={diagram}
          graph={graph}
          focus={focus}
          showSolutionContent={showSolutionContent}
        />
      )}

    </Card>
  );
}
