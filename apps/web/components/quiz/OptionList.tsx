"use client";

import { OptionItem } from "./OptionItem";
import type {
  QuizOption,
  QuizSessionState,
  SingleChoiceQuizTask,
} from "./quiz-session-store";
import { getOptionState } from "./quiz-session-store";

interface OptionListProps {
  task: SingleChoiceQuizTask;
  options: QuizOption[];
  session: QuizSessionState;
  onSelect: (optionId: string) => void;
}

export function OptionList({
  task,
  options,
  session,
  onSelect,
}: OptionListProps) {
  const acceptsAnswer = session.phase === "active" || session.phase === "retrying";
  const latestAnswer = session.answers.at(-1);
  const firstWrongOption =
    session.phase === "retrying" && latestAnswer?.format === "single_choice"
      ? latestAnswer.selectedOptionId
      : null;

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Варианты ответа">
      {options.map((option) => (
        <div key={option.id} role="listitem">
          <OptionItem
            id={option.id}
            text={option.text}
            state={getOptionState(task, option.id, session)}
            disabled={!acceptsAnswer || option.id === firstWrongOption}
            onClick={() => onSelect(option.id)}
          />
        </div>
      ))}
    </div>
  );
}
