import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  feedbackText: string;
  correctAnswer?: string;
  retryHint?: string;
}

export function AnswerFeedback({
  isCorrect,
  feedbackText,
  correctAnswer,
  retryHint,
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
        isCorrect ? "border-l-feedback-success/70" : "border-l-feedback-danger/70",
      )}
    >
      <p
        className={cn(
          "text-[13px] font-bold leading-none",
          isCorrect ? "text-feedback-success" : "text-feedback-danger",
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

      {retryHint ? (
        <p className="mt-3 border-t border-white/[.08] pt-3 text-[13px] leading-[1.6] text-white/72">
          <span className="font-semibold text-nova-cyan">Попробуй так: </span>
          <MathText text={retryHint} />
        </p>
      ) : null}
    </section>
  );
}
