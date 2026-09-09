"use client";
import { useState } from "react";
import type { TextbookChapter } from "../../lib/learning/textbook";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { checkQuestionKey } from "../../lib/learning/textbook-check-state";
import { Button } from "../ui/Button";

export function TextbookCheck({ check, chapterId }: { check: TextbookChapter["check"]; chapterId: string }) {
  const questionKey = checkQuestionKey(check);
  const initial = { stage:0, summaryText:"", summarySaved:false, answer:"", checked:false, questionKey };
  const [state, setState] = useState(initial);
  const draft = useLessonDraft(`textbook-check-${chapterId}`, state, setState, 1, "check");
  const index = state.questionKey === questionKey ? check.options.indexOf(state.answer) : -1;
  const answer = index < 0 ? null : index;
  const checked = answer !== null && state.checked;
  if (!draft.ready) return <p>Открываю самопроверку…</p>;
  return <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); if (answer !== null) setState({...initial,answer:check.options[answer],checked:true}); }}>
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-4 text-lg font-bold leading-relaxed">{check.question}</legend>
      {check.options.map((option, index) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border-strong)] p-4 leading-relaxed has-[:checked]:border-[var(--action-primary)]">
        <input type="radio" name="chapter-check" className="mt-1.5 accent-[var(--action-primary)]" checked={answer === index} onChange={() => setState({...initial,answer:option,checked:false})} />{option}
      </label>)}
    </fieldset>
    <Button type="submit" disabled={answer === null}>Проверить себя</Button>
    {checked && answer !== null && <p role="status" className="border-l-2 border-[var(--action-primary)] pl-4 leading-relaxed">{check.feedback[answer]}</p>}
    {draft.error && <p role="alert" className="text-sm leading-relaxed">{draft.error}</p>}
  </form>;
}
