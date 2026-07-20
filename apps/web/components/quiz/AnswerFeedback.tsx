import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  feedbackText: string;
  correctAnswer?: string;
}

export function AnswerFeedback({
  isCorrect,
  feedbackText,
  correctAnswer,
}: AnswerFeedbackProps) {
  const statusLabel = isCorrect ? "Верно" : "Не совсем";

  return (
    <section
      data-testid="answer-feedback"
      data-state={isCorrect ? "correct" : "wrong"}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "border-l-2 py-1 pl-4",
        isCorrect ? "border-l-nova-cyan/70" : "border-l-nova-pink/70",
      )}
    >
      <p
        className={cn(
          "text-[13px] font-bold leading-none",
          isCorrect ? "text-nova-cyan" : "text-nova-pink",
        )}
      >
        {statusLabel}
      </p>
      <p className="mt-2 text-[14px] font-medium leading-[1.6] text-white/82">
        <MathText text={feedbackText} />
      </p>

      {correctAnswer ? (
        <p
          data-testid="numeric-correct-answer"
          className="mt-2 text-[13px] leading-[1.6] text-white/64"
        >
          Правильный ответ:{" "}
          <span className="physics-number font-semibold text-white">{correctAnswer}</span>
        </p>
      ) : null}
    </section>
  );
}
