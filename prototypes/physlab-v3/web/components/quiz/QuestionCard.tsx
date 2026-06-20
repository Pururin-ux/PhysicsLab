import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { FormulaBox } from "../ui/FormulaBox";
import { cn } from "../../lib/utils";

interface QuestionCardProps {
  type: string;
  difficulty: 1 | 2 | 3;
  text: string;
  formula?: string;
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
  className,
}: QuestionCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4 p-4 md:gap-5 md:p-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{typeLabels[type] ?? type}</Badge>
        <Badge tone="blue">{difficultyLabels[difficulty]}</Badge>
      </div>

      <p className="text-[14px] font-normal leading-[1.8] text-white/80 md:text-[15px]">
        {text}
      </p>

      {formula ? <FormulaBox formula={formula} /> : null}
    </Card>
  );
}
