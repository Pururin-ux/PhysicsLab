"use client";
import { CheckCircle, X } from "@phosphor-icons/react";
import { useState, type CSSProperties } from "react";
import type { TextbookChapter } from "../../lib/learning/textbook";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { checkQuestionKey } from "../../lib/learning/textbook-check-state";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";

// Самопроверка в параграфе. После «Проверить себя» вариант показывает
// результат цветом и значком: правильный — успехом, выбранный мимо —
// ошибкой. До проверки выбранное просто выделено фирменной рамкой.
export function TextbookCheck({ check, chapterId }: { check: TextbookChapter["check"]; chapterId: string }) {
  const questionKey = checkQuestionKey(check);
  const initial = { stage:0, summaryText:"", summarySaved:false, answer:"", checked:false, questionKey };
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(`textbook-check-${chapterId}`, state, setState, 1, "check");
  const index = state.questionKey === questionKey ? check.options.indexOf(state.answer) : -1;
  const answer = index < 0 ? null : index;
  const checked = answer !== null && state.checked;
  const isCorrect = checked && answer === check.correct;
  if (!draft.ready) return <p>Открываю самопроверку…</p>;
  return <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); if (answer !== null) setState({...initial,answer:check.options[answer],checked:true}); }}>
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 text-lg font-bold leading-relaxed">{check.question}</legend>
      {check.options.map((option, optionIndex) => {
        const selected = answer === optionIndex;
        const showAsCorrect = checked && optionIndex === check.correct;
        const showAsWrong = checked && selected && optionIndex !== check.correct;
        return <label
          key={option}
          className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-relaxed transition-colors"
          style={{
            borderColor: showAsCorrect
              ? "color-mix(in srgb, var(--feedback-success) 62%, transparent)"
              : showAsWrong
                ? "color-mix(in srgb, var(--feedback-danger) 62%, transparent)"
                : selected
                  ? "var(--action-primary)"
                  : "var(--border-strong)",
            background: showAsCorrect
              ? "color-mix(in srgb, var(--feedback-success) 10%, transparent)"
              : showAsWrong
                ? "color-mix(in srgb, var(--feedback-danger) 8%, transparent)"
                : selected
                  ? "var(--mode-learn-soft)"
                  : undefined,
            opacity: checked && !selected && !showAsCorrect ? 0.62 : undefined,
          }}
        >
          <input type="radio" name="chapter-check" className="mt-1.5 accent-[var(--action-primary)]" checked={selected} onChange={() => setState({...initial,answer:option,checked:false})} />
          <span className="min-w-0 flex-1">{option}</span>
          {showAsCorrect && <CheckCircle size={19} weight="fill" style={{ color: "var(--feedback-success)", flexShrink: 0 }} aria-hidden="true" />}
          {showAsWrong && <X size={19} weight="bold" style={{ color: "var(--feedback-danger)", flexShrink: 0 }} aria-hidden="true" />}
        </label>;
      })}
    </fieldset>
    <Button type="submit" disabled={answer === null} className="w-fit px-7">Проверить себя</Button>
    {checked && answer !== null && (
      <p
        role="status"
        className="flex gap-3 rounded-option border-l-2 py-3 pl-4 leading-relaxed"
        style={{
          borderColor: isCorrect ? "var(--feedback-success)" : "var(--feedback-danger)",
          background: isCorrect
            ? "color-mix(in srgb, var(--feedback-success) 7%, transparent)"
            : "color-mix(in srgb, var(--feedback-danger) 6%, transparent)",
        }}
      >
        <strong
          className="shrink-0 text-[13px] font-[800] uppercase tracking-[.08em]"
          style={{ color: isCorrect ? "var(--feedback-success)" : "var(--feedback-danger)" }}
        >
          {isCorrect ? "Верно" : "Не совсем"}
        </strong>
        <MathText text={check.feedback[answer]} />
      </p>
    )}
    {draft.error && <p role="alert" className="text-sm leading-relaxed">{draft.error}</p>}
  </form>;
}
